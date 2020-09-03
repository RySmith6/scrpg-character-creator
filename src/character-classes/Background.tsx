import React, { Component } from 'react';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import Backgrounds from '../rulebook-data/Backgrounds.json'
import { Col, Accordion, Card, Button } from 'react-bootstrap';
import exploded from '../rulebook-data/exploded-categories.json';
import { ReturnSelection, SelectableByRoll } from './Character';

export class Background extends Component<SelectableByRoll> {
    name: string = 'DEFAULT BACKGROUND';
    rollResult: number = 0;
    diceToAssign: DiceOptions[] = [DiceOptions.d8, DiceOptions.d10];
    qualities: string[] = ["categoryPhysical", "categoryMental"];
    principleCategory: string = "Identity";
    diceForPowerSource: DiceOptions[] = [DiceOptions.d8, DiceOptions.d8, DiceOptions.d10];

    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let bg = Backgrounds[roll - 1];
        let explodedQualities = [];
        bg.qualities.forEach(q => {
            if (typeof (q) === "string")
                !q.startsWith('category') ? explodedQualities.push(q) : explodedQualities.push(...exploded.qualities[q])
        });
        bg.qualities = explodedQualities;
        Object.assign(this, bg);
        let keys = [];
        Backgrounds.forEach(a => { Object.keys(a).forEach(k => { if (!keys.includes(k)) keys.push(k) }) });
        let keyValues = {};
        Backgrounds.forEach(a => { keys.forEach(k => { if (typeof a[k] === 'string') keyValues[k] ? keyValues[k].push(a[k]) : keyValues[k] = [] }) });
        console.log('Powersource Keys' + keys.join(', '));
    }



    render() {
        return (
            <div>
                <span>Assign {this.diceToAssign.map((d, index: number) => diceImageSrc(d))} to any of the following Qualities:</span>
                <ul>
                    {this.qualities.map(q => (
                        <li>{q}</li>
                    ))}
                </ul>
                <span>{this.name}</span>
            </div>
        )
    }
}

export class BackgroundsList extends Component<ReturnSelection> {
    selectedBackground: Background;
    constructor(props: ReturnSelection) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }
    onSelect() {
        (this.props as any).onSubmitMessage(this.selectedBackground);
    }
    render() {
        return (
            <Col>
                <Accordion>
                    {Backgrounds.map(bg => (
                        <Card key={bg.rollResult} border={this.props.rolledOptions.includes(bg.rollResult) ? 'primary' : 'light'}>
                            <Accordion.Toggle as={Card.Header} eventKey={bg.rollResult.toString()} >
                                <span className="pull-left">{bg.name}</span> <Button variant="success" onClick={() => this.props.selectedCallback(bg)} className="pull-right">Select this Background</Button>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={bg.rollResult.toString()}>
                                <Background rollResult={bg.rollResult}></Background>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>

                {/* <ol>
                    {Backgrounds.map(bg => (
                        <li key={bg.rollResult}>
                            <Link to={bg.rollResult}>
                                <h3>{bg.name}</h3>
                            </Link>
                        </li>
                    ))}
                </ol> */}
            </Col>
        );
    }
}

export class BackgroundsSelection extends Component {

}
