<!-- PROJECT LOGO -->
<p align="center">
  <a href="">
    <img src="images/Genteque_logo_final.png" alt="Team/Project logo" min-width="80" height="80">
  </a>

  <p align="center" style="padding:1rem;">
    <br />
    <br />
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

![Product Name Screen Shot](https://github.com/shah0150/deployment-document-template/blob/master/images/screenshot.png?raw=true)

CBSA Helper is a voice application for Alexa and Google Home, to provide fast and easy to understand, information regarding travel exemptions, prohibited items and duties.
It is focused for travelers returning or entering Canada. The main purpouse is to be a trustable source, faster and easier than looking through a traditional website.

## Requirements 
- [x] GitHub code pulled to local machine
- [x] Alexa Developer Account
- [x] Dialogflow Account
- [x] Firebase Account

## Installation 
### Initial setup
Clone the GitHub directory to your local machine, using Terminal:
```sh
git clone https://github.com/rign0002/GenTeque.git GenTeque
```

### Installing components
To ensure you have all the standard components that the code need navigate on Terminal to functions folder and execute the install command as demonstraded below:
```sh
cd functions
npm install
```

### Login to Firebase
On Terminal proceed the login command to connect your Firebase account:
```sh
firebase login
```
You will be prompted to your default browser to login using your firebase account, once the login is succeed you can close the browser window that oppened.

## Emergency Kit
If for any reason you need to reinstall the firebase functions, proceed on Terminal as follows:
```sh
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
firebase login
firebase init functions
```
## Contact Us
<a name="Contact"></a>
