import { PDFDocument } from 'pdf-lib'
import download from 'downloadjs'
import HealthChart from '../rulebook-data/health-chart.json';

export async function fillForm(state: any) {
    const formUrl = 'Form_Fillable_Hero_Sheet.pdf'
    const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(formPdfBytes)


    const form = pdfDoc.getForm()

    const playerField = form.getTextField('Player')
    const heroNameField = form.getTextField('Hero Name')
    const aliasField = form.getTextField('Alias')
    const genderField = form.getTextField('Gender')
    const ageField = form.getTextField('Age')
    const heightField = form.getTextField('Height')
    const eyesField = form.getTextField('Eyes')
    const hairField = form.getTextField('Hair')
    const skinField = form.getTextField('Skin')
    const buildField = form.getTextField('Build')
    const costumeEquipmentField = form.getTextField('Costume/Equipment')
    const backgroundField = form.getTextField('Background')
    const powerSourceField = form.getTextField('Power Source')
    const archetypeField = form.getTextField('Archetype')
    const personalityField = form.getTextField('Personality')
    const principleField = form.getTextField('Principle')
    const roleplayingField = form.getTextField('During Roleplaying')
    const minorTwistField = form.getTextField('Minor Twist')
    const majorTwistField = form.getTextField('Major Twist')
    const principle2Field = form.getTextField('Principle 2')
    const roleplaying2Field = form.getTextField('During Roleplaying 2')
    const minorTwist2Field = form.getTextField('Minor Twist 2')
    const majorTwist2Field = form.getTextField('Major Twist 2')

    const powersFields = [{ stat: form.getTextField('Powers'), die: form.getDropdown('Die Type 1') },
    { stat: form.getTextField('Powers 2'), die: form.getDropdown('Die Type 2') },
    { stat: form.getTextField('Powers 3'), die: form.getDropdown('Die Type 3') },
    { stat: form.getTextField('Powers 4'), die: form.getDropdown('Die Type 4') },
    { stat: form.getTextField('Powers 5'), die: form.getDropdown('Die Type 5') },
    { stat: form.getTextField('Powers 6'), die: form.getDropdown('Die Type 6') }];
    const qualitiesFields = [
        { stat: form.getTextField('Qualities'), die: form.getDropdown('Die Type 7') },
        { stat: form.getTextField('Qualities 2'), die: form.getDropdown('Die Type 8') },
        { stat: form.getTextField('Qualities 3'), die: form.getDropdown('Die Type 9') },
        { stat: form.getTextField('Qualities 4'), die: form.getDropdown('Die Type 10') },
        { stat: form.getTextField('Qualities 5'), die: form.getDropdown('Die Type 11') },
        { stat: form.getTextField('Qualities 6'), die: form.getDropdown('Die Type 12') },
    ];

    const greenStatusDie = form.getDropdown('Die Type 13');
    const yellowStatusDie = form.getDropdown('Die Type 14');
    const redStatusDie = form.getDropdown('Die Type 15');

    const greenHealthRange = form.getTextField('Health Range 1');
    const yellowHealthRange = form.getTextField('Health Range 2');
    const redHealthRange = form.getTextField('Health Range 3');

    const greenAbilityFields = [
        { name: form.getTextField('Name'), icon: form.getTextField('Icon'), type: form.getDropdown('Type'), text: form.getTextField('Text') },
        { name: form.getTextField('Name 2'), icon: form.getTextField('Icon 2'), type: form.getDropdown('Type 2'), text: form.getTextField('Text 2') },
        { name: form.getTextField('Name 3'), icon: form.getTextField('Icon 3'), type: form.getDropdown('Type 3'), text: form.getTextField('Text 3') },
        { name: form.getTextField('Name 4'), icon: form.getTextField('Icon 4'), type: form.getDropdown('Type 4'), text: form.getTextField('Text 4') },
        { name: form.getTextField('Name 5'), icon: form.getTextField('Icon 5'), type: form.getDropdown('Type 5'), text: form.getTextField('Text 5') }
    ]
    const principleAbility = { name: form.getTextField('Name 6'), icon: form.getTextField('Icon 6'), type: form.getDropdown('Type 6'), text: form.getTextField('Text 6') };
    const principleAbility2 = { name: form.getTextField('Name 7'), icon: form.getTextField('Icon 7'), type: form.getDropdown('Type 7'), text: form.getTextField('Text 7') };

    const yellowAbilityFields = [
        { name: form.getTextField('Name 8'), icon: form.getTextField('Icon 8'), type: form.getDropdown('Type 8'), text: form.getTextField('Text 8') },
        { name: form.getTextField('Name 9'), icon: form.getTextField('Icon 9'), type: form.getDropdown('Type 9'), text: form.getTextField('Text 9') },
        { name: form.getTextField('Name 10'), icon: form.getTextField('Icon 10'), type: form.getDropdown('Type 10'), text: form.getTextField('Text 10') },
        { name: form.getTextField('Name 11'), icon: form.getTextField('Icon 11'), type: form.getDropdown('Type 11'), text: form.getTextField('Text 11') },
        { name: form.getTextField('Name 12'), icon: form.getTextField('Icon 12'), type: form.getDropdown('Type 12'), text: form.getTextField('Text 12') }
    ]
    const redAbilityFields = [
        { name: form.getTextField('Name 13'), icon: form.getTextField('Icon 13'), type: form.getDropdown('Type 13'), text: form.getTextField('Text 13') },
        { name: form.getTextField('Name 14'), icon: form.getTextField('Icon 14'), type: form.getDropdown('Type 14'), text: form.getTextField('Text 14') },
        { name: form.getTextField('Name 15'), icon: form.getTextField('Icon 15'), type: form.getDropdown('Type 15'), text: form.getTextField('Text 15') }
    ];

    const outAbility = form.getTextField('Out');

    //Fields not yet in the UI
    playerField.setText('1P')
    heroNameField.setText('Mario')
    ageField.setText('24 years')
    heightField.setText(`5' 1"`)
    eyesField.setText('blue')
    skinField.setText('white')
    hairField.setText('brown')
    aliasField.setText('Jennifer Garner')
    genderField.setText('female')
    buildField.setText('Lego Bricks')
    costumeEquipmentField.setText('Dapper Vest')

    backgroundField.setText(state.sources.background.name);
    powerSourceField.setText(state.sources.powerSource.name);
    archetypeField.setText(state.sources.archetype.name);
    personalityField.setText(state.sources.personality.name);
    if (state.sources.background.selectedPrinciple) {
        let principle = state.sources.background.selectedPrinciple;
        principleField.setText(principle.name);
        roleplayingField.setText(principle.duringRoleplaying);
        minorTwistField.setText(principle.minorTwist);
        majorTwistField.setText(principle.majorTwist);
        principleAbility.name.setText(principle.name);
        principleAbility.text.setText(principle.greenAbility.text);
    }
    if (state.sources.archetype.selectedPrinciple) {
        let principle = state.sources.archetype.selectedPrinciple;
        principle2Field.setText(principle.name);
        roleplaying2Field.setText(principle.duringRoleplaying);
        minorTwist2Field.setText(principle.minorTwist);
        majorTwist2Field.setText(principle.majorTwist);
        principleAbility2.name.setText(principle.name);
        principleAbility2.text.setText(principle.greenAbility.text);
    }
    state.powerDice.forEach((sd, index) => {
        if (index < 6) {
            powersFields[index].stat.setText(sd.statName);
            powersFields[index].die.select(sd.die);
        }
    });
    state.qualityDice.forEach((sd, index) => {
        qualitiesFields[index].stat.setText(sd.statName);
        qualitiesFields[index].die.select(sd.die);
    });
    greenStatusDie.select(state.greenStatusDie);
    yellowStatusDie.select(state.yellowStatusDie);
    redStatusDie.select(state.redStatusDie);

    greenHealthRange.setText(HealthChart[state.healthMax].green);
    yellowHealthRange.setText(HealthChart[state.healthMax].yellow);
    redHealthRange.setText(HealthChart[state.healthMax].red);

    state.greenAbilities.forEach((a, index) => {
        greenAbilityFields[index].name.setText(a.name);
        greenAbilityFields[index].text.setText(a.finalText || a.text);
        greenAbilityFields[index].type.select(a.type.charAt(0).toUpperCase());
    })
    state.yellowAbilities.forEach((a, index) => {
        yellowAbilityFields[index].name.setText(a.name);
        yellowAbilityFields[index].text.setText(a.finalText || a.text);
        yellowAbilityFields[index].type.select(a.type.charAt(0).toUpperCase());
    })
    state.redAbilities.forEach((a, index) => {
        redAbilityFields[index].name.setText(a.name);
        redAbilityFields[index].text.setText(a.finalText || a.text);
        redAbilityFields[index].type.select(a.type.charAt(0).toUpperCase());
    })
    outAbility.setText(state.outAbility);

    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "SCRPG_Character_" + state.name + ".pdf", "application/pdf");
}