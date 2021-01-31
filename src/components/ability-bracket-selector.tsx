import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function AbilityBracketSelector(props) {
    const options = [];

    if (props.bracketedString === '[power]') {
        options.push(...props.powers.map(d => d.statName))
    }
    else if (props.bracketedString === '[quality]') {
        options.push(...props.qualities.map(d => d.statName))
    }
    else {
        let strippedString = (props.bracketedString as string).slice(1, props.bracketedString.length - 1);
        options.push(...strippedString.match(/\b(?!or)\b\S+/g));
    }

    const handleSelection = (event) => {
        let value = event.target.value;
        props.bracketSelection(props.index, props.bracketedString, value);
    }

    return (<Select key={`${props.index}-${props.bracketedString}-select`} onChange={handleSelection} >
        {options.map(o => (
            <MenuItem value={o}>{o}</MenuItem>
        ))}
    </Select>);
}