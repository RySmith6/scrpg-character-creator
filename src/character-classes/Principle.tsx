
import { Ability, GYROZone } from './Ability';
import { SourceStep } from "./SourceStep";
import { Card, } from 'react-bootstrap';
import React, { Component } from 'react'
import Principles from '../rulebook-data/Principles.json'
import { Grid, Accordion, AccordionSummary, AccordionDetails, Button, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class Principle extends Component<PrincipleProps> {
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
            <div>
                <Grid container>
                    <Grid container item xs={8}>
                        <Typography><strong>During Roleplaying:</strong> {this.duringRoleplaying}</Typography>
                        <Typography><strong>Minor Twist:</strong> {this.minorTwist}</Typography>
                        <Typography><strong>Major Twist:</strong> {this.majorTwist}</Typography>
                    </Grid>
                    <Grid item xs={4}><Button variant="outlined" color="primary" onClick={() => this.props.selectedCallback(this)}>Select this Principle</Button></Grid>
                    <Ability gyroZone={GYROZone.green} sourceStep={SourceStep.Background}>{this.greenAbility}</Ability>
                </Grid>
            </div>
        )
    }
}

export function PrinciplesList(props) {
    const confirmCallback = (principle) => {
        props.selectedCallback(principle);
    }
    return (
        <Grid item xs={12}>
            {Principles.filter(p => (props.strict ? props.guidedCategory.includes(p.category) : true)).map(p => (
                <Accordion>
                    <AccordionSummary color={props.guidedCategory.includes(p.category) ? "text.primary" : 'text.light'}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <span className="mr-auto">{p.name}</span> <Button variant="outlined" color="primary" onClick={(e) => {
                            e.stopPropagation(); this.props.selectedCallback(new Principle(p))
                        }}>Select this Power Source</Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Principle selectedCallback={confirmCallback}>{p}</Principle>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Grid>
    );
}

export interface SelectablePrinciple {
    selectedCallback: (principle: any) => void,
    guidedCategory?: string,
    strict?: boolean
}

export interface PrincipleProps {
    selectedCallback: (principle: any) => void;
    children?
}