import React from 'react'
import { List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default function StatSelector(props: StatSelectionCallback) {
    const classes = useStyles();
    const handleChange = (event, value) => {
        props.selectedStat(value, props.id);
    };


    return (
        <Autocomplete
            id="combo-box-demo"
            options={ExplodedCategories.ReturnStatsWithExplodedCategories(props.stats)}
            style={{ width: 300 }}
            onChange={handleChange}
            defaultValue={props.stat}
            renderInput={(params) => <TextField {...params} label={props.label ?? 'Stat'} variant="outlined" />}
        />
    );
}

export interface StatSelectionCallback {
    stats: string[];
    selectedStat: (stat: string, id: number) => void;
    id: number;
    label?: string;
    stat: string;
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