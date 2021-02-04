import React, { Component, ChangeEvent } from 'react'
import { Background } from './Background';
import { Personality, PersonalityList } from './Personality';
import { Principle } from './Principle';
import { Ability, AbilityList, GYROZone } from './Ability';
import diceImageSrc, { DiceOptions, diceRoll } from './DiceOptions';
import { Container } from 'react-bootstrap';
import { Outlet, Routes, Route, Link } from "react-router-dom";
import { BackgroundsList } from './Background';
import { PowerSourcesList, PowerSource } from "./PowerSources"
import { ListGroup } from 'react-bootstrap';
import { ArchetypesList, Archetype } from './Archetype';
import { StatDie } from './StatDie';
import { SourceStep } from './SourceStep';
import { Grid, Accordion, List, ListItem, Divider, Button, Typography, Box } from '@material-ui/core';
import CreationStepper from '../components/creation-stepper'
import DisplayStatDice from '../components/display-stat-dice';
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CharacterSources } from './CharacterSources';

export class Character extends Component {
    state: {
        name: string;
        sources: CharacterSources;
        healthMax: number;
        principles: Principle[];
        greenAbilities: Ability[];
        yellowAbilities: Ability[];
        redAbilities: Ability[];
        powerDice: StatDie[];
        qualityDice: StatDie[];
        backgroundRollResult: number[];
        powerSourceRollResult: number[];
        greenStatusDie: DiceOptions;
        yellowStatusDie: DiceOptions;
        redStatusDie: DiceOptions;
        outAbility: string;
        strict: boolean;
        open: boolean;
    }
    open: boolean = true;
    constructor(data: any) {
        super(data);
        this.state = Object.assign({}, data);
        this.state.name = 'DEFAULT CHARACTER NAME';
        this.state.healthMax = 0;
        this.state.powerDice = [];
        this.state.qualityDice = [];
        this.state.greenAbilities = [];
        this.state.yellowAbilities = [];
        this.state.redAbilities = [];
        this.state.sources = new CharacterSources();
        this.state.strict = true;
        this.state.open = false;
        this.state.backgroundRollResult = this.rollForBackground();
        this.selectBackground = this.selectBackground.bind(this);
        this.selectPowerSource = this.selectPowerSource.bind(this);
        this.selectArchetype = this.selectArchetype.bind(this);
        this.selectPersonality = this.selectPersonality.bind(this);
        this.reRollBackground = this.reRollBackground.bind(this);
        this.rollForNextStep = this.rollForNextStep.bind(this);
        this.toggleSheetCollapse = this.toggleSheetCollapse.bind(this);
    }
    generateRandomCharacter() {
        this.state.sources.generateRandomSources();
        let newState = Object.assign({}, this.state);
        //Background
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Background) || []);
        newState.qualityDice.push(...newState.sources.background.diceToAssign.map(d => new StatDie(d, SourceStep.Background)));
        newState.powerSourceRollResult = this.rollForNextStep(newState.sources.background.diceForPowerSource);
        //PowerSource
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.PowerSource) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.PowerSource) || []);
        if (newState.sources.powerSource.additionalQualitiesDice)
            newState.qualityDice.push(...newState.sources.powerSource.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.PowerSource)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.yellowAbilityOptions || []));
        //archetypes
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.Archetype) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Archetype) || []);
        if (newState.sources.archetype.additionalQualitiesDice)
            newState.qualityDice.push(...newState.sources.archetype.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []));
        this.setState(newState);
    }
    reRollBackground() {
        let newState = Object.assign({}, this.state);
        newState.backgroundRollResult = this.rollForBackground();
        this.setState(newState);
    }

    rollForBackground(): number[] {
        let rolledBackgrounds = [];
        let firstDie = diceRoll(DiceOptions.d10);
        let secondDie = diceRoll(DiceOptions.d10);
        rolledBackgrounds = [firstDie, secondDie, (firstDie + secondDie)]
        return rolledBackgrounds;
    }
    rollForNextStep(dice: DiceOptions[]): number[] {
        let nextStepOptions = [];
        let nextStepRolls = dice.map(d => diceRoll(d));
        nextStepRolls.forEach((r, i) => {
            if (!nextStepOptions.includes(r))
                nextStepOptions.push(r);
            if (i < nextStepRolls.length - 1)
                nextStepRolls.slice(i + 1).forEach(or => {
                    if (!nextStepOptions.includes(r + or))
                        nextStepOptions.push(r + or);
                })
        });
        return nextStepOptions;
    }
    selectBackground(background: Background) {
        let newState = Object.assign({}, this.state);
        background.setStrict(this.state.strict);
        background.setUpdateFunction(this.selectBackground);
        newState.sources.background = background;
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Background) || []);
        newState.qualityDice.push(...(background.finalizedStatDice || []));
        newState.powerSourceRollResult = this.rollForNextStep(background.diceForPowerSource);
        newState.greenAbilities = newState.greenAbilities.filter(a => a.source !== SourceStep.Background);
        if (background.selectedPrinciple) {
            let principleAbility = background.selectedPrinciple.greenAbility;
            principleAbility.source = SourceStep.Background;
            newState.greenAbilities.push(principleAbility);
        }

        //newState.
        this.setState(newState);
    }
    selectPowerSource(powerSource: PowerSource) {
        let newState = Object.assign({}, this.state);
        powerSource.setStrict(this.state.strict);
        powerSource.setUpdateFunction(this.selectPowerSource);
        newState.sources.powerSource = powerSource;
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.PowerSource) || []);
        newState.powerDice.push(...newState.sources.powerSource.finalPowerDice);
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.PowerSource) || []);
        if (powerSource.finalQualityDice)
            newState.qualityDice.push(...powerSource.finalQualityDice);
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.finalYellowAbilities || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.finalYellowAbilities || []));
        this.setState(newState);
    }
    selectArchetype(archetype: Archetype) {
        let newState = Object.assign({}, this.state);
        newState.sources.archetype = archetype;
        newState.powerDice = (newState.powerDice.filter(q => q.source != SourceStep.Archetype) || []);
        newState.powerDice.push(...newState.sources.background.diceForPowerSource.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.qualityDice = (newState.qualityDice.filter(q => q.source != SourceStep.Archetype) || []);
        if (archetype.additionalQualitiesDice)
            newState.qualityDice.push(...archetype.additionalQualitiesDice.map(d => new StatDie(d, SourceStep.Archetype)));
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.greenAbilityOptions || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source != SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.yellowAbilityOptions || []));
        this.setState(newState);
    }
    selectPersonality(personality: Personality) {
        let newState = Object.assign({}, this.state);
        newState.sources.personality = personality;
        newState.greenStatusDie = personality.greenStatusDie;
        newState.yellowStatusDie = personality.yellowStatusDie;
        newState.redStatusDie = personality.redStatusDie;
        newState.outAbility = personality.outAbility;
        this.setState(newState);
    }

    toggleSheetCollapse() {
        let newState = Object.assign({}, this.state);
        newState.open = !newState.open;
        this.setState(newState)
    }

    componentDidMount() {
        this.generateRandomCharacter();
    }

    getStepLabels() {
        let stepArray = ['Background'];
        if (this.state.sources.background) {
            stepArray.push(...this.state.sources.background.getSteps().map(s => s.label));
        }
        stepArray.push('Power Source');
        if (this.state.sources.powerSource) {
            stepArray.push(...this.state.sources.powerSource.getSteps(this.state.qualityDice).map(s => s.label));
        }
        stepArray.push('Archetype');
        if (this.state.sources.archetype) {
            stepArray.push(...this.state.sources.archetype.getSteps(this.state.powerDice, this.state.qualityDice).map(s => s.label));
        }
        stepArray.push('Personality');
        if (this.state.sources.personality) {
            stepArray.push(...this.state.sources.personality.getSteps().map(s => s.label));
        }
        stepArray.push(...['Red Abilities', 'Retcon', 'Health', 'Finishing Touches']);
        return stepArray;
    }

    getStepContents() {
        let stepArray = [<BackgroundsList
            rolledOptions={this.state.backgroundRollResult}
            selectedCallback={this.selectBackground}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />];
        if (this.state.sources.background) {
            stepArray.push(...this.state.sources.background.getSteps().map(s => s.content));
        }
        stepArray.push(<PowerSourcesList
            rolledOptions={this.state.powerSourceRollResult}
            selectedCallback={this.selectPowerSource}
            diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />);
        if (this.state.sources.powerSource) {
            stepArray.push(...this.state.sources.powerSource.getSteps(this.state.qualityDice).map(s => s.content));
        }
        stepArray.push(<ArchetypesList
            rolledOptions={this.state.powerSourceRollResult}
            selectedCallback={this.selectArchetype}
            diceFromPreviousStep={this.state.sources.powerSource ? this.state.sources.powerSource.diceForArchetype : []}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />);
        if (this.state.sources.archetype) {
            stepArray.push(...this.state.sources.archetype.getSteps(this.state.powerDice, this.state.qualityDice).map(s => s.content));
        }
        stepArray.push(<PersonalityList
            rolledOptions={this.state.powerSourceRollResult}
            selectedCallback={this.selectPersonality}
            diceFromPreviousStep={this.state.sources.archetype ? this.state.sources.archetype.diceForPersonality : []}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />);
        if (this.state.sources.personality) {
            stepArray.push(...this.state.sources.personality.getSteps().map(s => s.content));
        }
        stepArray.push(...[<Typography>Red Abilities</Typography>, <Typography>'Retcon'</Typography>, <Typography>'Health'</Typography>, <Typography>'Finishing Touches'</Typography>]);
        return stepArray;
    }

    render() {
        return (
            <Grid container
                spacing={3}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid container item xs={12} md={6}>
                    <Container fluid>
                        <Accordion>
                            <AccordionSummary>Character Name:{this.state.name} <Button color="primary" onClick={this.toggleSheetCollapse}>Toggle Character Sheet</Button></AccordionSummary>
                            <AccordionDetails>
                                <Grid container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                    spacing={2}>
                                    <Grid item xs={4}>
                                        <Button variant="contained" onClick={this.reRollBackground}> Re-roll backgrounds</Button>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2} justify="center">
                                        <Grid item><p><Link to={'/backgrounds'}> Background</Link>:{this.state.sources.background ? this.state.sources.background.name : 'No Background Selected'}</p>
                                        </Grid><Grid item>
                                            <p><Link to={'/powersources'}> Power Source</Link>:{this.state.sources.powerSource ? this.state.sources.powerSource.name : 'No Power Source Selected'}</p>
                                        </Grid><Grid item>
                                            <p><Link to={'/archetypes'}> Archetype</Link>:{this.state.sources.archetype ? this.state.sources.archetype.name : 'No Archetype Selected'}</p>
                                        </Grid><Grid item>
                                            <p><Link to={'/personalities'}> Personality</Link>:{this.state.sources.personality ? this.state.sources.personality.name : 'No Personality Selected'}</p>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2}>
                                        <Grid item xs={5}>
                                            <DisplayStatDice
                                                statDice={this.state.qualityDice}
                                                statType="Qualities" />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <DisplayStatDice
                                                statDice={this.state.powerDice}
                                                powerOrQuality="Powers" />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    Status Dice
                                    </AccordionSummary>
                                                <AccordionDetails>
                                                    <List style={{ width: '100%' }}>
                                                        <ListItem className='gyrozone-green'>{diceImageSrc(this.state.greenStatusDie, 30)}</ListItem>
                                                        <Divider />
                                                        <ListItem className='gyrozone-yellow'>{diceImageSrc(this.state.yellowStatusDie, 30)}</ListItem>
                                                        <Divider />
                                                        <ListItem className='gyrozone-red'>{diceImageSrc(this.state.redStatusDie, 30)}</ListItem>
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2}>
                                        <Grid item>
                                            <AbilityList gyroZone={GYROZone.green} preview={true} abilities={this.state.greenAbilities} characterSources={this.state.sources}></AbilityList>
                                        </Grid>
                                        <Grid item>
                                            <AbilityList gyroZone={GYROZone.yellow} preview={true} abilities={this.state.yellowAbilities} characterSources={this.state.sources}></AbilityList>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Container>
                </Grid>
                <Grid container item xs={12} md={6}>
                    <Box width='100%' style={{ maxHeight: '85vh', overflow: 'auto' }}>
                        <CreationStepper
                            steps={this.getStepLabels()
                                // ['Background', 'Power Source', 'Archetype', 'Personality', 'Red Abilities', 'Retcon', 'Health', 'Finishing Touches']
                            }
                            getStepContent={this.getStepContents()
                                // [
                                // <BackgroundsList
                                //     rolledOptions={this.state.backgroundRollResult}
                                //     selectedCallback={this.selectBackground}
                                //     strict={this.state.strict}
                                //     powerDice={this.state.powerDice}
                                //     qualityDice={this.state.qualityDice} />,
                                // <PowerSourcesList
                                //     rolledOptions={this.state.powerSourceRollResult}
                                //     selectedCallback={this.selectPowerSource}
                                //     diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []}
                                //     strict={this.state.strict}
                                //     powerDice={this.state.powerDice}
                                //     qualityDice={this.state.qualityDice} />,
                                // <ArchetypesList
                                //     rolledOptions={this.state.powerSourceRollResult}
                                //     selectedCallback={this.selectArchetype}
                                //     diceFromPreviousStep={this.state.sources.powerSource ? this.state.sources.powerSource.diceForArchetype : []}
                                //     strict={this.state.strict}
                                //     powerDice={this.state.powerDice}
                                //     qualityDice={this.state.qualityDice} />,
                                // <PersonalityList
                                //     rolledOptions={this.state.powerSourceRollResult}
                                //     selectedCallback={this.selectPersonality}
                                //     diceFromPreviousStep={this.state.sources.archetype ? this.state.sources.archetype.diceForPersonality : []}
                                //     strict={this.state.strict}
                                //     powerDice={this.state.powerDice}
                                //     qualityDice={this.state.qualityDice} />,
                                // 'Red Abilities',
                                // 'Retcon',
                                // 'Health',
                                // 'Finishing Touches']
                            } ></CreationStepper>
                    </Box>
                    {/* <Outlet /> */}
                </Grid>
                {/* <Routes>
                    <Route path="/backgrounds" element={<BackgroundsList rolledOptions={this.state.backgroundRollResult} selectedCallback={this.selectBackground} strict={this.state.strict} />} />
                    <Route path="/powersources" element={<PowerSourcesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPowerSource} diceFromPreviousStep={this.state.sources.background ? this.state.sources.background.diceForPowerSource : []} strict={this.state.strict} />} />
                    <Route path="/archetypes" element={<ArchetypesList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectArchetype} diceFromPreviousStep={this.state.sources.powerSource ? this.state.sources.powerSource.diceForArchetype : []} strict={this.state.strict} />} />
                    <Route path="/personalities" element={<PersonalityList rolledOptions={this.state.powerSourceRollResult} selectedCallback={this.selectPersonality} diceFromPreviousStep={this.state.sources.archetype ? this.state.sources.archetype.diceForPersonality : []} strict={this.state.strict} />} />
                </Routes> */}
            </Grid>
        )
    }

}


export interface ReturnSelection {
    selectedCallback?: (selectable) => void;
    rolledOptions?: number[];
    diceFromPreviousStep?: DiceOptions[];
    strict?: boolean;
    qualityDice: StatDie[];
    powerDice: StatDie[];
}

export interface SelectableByRoll {
    rollResult: number;
    diceFromPreviousStep?: DiceOptions[];
    children?;
    updateState: (any) => void;
    strict?: boolean;
}