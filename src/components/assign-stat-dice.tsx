import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { StatDie } from '../character-classes/StatDie';
import diceImageSrc, { DiceOptions } from '../character-classes/DiceOptions';
import { SourceStep } from '../character-classes/SourceStep';
import StatSelector from './stat-selector';
import { Card, CardContent, Button, CardHeader } from '@material-ui/core';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';

export default class AssignStatDice extends Component<AssignDiceProps>{
    statDice: StatDie[] = [];
    state: {
        unselectedStats: string[];
        unselectedDice: DiceOptions[];
    }
    constructor(props: AssignDiceProps) {
        super(props);
        let explodedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats);
        this.statDice = this.props.dice.map((d, index) => new StatDie(d, SourceStep.Background, explodedStats[index]));
        this.state = { unselectedDice: this.props.dice, unselectedStats: ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats).filter(s => !this.statDice.some(d => d.statName == s)) };
        //this.statDice = this.props.dice.map(d => new StatDie(d, SourceStep.Background));

        this.statSelected = this.statSelected.bind(this);
        this.returnConfirmed = this.returnConfirmed.bind(this);
        this.returnConfirmed();
    }

    componentDidUpdate(prevProps) {
        if (this.props.dice !== prevProps.dice || this.props.stats !== prevProps.stats) {
            this.statDice = this.props.dice.map(d => new StatDie(d, SourceStep.Background));
            this.setState({ unselectedDice: this.props.dice, unselectedStats: ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats) });
        }

    }

    statSelected(stat: string, id: number) {
        this.statDice[id].statName = stat;
        let newState = Object.assign({}, this.state);
        newState.unselectedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats).filter(s => !this.statDice.some(d => d.statName == s));
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
                    <CardHeader title={`Assign dice for Source`}></CardHeader>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {this.props.dice.map((d, index: number) => (
                                    <Grid container item xs={12} spacing={3}>
                                        <Grid item xs={4}>{diceImageSrc(d)}</Grid>
                                        <Grid item xs={8}><StatSelector stats={this.state.unselectedStats} selectedStat={this.statSelected} id={index} label={this.props.statType} stat={this.statDice[index].statName} /></Grid>
                                    </Grid>
                                ))}
                            </Grid>
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
}