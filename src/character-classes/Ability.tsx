import React, { Component } from 'react';
import { Icons } from './Icons';
import { AbilityType } from './AbilityType';
import { SourceStep, CharacterSources } from './Character';
import { ListGroup } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export class Ability extends Component {
    source: SourceStep;
    icon: Icons[] = [
        Icons.overcome
    ];
    name: string = "Principle of Destiny";
    type: AbilityType = AbilityType.action;
    text: string = "Overcome a situation directly connected to your destiny and use your Max die. You and each of your allies gain a hero point.";
    render() {
        return (
            <div></div>
        )
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
            <ListGroup>
                {this.props.abilities.map(a =>
                    <ListGroup.Item>
                        <OverlayTrigger
                            key={a.name}
                            placement='right'
                            overlay={
                                <Tooltip id={`text-${a.name}`}>
                                    {a.text}
                                </Tooltip>
                            }
                        >
                            <a>{a.name}</a>
                        </OverlayTrigger>
                    </ListGroup.Item>
                )}
            </ListGroup>
        )
    }
}

export interface AbilitiesProps {
    abilities: Ability[],
    gyroZone: GYROZone,
    preview: boolean,
    characterSources: CharacterSources
}
export enum GYROZone {
    green = 'Green',
    yellow = 'Yellow',
    red = 'Red',
    out = 'Out'
}
