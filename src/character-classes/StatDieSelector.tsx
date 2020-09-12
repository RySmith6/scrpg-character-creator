import React, { Component } from 'react';
import diceImagesrc, { DiceOptions } from './DiceOptions';
import { InputGroup, FormControl, Card } from 'react-bootstrap';
import { SourceStatMap } from './Character';
import { SourceStep } from "./SourceStep";
import { UsesDiceAndConfirmCallback, HasSourceStep, StatOptionsAndCallback } from './interfaces';

export class StatDieSelector extends Component<StatOptionsAndCallback> implements HasSourceStep {

    source: SourceStep;
    constructor(props: StatOptionsAndCallback) {
        super(props);
        this.state = { value: this.props.statOptions[0] };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        let value = event.target.value;
        this.setState({ value: value });
        this.props.onConfirm(value, this.props.index);
    }
    render() {
        return (
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm"> {diceImagesrc(this.props.die, 20)} </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="select" defaultValue={this.props.defaultValue} onChange={this.handleChange}>
                    {this.props.statOptions.map((o, i) => (
                        <option>{o}</option>
                    ))}
                </FormControl>
            </InputGroup>
        );
    }
}

export class StatDie implements HasSourceStep {
    source: SourceStep;
    statName: string;
    die: DiceOptions = DiceOptions.d4;
    constructor(die: DiceOptions, source: SourceStep, statName: string = '') {
        this.source = source;
        this.die = die;
    }
}
export class StatDice extends Component<UsesDiceAndConfirmCallback>{
    state: {
        stats: StatDie[]
    };
    statMap: SourceStatMap;
    constructor(props: UsesDiceAndConfirmCallback) {
        super(props);
        this.state = { stats: this.props.stats.slice() };
        this.updateStatDice = this.updateStatDice.bind(this);
    }
    updateStatDice(value, index) {
        let newStats = this.state.stats.slice();
        newStats[index].statName = value;
        this.setState({ stats: newStats });
    }

    render() {
        this.setState({ stats: this.props.stats.slice() });
        this.statMap = this.props.characterSources.generateStatMap();
        return (
            <Card>
                <Card.Header>
                    {this.props.powerOrQuality}
                </Card.Header>
                <Card.Body>
                    {this.state.stats.map((s, index) => (
                        <StatDieSelector
                            index={index}
                            die={s.die}
                            onConfirm={this.updateStatDice}
                            defaultValue={this.state.stats[index].statName}
                            statOptions={this.statMap[s.source][this.props.powerOrQuality].filter(o => !this.state.stats.some((st, i) => st.statName === o && i !== index))} ></StatDieSelector>

                    ))}
                </Card.Body>
            </Card>
        )
    }
}
