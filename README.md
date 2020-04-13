<!-- PROJECT LOGO -->
<p align="center">
  <a href="">
    <img src="images/Genteque_logo_final.png" alt="Team/Project logo" min-width="80" height="80">
  </a>
  
  </br>          
  <h1 align="center">CBSA Helper</h1>
  
  <p align="center">
    </br>
    <a href="https://bot.dialogflow.com/96a34494-a331-4f68-807a-43f956ea865e" target="_blank">Chatbot Demo</a>
    ·
    <a href="#Contact">Contact Us</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Features](#features)
* [Design](#design)
  * [User Research](#user-research)
  * [Personas](#personas)
  * [User Stories](#user-stories)
  * [Usage Scenarios](#usage-scenarios)
  * [Dialog Scripts](#dialog-scripts)
  * [Dialog Flow](#dialog-flow)
  * [Information Architecture](#information-architecture)
  * [Storyboards](#storyboards)
* [High-Level Architecture](#high-level-architecture)
* [Technical Research](#technical-research)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Add New Intent](#add-new-intent)
* [Roadmap](#roadmap)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)


<!-- ABOUT THE PROJECT -->
## About The Project
![Skills Screenshot](images/skills_screenshot.png)

 
CBSA Helper is a voice application for Alexa and Google Home, to provide fast and easy to understand, information regarding travel exemptions, prohibited items and duties.
It is focused for travelers returning or entering Canada. The main purpouse is to be a trustable source, faster and easier than looking through a traditional website.

<!-- BUILT WITH -->
### Built With
* [Node.js](https://nodejs.org/en/)
* [Alexa](https://developer.amazon.com/en-US/alexa)
* [Dialogflow](https://dialogflow.com/)
* [Firebase](https://firebase.google.com/)

<!-- FEATURES -->
## Features
- Voice app to help travelers understand the rules and regulations on entering Canada from international travels as described in the dedicated website: https://www.cbsa-asfc.gc.ca/travel-voyage/ifcrc-rpcrc-eng.html
- Desirable features: Send e-mail or SMS to user with more details to the user when requested.
- Platforms: Alexa app, Amazon Echo, Google Home

<!-- DESIGN -->
## Design

### User Research
We conducted user research by sending out a survey to Canadian citizens, we found out things like how proficient people were with using voice assistants and we gathered data on how they would ask the voice assistant questions by putting them into a scenario. Here is an example of our survey:
https://docs.google.com/forms/d/e/1FAIpQLSfd8yLSAVJPkhHk4UxZg3ZdEgTfotpg5GeBORWSkCTAWzxpbQ/viewform?usp=sf_link

### Personas
Using the data, we collected from the user research we created personas to help us understand our users better. Deep understanding of the target user is necessary in order to create a worthwhile product. Personas help the team find the answer to one of the most important questions "Who are we designing for?" Here is an example of one of our many personas.

![Persona](images/persona.png)

### User Stories 
User stories are brief statements that identifies the users and their goals. It determines who the user is, what they need, and why they need it. Creating user stories give us an estimate on what is needed to be delivered in the product.

![UserStories](images/user_stories.png)

### Usage Scenarios
We created user scenarios for our personas to help us understand what motivates the user when they interact with the voice assistant. We wanted to capture how a user performs a task with the voice assistant in different circumstances. This gives us a sense of the flow of tasks a user must take in order to successfully use the voice assistant.

![UsageScenarios](images/scenario.png)

### Dialog Scripts
Once we had outlined some key features, we created dialog scripts. Dialog scripts help us to see how users will interact with the voice assistant in real life. A user may say too little, too much, or say things that we weren’t expecting. Writing dialog scripts helps us visualize the conversation.

![DialogScripts](images/dialog_scripts.png)

### Dialog Flow
After creating the scripts, we wanted to explore the way the conversations with our voice assistant would go a bit more. We created a dialog flow chart of different conversation paths a user can take. Similar to an information architecture this maps out the experience a user has with the application.
![DialogFlow](images/dialog_flow.png)

### Information Architecture
Used more for convention mobile applications we thought it would be a good idea to also include a more standard information architecture of the dialog flow. This helps our developers visualize the map of conversation flow and the experience a user has with the voice assistant.
![InformationArchitecture](images/information_architecture.png)

### Storyboards
We wanted a way to visually predict the users experience with the voice assistant. We created a storyboard to help people understand the flow of conversation through the interaction. Using a storyboard was the proved to be a good approach to show off the narrative.

![Storyboard](images/storyboard.png)

<!-- HIGH-LEVEL ARCHITECTURE -->
## High-Level Architecture
Alexa and Dialogflow communicate directly to Firebase Function, which contains the code published and the following interactions with Firebase Database, Twilio and Sandgrid occurr from there. Additionaly, Google has a chat platform, directly enabled from DialogFlow:
![Genteque High-Level Architecture](images/GenTeque_HighLevelArchitecture.png)

<!-- TECHNICAL RESEARCH -->
## Technical Research
The technical research started with a possibility of developing the Google Agent on Dialogflow and importing it to Alexa, the documents in the folder link below contains the research on that matter and also the Twillo usage for SMS and Sandgrid for Emails.

-[Alexa and Firebase Research](docs/Alexa_to_Dialogflow_Research.pdf)

-[Twilio Research](docs/TwilioResearch.pdf)

During our research, we foundded out that it was possible to have one code published as a cloud function, and using it as an endpoint on Alexa and Dialogflow. This discover was based on the work published on the link below:

[Google Assistant and Alexa on Firebase Functions](https://thecocktail.engineering/google-assistant-alexa-chatbot-on-firebase-cloud-functions-2d7491b0f06d)


<!-- GETTING STARTED -->
## Getting Started
The following topics will describe the requirements and how to get a local copy of the project to use in further implementations.

<!-- PREREQUISITES -->
### Prerequisites
- [x] GitHub code pulled to local machine
- [x] Alexa Developer Account
- [x] Dialogflow Account
- [x] Firebase Account

<!-- Instalation -->
### Installation
#### Initial setup
Clone the GitHub directory to your local machine, using Terminal:
```sh
git clone https://github.com/rign0002/GenTeque.git GenTeque
```

#### Installing components
To ensure you have all the standard components that the code need navigate on Terminal to functions folder and execute the install command as demonstraded below:
```sh
cd functions
npm install
```

#### Login to Firebase
On Terminal proceed the login command to connect your Firebase account:
```sh
firebase login
```
You will be prompted to your default browser to login using your firebase account, once the login is succeed you can close the browser window that oppened.

### Deploy to Firebase Function
Every time a change in the code is made, or a functionality is implemented you will need to deploy the code to Firebase Function, be sure you are logged on the Terminal window with your Firebase account, and execute the following command:
```sh
sudo firebase deploy
```

### Setup aditional features
To setup and enable the additional features to send email and SMS please refer to the following documents:

-[Sendgrid Setup](docs/SendGrid-Guide.pdf)

-[Twilio Setup](docs/Twilio-SetUp.pdf)


#### Emergency Kit
If for any reason you need to reinstall the firebase functions, proceed on Terminal as follows:
```sh
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
firebase login
firebase init functions
```

<!-- USAGE -->
## Usage
Usage flow example for each platform.

![Conversation Example](images/conversation_screenshot.png)


### Add New Intent
To add a new intent, please refer to the following document:
[Add Intent Document](documents/Add_New_Intent.pdf)

<!-- ROADMAP -->
## Roadmap
- Add more intents: We have added the intents that currently are referred to on CBSA website, as regulations can change, any new intent will need to be added later.

- Publishing on Store: This project is not published on Alexa Store nor Google Store. We worked as far as we could to let the project in the final steps for publishing for the general public.

- Images: The project was focused only on voice, but Amazon and Google have devices with a screen, we would suggest implementing some images in the responses for the users that have these devices, we believe this will make their usage more friendly, instead of the device be only displaying text as currently does.

<!-- CONTACT -->
## Contact Us
**Project Lead:** [Thomas Sicard](mailto:sica0019@algonquinlive.com)

**Technical Lead:** [Marcos Zorzi Rosa](mailto:zorz0004@algonquinlive.com)

**Design Lead:** [Brandon Vervoort](mailto:verv0022@algonquinlive.com)

**Database Developer:** [Snehal Gondaliya](mailto:gond0017@algonquinlive.com)

**UX Researcher & API Developer:** [Rushikumar Patel](mailto:pate0672@algonquinlive.com)

**Developer:** [Justin Rignault](mailto:rign0002@algonquinlive.com)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
Our gratitude to our professors that contributed since the early stages of this project. Adesh and Su Cheng, thank you.

To our client, who was always open to discuss the different approaches we were thinking on and for embracing this challenge. Ranjan, thank you.

To all the members of Genteque that contributed with their best in this project, thank you.
