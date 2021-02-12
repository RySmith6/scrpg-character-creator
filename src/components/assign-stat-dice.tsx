import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { StatDie } from '../character-classes/StatDie';
import { DiceOptions } from '../character-classes/DiceOptions';
import { SourceStep } from '../character-classes/SourceStep';
import StatSelector from './stat-selector';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';

export default class AssignStatDice extends Component<AssignDiceProps>{
    statDice: StatDie[] = [];
    state: {
        unselectedStats: string[];
        unselectedDice: DiceOptions[];
    }
    constructor(props: AssignDiceProps) {
        super(props);
        let explodedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats);
        this.statDice = this.props.dice.map((d, index) => new StatDie(d, this.props.source, explodedStats[index]));
        this.state = { unselectedDice: this.props.dice, unselectedStats: ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats).filter(s => !this.statDice.some(d => d.statName === s)) };
        //this.statDice = this.props.dice.map(d => new StatDie(d, SourceStep.Background));

        this.statSelected = this.statSelected.bind(this);
        this.returnConfirmed = this.returnConfirmed.bind(this);
        this.returnConfirmed();
    }

    componentDidUpdate(prevProps) {
        if (this.props.dice !== prevProps.dice || this.props.stats !== prevProps.stats) {
            this.statDice = this.props.dice.map(d => new StatDie(d, this.props.source));
            this.setState({ unselectedDice: this.props.dice, unselectedStats: ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats) });
        }

    }

    statSelected(stat: string, id: number) {
        this.statDice[id].statName = stat;
        let newState = Object.assign({}, this.state);
        newState.unselectedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats).filter(s => !this.statDice.some(d => d.statName === s));
        this.returnConfirmed();
        this.setState(newState);
    }

    returnConfirmed() {
        this.props.confirmDice(this.statDice);
    }

    render() {
        return (
            <Grid item>
                <Card>
                    <CardHeader title={`Assign dice for ${this.props.source}`}></CardHeader>
                    <CardContent>
                        <Grid container spacing={3}>
                            {this.props.dice.map((d, index: number) => (
                                <Grid item xs={12}>
                                    <StatSelector stats={this.state.unselectedStats} selectedStat={this.statSelected} id={index} label={this.props.statType} stat={this.statDice[index].statName} die={d} />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export interface AssignDiceProps {
    dice: DiceOptions[];
    stats: string[];
    confirmDice: (statDice: StatDie[]) => void;
    statType?: string;
    source: SourceStep;
    usedStats: string[];
}