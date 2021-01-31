import { StatDie } from "./StatDie";
import { CharacterSources } from "./CharacterSources";
import { SourceStep } from "./SourceStep";
import { DiceOptions } from "./DiceOptions";


export interface UsesDiceAndConfirmCallback {
    stats: StatDie[];
    confirmCallback?: (confirmData) => void;
    characterSources: CharacterSources;
    powerOrQuality: string;
}



export interface StatOptionsAndCallback {
    statOptions: string[];
    die: DiceOptions;
    onConfirm: (value, index) => void;
    index: number;
    defaultValue?: string;
}
export interface HasSourceStep {
    source: SourceStep;
}