import Page from './page'

class Start extends Page {
  
  // define elements
  get startNewClaim () { return $('.govuk-button--start') }
  get startNow () { return $('#submit') }
    
  // define or overwrite page methods  
  open () {
    super.open('')
    browser.pause(3000)
  }
  
 //// your page specific methods
  clickOnStartNow () {
     browser.executeScript("element.querySelector('//a[contains(@href, '/search')]').click()")
  }
}
export default new Start()
