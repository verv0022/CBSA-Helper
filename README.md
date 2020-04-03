<!-- PROJECT LOGO -->
<p align="center">
  <a href="">
    <img src="images/Genteque_logo_final.png" alt="Team/Project logo" min-width="80" height="80">
  </a>

  <p align="center">
    </br>
    <h1>CBSA HELPER</h1>
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
  * [User Research](#userresearch)
  * [Product Research](#productresearch)
  * [Personas](#personas)
  * [User Stories & Usage Scenarios](#user-stories-usage-Scenarios)
  * [Information Architecture](#information-architecture)
  * [Paper Prototypes](#paper-prototypes)
  * [UI Wireframes](#ui-wireframes)
  * [Visual Design](#visual-design)
  * [Interactive Visual MockUp](#interactive-visual-mockup)
  * [Usability Testing Results](#usability-testing-results)
* [High-Level Architecture](#high-level-architecture)
* [Technical Research](#technical-research)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
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

<!-- HIGH-LEVEL ARCHITECTURE -->
## High-Level Architecture
Alexa and Dialogflow communicate directly to Firebase Function, which contains the code published and the following interactions with Firebase Database, Twilio and Sandgrid occurr from there. Additionaly, Google has a chat platform, directly enabled from DialogFlow:
![Genteque High-Level Architecture](images/GenTeque_HighLevelArchitecture.png)

<!-- TECHNICAL RESEARCH -->
## Technical Research

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

<!-- ROADMAP -->
## Roadmap

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
