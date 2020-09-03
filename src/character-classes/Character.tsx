import React, { Component, ChangeEvent } from 'react'
import { Background } from './Background';
import { Personality } from './Personality';
import { Principle } from './Principle';
import { Ability, AbilityList, GYROZone } from './Ability';
import diceImagesrc, { DiceOptions, diceRoll } from './DiceOptions';
import { Row, Col, Card, InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { Outlet, Routes, Route, Link } from "react-router-dom";
import { BackgroundsList } from './Background';
import { PowerSourcesList, PowerSource } from "./PowerSources"
import { ListGroup } from 'react-bootstrap';
import { ArchetypesList, Archetype } from './Archetype';

export class Character extends Component {
    state: {
        name: string;
        sources: CharacterSources;
        healthMax: number;
        principles: Principle[];
        greenAbilities: Ability[];
        yellowAbilities: Ability[];
        redAbilities: Ability[];
        powerDice: StatDie[];
        qualityDice: StatDie[];
        backgroundRollResult: number[];
        powerSourceRollResult: number[];
    }
    constructor(data: any) {
        super(data);
        this.state = Object.assign({}, data);
        this.state.name = 'DEFAULT CHARACTER NAME';
        this.state.healthMax = 0;
        this.state.powerDice = [];
        this.state.qualityDice = [];
        this.state.greenAbilities = [];
        this.state.yellowAbilities = [];
        this.state.redAbilities = [];
        this.state.sources = new CharacterSources();
        this.state.backgroundRollResult = this.rollForBackground();
        this.selectBackground = this.selectBackground.bind(this);
        this.selectPowerSource = this.selectPowerSource.bind(this);
        this.reRollBackground = this.reRollBackground.bind(this);
        this.rollForNextStep = this.rollForNextStep.bind(this);
    }
    generateRandomCharacter() {
        this.state.sources.generateRandomSources();
        let newState = Object.assign({}, this.state);
        //Background
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Background) || []);
        newState.qualityDice.push(...newState.sources.background.diceToAssign.map(d => new StatDie(d, SourceStep.Background)));
        newState.powerSourceRollResult = this.rollForNextStep(newState.sources.background.diceForPowerSource);
        //PowerSource
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.PowerSource) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.PowerSource) || []);
        if (newState.sources.powerSource.additionalQualitiesDice)
            newState.qualityDice.push(...newState.sources.powerSource.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.yellowAbilityOptions || []));
        //archetypes
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.Archetype) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Archetype) || []);
        if (newState.sources.archetype.additionalQualitiesDice)
            newState.qualityDice.push(...newState.sources.archetype.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []));
        this.setState(newState);
    }
    reRollBackground() {
        let newState = Object.assign({}, this.state);
        newState.backgroundRollResult = this.rollForBackground();
        this.setState(newState);
    }

    rollForBackground(): number[] {
        let rolledBackgrounds = [];
        let firstDie = diceRoll(DiceOptions.d10);
        let secondDie = diceRoll(DiceOptions.d10);
        rolledBackgrounds = [firstDie, secondDie, (firstDie + secondDie)]
        return rolledBackgrounds;
    }
    rollForNextStep(dice: DiceOptions[]): number[] {
        let nextStepOptions = [];
        let nextStepRolls = dice.map(d => diceRoll(d));
        nextStepRolls.forEach((r, i) => {
            if (!nextStepOptions.includes(r))
                nextStepOptions.push(r);
            if (i < nextStepRolls.length - 1)
                nextStepRolls.slice(i + 1).forEach(or => {
                    if (!nextStepOptions.includes(r + or))
                        nextStepOptions.push(r + or);
                })
        });
        return nextStepOptions;
    }
    selectBackground(background: Background) {
        let newState = Object.assign({}, this.state);
        newState.sources.background = background;
        newState.qualityDice = (this.state.qualityDice.filter(q => q.source != SourceStep.Background) || []);
        newState.qualityDice.push(...background.diceToAssign.map(d => new StatDie(d, SourceStep.Background)));
        newState.powerSourceRollResult = this.rollForNextStep(background.diceForPowerSource);
        this.setState(newState);
    }
    selectPowerSource(powerSource: PowerSource) {
        let newState = Object.assign({}, this.state);
        newState.sources.powerSource = powerSource;
        newState.powerDice = (this.state.powerDice.filter(q => q.source != SourceStep.PowerSource) || []);
        newState.powerDice.push(...this.state.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.qualityDice = (this.state.qualityDice.filter(q => q.source != SourceStep.PowerSource) || []);
        if (powerSource.additionalQualitiesDice)
            newState.qualityDice.push(...powerSource.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.greenAbilities = (this.state.greenAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.greenAbilityOptions || []));
        newState.yellowAbilities = (this.state.yellowAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.yellowAbilityOptions || []));
        this.setState(newState);
    }
    selectArchetype(archetype: Archetype) {
        let newState = Object.assign({}, this.state);
        newState.sources.archetype = archetype;
        newState.powerDice = (this.state.powerDice.filter(q => q.source != SourceStep.Archetype) || []);
        newState.powerDice.push(...this.state.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.qualityDice = (this.state.qualityDice.filter(q => q.source != SourceStep.Archetype) || []);
        if (archetype.additionalQualitiesDice)
            newState.qualityDice.push(...archetype.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.greenAbilities = (this.state.greenAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []));
        newState.yellowAbilities = (this.state.yellowAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []));
        this.setState(newState);
    }

    componentDidMount() {
        this.generateRandomCharacter();
    }
    render() {
        return (
            <Row>
                <Col>
                    <Card>
                        <h2>Character Creator</h2>
                        <p>Character Name:{this.state.name}</p>
                        <Button onClick={this.reRollBackground}> Re-roll backgrounds</Button>
                        <p><Link to={'/backgrounds'}> Background</Link>:{this.state.sources.background ? this.state.sources.background.name : 'No Background Selected'}</p>
                        <p><Link to={'/powersources'}> Power Source</Link>:{this.state.sources.powerSource ? this.state.sources.powerSource.name : 'No Power Source Selected'}</p>
                        <p><Link to={'/archetypes'}> Archetype</Link>:{this.state.sources.archetype ? this.state.sources.archetype.name : 'No Archetype Selected'}</p>
                        <Row>
                            <Col xs={5}>
                                <StatDice
                                    stats={this.state.qualityDice}
                                    characterSources={this.state.sources}
                                    powerOrQuality="Qualities"></StatDice>
                            </Col>
                            <Col xs={5}>
                                <StatDice
                                    stats={this.state.powerDice}
                                    characterSources={this.state.sources}
                                    powerOrQuality="Powers"></StatDice>
                            </Col>
                            <Col xs={2}>
                                <Card>
                                    <Card.Header>
                                        Status
                                    </Card.Header>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AbilityList gyroZone={GYROZone.yellow} preview={true} abilities={this.state.yellowAbilities} characterSources={this.state.sources}></AbilityList>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Outlet />
                <Routes>
                    <Route path="/backgrounds" element={<BackgroundsList rolledOptions={this.state.backgroundRollResult} selectedCallback={this.selectBackground} />} />
                    <Route path="/powersources" element={<PowerSourcesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPowerSource} diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []} />} />
                    <Route path="/archetypes" element={<ArchetypesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPowerSource} diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []} />} />
                </Routes>
            </Row>
        )
    }

}

