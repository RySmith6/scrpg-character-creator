
import { Ability, GYROZone } from './Ability';
import { SourceStep } from "./SourceStep";
import React from 'react'
import Principles from '../rulebook-data/Principles.json'
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class Principle {
    source: SourceStep;
    name: string = "Destiny";
    category: string = "Esoteric";
    duringRoleplaying: string = "Signs and portents lead you towards an inevitable place in your life. You can always gain some measure of direction when needed.";
    minorTwist: string = "What omen of dire fortune did you just witness?";
    majorTwist: string = "What heinous prophecy just came true?";
    greenAbility: Ability;

    constructor(data) {
        Object.assign(this, data);
    }
}

export function PrinciplesList(props) {
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
                            e.stopPropagation(); props.selectedCallback(new Principle(p))
                        }}>Select this Power Source</Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PrincipleElement>{p}</PrincipleElement>
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
export function PrincipleElement(props) {
    return (
        <Grid container>
            <Grid container item xs={8}>
                <Typography><strong>During Roleplaying:</strong> {props.children.duringRoleplaying}</Typography>
                <Typography><strong>Minor Twist:</strong> {props.children.minorTwist}</Typography>
                <Typography><strong>Major Twist:</strong> {props.children.majorTwist}</Typography>
            </Grid>
            <Ability gyroZone={GYROZone.green} sourceStep={SourceStep.Background}>{props.children.greenAbility}</Ability>
        </Grid>);
}