import React, { Component } from 'react';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import Backgrounds from '../rulebook-data/Backgrounds.json'
import { Col, Accordion, Card, Button, Row } from 'react-bootstrap';
import exploded from '../rulebook-data/exploded-categories.json';
import { ReturnSelection, SelectableByRoll } from './Character';
import { ExplodedCategories } from './ExplodedCategories';
import { PrinciplesList, Principle } from './Principle';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from 'react-bootstrap';

export class Background extends Component<SelectableByRoll> {
    name: string = 'DEFAULT BACKGROUND';
    rollResult: number = 0;
    diceToAssign: DiceOptions[] = [DiceOptions.d8, DiceOptions.d10];
    qualities: string[] = ["categoryPhysical", "categoryMental"];
    principleCategory: string = "Identity";
    diceForPowerSource: DiceOptions[] = [DiceOptions.d8, DiceOptions.d8, DiceOptions.d10];
    selectedPrinciple: Principle;
    state: { showQualities: boolean }
    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let bg = Backgrounds[roll - 1];
        let explodedQualities = [];
        ExplodedCategories.PushAndExplode(explodedQualities, bg.qualities);
        bg.qualities = explodedQualities;
        Object.assign(this, bg);
        let keys = [];
        Backgrounds.forEach(a => { Object.keys(a).forEach(k => { if (!keys.includes(k)) keys.push(k) }) });
        let keyValues = {};
        Backgrounds.forEach(a => { keys.forEach(k => { if (typeof a[k] === 'string') keyValues[k] ? keyValues[k].push(a[k]) : keyValues[k] = [] }) });
        console.log('Background Keys' + keys.join(', '));
    }



    render() {
        return (
            <div>
                <Card.Text>Assign {this.diceToAssign.map((d, index: number) => diceImageSrc(d, 25))} to any of the following<OverlayTrigger
                    key={`overlay-${this.props.rollResult}-qualities`}
                    overlay={
                        <Tooltip id={`tooltip-${this.props.rollResult}-qualities`}>
                            <ul>
                                {this.qualities.map(q => (
                                    <li>{q}</li>
                                ))}
                            </ul>
                        </Tooltip>
                    }
                >
                    <Button variant="link">Qualities:</Button>
                </OverlayTrigger>

                </Card.Text>
                <Card.Text>Choose a {this.principleCategory} principle</Card.Text>
                <Card.Text>Roll {this.diceForPowerSource.map(d => diceImageSrc(d, 25))} for power source selection.</Card.Text>
            </div>
        )
    }
}

export class BackgroundsList extends Component<ReturnSelection> {
    state: {
        selectedBackground?: Background;
    }
    constructor(props: ReturnSelection) {
        super(props);
        this.state = {};
        this.confirmBackground = this.confirmBackground.bind(this);
        this.selectBackground = this.selectBackground.bind(this);
        this.selectedPrinciple = this.selectedPrinciple.bind(this);
    }
    selectBackground(background: any) {
        this.setState({ selectedBackground: background });
    }
    confirmBackground(background: Background) {
        this.props.selectedCallback(background);
    }
    selectedPrinciple(principle: Principle) {
        let background = Object.assign({}, this.state.selectedBackground);
        background.selectedPrinciple = principle;
        this.confirmBackground(background);
    }

    render() {
        return (
            <Row noGutters>
                <Col xs={6}>
                    <Accordion>
                        {Backgrounds.filter(b => this.props.strict ? this.props.rolledOptions.includes(b.rollResult) : true).map(bg => (
                            <Card key={bg.rollResult} border={this.props.rolledOptions.includes(bg.rollResult) ? 'primary' : 'light'}>
                                <Accordion.Toggle as={Card.Header} eventKey={bg.rollResult.toString()} >
                                    <span className="mr-auto">{bg.name}</span> <Button size="sm" variant="success" onClick={() => this.selectBackground(bg)} >Select this Background</Button>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={bg.rollResult.toString()}>
                                    <Background rollResult={bg.rollResult}></Background>
                                </Accordion.Collapse>
                            </Card>
                        ))}
                    </Accordion>
                </Col>
                {this.state.selectedBackground ? <Col xs={6}>
                    <PrinciplesList guidedCategory={this.state.selectedBackground.principleCategory} selectedCallback={this.selectedPrinciple} strict={this.props.strict}></PrinciplesList></Col> : ''}
            </Row>
        );
    }
}

export class BackgroundsSelection extends Component {

}
