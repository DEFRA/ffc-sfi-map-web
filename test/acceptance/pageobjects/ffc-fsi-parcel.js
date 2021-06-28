import Page from './page'

class Parcel extends Page {
  
// define elements
get landLink () { return $('#myland'); }
get delandlink () { return $('#myland'); } 
get searchlink () { return $('#search'); } 
get homelink () { return $('#home'); } 
  
  // define or overwrite page methods   
  open () {
    super.open('')
    browser.pause(3000)
  }

  // your page specific methods
  clickOnLandLink ( ) {  
    console.log();     
    this.landlink.click();       
  }

  async clickOnDeLandLink () {
    await (await this.delandlink).click()
  }

  async clickOnSearchLink () {
    await (await this.searchlink).click()
  }

  async clickOnHomeLink () {
    await (await this.homelink).click()
  } 
}
export default new Parcel()
