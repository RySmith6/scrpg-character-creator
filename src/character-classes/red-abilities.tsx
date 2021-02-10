import AbilitySelector from '../components/ability-selector';
import RedAbilities from '../rulebook-data/RedAbilities.json';
import { ExplodedCategories } from './ExplodedCategories';
import React from 'react';

export default function RedAbilityList(props) {
    let stats = props.totalStats ? { qualities: props.totalStats.qualities, powers: props.totalStats.powers, total: (props.totalStats.powers || []).concat(props.totalStats.qualities) } : { qualities: ['history'], powers: ['speed'], total: ['history', 'speed'] };
    const updateAbilities = () => {

    }
    let filteredReds = RedAbilities.filter(ra => stats.total.some(s => ExplodedCategories.ReturnStatsWithExplodedCategories((ra.requiredQuality || []).concat(ra.requiredPower)).indexOf(s) != -1));


    return (
        <AbilitySelector
            abilities={filteredReds}
            confirmAbilities={props.confirmRedAbilities}
            strict={props.strict}
            powers={stats.powers || []}
            qualities={stats.qualities || []}
            maxOptions={2} />
    )
}