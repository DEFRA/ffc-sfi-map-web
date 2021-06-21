import Page from './page'

class Parcel extends Page {
  

 
  
  // define or overwrite page methods   
  open () {
    super.open('')
    browser.pause(3000)
  }
  
 
 
}
export default new Parcel()
