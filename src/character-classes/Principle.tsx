
import { Ability, GYROZone } from './Ability';
import { SourceStep } from "./SourceStep";
import { Card, Col, Accordion } from 'react-bootstrap';
import React, { Component } from 'react'
import Principles from '../rulebook-data/Principles.json'
import { Button } from 'react-bootstrap';

export class Principle extends Component {
    source: SourceStep;
    name: string = "Destiny";
    category: string = "Esoteric";
    duringRoleplaying: string = "Signs and portents lead you towards an inevitable place in your life. You can always gain some measure of direction when needed.";
    minorTwist: string = "What omen of dire fortune did you just witness?";
    majorTwist: string = "What heinous prophecy just came true?";
    greenAbility: Ability;

    constructor(props) {
        super(props);
        Object.assign(this, props.children);
    }

    render() {
        return (
            <Card.Body>
                <Card.Text><strong>During Roleplaying:</strong> {this.duringRoleplaying}</Card.Text>
                <Card.Text><strong>Minor Twist:</strong> {this.minorTwist}</Card.Text>
                <Card.Text><strong>Major Twist:</strong> {this.majorTwist}</Card.Text>
                <Ability gyroZone={GYROZone.green} sourceStep={SourceStep.Background}>{this.greenAbility}</Ability>
            </Card.Body>
        )
    }
}

export class PrinciplesList extends Component<SelectablePrinciple> {
    selectedPrinciple: Principle;
    // constructor(props: SelectablePrinciple) {
    //     super(props);
    // }
    render() {
        return (
            <Col>
                <Accordion>
                    {Principles.filter(p => (this.props.strict ? this.props.guidedCategory.includes(p.category) : true)).map(p => (
                        <Card key={p.name} border={this.props.guidedCategory.includes(p.category) ? 'primary' : 'light'}>
                            <Accordion.Toggle as={Card.Header} eventKey={p.name} >
                                <span className="pull-left">{p.name}</span> <Button size="sm" variant="success" onClick={() => this.props.selectedCallback(p)} className="pull-right">Select this Principle</Button>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={p.name}>
                                <Principle>{p}</Principle>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </Col>
        );
    }
}

export interface SelectablePrinciple {
    selectedCallback: (principle: any) => void,
    guidedCategory?: string,
    strict?: boolean
}