export interface UsesDiceAndConfirmCallback {
    stats: StatDie[];
    confirmCallback?: (confirmData) => void;
    characterSources: CharacterSources;
    powerOrQuality: string;
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
        this.state = { stats: this.props.stats.slice() };
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
                            statOptions={this.statMap[s.source][this.props.powerOrQuality].filter(o => !this.state.stats.some((st, i) => st.statName == o && i != index))} ></StatDieSelector>

                    ))}
                </Card.Body>
            </Card>
        )
    }
}

export interface StatOptionsAndCallback {
    statOptions: string[];
    die: DiceOptions;
    onConfirm: (value, index) => void;
    index: number;
    defaultValue?: string;
}
export interface HasSourceStep {
    source: SourceStep;
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
            <InputGroup size="lg" className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm"> {diceImagesrc(this.props.die)} </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="select" defaultValue={this.props.defaultValue} onChange={this.handleChange}>
                    {this.props.statOptions.map((o, i) => (
                        <option >{o}</option>
                    ))}
                </FormControl>
            </InputGroup>
        )
    }
}

export enum SourceStep {
    Background = 'Background',
    PowerSource = 'PowerSource',
    Archetype = 'Archetype',
    Personality = 'Personality'
}

export class CharacterSources {
    background?: Background;
    powerSource?: PowerSource;
    archetype?: Archetype;
    personality?: Personality;
    sourceStatMap: SourceStatMap;
    generateStatMap() {
        if (!this.sourceStatMap)
            this.sourceStatMap = new SourceStatMap();
        this.sourceStatMap.Background.Qualities = (this.background ? this.background.qualities : []);
        this.sourceStatMap.PowerSource.Powers = (this.powerSource ? this.powerSource.powers : []);
        this.sourceStatMap.PowerSource.Qualities = (this.powerSource ? this.powerSource.additionalQualities : []);
        this.sourceStatMap.Archetype.Powers = (this.archetype ? this.archetype.powers : []);
        this.sourceStatMap.Archetype.Qualities = (this.archetype ? this.archetype.qualities : []);
        this.sourceStatMap.Archetype.RequiredPowers = (this.archetype ? this.archetype.requiredPower : []);

        return this.sourceStatMap;
    }
    generateRandomSources() {
        let selectableByRoll: SelectableByRoll = { rollResult: Math.floor((Math.random() * 20) + 1) };
        this.background = new Background(selectableByRoll);
        selectableByRoll.rollResult = Math.floor((Math.random() * 20) + 1);
        selectableByRoll.diceFromPreviousStep = this.background.diceForPowerSource;
        this.powerSource = new PowerSource(selectableByRoll)
        selectableByRoll.rollResult = Math.floor((Math.random() * 18) + 1);
        selectableByRoll.diceFromPreviousStep = this.powerSource.diceForArchetype;
        this.archetype = new Archetype(selectableByRoll);

    }
}

export class SourceStatMap {
    Background: {
        Qualities: string[],
        Powers: string[],
        RequiredQualities: string[],
        RequiredPowers: string[];
    } = {
            Qualities: [],
            Powers: [],
            RequiredQualities: [],
            RequiredPowers: []
        };
    PowerSource: {
        Qualities: string[],
        Powers: string[],
        RequiredQualities: string[],
        RequiredPowers: string[];
    } = {
            Qualities: [],
            Powers: [],
            RequiredQualities: [],
            RequiredPowers: []
        };
    Archetype: {
        Qualities: string[],
        Powers: string[],
        RequiredQualities: string[],
        RequiredPowers: string[];
    } = {
            Qualities: [],
            Powers: [],
            RequiredQualities: [],
            RequiredPowers: []
        };
}


export interface ReturnSelection {
    selectedCallback?: (selectable) => void;
    rolledOptions: number[];
    diceFromPreviousStep?: DiceOptions[];
}

export interface SelectableByRoll {
    rollResult: number;
    diceFromPreviousStep?: DiceOptions[];
}