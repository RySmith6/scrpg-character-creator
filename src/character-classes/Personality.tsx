import React, { Component } from 'react';
import { ReturnSelection, SelectableByRoll } from './Character';
import Personalities from '../rulebook-data/Personalities.json'
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Row } from 'react-bootstrap';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Button, List, ListItem, Divider, Card, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Ability, GYROZone } from './Ability';
import { SourceStep } from './SourceStep'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'



export class Personality {
    name: string = "Lone Wolf";
    rollResult: number = 1;
    outAbility: string = "Boost an ally by rolling your single [quality] die.";
    greenStatusDie: DiceOptions = DiceOptions.d8;
    yellowStatusDie: DiceOptions = DiceOptions.d8;
    redStatusDie: DiceOptions = DiceOptions.d8;
    backstoryQuality: DiceOptions = DiceOptions.d8;

    constructor(data: any) {
        Object.assign(this, data);
    }



    getSteps() {
        let steps = [
            {
                label: 'Assign Dice', content:
                    <Grid></Grid>
            }]
        return steps;
    }
}
export class PersonalityElement extends Component<SelectableByRoll> {
    state: { personality: Personality };
    constructor(props: SelectableByRoll) {
        super(props);
        let per = Personalities[props.rollResult - 1];
        this.state = { personality: new Personality(per) };
    }

    updateChange() {
        this.props.updateState(this);
    }


    render() {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Typography>Make up a quality based on your hero’s backstory. Assign {diceImageSrc(this.state.personality.backstoryQuality, 25)} to it.</Typography>
                    </Grid>
                    <Grid item xs={4} className='gyrozone-green'>
                        <Typography>Green Status</Typography>
                        {diceImageSrc(this.state.personality.greenStatusDie, 30)}
                    </Grid>
                    <Grid item xs={4} className='gyrozone-yellow'>
                        <Typography>Yellow Status</Typography>
                        {diceImageSrc(this.state.personality.yellowStatusDie, 30)}
                    </Grid>
                    <Grid item xs={4} className='gyrozone-red'>
                        <Typography>red Status</Typography>
                        {diceImageSrc(this.state.personality.redStatusDie, 30)}
                    </Grid>
                    <Grid item xs={12}>
                        <Ability gyroZone={GYROZone.out} sourceStep={SourceStep.Personality}>{{ name: 'Out Ability', text: this.state.personality.outAbility }}</Ability>
                    </Grid>
                </Grid>
                {/* <List style={{ width: '100%' }}>
                    <ListItem className='gyrozone-green'>{diceImageSrc(this.state.personality.greenStatusDie, 30)}</ListItem>
                    <Divider />
                    <ListItem className='gyrozone-yellow'>{diceImageSrc(this.state.personality.yellowStatusDie, 30)}</ListItem>
                    <Divider />
                    <ListItem className='gyrozone-red'>{diceImageSrc(this.state.personality.redStatusDie, 30)}</ListItem>
                </List> */}
            </div>
            // <Row>
            //     <Col xs={9}>
            //         <p>Make up a quality based on your hero’s backstory. Assign {diceImageSrc(this.backstoryQuality, 20)} to it.</p>
            //         <p><strong>Out Ability:</strong>{this.outAbility}</p>
            //     </Col>
            //     <Col xs={3}>
            //         <ListGroup>
            //             <ListGroup.Item variant='success'>{diceImageSrc(this.greenStatusDie, 30)}</ListGroup.Item>
            //             <ListGroup.Item variant='warning'>{diceImageSrc(this.yellowStatusDie, 30)}</ListGroup.Item>
            //             <ListGroup.Item variant='danger'>{diceImageSrc(this.redStatusDie, 30)}</ListGroup.Item>
            //         </ListGroup>
            //     </Col>
            // </Row>
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
            <Grid container spacing={3}>
                <Grid item xs={12}>

                    {Personalities.filter(p => this.props.strict ? this.props.rolledOptions.includes(p.rollResult) : true).map(per => (
                        <Accordion>
                            <AccordionSummary color={this.props.rolledOptions.includes(per.rollResult) ? "text.primary" : 'text.light'}
                                expandIcon={<ExpandMoreIcon />}
                                id={`per${per.rollResult}-header`}
                            ><span className="mr-auto"><strong>{per.rollResult}:</strong> {per.name}</span> <Button variant="outlined" color="primary" onClick={(e) => {
                                e.stopPropagation();
                                this.props.selectedCallback(new Personality(per))
                            }} >Select this Background</Button></AccordionSummary>
                            <AccordionDetails><PersonalityElement rollResult={per.rollResult} updateState={this.props.selectedCallback}></PersonalityElement>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>
            //<Col>
            //     <Accordion>
            //         {Personalities.filter(per => this.props.strict ? this.props.rolledOptions.includes(per.rollResult) : true).map(per => (
            //             <Card key={per.rollResult} border={this.props.rolledOptions && this.props.rolledOptions.includes(per.rollResult) ? 'primary' : 'light'}>
            //                 <Accordion.Toggle as={Card.Header} eventKey={per.rollResult.toString()} >
            //                     <span className="pull-left">{per.name}</span> <Button variant="success" onClick={() => this.props.selectedCallback(per)} className="pull-right">Select this Personality</Button>
            //                 </Accordion.Toggle>
            //                 <Accordion.Collapse eventKey={per.rollResult.toString()}>
            //                     <Personality rollResult={per.rollResult} updateState={this.props.selectedCallback}></Personality>
            //                 </Accordion.Collapse>
            //             </Card>
            //         ))}
            //     </Accordion>
            // </Col>
        );
    }
}

