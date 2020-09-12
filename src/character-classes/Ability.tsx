import React, { Component, Props } from 'react';
import iconImageSrc, { Icons } from './Icons';
import { AbilityType } from './AbilityType';
import { CharacterSources } from './Character';
import { SourceStep } from "./SourceStep";
import { ListGroup, Card } from 'react-bootstrap';
import { OverlayTrigger, Row, Col } from 'react-bootstrap';
import { Tooltip } from 'react-bootstrap';

export class Ability extends Component<AbilityProp> {
    icon: (Icons | string)[] = [
        Icons.overcome
    ];
    name: string = "Principle of Destiny";
    type: AbilityType = AbilityType.action;
    text: string = "Overcome a situation directly connected to your destiny and use your Max die. You and each of your allies gain a hero point.";
    gyroZone: GYROZone = GYROZone.green;
    source: SourceStep = SourceStep.Archetype;
    constructor(prop: AbilityProp) {
        super(prop);
        Object.assign(this, prop.children);
    }

    render() {
        return (
            <Card bg={backgroundColor(this.gyroZone)}>
                <Row noGutters>
                    <Col xs={2}>
                        {this.icon.map(i => {
                            return (
                                iconImageSrc(i.toString())
                            )
                        })}
                    </Col>
                    <Col xs={3}><p><strong>{this.name}</strong></p> </Col>
                    <Col xs={1}><p>{this.type.toString()}</p></Col>
                    <Col><p>{this.text}</p></Col>
                </Row>
            </Card>
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
                    <ListGroup.Item variant={backgroundColor(this.props.gyroZone)}>
                        <OverlayTrigger
                            key={a.name}
                            placement='right'
                            overlay={
                                <Tooltip id={`text-${a.name}`}>
                                    {a.text}
                                </Tooltip>
                            }
                        >
                            <a>{a.name} from {a.source}: {this.props.characterSources.getNameOfSource(a.source)}</a>
                        </OverlayTrigger>
                    </ListGroup.Item>
                )}
            </ListGroup>
        )
    }


}

export default function backgroundColor(gyroZone: GYROZone): string {
    if (gyroZone === GYROZone.green)
        return 'success';
    else if (gyroZone === GYROZone.yellow)
        return 'warning';
    else if (gyroZone === GYROZone.red)
        return 'danger';
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
    sourceStep: SourceStep,
    children?
}
export enum GYROZone {
    green = 'Green',
    yellow = 'Yellow',
    red = 'Red',
    out = 'Out'
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
