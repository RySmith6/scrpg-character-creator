import React, { Component, ChangeEvent } from 'react'
import { Background } from './Background';
import { Personality, PersonalityList } from './Personality';
import { Principle } from './Principle';
import { Ability, AbilityList, GYROZone } from './Ability';
import diceImageSrc, { DiceOptions, diceRoll } from './DiceOptions';
import { Row, Col, Card, Form, Button, Container, Collapse } from 'react-bootstrap';
import { Outlet, Routes, Route, Link } from "react-router-dom";
import { BackgroundsList } from './Background';
import { PowerSourcesList, PowerSource } from "./PowerSources"
import { ListGroup } from 'react-bootstrap';
import { ArchetypesList, Archetype } from './Archetype';
import { StatDieSelector, StatDie, StatDice } from './StatDieSelector';
import { SourceStep } from './SourceStep';

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
        greenStatusDie: DiceOptions;
        yellowStatusDie: DiceOptions;
        redStatusDie: DiceOptions;
        outAbility: string;
        strict: boolean;
        open: boolean;
    }
    open: boolean = true;
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
        this.state.strict = true;
        this.state.open = false;
        this.state.backgroundRollResult = this.rollForBackground();
        this.selectBackground = this.selectBackground.bind(this);
        this.selectPowerSource = this.selectPowerSource.bind(this);
        this.selectArchetype = this.selectArchetype.bind(this);
        this.selectPersonality = this.selectPersonality.bind(this);
        this.reRollBackground = this.reRollBackground.bind(this);
        this.rollForNextStep = this.rollForNextStep.bind(this);
        this.toggleSheetCollapse = this.toggleSheetCollapse.bind(this);
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
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Background) || []);
        newState.qualityDice.push(...background.diceToAssign.map(d => new StatDie(d, SourceStep.Background)));
        newState.powerSourceRollResult = this.rollForNextStep(background.diceForPowerSource);
        newState.greenAbilities = newState.greenAbilities.filter(a => a.source !== SourceStep.Background);
        if (background.selectedPrinciple) {
            let principleAbility = background.selectedPrinciple.greenAbility;
            principleAbility.source = SourceStep.Background;
            newState.greenAbilities.push(principleAbility);
        }
        //newState.
        this.setState(newState);
    }
    selectPowerSource(powerSource: PowerSource) {
        let newState = Object.assign({}, this.state);
        newState.sources.powerSource = powerSource;
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.PowerSource) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.PowerSource) || []);
        if (powerSource.additionalQualitiesDice)
            newState.qualityDice.push(...powerSource.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.yellowAbilityOptions || []));
        this.setState(newState);
    }
    selectArchetype(archetype: Archetype) {
        let newState = Object.assign({}, this.state);
        newState.sources.archetype = archetype;
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.Archetype) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Archetype) || []);
        if (archetype.additionalQualitiesDice)
            newState.qualityDice.push(...archetype.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []));
        this.setState(newState);
    }
    selectPersonality(personality: Personality) {
        let newState = Object.assign({}, this.state);
        newState.sources.personality = personality;
        newState.greenStatusDie = personality.greenStatusDie;
        newState.yellowStatusDie = personality.yellowStatusDie;
        newState.redStatusDie = personality.redStatusDie;
        newState.outAbility = personality.outAbility;
        this.setState(newState);
    }

    toggleSheetCollapse() {
        let newState = Object.assign({}, this.state);
        newState.open = !newState.open;
        this.setState(newState)
    }

    componentDidMount() {
        this.generateRandomCharacter();
    }
    render() {
        return (
            <Container fluid>
                <Row noGutters>
                    <Col xs={12}>
                        <Card>

                            <Card.Header>Character Name:{this.state.name} <Button variant={'link'} onClick={this.toggleSheetCollapse}>Toggle Character Sheet</Button></Card.Header>
                            <Collapse in={this.state.open}>
                                <Card.Body>
                                    <Button onClick={this.reRollBackground}> Re-roll backgrounds</Button>
                                    <Row>
                                        <Col><p><Link to={'/backgrounds'}> Background</Link>:{this.state.sources.background ? this.state.sources.background.name : 'No Background Selected'}</p>
                                        </Col><Col>
                                            <p><Link to={'/powersources'}> Power Source</Link>:{this.state.sources.powerSource ? this.state.sources.powerSource.name : 'No Power Source Selected'}</p>
                                        </Col><Col>
                                            <p><Link to={'/archetypes'}> Archetype</Link>:{this.state.sources.archetype ? this.state.sources.archetype.name : 'No Archetype Selected'}</p>
                                        </Col><Col>
                                            <p><Link to={'/personalities'}> Personality</Link>:{this.state.sources.personality ? this.state.sources.personality.name : 'No Personality Selected'}</p>
                                        </Col>
                                    </Row>
                                    <Row noGutters>
                                        <Col xs={5}>
                                            <StatDice
                                                stats={this.state.qualityDice}
                                                characterSources={this.state.sources}
                                                powerOrQuality="Qualities" />
                                        </Col>
                                        <Col xs={5}>
                                            <StatDice
                                                stats={this.state.powerDice}
                                                characterSources={this.state.sources}
                                                powerOrQuality="Powers" />
                                        </Col>
                                        <Col xs={2}>
                                            <Card>
                                                <Card.Header>
                                                    Status Dice
                                    </Card.Header>
                                                {/* <Card.Body> */}
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant='success'>{diceImageSrc(this.state.greenStatusDie, 30)}</ListGroup.Item>
                                                    <ListGroup.Item variant='warning'>{diceImageSrc(this.state.yellowStatusDie, 30)}</ListGroup.Item>
                                                    <ListGroup.Item variant='danger'>{diceImageSrc(this.state.redStatusDie, 30)}</ListGroup.Item>
                                                </ListGroup>
                                                {/* </Card.Body> */}
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AbilityList gyroZone={GYROZone.green} preview={true} abilities={this.state.greenAbilities} characterSources={this.state.sources}></AbilityList>
                                        </Col>
                                        <Col>
                                            <AbilityList gyroZone={GYROZone.yellow} preview={true} abilities={this.state.yellowAbilities} characterSources={this.state.sources}></AbilityList>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>

                <Outlet />
                <Routes>
                    <Route path="/backgrounds" element={<BackgroundsList rolledOptions={this.state.backgroundRollResult} selectedCallback={this.selectBackground} strict={this.state.strict} />} />
                    <Route path="/powersources" element={<PowerSourcesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPowerSource} diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []} strict={this.state.strict} />} />
                    <Route path="/archetypes" element={<ArchetypesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectArchetype} diceFromPreviousStep={this.state.sources.powerSource ? this.state.sources.powerSource.diceForArchetype : []} strict={this.state.strict} />} />
                    <Route path="/personalities" element={<PersonalityList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPersonality} diceFromPreviousStep={this.state.sources.archetype ? this.state.sources.archetype.diceForPersonality : []} strict={this.state.strict} />} />
                </Routes>
            </Container>
        )
    }

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
    getNameOfSource(step: SourceStep) {
        if (step === SourceStep.Background && this.background)
            return this.background.name;
        else if (step === SourceStep.PowerSource && this.powerSource)
            return this.powerSource.name;
        else if (step === SourceStep.Archetype && this.archetype)
            return this.archetype.name;
        else if (step === SourceStep.Personality && this.personality)
            return this.personality.name;
        else
            return 'UNDEFINED SOURCE'
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
    rolledOptions?: number[];
    diceFromPreviousStep?: DiceOptions[];
    strict?: boolean;
}

export interface SelectableByRoll {
    rollResult: number;
    diceFromPreviousStep?: DiceOptions[];
    children?
}