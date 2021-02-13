import React, { Component } from 'react';
import diceImageSrc, { DiceOptions } from './DiceOptions';
import Backgrounds from '../rulebook-data/Backgrounds.json'
import { ReturnSelection, SelectableByRoll } from './Character';
import { PrinciplesList, Principle } from './Principle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Button from '@material-ui/core/Button'
import StatDisplay from '../components/stat-display';
import Typography from '@material-ui/core/Typography';
import AssignStatDice from '../components/assign-stat-dice';
import { StatDie } from './StatDie';
import { SourceStep } from './SourceStep';

export class Background {
    name: string = 'DEFAULT BACKGROUND';
    rollResult: number = 0;
    diceToAssign: DiceOptions[] = [DiceOptions.d8, DiceOptions.d10];
    qualities: string[] = ["categoryPhysical", "categoryMental"];
    principleCategory: string = "Identity";
    diceForPowerSource: DiceOptions[] = [DiceOptions.d8, DiceOptions.d8, DiceOptions.d10];
    selectedPrinciple: Principle;
    state: { showQualities: boolean }
    classes;
    finalizedStatDice: StatDie[] = [];
    steps: any[];
    updateFunction;
    strict: boolean = false;
    usedStats?: string[]
    constructor(data) {
        Object.assign(this, data);
        this.confirmDice = this.confirmDice.bind(this);
        this.confirmPrinciple = this.confirmPrinciple.bind(this);
    }
    setUpdateFunction(update) {
        this.updateFunction = update;
    }
    setStrict(strict) {
        this.strict = strict;
    }
    setUsedStats(stats) {
        this.usedStats = stats.slice();
    }

    confirmPrinciple(principle: Principle) {
        this.selectedPrinciple = principle;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }
    confirmDice(dice: StatDie[]) {
        this.finalizedStatDice = dice;
        if (this.updateFunction) {
            this.updateFunction(this);
        }
    }

    getSteps() {
        let steps = [{
            label: 'Assign Dice', content: <AssignStatDice dice={this.diceToAssign} stats={this.qualities} confirmDice={this.confirmDice} statType='Quality' source={SourceStep.Background}
                usedStats={this.usedStats}></AssignStatDice>
        }, { label: 'Select Principle', content: <PrinciplesList guidedCategory={this.principleCategory} selectedCallback={this.confirmPrinciple} strict={this.strict}></PrinciplesList> }]
        return steps;
    }
}


export class BackgroundsList extends Component<ReturnSelection> {
    state: {
        selectedBackground?: Background;
    }
    constructor(props: ReturnSelection) {
        super(props);
        this.state = {};
        this.confirmBackground = this.confirmBackground.bind(this);
        this.selectBackground = this.selectBackground.bind(this);
        this.selectedPrinciple = this.selectedPrinciple.bind(this);
        this.confirmDice = this.confirmDice.bind(this);
    }
    selectBackground(background: any) {
        this.setState({ selectedBackground: background });
        this.confirmBackground();
    }
    confirmBackground() {
        this.props.selectedCallback(this.state.selectedBackground);
    }
    selectedPrinciple(principle: Principle) {
        let background = Object.assign({}, this.state.selectedBackground);
        background.selectedPrinciple = principle;
        this.setState({ selectedBackground: background });
    }
    confirmDice(dice: StatDie[]) {
        let background = Object.assign({}, this.state.selectedBackground);
        background.finalizedStatDice = dice;
        this.setState({ selectedBackground: background });
    }

    // selectBackground(event, background){
    //     event.stopPropagation
    // }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>

                    {Backgrounds.filter(b => this.props.strict ? this.props.rolledOptions.includes(b.rollResult) : true).map(bg => (
                        <Accordion>
                            <AccordionSummary color={this.props.rolledOptions.includes(bg.rollResult) ? "text.primary" : 'text.light'}
                                expandIcon={<ExpandMoreIcon />}
                                id={`bg${bg.rollResult}-header`}
                            ><Typography style={{ flex: 1 }}><strong>{bg.rollResult}:</strong> {bg.name}</Typography> <Button variant="outlined" color="primary" onClick={(e) => {
                                e.stopPropagation();
                                this.props.selectedCallback(new Background(bg))
                            }} >Select this Background</Button></AccordionSummary>
                            <AccordionDetails><BackgroundElement rollResult={bg.rollResult} updateState={this.props.selectedCallback}></BackgroundElement>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>
        );
    }
}

export class BackgroundsSelection extends Component {

}

export class BackgroundElement extends Component<SelectableByRoll>
{
    state: { background: Background };
    constructor(props: SelectableByRoll) {
        super(props)
        let roll = props.rollResult;
        let bg = Backgrounds[roll - 1];
        this.state = { background: new Background(bg) };
    }

    updateChange() {
        this.props.updateState(this);
    }

    render() {
        return (
            <div>
                <Typography>Assign {this.state.background.diceToAssign.map((d, index: number) => diceImageSrc(d, 25))} to any of the following
                    Qualities:
                </Typography>
                <StatDisplay stats={this.state.background.qualities} />
                <Typography>Choose a {this.state.background.principleCategory} principle</Typography>
                <Typography>Roll {this.state.background.diceForPowerSource.map(d => diceImageSrc(d, 25))} for power source selection.</Typography>
            </div>
        )
    }
}