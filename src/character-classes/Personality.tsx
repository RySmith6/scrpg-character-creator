import React, { Component } from 'react';
import { ReturnSelection, SelectableByRoll } from './Character';
import { Col, Accordion, Card, ListGroup } from 'react-bootstrap';
import Personalities from '../rulebook-data/Personalities.json'
import { Button } from 'react-bootstrap';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Row } from 'react-bootstrap';

export class Personality extends Component<SelectableByRoll> {
    name: string = "Lone Wolf";
    rollResult: number = 1;
    outAbility: string = "Boost an ally by rolling your single [quality] die.";
    greenStatusDie: DiceOptions = DiceOptions.d8;
    yellowStatusDie: DiceOptions = DiceOptions.d8;
    redStatusDie: DiceOptions = DiceOptions.d8;
    backstoryQuality: DiceOptions = DiceOptions.d8;
    constructor(props: SelectableByRoll) {
        super(props);
        let per = Personalities[props.rollResult - 1];
        Object.assign(this, per);
    }


    getSteps(): { label: string, content: any }[] {
        let stepLabels = [];
        return stepLabels;
    }
    render() {
        return (
            <Row>
                <Col xs={9}>
                    <p>Make up a quality based on your hero’s backstory. Assign {diceImageSrc(this.backstoryQuality, 20)} to it.</p>
                    <p><strong>Out Ability:</strong>{this.outAbility}</p>
                </Col>
                <Col xs={3}>
                    <ListGroup>
                        <ListGroup.Item variant='success'>{diceImageSrc(this.greenStatusDie, 30)}</ListGroup.Item>
                        <ListGroup.Item variant='warning'>{diceImageSrc(this.yellowStatusDie, 30)}</ListGroup.Item>
                        <ListGroup.Item variant='danger'>{diceImageSrc(this.redStatusDie, 30)}</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        )
    }
}
export class PersonalityList extends Component<ReturnSelection> {
    selectedPersonality: Personality;
    constructor(props: ReturnSelection) {
        super(props);
    }
    render() {
        return (
            <Col>
                <Accordion>
                    {Personalities.filter(per => this.props.strict ? this.props.rolledOptions.includes(per.rollResult) : true).map(per => (
                        <Card key={per.rollResult} border={this.props.rolledOptions && this.props.rolledOptions.includes(per.rollResult) ? 'primary' : 'light'}>
                            <Accordion.Toggle as={Card.Header} eventKey={per.rollResult.toString()} >
                                <span className="pull-left">{per.name}</span> <Button variant="success" onClick={() => this.props.selectedCallback(per)} className="pull-right">Select this Personality</Button>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={per.rollResult.toString()}>
                                <Personality rollResult={per.rollResult} updateState={this.props.selectedCallback}></Personality>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </Col>
        );
    }
}

