import React, { Component } from 'react';
import { ReturnSelection, SelectableByRoll } from './Character';
import Personalities from '../rulebook-data/Personalities.json'
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Button, List, ListItem, Divider, Card, CardContent, TextField, InputAdornment } from '@material-ui/core';
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
    backstoryQualityStat: string = '';

    constructor(data: any) {
        Object.assign(this, data);
    }

    confirmBackstoryQuality() {

    }


    getSteps() {
        let steps = [
            {
                label: 'Select Backstory Quality', content:
                    <div>
                        <TextField
                            label={'Quality from your Backstory'}
                            id="standard-start-adornment"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{diceImageSrc(this.backstoryQuality, 25)}</InputAdornment>,
                            }}
                            variant="filled"
                        />
                    </div>
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
                <Grid container>
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
            </div>
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

        );
    }
}

