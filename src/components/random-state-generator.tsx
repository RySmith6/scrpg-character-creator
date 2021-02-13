
import { ExplodedCategories } from '../character-classes/ExplodedCategories';
import Backgrounds from '../rulebook-data/Backgrounds.json';
import PowerSources from '../rulebook-data/PowerSource.json';
import Archetypes from '../rulebook-data/Archetypes.json';
import Personalities from '../rulebook-data/Personalities.json';
import Principles from '../rulebook-data/Principles.json'
import RedAbilities from '../rulebook-data/RedAbilities.json'

import { DiceOptions, rollForNextStep } from '../character-classes/DiceOptions';
import { Background } from '../character-classes/Background';
import { Personality } from '../character-classes/Personality';
import { Principle } from '../character-classes/Principle';
import { Ability } from '../character-classes/Ability';
import { PowerSource } from "../character-classes/PowerSources"
import { Archetype } from '../character-classes/Archetype';
import { StatDie } from '../character-classes/StatDie';
import { SourceStep } from '../character-classes/SourceStep';
export default function GenerateRandomCharacterState(beginningState, selectBackground, selectPowerSource, selectArchetype, selectPersonality, generateHealthMax) {
    let newState = Object.assign({}, beginningState);
    newState.backgroundRollResult = rollForNextStep([DiceOptions.d10, DiceOptions.d10]);
    //Background
    newState.sources.background = new Background(Backgrounds[newState.backgroundRollResult[0] - 1]);
    newState.sources.background.setUpdateFunction(selectBackground);
    newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.Background) || []);
    newState.qualityDice.push(...newState.sources.background.diceToAssign.map((d, index) => new StatDie(d, SourceStep.Background, ExplodedCategories.ReturnStatsWithExplodedCategories(newState.sources.background.qualities)[index])));
    newState.principleAbilities = [];// newState.principleAbilities.filter(pa => pa.name !== newState.sources.background.selectedPrinciple.name);
    newState.sources.background.selectedPrinciple = new Principle({ ...Principles.find(p => p.category === newState.sources.background.principleCategory), source: SourceStep.Background });
    newState.principleAbilities.push(newState.sources.background.selectedPrinciple.greenAbility);
    newState.powerSourceRollResult = rollForNextStep(newState.sources.background.diceForPowerSource);
    //PowerSource
    newState.sources.powerSource = new PowerSource({ ...PowerSources[newState.powerSourceRollResult[0] - 1], diceToAssign: newState.sources.background.diceForPowerSource });
    newState.sources.powerSource.setUpdateFunction(selectPowerSource);
    newState.powerDice = (newState.powerDice.filter(q => q.source !== SourceStep.PowerSource) || []);
    newState.powerDice.push(...newState.sources.background.diceForPowerSource.map((d, index) => new StatDie(d, SourceStep.PowerSource, ExplodedCategories.ReturnStatsWithExplodedCategories(newState.sources.powerSource.powers)[index])));
    newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.PowerSource) || []);
    if (newState.sources.powerSource.additionalQualitiesDice)
        newState.qualityDice.push(...newState.sources.powerSource.additionalQualitiesDice.map((d, index) => new StatDie(d, SourceStep.PowerSource, ExplodedCategories.ReturnStatsWithExplodedCategories(newState.sources.powerSource.additionalQualities)[index])));
    newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source !== SourceStep.PowerSource) || []);
    newState.greenAbilities.push(...((newState.sources.powerSource.greenAbilityOptions || []).slice(0, newState.sources.powerSource.greenAbilityCount || 0) || []));
    newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source !== SourceStep.PowerSource) || []);
    newState.yellowAbilities.push(...(newState.sources.powerSource.yellowAbilityOptions || []).slice(0, newState.sources.powerSource.yellowAbilityCount || 0));
    newState.archetypeRollResult = rollForNextStep(newState.sources.powerSource.diceForArchetype);
    //archetypes
    newState.sources.archetype = new Archetype(Archetypes[newState.archetypeRollResult[0] - 1]);
    newState.sources.archetype.setUpdateFunction(selectArchetype);
    newState.powerDice = (newState.powerDice.filter(q => q.source !== SourceStep.Archetype) || []);
    newState.powerDice.push(...newState.sources.powerSource.diceForArchetype.map((d, index) => new StatDie(d, SourceStep.Archetype, ExplodedCategories.ReturnStatsWithExplodedCategories(newState.sources.archetype.powers).filter(p => !newState.powerDice.some(pd => pd.statName === p))[index])));
    newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.Archetype) || []);
    newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source !== SourceStep.Archetype) || []);
    newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []).slice(0, newState.sources.archetype.greenAbilityCount || 0));
    if (newState.sources.archetype.guaranteedGreenAbilities)
        newState.greenAbilities.push(...newState.sources.archetype.guaranteedGreenAbilities);
    newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source !== SourceStep.Archetype) || []);
    newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []).slice(0, newState.sources.archetype.yellowAbilityCount || 0));
    //    newState.principleAbilities = newState.principleAbilities.filter(pa => pa.name !== newState.sources.archetype.selectedPrinciple.name);
    newState.sources.archetype.selectedPrinciple = new Principle({ ...Principles.find(p => (p.category === newState.sources.archetype.principleCategory && p.name !== newState.sources.background.selectedPrinciple.name)), source: SourceStep.Archetype });
    newState.principleAbilities.push(newState.sources.archetype.selectedPrinciple.greenAbility);
    newState.personalityRollResult = rollForNextStep([DiceOptions.d10, DiceOptions.d10]);
    //Personality
    newState.sources.personality = new Personality(Personalities[newState.personalityRollResult[0] - 1]);
    newState.sources.personality.setUpdateFunction(selectPersonality);
    newState.greenStatusDie = newState.sources.personality.greenStatusDie;
    newState.yellowStatusDie = newState.sources.personality.yellowStatusDie;
    newState.redStatusDie = newState.sources.personality.redStatusDie;
    newState.outAbility = newState.sources.personality.outAbility;
    //RedAbilities
    newState.redAbilities = RedAbilities.filter(ra => newState.qualityDice.concat(newState.powerDice).some(s => ExplodedCategories.ReturnStatsWithExplodedCategories((ra.requiredQuality || []).concat(ra.requiredPower)).indexOf(s.statName) !== -1)).slice(0, 2).map(ra => new Ability(ra));
    //health
    newState.healthMax = generateHealthMax(true, newState);
    return newState;
}