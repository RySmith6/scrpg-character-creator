import React, { Component } from 'react'
import { ReturnSelection, SelectableByRoll } from './Character';
import PowerSources from '../rulebook-data/PowerSource.json'
import { Col, Accordion, Card, Button, ListGroup } from 'react-bootstrap';
import exploded from '../rulebook-data/exploded-categories.json';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Ability } from './Ability';
import { Row } from 'react-bootstrap';
import { ExplodedCategories } from './ExplodedCategories';
import { SourceStep } from './SourceStep';
import { Tooltip } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { StatDie } from './StatDieSelector';

export class PowerSourcesList extends Component<ReturnSelection>{
    selectedPowerSource: PowerSource;
    constructor(props: ReturnSelection) {
        super(props);
    }
    render() {
        return (
            <Col>
                <Accordion>
                    {PowerSources.filter(ps => this.props.strict && this.props.rolledOptions ? this.props.rolledOptions.includes(ps.rollResult) : true).map(ps => (
                        <Card key={ps.rollResult} border={this.props.rolledOptions && this.props.rolledOptions.includes(ps.rollResult) ? 'primary' : 'light'}>
                            <Accordion.Toggle as={Card.Header} eventKey={ps.rollResult.toString()} >
                                <span className="pull-left">{ps.name}</span> <Button variant="success" onClick={() => this.props.selectedCallback(ps)} className="pull-right">Select this Power Source</Button>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={ps.rollResult.toString()}>
                                <PowerSource rollResult={ps.rollResult} diceFromPreviousStep={this.props.diceFromPreviousStep}></PowerSource>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </Col>
        );
    }
}

export class PowerSource extends Component<SelectableByRoll> {
    name: string = 'DEFAULT BACKGROUND';
    rollResult: number = 0;
    powers: string[]
    diceForArchetype: DiceOptions[]
    greenAbilityCount: number
    greenAbilityOptions: Ability[]
    yellowAbilityCount: number
    yellowAbilityRestriction: string = "differentPowers"
    yellowAbilityOptions: Ability[]
    diceToAssign: DiceOptions[]
    additionalQualitiesDice?: DiceOptions[]
    additionalQualities?: string[]

    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let ps = PowerSources[roll - 1];
        let explodedPowers = [];
        let explodedQualities = [];
        if (ps.requiredPowers)
            ExplodedCategories.PushAndExplode(explodedPowers, ps.requiredPowers);
        ExplodedCategories.PushAndExplode(explodedPowers, ps.powers);
        ps.powers = explodedPowers;
        if (ps.additionalQualities) {
            ExplodedCategories.PushAndExplode(explodedQualities, ps.additionalQualities);
            ps.additionalQualities = explodedQualities;
        }
        Object.assign(this, ps);
        this.diceToAssign = (props.diceFromPreviousStep ? props.diceFromPreviousStep.slice() : []);

        (this.greenAbilityOptions || []).forEach(a => { a.source = SourceStep.PowerSource });
        (this.yellowAbilityOptions || []).forEach(a => { a.source = SourceStep.PowerSource });


        let keys = [];
        PowerSources.forEach(a => { Object.keys(a).forEach(k => { if (!keys.includes(k)) keys.push(k) }) });
        let keyValues = {};
        PowerSources.forEach(a => { keys.forEach(k => { if (typeof a[k] === 'string') keyValues[k] ? keyValues[k].push(a[k]) : keyValues[k] = [] }) });
        console.log('Powersource Keys' + keys.join(', '));

    }



    render() {
        return (
            <Card.Body>
                <Card.Text>Assign {this.diceToAssign.length > 0 ? this.diceToAssign.map((d, index: number) => diceImageSrc(d, 25)) : 'Dice from Background'} to any of the following<OverlayTrigger
                    key={`overlay-ps-${this.props.rollResult}-powers`}
                    overlay={
                        <Tooltip id={`tooltip-ps-${this.props.rollResult}-powers`}>
                            <ul>
                                {this.powers.map(q => (
                                    <li>{q}</li>
                                ))}
                            </ul>
                        </Tooltip>
                    }
                >
                    <Button variant="link">Powers:</Button>
                </OverlayTrigger>

                </Card.Text>
                {this.additionalQualitiesDice &&
                    <Card.Text>
                        Assign {this.additionalQualitiesDice.map((d, index: number) => diceImageSrc(d, 25))} to any of the following <OverlayTrigger
                            key={`overlay-ps-${this.props.rollResult}-qualities`}
                            overlay={
                                <Tooltip id={`tooltip-ps-${this.props.rollResult}-qualities`}>
                                    <ul>
                                        {this.additionalQualities.map(q => (
                                            <li>{q}</li>
                                        ))}
                                    </ul>
                                </Tooltip>
                            }
                        >
                            <Button variant="link">Qualities:</Button>
                        </OverlayTrigger>
                    </Card.Text>
                }
                <Card.Text>Roll {this.diceForArchetype.map(d => diceImageSrc(d, 25))} for power source selection.</Card.Text>
            </Card.Body>
        )
    }
}

export class DiceAssignmentPanel extends Component<DiceAssignmentProps>{
    state: {
        diceToAssign: DiceOptions[];
        requiredStat: string[];
        atLeastOneFromStats: string[];
        remainingStats: string[];
    }
    finalStatDice: StatDie[];
    constructor(props) {
        super(props);
        this.finalStatDice = this.props.diceToAssign.map(d => new StatDie(d, this.props.source));
    }

    render() {
        return (
            <div>
                {this.finalStatDice.map(s => (
                    <div />

                ))}
            </div>
        )
    }

}

export interface DiceAssignmentProps {
    diceToAssign: DiceOptions[];
    requiredStat?: string[];
    atLeastOneFromStats?: string[];
    remainingStats?: string[];
    source: SourceStep;
    confirmCallback: (confirmedDice: StatDie[]) => void;
}