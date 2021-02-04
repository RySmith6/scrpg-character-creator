import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { StepContent } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        padding: 0
    },
    button: {
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
        paddingTop: 5
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Background', 'Power Source', 'Archetype', 'Personality'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Background';
        case 1:
            return 'Power Source';
        case 2:
            return 'Archetype';
        case 3:
            return 'Personality';
        // case 4:
        //     return 'Red Abilities';
        //     case 5:
        //         return 'Retcon';
        //         case 6:
        //             return 'Health';
        default:
            return 'Unknown step';
    }
}

export default function CreationStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});

    const totalSteps = () => {
        return props.steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                props.steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <div className={classes.root}>
            <Stepper orientation="vertical" nonLinear activeStep={activeStep} className={classes.root}>
                {props.steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton onClick={handleStep(index)} completed={completed[index]}>
                            {label}
                        </StepButton>
                        <StepContent>
                            {props.getStepContent[index]}
                            <div className={classes.actionsContainer}>
                                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    Next
                                </Button>
                                {activeStep !== props.steps.length &&
                                    (completed[activeStep] ? (
                                        <Typography variant="caption" className={classes.completed}>
                                            Step {activeStep + 1} already completed
                                        </Typography>
                                    ) : (
                                            <Button variant="contained" color="primary" onClick={handleComplete}
                                                className={classes.button}>
                                                {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                            </Button>
                                        ))}
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {/* <div>
                {allStepsCompleted() ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed - you&apos;re finished
            </Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                        <div>
                            {props.getStepContent[activeStep]}
                            <div>
                                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                    Back
              </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    Next
              </Button>
                                {activeStep !== props.steps.length &&
                                    (completed[activeStep] ? (
                                        <Typography variant="caption" className={classes.completed}>
                                            Step {activeStep + 1} already completed
                                        </Typography>
                                    ) : (
                                            <Button variant="contained" color="primary" onClick={handleComplete}>
                                                {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                            </Button>
                                        ))}
                            </div>
                        </div>
                    )}
            </div> */}
        </div>
    );
}