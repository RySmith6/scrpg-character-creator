import React, { Component } from 'react'
import { ReturnSelection, SelectableByRoll } from './Character';
import Archetypes from '../rulebook-data/Archetypes.json'
import { Col, Card, Button, ListGroup } from 'react-bootstrap';
import exploded from '../rulebook-data/exploded-categories.json';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Ability } from './Ability';
import { Row } from 'react-bootstrap';
import { stat } from 'fs';
import { ExplodedCategories } from './ExplodedCategories';
import { SourceStep } from './SourceStep';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import SourceStepper from '../components/source-stepper';
import { StatDie } from './StatDie';
import AssignStatDice from '../components/assign-stat-dice';
import StatDisplay from '../components/stat-display';
import AbilitySelector from '../components/ability-selector';
import { Principle, PrinciplesList } from './Principle';
import StatIndex from '../rulebook-data/stats-index.json';

export class ArchetypesList extends Component<ReturnSelection>{
    state: {
        selectedArchetype?: Archetype;
    }
    constructor(props: ReturnSelection) {
        super(props);
        this.confirmArchetype = this.confirmArchetype.bind(this);
        this.selectArchetype = this.selectArchetype.bind(this);
        this.state = {};
    }

    confirmYellowAbilities(abilities) {
        let archetype = Object.assign({}, this.state.selectedArchetype);
        archetype.finalYellowAbilities = abilities;
        this.setState({ selectedArchetype: archetype });
    }

    confirmGreenAbilities(abilities) {
        let archetype = Object.assign({}, this.state.selectedArchetype);
        archetype.finalGreenAbilities = abilities;
        this.setState({ selectedArchetype: archetype });
    }

    confirmPowerDice(dice) {
        let archetype = Object.assign({}, this.state.selectedArchetype);
        archetype.finalPowerDice = dice;
        this.setState({ selectedArchetype: archetype });
    }

    confirmQualityDice(dice) {
        let archetype = Object.assign({}, this.state.selectedArchetype);
        archetype.finalQualityDice = dice;
        this.setState({ selectedArchetype: archetype });
    }

    getArchetypeSteps(archetype) {
        let baseSteps = [];
        if (archetype.requiredPower) {
            baseSteps.push(...[{ content: <AssignStatDice dice={this.state.selectedArchetype.diceToAssign} stats={archetype.powers} confirmDice={this.confirmPowerDice} /> }])
        }

    }

    getArchetypeStepContents(archetype) {

    }

    confirmArchetype() {
        this.props.selectedCallback(this.state.selectedArchetype);
    }
    selectArchetype(archetype: any) {
        archetype.diceToAssign = this.props.diceFromPreviousStep;
        this.setState({ selectedArchetype: archetype });
    }
    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {Archetypes.filter(a => this.props.strict ? this.props.rolledOptions.includes(a.rollResult) : true).map(a => (

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                key={a.rollResult} >
                                <span className="pull-left">{a.name}</span> <Button variant="outlined" color="primary" onClick={() => this.props.selectedCallback(new Archetype(a))} className="pull-right">Select this Archetype</Button>
                            </AccordionSummary>
                            <AccordionDetails >
                                <ArchetypeElement rollResult={a.rollResult} diceFromPreviousStep={this.props.diceFromPreviousStep} updateState={this.props.selectedCallback}></ArchetypeElement>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
                <Grid item xs={6}>
                    {this.state.selectedArchetype ?
                        <Grid
                            item xs={6}>
                            <SourceStepper steps={this.getArchetypeSteps(this.state.selectedArchetype)} stepContent={this.getArchetypeStepContents(this.state.selectedArchetype)} completeStepActions={this.confirmArchetype}></SourceStepper>
                        </Grid> : ''}
                </Grid>
            </Grid>
        );
    }
}

export class Archetype {
    name: string = 'DEFAULT ARCHETYPE';
    rollResult: number = 0;
    required: string[]
    min?: number;
    exact?: number
    powers: string[]
    remaining: string[]
    diceForPersonality: DiceOptions[]
    greenAbilityCount: number
    greenAbilityRestriction: string
    greenAbilityOptions: Ability[]
    yellowAbilityCount: number
    yellowAbilityRestriction: string = "differentPowers"
    yellowAbilityOptions: Ability[]
    diceToAssign: DiceOptions[]
    additionalQualitiesDice?: DiceOptions[]
    additionalQualities?: string[]
    principleCategory: string
    guaranteedGreenAbilities: Ability[]
    freeDice: DiceOptions[];
    freeDiceRestriction: string[];
    finalPowerDice: StatDie[] = [];
    finalQualityDice: StatDie[] = [];
    finalGreenAbilities: Ability[] = [];
    finalYellowAbilities: Ability[] = [];
    selectedPrinciple: Principle;
    remainingDice: DiceOptions[];
    strict: boolean = false;
    updateFunction?
    constructor(data) {
        Object.assign(this, data);


        (this.greenAbilityOptions || []).forEach(a => { a.source = SourceStep.Archetype });
        (this.yellowAbilityOptions || []).forEach(a => { a.source = SourceStep.Archetype });
        this.confirmPowerDice = this.confirmPowerDice.bind(this);
        //this.confirmQualityDice = this.confirmQualityDice.bind(this);
        this.confirmGreenAbilities = this.confirmGreenAbilities.bind(this);
        this.confirmYellowAbilities = this.confirmYellowAbilities.bind(this);
    }
    setUpdateFunction(update) {
        this.updateFunction = update;
    }
    setStrict(strict) {
        this.strict = strict;
    }

