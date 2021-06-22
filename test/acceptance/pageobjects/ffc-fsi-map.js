import Page from './page'

class Map extends Page {

  // define elements
  get parcelNos () { return $('tbody.govuk-table__body') }
  get linkName () { return $('//a[contains(text(),"SE9849 1742")]'); }
  get linkNames () { return $('//a[contains(text()," + links + ")]'); } 
  
  // define or overwrite page methods   
  open () {
    super.open('')
    browser.pause(3000)
  }
  
  // your page specific methods
  clickOnParcelNumbers (links ) {  
    console.log(links);     
    this.linkName.click(links);       
  }
 
  clickOnParcelNos () {      
    this.linkName.click();       
  }
}
export default new Map()
