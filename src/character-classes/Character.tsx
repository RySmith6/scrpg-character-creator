import React, { Component } from 'react'
import { Background } from './Background';
import { Personality, PersonalityList } from './Personality';
import { Principle } from './Principle';
import { Ability, AbilityList, GYROZone } from './Ability';
import diceImageSrc, { DiceOptions, diceRoll, maxDieValue, rollForNextStep } from './DiceOptions';
import { BackgroundsList } from './Background';
import { PowerSourcesList, PowerSource } from "./PowerSources"
import { ArchetypesList, Archetype } from './Archetype';
import { StatDie } from './StatDie';
import { SourceStep } from './SourceStep';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CreationStepper from '../components/creation-stepper'
import DisplayStatDice from '../components/display-stat-dice';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CharacterSources } from './CharacterSources';
import RedAbilityList from './red-abilities';
import { ExplodedCategories } from './ExplodedCategories';
import HealthChart from '../rulebook-data/health-chart.json';
import { fillForm } from '../components/pdf-filler'
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import GenerateRandomCharacterState from '../components/random-state-generator';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';

export class Character extends Component {
    state: {
        name: string;
        sources: CharacterSources;
        healthMax: number;
        principles: Principle[];
        greenAbilities: Ability[];
        principleAbilities: Ability[];
        yellowAbilities: Ability[];
        redAbilities: Ability[];
        powerDice: StatDie[];
        qualityDice: StatDie[];
        backgroundRollResult: number[];
        powerSourceRollResult: number[];
        archetypeRollResult: number[];
        personalityRollResult: number[];
        greenStatusDie: DiceOptions;
        yellowStatusDie: DiceOptions;
        redStatusDie: DiceOptions;
        outAbility: string;
        strict: boolean;
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
        this.state.principleAbilities = [];
        this.state.yellowAbilities = [];
        this.state.redAbilities = [];
        this.state.sources = new CharacterSources();
        this.state.strict = true;
        this.state.backgroundRollResult = rollForNextStep([DiceOptions.d10, DiceOptions.d10]);
        this.selectBackground = this.selectBackground.bind(this);
        this.selectPowerSource = this.selectPowerSource.bind(this);
        this.selectArchetype = this.selectArchetype.bind(this);
        this.selectPersonality = this.selectPersonality.bind(this);
        this.selectRedAbilities = this.selectRedAbilities.bind(this);
        this.generateRandomCharacter = this.generateRandomCharacter.bind(this);
        this.generateHealthMax = this.generateHealthMax.bind(this);
        this.setCharacterName = this.setCharacterName.bind(this);
        this.clearCharacterData = this.clearCharacterData.bind(this);
        this.changeStrict = this.changeStrict.bind(this);
    }
    changeStrict(value) {
        this.setState({ strict: value });
    }
    generateRandomCharacter() {
        let newState = GenerateRandomCharacterState(this.state, this.selectBackground, this.selectPowerSource, this.selectArchetype, this.selectPersonality, this.generateHealthMax);
        this.setState(newState);
    }
    clearCharacterData() {
        let newState = Object.assign({}, this.state);
        newState.powerDice = [];
        newState.qualityDice = [];
        newState.greenAbilities = [];
        newState.principleAbilities = [];
        newState.yellowAbilities = [];
        newState.redAbilities = [];
        newState.greenStatusDie = DiceOptions.d4;
        newState.yellowStatusDie = DiceOptions.d4;
        newState.redStatusDie = DiceOptions.d4;
        newState.outAbility = '';
        newState.sources = new CharacterSources();
        newState.backgroundRollResult = rollForNextStep([DiceOptions.d10, DiceOptions.d10]);
        newState.healthMax = 0;
        this.setState(newState);
    }
    selectBackground(background: Background) {
        let newState = Object.assign({}, this.state);
        background.setStrict(this.state.strict);
        background.setUpdateFunction(this.selectBackground);
        newState.sources.background = background;
        newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.Background) || []);
        newState.qualityDice.push(...(background.finalizedStatDice || []));
        newState.powerSourceRollResult = rollForNextStep(background.diceForPowerSource);
        newState.greenAbilities = newState.greenAbilities.filter(a => a.source !== SourceStep.Background);
        if (background.selectedPrinciple) {
            let principleAbility = background.selectedPrinciple.greenAbility;
            principleAbility.source = SourceStep.Background;
            newState.principleAbilities = newState.principleAbilities.filter(a => a.source !== SourceStep.Background);
            newState.principleAbilities.push(principleAbility);
        }
        this.updateSourcesWithUsedStats(newState);
        this.setState(newState);
    }
    selectPowerSource(powerSource: PowerSource) {
        let newState = Object.assign({}, this.state);
        powerSource.setStrict(this.state.strict);
        powerSource.setUpdateFunction(this.selectPowerSource);
        newState.sources.powerSource = powerSource;
        newState.powerDice = (newState.powerDice.filter(q => q.source !== SourceStep.PowerSource) || []);
        newState.powerDice.push(...newState.sources.powerSource.finalPowerDice);
        newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.PowerSource) || []);
        if (powerSource.finalQualityDice)
            newState.qualityDice.push(...powerSource.finalQualityDice);
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source !== SourceStep.PowerSource) || []);
        newState.greenAbilities.push(...(newState.sources.powerSource.finalGreenAbilities || []));
        newState.yellowAbilities = (newState.yellowAbilities.filter(ya => ya.source !== SourceStep.PowerSource) || []);
        newState.yellowAbilities.push(...(newState.sources.powerSource.finalYellowAbilities || []));
        newState.archetypeRollResult = rollForNextStep(powerSource.diceForArchetype);
        this.updateSourcesWithUsedStats(newState);
        this.setState(newState);
    }
    selectArchetype(archetype: Archetype) {
        let newState = Object.assign({}, this.state);
        archetype.setStrict(this.state.strict);
        archetype.setUpdateFunction(this.selectArchetype);
        newState.sources.archetype = archetype;
        newState.powerDice = (newState.powerDice.filter(q => q.source !== SourceStep.Archetype) || []);
        newState.powerDice.push(...newState.sources.archetype.finalPowerDice);
        newState.qualityDice = (newState.qualityDice.filter(q => q.source !== SourceStep.Archetype) || []);
        if (archetype.finalQualityDice)
            newState.qualityDice.push(...archetype.finalQualityDice);
        newState.greenAbilities = (newState.greenAbilities.filter(ga => ga.source !== SourceStep.Archetype) || []);
        newState.greenAbilities.push(...(newState.sources.archetype.finalGreenAbilities || []));
        if (newState.sources.archetype.guaranteedGreenAbilities)
            newState.greenAbilities.push(...newState.sources.archetype.guaranteedGreenAbilities);
        newState.yellowAbilities = (newState.yellowAbilities.filter(ga => ga.source !== SourceStep.Archetype) || []);
        newState.yellowAbilities.push(...(newState.sources.archetype.finalYellowAbilities || []));

        if (archetype.selectedPrinciple) {
            let principleAbility = archetype.selectedPrinciple.greenAbility;
            principleAbility.source = SourceStep.Archetype;
            newState.principleAbilities = newState.principleAbilities.filter(a => a.source !== SourceStep.Archetype);
            newState.principleAbilities.push(principleAbility);
        }
        this.updateSourcesWithUsedStats(newState);
        this.setState(newState);
    }
    selectPersonality(personality: Personality) {
        let newState = Object.assign({}, this.state);
        personality.setUpdateFunction(this.selectPersonality);
        newState.sources.personality = personality;
        newState.greenStatusDie = personality.greenStatusDie;
        newState.yellowStatusDie = personality.yellowStatusDie;
        newState.redStatusDie = personality.redStatusDie;
        newState.outAbility = personality.outAbility;
        if (personality.backstoryQualityStat) {
            newState.qualityDice = newState.qualityDice.filter(q => q.source !== SourceStep.Personality);
            newState.qualityDice.push(new StatDie(personality.backstoryQuality
                , SourceStep.Personality, personality.backstoryQualityStat));
        }
        this.setState(newState);
    }
    selectRedAbilities(abilities) {
        // let newState = Object.assign({}, this.state);
        // newState.redAbilities;
        this.setState({ redAbilities: abilities });
    }
    selectHealthRoll(roll: boolean) {
        let newState = Object.assign({}, this.state);
        newState.healthMax = this.generateHealthMax(roll, newState);
        this.setState(newState);
    }
    generateHealthMax(roll, state) {
        let startValue = 8;
        let redStatus = maxDieValue(state.redStatusDie);
        let sortedAthPowOrMentQuals = state.powerDice.filter(pd => ExplodedCategories.GetCategoryForStat(pd.statName) === 'categoryAthletic')
            .concat(state.qualityDice.filter(pd => ExplodedCategories.GetCategoryForStat(pd.statName) === 'categoryMental')).sort((a, b) => (a.die > b.die) ? 1 : -1);
        let maxPowQual = sortedAthPowOrMentQuals.length > 0 ? maxDieValue(sortedAthPowOrMentQuals[sortedAthPowOrMentQuals.length - 1].die) : 4;
        let d8orAvg = roll ? diceRoll(DiceOptions.d8) : 4;
        let maxHealth = startValue + redStatus + maxPowQual + d8orAvg;
        return maxHealth;
    }

    setCharacterName(value) {
        let newState = Object.assign({}, this.state);
        newState.name = value;
        this.setState(newState);
    }
    updateSourcesWithUsedStats(state) {
        let usedStats = state.powerDice.slice().concat(state.qualityDice.slice());
        if (state.sources.background)
            state.sources.background.setUsedStats(usedStats.filter(s => s.source !== SourceStep.Background).map(sd => sd.statName));
        if (state.sources.powerSource)
            state.sources.powerSource.setUsedStats(usedStats.filter(s => s.source !== SourceStep.PowerSource).map(sd => sd.statName));
        if (state.sources.arechetype)
            state.sources.archetype.setUsedStats(usedStats.filter(s => s.source !== SourceStep.Archetype).map(sd => sd.statName));
    }

    componentDidMount() {
        //this.generateRandomCharacter();
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
        stepArray.push(...['Select 2 Red Abilities', 'Retcon', 'Determine Health', 'Finishing Touches', 'Download Sheet']);
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
            rolledOptions={this.state.archetypeRollResult}
            selectedCallback={this.selectArchetype}
            diceFromPreviousStep={this.state.sources.powerSource ? this.state.sources.powerSource.diceForArchetype : []}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />);
        if (this.state.sources.archetype) {
            stepArray.push(...this.state.sources.archetype.getSteps(this.state.powerDice, this.state.qualityDice).map(s => s.content));
        }
        stepArray.push(<PersonalityList
            rolledOptions={this.state.personalityRollResult}
            selectedCallback={this.selectPersonality}
            diceFromPreviousStep={this.state.sources.archetype ? this.state.sources.archetype.diceForPersonality : []}
            strict={this.state.strict}
            powerDice={this.state.powerDice}
            qualityDice={this.state.qualityDice} />);
        if (this.state.sources.personality) {
            stepArray.push(...this.state.sources.personality.getSteps().map(s => s.content));
        }
        stepArray.push(<RedAbilityList
            strict={this.state.strict}
            totalStats={{ powers: this.state.powerDice, qualities: this.state.qualityDice }}
            confirmRedAbilities={this.selectRedAbilities} />)
        stepArray.push(...[<Typography>'Retcon'</Typography>,
        <div>
            <Button variant="outlined" color="primary" onClick={(e) => {
                e.stopPropagation(); this.selectHealthRoll(true)
            }}>Roll For Health</Button>
            <Button variant="outlined" color="primary" onClick={(e) => {
                e.stopPropagation(); this.selectHealthRoll(false)
            }}>Take 4 For Health</Button>
        </div>
            , <Typography>'Finishing Touches'</Typography>,
        <Button variant="outlined" color="primary" onClick={(e) => {
            e.stopPropagation(); fillForm(this.state);
        }}>Download filled Character Sheet</Button>
        ]);
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
                    <Grid container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        spacing={2}>
                        <Grid container item xs={12}>
                            {/* <Switch
                                checked={this.state.strict}
                                onChange={(event) =>
                                    this.changeStrict(event.target.checked)}
                                name="strict"
                                color="primary"
                                size="small"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            /> */}
                            <Grid container item xs={11}>
                                <TextField style={{ flex: 1 }} required id="standard-required" label="Character Name" defaultValue={this.state.name} onChange={(event) => this.setCharacterName(event.target.value)}></TextField>

                                <Tooltip title="Randomize Character">
                                    <Fab aria-label="Roll" color={'secondary'} size={'small'} variant={'extended'} onClick={this.generateRandomCharacter}>
                                        <CasinoOutlinedIcon /> Randomize
                                    </Fab>
                                </Tooltip>
                                <Tooltip title="Download Character Sheet">
                                    <Fab aria-label="download" color={'primary'} size={'small'} variant={'extended'} onClick={() => fillForm(this.state)}>
                                        <CloudDownloadIcon />  Download
                                    </Fab>
                                </Tooltip>
                                <Tooltip title="Clear Character data">
                                    <Fab aria-label="clear" color={'default'} size={'small'} variant={'extended'} onClick={this.clearCharacterData}>
                                        <DeleteForeverOutlinedIcon />  Clear Data
                                    </Fab>
                                </Tooltip>
                            </Grid>
                            <Grid xs={1}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.strict}
                                                onChange={(event) =>
                                                    this.changeStrict(event.target.checked)}
                                                name="strict"
                                                color="primary"
                                                size="small"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />}
                                        labelPlacement={'top'}
                                        label="Guided"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2} justify="center">
                            <Grid item><Typography> Background:{this.state.sources.background ? this.state.sources.background.name : 'No Background Selected'}</Typography>
                            </Grid><Grid item>
                                <Typography> Power Source:{this.state.sources.powerSource ? this.state.sources.powerSource.name : 'No Power Source Selected'}</Typography>
                            </Grid><Grid item>
                                <Typography>Archetype:{this.state.sources.archetype ? this.state.sources.archetype.name : 'No Archetype Selected'}</Typography>
                            </Grid><Grid item>
                                <Typography>Personality:{this.state.sources.personality ? this.state.sources.personality.name : 'No Personality Selected'}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4}>
                                <DisplayStatDice
                                    statDice={this.state.powerDice}
                                    statType="Powers" />
                            </Grid>
                            <Grid item xs={4}>
                                <DisplayStatDice
                                    statDice={this.state.qualityDice}
                                    statType="Qualities" />
                            </Grid>
                            <Grid item xs={4}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        Status Dice
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List style={{ width: '100%' }}>
                                            <ListItem className='gyrozone-green'>{diceImageSrc(this.state.greenStatusDie, 30)} {this.state.healthMax && HealthChart[this.state.healthMax].green}</ListItem>
                                            <Divider />
                                            <ListItem className='gyrozone-yellow'>{diceImageSrc(this.state.yellowStatusDie, 30)} {this.state.healthMax && HealthChart[this.state.healthMax].yellow}</ListItem>
                                            <Divider />
                                            <ListItem className='gyrozone-red'>{diceImageSrc(this.state.redStatusDie, 30)} {this.state.healthMax && HealthChart[this.state.healthMax].red}</ListItem>
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item>
                                <AbilityList gyroZone={GYROZone.green} preview={true} abilities={this.state.greenAbilities.concat(this.state.principleAbilities)} characterSources={this.state.sources}></AbilityList>
                            </Grid>
                            <Grid item>
                                <AbilityList gyroZone={GYROZone.yellow} preview={true} abilities={this.state.yellowAbilities} characterSources={this.state.sources}></AbilityList>
                            </Grid>
                            <Grid item>
                                <AbilityList gyroZone={GYROZone.red} preview={true} abilities={this.state.redAbilities} characterSources={this.state.sources}></AbilityList>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={6}>
                    <Box width='100%' style={{ maxHeight: '85vh', overflow: 'auto' }}>
                        <CreationStepper
                            steps={this.getStepLabels()}
                            getStepContent={this.getStepContents()} ></CreationStepper>
                    </Box>
                </Grid>

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