
import { DiceOptions } from './DiceOptions';
import { SourceStep } from "./SourceStep";
import { HasSourceStep } from './interfaces';

export class StatDie implements HasSourceStep {
    source: SourceStep;
    statName: string;
    die: DiceOptions = DiceOptions.d4;
    constructor(die: DiceOptions, source: SourceStep, statName: string = '') {
        this.source = source;
        this.die = die;
        this.statName = statName;
    }
}