    confirmYellowAbilities(abilities) {
        this.finalYellowAbilities = abilities;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmGreenAbilities(abilities) {
        this.finalGreenAbilities = abilities;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmRequiredDice(dice) {
        let powerDice = [];
        powerDice.push(...dice.where(d => StatIndex[d.statName].statType === 'Power'));
        this.finalPowerDice.push(...powerDice);
        let qualityDice = [];
        qualityDice.push(...dice.where(d => StatIndex[d.statName].statType === 'Quality'));
        this.finalQualityDice.push(...qualityDice);
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmPowerDice(dice) {
        this.finalPowerDice.push(dice);
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmRemainingDice(dice) {
        let powerDice = [];
        powerDice.push(...dice.where(d => StatIndex[d.statName].statType === 'Power'));
        this.finalPowerDice.push(...powerDice);
        let qualityDice = [];
        qualityDice.push(...dice.where(d => StatIndex[d.statName].statType === 'Quality'));
        this.finalQualityDice.push(...qualityDice);
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmPrinciple(principle: Principle) {
        this.selectedPrinciple = principle;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }



    getSteps(powerDice, qualityDice, skipAbilities: boolean = false, skipPrinciple = false) {
        let baseSteps = [
            {
                label: 'Assign Power Dice', content: <AssignStatDice
                    dice={this.diceToAssign}
                    stats={this.powers}
                    confirmDice={this.confirmPowerDice}
                    statType='Power' />
            }, {
                label: `Select ${this.greenAbilityCount} green Abilities`, content: <AbilitySelector
                    abilities={this.greenAbilityOptions}
                    confirmAbilities={this.confirmGreenAbilities}
                    strict={this.strict}
                    powers={powerDice.concat(this.finalPowerDice || [])}
                    qualities={qualityDice.concat(this.finalQualityDice || [])}
                    maxOptions={this.greenAbilityCount} />
            }];
        if (this.yellowAbilityCount)
            baseSteps.push({
                label: `Select ${this.yellowAbilityCount} Yellow Abilities`, content: <AbilitySelector
                    abilities={this.yellowAbilityOptions}
                    confirmAbilities={this.confirmYellowAbilities}
                    strict={this.strict}
                    powers={powerDice.concat(this.finalPowerDice || [])}
                    qualities={qualityDice.concat(this.finalQualityDice || [])}
                    maxOptions={this.yellowAbilityCount} />
            });
        if (this.required) {
            baseSteps.unshift(
                {
                    label: 'Assign Required Dice', content: <Typography>TODO: ADD REQUIRED DIE SELECTOR</Typography>
                });
        }
        if (this.additionalQualitiesDice) {
            baseSteps.push({ label: `Assign additional Quality Die`, content: <AssignStatDice dice={this.additionalQualitiesDice} stats={this.additionalQualities} confirmDice={this.confirmRemainingDice} /> });
        }
        if (!skipPrinciple) {
            baseSteps.push({ label: 'Select Principle', content: <PrinciplesList guidedCategory={this.principleCategory} selectedCallback={this.confirmPrinciple} strict={this.strict}></PrinciplesList> })
        }
        return baseSteps;
    }
}

export class ArchetypeElement extends Component<SelectableByRoll>{
    state: { archetype: Archetype }
    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let ar = Archetypes[roll - 1];
        ar['diceToAssign'] = (props.diceFromPreviousStep ? props.diceFromPreviousStep.slice() : []);
        this.state = { archetype: new Archetype(ar) };
    }



    getSteps(): { label: string, content: any }[] {
        let stepLabels = [];
        return stepLabels;
    }

    render() {
        return (
            <div>
                {this.state.archetype.required ? <div><Typography>Assign {this.state.archetype.diceToAssign.map((d, index: number) => diceImageSrc(d, 25))} to: <StatDisplay stats={this.state.archetype.required}></StatDisplay>
                </Typography> <Typography> Then, Assign {this.state.archetype.min ? `at least ${this.state.archetype.min}` : this.state.archetype.exact || ''} remaining dice to any of the following Powers: <StatDisplay stats={this.state.archetype.powers}></StatDisplay>
                    </Typography> </div> :
                    <Typography>Assign {this.state.archetype.diceToAssign.map((d, index: number) => diceImageSrc(d, 25))} to any of the following Powers: <StatDisplay stats={this.state.archetype.powers}></StatDisplay>
                    </Typography>}
                <Typography> Then, Assign remaining dice to any of the following: <StatDisplay stats={this.state.archetype.powers}></StatDisplay>
                </Typography>
                {this.state.archetype.greenAbilityCount ? <Typography>Select {this.state.archetype.greenAbilityCount} of these Green Abilities</Typography> : ''}
                {this.state.archetype.yellowAbilityCount ? <Typography>Select {this.state.archetype.yellowAbilityCount} of these Green Abilities</Typography> : ''}
                <Typography>Roll {this.state.archetype.diceForPersonality.map(d => diceImageSrc(d, 25))} for Personality selection.</Typography>

            </div>
        )
    }
}


