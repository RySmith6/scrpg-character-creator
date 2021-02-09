import { Background } from './Background';
import { Personality } from './Personality';
import { PowerSource } from "./PowerSources";
import { Archetype } from './Archetype';
import { SourceStep } from './SourceStep';
import Backgrounds from '../rulebook-data/Backgrounds.json';
import PowerSources from '../rulebook-data/PowerSource.json';
import Archetypes from '../rulebook-data/Archetypes.json';
import Personalities from '../rulebook-data/Personalities.json';

export class CharacterSources {
    background?: Background;
    powerSource?: PowerSource;
    archetype?: Archetype;
    personality?: Personality;
    generateRandomSources() {
        this.background = new Background(Backgrounds[Math.floor((Math.random() * 20) + 1)]);
        let ps = PowerSources[Math.floor((Math.random() * 20) + 1)];
        ps['diceToAssign'] = this.background.diceForPowerSource;
        this.powerSource = new PowerSource(ps);
        let ar = Archetypes[Math.floor((Math.random() * 18) + 1)];
        ar['diceToAssign'] = this.powerSource.diceForArchetype;
        this.archetype = new Archetype(ar);
        let per = Personalities[Math.floor((Math.random() * 20) + 1)];
        this.personality = new Personality(per);
    }
    getNameOfSource(step: SourceStep) {
        if (step === SourceStep.Background && this.background)
            return this.background.name;
        else if (step === SourceStep.PowerSource && this.powerSource)
            return this.powerSource.name;
        else if (step === SourceStep.Archetype && this.archetype)
            return this.archetype.name;
        else if (step === SourceStep.Personality && this.personality)
            return this.personality.name;

        else
            return 'UNDEFINED SOURCE';
    }
}
