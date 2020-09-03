import { Component } from 'react';
import { Ability } from './Ability';
import { SourceStep } from './Character';

export class Principle extends Component {
    source: SourceStep;
    name: string = "Destiny";
    category: string = "Esoteric";
    duringRoleplaying: string = "Signs and portents lead you towards an inevitable place in your life. You can always gain some measure of direction when needed.";
    minorTwist: string = "What omen of dire fortune did you just witness?";
    majorTwist: string = "What heinous prophecy just came true?";
    greenAbility: Ability;
}
