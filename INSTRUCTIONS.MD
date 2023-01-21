Development exercise: Mood sensing application 

Time allotted: 2 days 

The camera on your shiny new phone can sense a user’s mood based on their facial features, 
where mood can be characterized as either happy, sad, or neutral to start with. We like you to design and implement 
a mood-sense application that leverages the phone’s mood-sensing capability to collect
mood data and provide insights:

• Upload a mood capture for a given user and location 
• Return the mood frequency distribution for a given user 
• Given the user’s current location, return the closest location where the user has been happy.

Specifically,

1. Create code to implement the REST service cloud backend APIs for this application. Please note there is no need to
   create code that determines the mood from an image or upload images – you can assume the phone provides the
   mood-sensing capability and location!Preferably in Python or Java, but you are free to use any framework that you are
   comfortable with. Feel free to make any reasonable assumptions about the scope of your implementation (e.g. a 3rd
   party library for obtaining location characteristics, given a set of GPS coordinates)
2. Develop a React typeahead component with multi-select functionality.
   1. As the user types a search input, they get a dropdown list of matches.
   2. Selecting a match should add it to the input field.
   3. The input field should support holding more than one selection
   4. Provide the option for the end consumer of this component to enable and configure caching of GET endpoints. You may
      use a 3rd party library to handle the actual caching
   5. Constraints:
      i. Keep it lightweight. Do not use external state management such as Redux.
      ii. The business logic of the component should be built by you (i.e. don’t use a prebuilt Autocomplete component),
      but the rest of it can come from a 3rd party like Material UI
3. Lastly, create a simple demo app that renders your typeahead component to allow user to search a location using
   address or GPS coordinates and upload a mood for it. User should also be able to pull up the closest locations where
   the user has been happy.
   1. Feel free to use an app bootstrapper like create-react-app to perform the setup

Note: We like to see a runnable version of the code plus instructions how to run it! If some parts are not implemented,
please indicate so in the README and describe how you would implement it, and which 3rd party libraries or components
you would use.

Try to cover as much detail as necessary to articulate the application design and implementation for the following.

Implementation Aspects:
• Define API 
• Create dev project 
• Layout code structure 
• Design data model and key data structures 
• Define data persistence using any data store of your choice. 
• Define Implementation of operations 
• Input validation 
• Authentication 
• Authorization 
• Unit test
• Proper setup and usage of package.json for publishing of the React component for in-browser usage
• Finally, provide a README for your design, implementation and assumptions. 

We request you to zip up your project and
send it back to us (i.e. do not upload it to GitHub or any other public repository)Once we received your project, we
will review it with you!
