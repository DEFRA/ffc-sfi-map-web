function ViewModel (value, error) {
  this.model = {
    label: {
      text: 'What is your Single Business Identifier (SBI)?',
      classes: 'govuk-label--l',
      isPageHeading: true
    },
    classes: 'govuk-input--width-10',
    hint: {
      text: 'Must be a 9 digit number'
    },
    id: 'sbi',
    name: 'sbi',
    inputmode: 'numeric',
    pattern: '[0-9]*',
    spellcheck: false
  }

  if (error) {
    this.model.errorMessage = {
      text: error.message
    }
  }
}

module.exports = ViewModel
