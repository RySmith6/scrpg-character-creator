import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { StatDie } from '../character-classes/StatDie';
import diceImageSrc, { DiceOptions } from '../character-classes/DiceOptions';
import { SourceStep } from '../character-classes/SourceStep';
import StatSelector from './stat-selector';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class AssignRequiredDice extends Component<AssignRequiredDiceProps>{
    statDice: StatDie[] = [];
    state: {
        unselectedStats: string[];
        unselectedDice: DiceOptions[];
    }
    constructor(props: AssignRequiredDiceProps) {
        super(props);
        let explodedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats);
        this.statDice = this.props.existingStatDice || this.props.requiredExact ? this.props.dice.slice(0, this.props.requiredExact).map((d, index) => new StatDie(d, this.props.source, explodedStats[index])) : []//this.props.dice.map((d, index) => new StatDie(d, SourceStep.Background, explodedStats[index]));
        let sortedDice = this.props.dice.sort();
        this.state = {
            unselectedDice: sortedDice.filter((d, index, array) => this.statDice.filter(s => s.die === d).length < (index - array.indexOf(d) + 1)),
            unselectedStats: ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats).filter(s => !this.statDice.some(d => d.statName === s))
        };
        //this.statDice = this.props.dice.map(d => new StatDie(d, SourceStep.Background));

        this.statSelected = this.statSelected.bind(this);
        this.returnConfirmed = this.returnConfirmed.bind(this);
        this.returnConfirmed();
    }

    componentDidUpdate(prevProps) {
        if (this.props.dice !== prevProps.dice || this.props.stats !== prevProps.stats) {
            this.statDice = this.props.requiredExact ? this.props.dice.slice(0, this.props.requiredExact).map(d => new StatDie(d, this.props.source)) : []//this.props.dice.map(d => new StatDie(d, SourceStep.Background));
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

    dieSelected(die: any, id: number) {
        if (this.statDice[id]) {
            this.statDice[id].die = die;
        }
        else {
            let availableStats = this.state.unselectedStats.slice();
            this.statDice.push(new StatDie(die, SourceStep.Archetype, availableStats[0]))
        }
        let newState = Object.assign({}, this.state);
        newState.unselectedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(this.props.stats, this.props.usedStats).filter(s => !this.statDice.some(d => d.statName === s));
        let sortedDice = this.props.dice.sort();
        newState.unselectedDice = sortedDice.filter((d, index, array) => this.statDice.filter(s => s.die === d).length < (index - array.indexOf(d) + 1));
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
                            <Grid item xs={12}>

                                {this.statDice.map((sd, index) => (
                                    <Grid container item xs={12} spacing={3}>
                                        <Grid item xs={4}>
                                            <InputLabel>Dice</InputLabel> <Select id={`reqStat-${index}-die`} value={sd.die} onChange={(event) => this.dieSelected(event.target.value, index)}>
                                                <MenuItem value={sd.die}>{diceImageSrc(sd.die)}</MenuItem>
                                                {this.state.unselectedDice.map(d => (
                                                    <MenuItem value={d}>{diceImageSrc(d)}</MenuItem>
                                                ))}

                                            </Select></Grid>
                                        <Grid item xs={8}><StatSelector stats={this.state.unselectedStats} selectedStat={this.statSelected} id={index} label={this.props.statType} stat={this.statDice[index].statName} die={sd.die} /></Grid>
                                    </Grid>
                                ))}
                                {this.props.requiredMin ?
                                    <Grid item xs={4}>
                                        <InputLabel>Dice</InputLabel> <Select id={`reqStat-new-die`} onChange={(event) => this.dieSelected(event.target.value, -1)}>
                                            {this.state.unselectedDice.map(d => (
                                                <MenuItem value={d}>{diceImageSrc(d)}</MenuItem>
                                            ))}
                                        </Select></Grid>
                                    : ''}


                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export interface AssignRequiredDiceProps {
    dice: DiceOptions[];
    stats: string[];
    confirmDice: (statDice: StatDie[]) => void;
    source: SourceStep;
    statType?: string;
    requiredMin?: number;
    requiredExact?: number;
    usedStats: string[];
    existingStatDice: StatDie[];
}