import React, { Component } from 'react'
import { ReturnSelection, SelectableByRoll } from './Character';
import Archetypes from '../rulebook-data/Archetypes.json'
import { Col, Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import exploded from '../rulebook-data/exploded-categories.json';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Ability } from './Ability';
import { Row } from 'react-bootstrap';

export class ArchetypesList extends Component<ReturnSelection>{
    selectedArchetype: Archetype;
    constructor(props: ReturnSelection) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }
    onSelect() {
        (this.props as any).onSubmitMessage(this.selectedArchetype);
    }
    render() {
        return (
            <Col>
                <Accordion>
                    {Archetypes.map(ps => (
                        <Card key={ps.rollResult} border={this.props.rolledOptions && this.props.rolledOptions.includes(ps.rollResult) ? 'primary' : 'light'}>
                            <Accordion.Toggle as={Card.Header} eventKey={ps.rollResult.toString()} >
                                <span className="pull-left">{ps.name}</span> <Button variant="success" onClick={() => this.props.selectedCallback(ps)} className="pull-right">Select this Background</Button>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={ps.rollResult.toString()}>
                                <Archetype rollResult={ps.rollResult} diceFromPreviousStep={this.props.diceFromPreviousStep}></Archetype>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </Col>
        );
    }
}

export class Archetype extends Component<SelectableByRoll> {
    name: string = 'DEFAULT ARCHETYPE';
    rollResult: number = 0;
    requiredPower: string[]
    powers: string[]
    qualities: string[]
    diceForPersonality: DiceOptions[]
    greenAbilityCount: number
    greenAbilityRestriction: string
    greenAbilityOptions: Ability[]
    yellowAbilityCount: number
    yellowAbilityRestriction: string = "differentPowers"
    yellowAbilityOptions: Ability[]
    diceToAssign: DiceOptions[]
    additionalQualitiesDice?: DiceOptions[]
    additionalQualities?: string[]
    principleCategory: string
    guaranteedGreenAbilities: Ability[]
    freeDice: DiceOptions[]
    freeDiceRestriction: string[]

    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let ps = Archetypes[roll - 1];
        let explodedPowers = [];
        let explodedQualities = [];
        if (ps.requiredPower)
            ps.requiredPower.forEach(q => {
                if (typeof (q) === "string")
                    !q.startsWith('category') ? explodedPowers.push(q) : explodedPowers.push(...exploded.powers[q])
            });
        ps.powers.forEach(q => {
            if (typeof (q) === "string")
                !q.startsWith('category') ? explodedPowers.push(q) : explodedPowers.push(...exploded.powers[q])
        });
        ps.powers = explodedPowers;
        if (ps.qualities) {
            ps.qualities.forEach(q => {
                if (typeof (q) === "string")
                    !q.startsWith('category') ? explodedQualities.push(q) : explodedQualities.push(...exploded.qualities[q])
            });
            ps.qualities = explodedQualities;
        }
        Object.assign(this, ps);
        this.diceToAssign = (props.diceFromPreviousStep ? props.diceFromPreviousStep.slice() : []);
        let keys = [];
        Archetypes.forEach(a => { Object.keys(a).forEach(k => { if (!keys.includes(k)) keys.push(k) }) });
        let keyValues = {};
        Archetypes.forEach(a => { keys.forEach(k => { if (typeof a[k] === 'string') keyValues[k] ? keyValues[k].push(a[k]) : keyValues[k] = [] }) });
        console.log('Archetype Keys' + keys.join(', '));
    }



    render() {
        return (
            <Row>
                <Col>
                    <span>Assign {this.diceToAssign.length > 0 ? this.diceToAssign.map((d, index: number) => diceImageSrc(d)) : 'Dice from Background'} to any of the following Powers:</span>
                    <ListGroup>
                        {this.powers.map(p => (
                            <ListGroup.Item>{p}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                {this.additionalQualitiesDice &&
                    <Col>
                        <span>Assign {this.additionalQualitiesDice.map((d, index: number) => diceImageSrc(d))} to any of the following Qualities:</span>
                        <ul>

                        </ul>
                    </Col>
                }
            </Row>
        )
    }
}
