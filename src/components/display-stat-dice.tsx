import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { diceAvatar } from '../character-classes/DiceOptions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));


export default function DisplayStatDice(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{props.statType ?? 'Stats'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List dense={true}>
                        {props.statDice.map(d => (
                            <ListItem>
                                <ListItemAvatar>
                                    {diceAvatar(d.die)}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={d.statName}
                                />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}