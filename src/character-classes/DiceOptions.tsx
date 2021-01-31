import d4 from '../rulebook-data/d4.png'
import d6 from '../rulebook-data/d6.png'
import d8 from '../rulebook-data/d8.png'
import d10 from '../rulebook-data/d10.png'
import d12 from '../rulebook-data/d12.png'
import React from 'react';
import { Avatar } from '@material-ui/core'

export enum DiceOptions {
    d4 = 'd4',
    d6 = 'd6',
    d8 = 'd8',
    d10 = 'd10',
    d12 = 'd12'
}
export default function diceImageSrc(diceOption: string, size: number = 42) {
    let src = '';
    switch (DiceOptions[diceOption]) {
        case DiceOptions.d12:
            src = d12;
            break;
        case DiceOptions.d10:
            src = d10;
            break;
        case DiceOptions.d8:
            src = d8;
            break;
        case DiceOptions.d6:
            src = d6;
            break;
        default:
            src = d4;
            break;
    }
    return (
        <img src={src} width={size} height={size} />
    )
}
export function diceRoll(diceOption: string): number {
    let maxValue = 0;
    switch (DiceOptions[diceOption]) {
        case DiceOptions.d12:
            maxValue = 12;
            break;
        case DiceOptions.d10:
            maxValue = 10;
            break;
        case DiceOptions.d8:
            maxValue = 8;
            break;
        case DiceOptions.d6:
            maxValue = 6;
            break;
        default:
            maxValue = 4;
            break;
    }
    return Math.floor(Math.random() * (maxValue + 1));
}


export function diceAvatar(diceOption: string, size: number = 42) {
    let src = '';
    switch (DiceOptions[diceOption]) {
        case DiceOptions.d12:
            src = d12;
            break;
        case DiceOptions.d10:
            src = d10;
            break;
        case DiceOptions.d8:
            src = d8;
            break;
        case DiceOptions.d6:
            src = d6;
            break;
        default:
            src = d4;
            break;
    }
    return (
        <Avatar variant="square" src={src} />
    )
}
