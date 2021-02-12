import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import AbilityBracketSelector from './ability-bracket-selector';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    text: {
        width: '80%'
    }
}));
export default function AbilitySelector(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(props.defaultAbilities || []);
    const bracketRegEx = /\[([^\]]+)\]/g

    const handleToggle = (ability) => () => {
        const currentIndex = checked.findIndex(a => a.name === ability.name);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            if (newChecked.length < props.maxOptions ?? 5)
                newChecked.push(ability);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        confirmAbilities(newChecked);
    };

    const confirmAbilities = (varchecked) => {
        if (typeof (props.confirmAbilities) === 'function')
            props.confirmAbilities(varchecked)
    }


    const handleBracketSelection = (index, bracketString, value) => {
        const newChecked = [...checked];
        const ability = newChecked[index];

        ability['finalText'] = ability['text'].replace(bracketString, value);
        setChecked(newChecked);
        confirmAbilities(newChecked);
    };

    return (
        <List className={classes.root}>
            {props.abilities.map((ability, index) => {
                const labelId = `checkbox-list-label-${ability.name}`;

                return (
                    <ListItem key={ability.name} role={undefined} dense button onClick={handleToggle(ability)} alignItems="flex-start">
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(ability) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={ability.name} secondary={<Typography className={classes.text}>{ability.finalText || ability.text}</Typography>} />
                        {(checked.indexOf(ability) !== -1 && ability.text.match(bracketRegEx)) ?
                            <ListItemSecondaryAction>
                                {ability.text.match(bracketRegEx).map(bracketedValue =>
                                    <AbilityBracketSelector
                                        bracketedString={bracketedValue}
                                        index={checked.indexOf(ability)}
                                        powers={ability.requiredPower ? props.powers.filter(p => ExplodedCategories.ReturnStatsWithExplodedCategories(ability.requiredPower).indexOf(p.statName) > -1) : props.powers}
                                        qualities={ability.requiredQuality ? props.qualities.filter(q => ExplodedCategories.ReturnStatsWithExplodedCategories(ability.requiredQuality).indexOf(q.statName) > -1) : props.qualities}
                                        bracketSelection={handleBracketSelection}>

                                    </AbilityBracketSelector>)}
                            </ListItemSecondaryAction>
                            : ''}

                    </ListItem>
                );
            })}
        </List>
    );
}