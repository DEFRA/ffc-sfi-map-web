Feature: Check error validation
    # Scenario:Validate blank value thrown error
    #     Given I open the url "/search"
    #     Then I wait on element "#sbi" for 500ms to be displayed
    #     When I add " " to the inputfield "#sbi"
    #     And I click on the element "#submit"
    #     Then I expect that the url contains "/search"
    #     # Then I expect that element "#sbi-error" contains the text "The SBI must be a number"
    #     # sbi-hint
    #     Then I expect that element "#sbi-hint" contains the text "Must be a 9 digit number"
        
    # Scenario: Validate less than 9 digits
    #     Given I open the url "/search"
    #     Then I wait on element "#sbi" for 500ms to be displayed
    #     When I add "1066" to the inputfield "#sbi"
    #     And I click on the button "#submit"
    #     Then I expect that the url contains "/search"
    #     Then I expect that element "#sbi-error" contains the text "The SBI is too short."

    # Scenario: Validate blank value thrown error
    #    Given I open the url "/search"
    #    Then I wait on element "#sbi" for 500ms to be displayed
    #    When I add "10665544646466" to the inputfield "#sbi"
    #    And I click on the element "#submit"
    #    Then I expect that the url contains "/search"
    #    Then I expect that element "#sbi-error" contains the text "The SBI is too long."
