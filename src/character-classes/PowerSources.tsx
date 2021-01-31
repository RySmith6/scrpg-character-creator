import React, { Component } from 'react'
import { ReturnSelection, SelectableByRoll } from './Character';
import PowerSources from '../rulebook-data/PowerSource.json'
import diceImageSrc, { DiceOptions } from './DiceOptions';
import { Ability } from './Ability';
import { SourceStep } from './SourceStep';
import { StatDie } from './StatDie';
import { Grid, Accordion, AccordionSummary, AccordionDetails, Button, Card, CardContent, Typography } from '@material-ui/core';
import SourceStepper from '../components/source-stepper';
import AssignStatDice from '../components/assign-stat-dice';
import AbilitySelector from '../components/ability-selector';
import StatDisplay from '../components/stat-display';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class PowerSourcesList extends Component<ReturnSelection>{
    state: {
        selectedPowerSource?: PowerSource;
    }
    constructor(props: ReturnSelection) {
        super(props);
        this.selectPowerSource = this.selectPowerSource.bind(this);
        this.state = {};
    }

    selectPowerSource(powerSource: any) {
        powerSource.diceToAssign = this.props.diceFromPreviousStep;
        this.setState({ selectedPowerSource: powerSource });
    }

    confirmPowerSource() {
        this.props.selectedCallback(this.state.selectedPowerSource);
    }



    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>

                    {PowerSources.filter(ps => this.props.strict && this.props.rolledOptions ? this.props.rolledOptions.includes(ps.rollResult) : true).map(ps => (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                id={`bg${ps.rollResult}-header`}>
                                <span className="mr-auto"><strong>{ps.rollResult}:</strong>{ps.name}</span> <Button variant="outlined" color="primary" onClick={() => this.props.selectedCallback(new PowerSource(ps))}>Select this Power Source</Button>
                            </AccordionSummary>
                            <AccordionDetails>
                                <PowerSourceElement rollResult={ps.rollResult} diceFromPreviousStep={this.props.diceFromPreviousStep} updateState={this.props.selectedCallback}></PowerSourceElement>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>
        );
    }
}

export class PowerSource {
    name: string = 'DEFAULT BACKGROUND';
    rollResult: number = 0;
    powers: string[]
    diceForArchetype: DiceOptions[]
    greenAbilityCount: number
    greenAbilityOptions: Ability[]
    yellowAbilityCount: number
    yellowAbilityRestriction: string = "differentPowers"
    yellowAbilityOptions: Ability[]
    diceToAssign: DiceOptions[]
    additionalQualitiesDice?: DiceOptions[]
    additionalQualities?: string[]
    additionalPowersDice?: DiceOptions[]
    additionalPowers?: string[]
    downgradeDieCount?: number
    downgradeDie?: DiceOptions[]
    upgradeDieCount?: number
    upgradeDie?: DiceOptions[]
    requiredPowers?: string[]
    finalYellowAbilities: Ability[] = [];
    finalGreenAbilities: Ability[] = [];
    finalPowerDice: StatDie[] = [];
    finalQualityDice: StatDie[] = [];
    updateFunction;
    strict: boolean = false;
    constructor(data) {
        Object.assign(this, data);

        (this.greenAbilityOptions || []).forEach(a => { a.source = SourceStep.PowerSource });
        (this.yellowAbilityOptions || []).forEach(a => { a.source = SourceStep.PowerSource });
        this.confirmPowerDice = this.confirmPowerDice.bind(this);
        this.confirmQualityDice = this.confirmQualityDice.bind(this);
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

    confirmPowerDice(dice) {
        this.finalPowerDice = dice;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    confirmQualityDice(dice) {
        this.finalQualityDice = dice;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }



    getSteps(qualityDice) {

        let baseSteps = [
            {
                label: 'Assign Power Dice', content: <AssignStatDice
                    dice={this.diceToAssign}
                    stats={this.powers}
                    confirmDice={this.confirmPowerDice}
                    statType='Power' />
            },
            {
                label: `Select ${this.yellowAbilityCount} Yellow Abilities`, content: <AbilitySelector
                    abilities={this.yellowAbilityOptions}
                    confirmAbilities={this.confirmYellowAbilities}
                    strict={this.strict}
                    powers={this.finalPowerDice}
                    qualities={qualityDice.concat(this.finalQualityDice || [])}
                    maxOptions={this.yellowAbilityCount} />
            }];
        if (this.requiredPowers) {
            baseSteps.push({
                label: `Assign Required Power`, content: <Typography>TODO: ADD REQUIRED DIE SELECTOR</Typography>
            });
        }
        if (this.greenAbilityCount) {
            baseSteps.push({
                label: `Select ${this.greenAbilityCount} green Abilities`, content: <AbilitySelector
                    abilities={this.greenAbilityOptions}
                    confirmAbilities={this.confirmGreenAbilities}
                    strict={this.strict}
                    powers={this.finalPowerDice.concat(this.finalPowerDice)}
                    qualities={qualityDice.concat(this.finalQualityDice || [])}
                    maxOptions={this.greenAbilityCount} />
            });
        }
        if (this.additionalQualitiesDice) {
            baseSteps.push({ label: `Assign additional Quality Die`, content: <AssignStatDice dice={this.additionalQualitiesDice} stats={this.additionalQualities} confirmDice={this.confirmQualityDice} /> });
        }
        if (this.additionalPowersDice) {
            baseSteps.push({ label: `Assign additional Power Die`, content: <AssignStatDice dice={this.additionalPowersDice} stats={this.additionalPowers} confirmDice={this.confirmQualityDice} /> });
        }
        if (this.downgradeDieCount) {
            baseSteps.push({ label: `Downgrade Die`, content: <Typography>TODO:DOWNGRADE DIE COMPONENT</Typography> });
        }
        if (this.upgradeDieCount) {
            baseSteps.push({ label: `Upgrade Die`, content: <Typography>TODO:UPGRADE DIE COMPONENT</Typography> });
        }
        return baseSteps;
    }
}

export class PowerSourceElement extends Component<SelectableByRoll>{
    state: { powerSource: PowerSource };

    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let ps = PowerSources[roll - 1];
        ps['diceToAssign'] = (props.diceFromPreviousStep ? props.diceFromPreviousStep.slice() : []);
        this.state = { powerSource: new PowerSource(ps) };
    }

    getSteps(): { label: string, content: any }[] {
        let stepLabels = [];
        return stepLabels;
    }


    render() {
        return (
            <div>
                <Typography>Assign {this.state.powerSource.diceToAssign.map((d, index: number) => diceImageSrc(d, 25))} to any of the following
                    Powers: <StatDisplay stats={this.state.powerSource.powers}></StatDisplay>
                </Typography>
                {this.state.powerSource.greenAbilityCount ? <Typography>Select {this.state.powerSource.greenAbilityCount} of these Green Abilities</Typography> : ''}
                {this.state.powerSource.yellowAbilityCount ? <Typography>Select {this.state.powerSource.yellowAbilityCount} of these Green Abilities</Typography> : ''}
                {this.state.powerSource.additionalQualitiesDice ?
                    <Typography>Assign {this.state.powerSource.additionalQualitiesDice.map((d, index: number) => diceImageSrc(d, 25))} to any of the following
                Qualities: <StatDisplay stats={this.state.powerSource.additionalQualities}></StatDisplay></Typography> : ''}
                <Typography>Roll {this.state.powerSource.diceForArchetype.map(d => diceImageSrc(d, 25))} for power source selection.</Typography>

            </div>
        )
    }
}