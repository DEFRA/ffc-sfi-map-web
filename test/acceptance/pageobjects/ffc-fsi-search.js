import Page from './page'

class Search extends Page {
  
  // define elements
  get continueBtn () { return $('button.govuk-button') }  
  get sbiField () { return $('#sbi') } 

  // define or overwrite page methods   
  open () {
    super.open('')
    browser.pause(3000)
  }
  
  // your page specific methods
  EnterSBInumber () {
    this.vsbiField.setValue(value)
  }
  
  clickOnContinueButton () {
    this.continueBtn.click()
  }
  
}
export default new Search()
