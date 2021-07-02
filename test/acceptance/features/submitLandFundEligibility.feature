Feature: Check and submit land fund eligibility
    Scenario: Successfully check for fund eligibility 
        Given I open the url "/"
        Then I expect that the title contains "View my land parcels - GOV.UK"
        Then I expect that element "h1" contains the text "View my land parcels"       
        And I pause for 500ms
        When I click on the button "#submit"                            
        Then I expect that the url contains "/search"
        And I pause for 500ms
        When I click on the element "#sbi"
        When I add "106651310" to the inputfield "#sbi"
        And I click on the element "#submit"
        Then I expect that the url contains "/map?sbi=106651310"
        And I pause for 500ms
        When I click on the link "SE9849 1742"
        Then I expect that the url contains "/parcel"  

    Scenario: User can click copyright link on value page
      Given I open the url "/"
      When I click on the link "© Crown copyright"
      Then I expect that element "h1" contains the text "Crown copyright"

    Scenario: User can click on Open Government Licence link
       Given I open the url "/"
       When I click on the link "Open Government Licence v3.0"
       Then I expect that element "#license > h3:nth-child(3)" contains the text "Using Information under this licence"   
       Then I expect that element "//div[@id='license']/div[2]/h3" is displayed

    Scenario: User can click cookies link on calculation page
      Given I open the url "/"
      When I click on the link "Cookies"
      And I pause for 500ms
      Then I expect that the url contains "/cookies"
      Then I expect that element "h3" contains the text "Essential cookies" 

    Scenario: User can click on Rural land register link
      Given I open the url "/"
      When I click on the link "Rural land register"
      Then I expect that element "h1" contains the text "Register land with the Rural Land Register"
    
    Scenario: User can click on Defra services platform link
      Given I open the url "/"
      When I click on the link "Defra services platform"
      Then I expect that the url contain "https://environment.data.gov.uk/"
     
    Scenario: User can navigate back to search page
        Given I open the url "/parcel?sbi=106651310&sheetId=SE9849&parcelId=1742"
        Then I expect that element "h1" contains the text "Parcel details"
        ## When I click on the link "My land" 
        When I click on the land link
        And I pause for 500ms
        Then I expect that the url contains "/parcel"
        When I click on the link "Search"
        And I pause for 500ms
        Then I expect that the url contains "/search"
        Then I expect that element "h1" contains the text "(SBI)?"
         
    Scenario: User can navigate back to home page
        Given I open the url "/parcel?sbi=106651310&sheetId=SE9849&parcelId=1742"
        Then I expect that element "h1" contains the text "Parcel details"
        # When I click on the link "My land"
        When I click on the land link
        And I pause for 500ms
        Then I expect that the url contains "/parcel"
        When I click on the link "Home"
        Then I expect that element "h1" contains the text "View my land parcels"