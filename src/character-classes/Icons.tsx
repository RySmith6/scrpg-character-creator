import attack from '../rulebook-data/attack.png'
import defend from '../rulebook-data/defend.png'
import boost from '../rulebook-data/boost.png'
import hinder from '../rulebook-data/hinder.png'
import overcome from '../rulebook-data/overcome.png'
import recover from '../rulebook-data/recover.png'
import React from 'react';

export enum Icons {
    'overcome',
    'boost',
    'hinder',
    'attack',
    'defense',
    'recover'
}

export default function iconImageSrc(icon: string, size: number = 20) {
    let src = '';
    switch (Icons[icon]) {
        case Icons.attack:
            src = attack;
            break;
        case Icons.defense:
            src = defend;
            break;
        case Icons.boost:
            src = boost;
            break;
        case Icons.hinder:
            src = hinder;
            break;
        case Icons.overcome:
            src = overcome;
            break;
        case Icons.recover:
            src = recover;
            break;
        default:
            src = attack;
            break;
    }
    return (
        <img src={src} width={size} height={size} alt={icon} />
    )
}