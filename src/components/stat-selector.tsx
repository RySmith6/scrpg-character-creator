import React from 'react'
import { List, ListSubheader, ListItem, ListItemText, InputAdornment } from '@material-ui/core';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import diceImageSrc, { DiceOptions } from '../character-classes/DiceOptions';


export default function StatSelector(props: StatSelectionCallback) {
    const classes = useStyles();
    const options = ExplodedCategories.GetSortedExplodedCategories(props.stats);
    const handleChange = (event, value) => {
        props.selectedStat(value, props.id);
    };


    return (
        <Autocomplete
            id="combo-box-demo"
            options={options}
            groupBy={(option) => ExplodedCategories.GetReadableCategoryName(option.category)}
            getOptionLabel={(option) => option.stat}
            style={{ width: 300 }}
            onChange={handleChange}
            defaultValue={//props.stat
                { stat: props.stat, category: ExplodedCategories.GetCategoryForStat(props.stat), type: ExplodedCategories.GetTypeofStat(props.stat) }
            }
            //autoComplete={true}
            renderInput={(params) => <TextField {...params} label={props.label ?? 'Stat'} variant="outlined"
                InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment position="start">{diceImageSrc(props.die, 25)}</InputAdornment>,
                }}
            />}
        />
    );
}

export interface StatSelectionCallback {
    stats: string[];
    selectedStat: (stat: string, id: number) => void;
    id: number;
    label?: string;
    stat: string;
    die: DiceOptions;
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));