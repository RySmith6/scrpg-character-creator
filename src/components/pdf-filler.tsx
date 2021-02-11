import { PDFDocument } from 'pdf-lib'
import download from 'downloadjs'

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

    heroNameField.setText('Mario')
    ageField.setText('24 years')
    heightField.setText(`5' 1"`)
    eyesField.setText('blue')
    skinField.setText('white')
    hairField.setText('brown')

    backgroundField.setText(state.sources.background.name);
    powerSourceField.setText(state.sources.powerSource.name);
    archetypeField.setText(state.sources.archetype.name);
    personalityField.setText(state.sources.personality.name);

    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");
}