import React, { Component } from 'react';
import iconImageSrc, { Icons } from './Icons';
import { AbilityType } from './AbilityType';
import { CharacterSources } from "./CharacterSources";
import { SourceStep } from "./SourceStep";
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography';


export enum GYROZone {
    green = 'Green',
    yellow = 'Yellow',
    red = 'Red',
    out = 'Out'
}

export class Ability {
    icon: (Icons | string)[] = [
        Icons.overcome
    ];
    name: string = "Principle of Destiny";
    type: AbilityType = AbilityType.action;
    text: string = "Overcome a situation directly connected to your destiny and use your Max die. You and each of your allies gain a hero point.";
    gyroZone: GYROZone = GYROZone.green;
    source: SourceStep = SourceStep.Archetype;
    finalText?: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class AbilityList extends Component<AbilitiesProps> {
    state: {
        abilities: Ability[],
        gyroZone: GYROZone,
        preview: boolean,
        characterSources: CharacterSources
    } = { abilities: [], gyroZone: GYROZone.green, preview: false, characterSources: new CharacterSources() };
    constructor(props: AbilitiesProps) {
        super(props);
        this.setState(Object.assign({}, this.props));
    }
    render() {
        return (
            <Accordion className={backgroundColor(this.props.gyroZone)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>{`${this.props.gyroZone} Zone Abilities`}</AccordionSummary>
                <AccordionDetails>
                    <List>
                        {this.props.abilities.map(a =>
                            <ListItem >
                                <AbilityElement gyroZone={this.props.gyroZone}>{a}</AbilityElement>
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    }
}

export function AbilityElement(props) {
    return (
        <Card style={{ width: '100%' }}>
            <Grid
                container
                spacing={1}
                className={backgroundColor(props.gyroZone)}
                justify="space-between"
                alignItems="center">
                <Grid item xs={1}>
                    {(props.children.icons || []).map(i => {
                        return (
                            iconImageSrc(i.toString())
                        )
                    })}
                </Grid>
                <Grid item xs={2}><Typography><strong>{props.children.name}</strong></Typography> </Grid>
                <Grid item xs={2}><Typography align={'center'}>{props.children.type.toString()}</Typography></Grid>
                <Grid item xs={7}><Typography>{props.children.finalText || props.children.text}</Typography></Grid>
            </Grid>
        </Card>
    )
}

export default function backgroundColor(gyroZone: GYROZone): string {
    if (gyroZone === GYROZone.green)
        return 'gyrozone-green';
    else if (gyroZone === GYROZone.yellow)
        return 'gyrozone-yellow';
    else if (gyroZone === GYROZone.red)
        return 'gyrozone-red';
    else
        return 'secondary'
}

export interface AbilitiesProps {
    abilities: Ability[],
    gyroZone: GYROZone,
    preview: boolean,
    characterSources: CharacterSources
}
export interface AbilityProp {
    gyroZone: GYROZone,
    sourceStep?: SourceStep,
    children?
}

export class AbilityStruct {
    icon: Icons[] = [
        Icons.overcome
    ];
    name: string = "Principle of Destiny";
    type: AbilityType = AbilityType.action;
    text: string = "Overcome a situation directly connected to your destiny and use your Max die. You and each of your allies gain a hero point.";
    constructor(data) {
        Object.assign(this, data);
    }
}
