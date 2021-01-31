import React from 'react'
import { List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { ExplodedCategories } from '../character-classes/ExplodedCategories';
import { makeStyles } from '@material-ui/core/styles';


export default function StatDisplay(props) {
    const classes = useStyles();
    return (<List dense={true} subheader={<li />} className={classes.root}>
        {props.stats.map((stat) => (
            (stat as string).startsWith('category') ?
                <li key={`stat-${stat}`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        <ListSubheader>{ExplodedCategories.GetReadableCategoryName(stat)}</ListSubheader>
                        {ExplodedCategories.GetAllStatsInCategory(stat).map((item) => (
                            <ListItem key={`item-${stat}-${item}`}>
                                <ListItemText primary={`${item}`} />
                            </ListItem>
                        ))}
                    </ul>
                </li>
                :
                <ListItem key={`item-${stat}`}>
                    <ListItemText primary={`${stat}`} />
                </ListItem>
        ))}
    </List>);
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 360,
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