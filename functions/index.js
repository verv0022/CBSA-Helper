/* eslint-disable no-unreachable */
const functions = require('firebase-functions');
//const verifier = require('alexa-verifier');


//Start - Sendgrid requirements
process.env.DEBUG = 'dialogflow:debug';
process.env.SENDGRID_API_KEY = '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';
//End - Sendgrid requirements


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/**********************************************************************************/
/********************************Google Assistant**********************************/
/************************************************+++++++++++++++++++++++++++++++++*/
const {WebhookClient} = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillement = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));


  //Functions to add agent for each intent called
  function getCurrentTimeAnswer(agent) {
    agent.add(currentTime());
  }

  async function getWelcomeMessage(agent){
    await agent.add(welcomeMessage());
  }

  async function getExemptionsAnswer(agent){
    await agent.add(travelTimeExemptions(agent.parameters.time, agent.parameters.dwm));
  }

  async function getSMSIntent(agent){
    await agent.add(twilioSMS());
  }

  async function getEmailIntent(agent){
    await agent.add(sandgridEmail());
  }

  function getAlcoholIntent(agent){
    agent.add(alcoholIntent(agent.parameters.AlcoholType, agent.parameters.time, agent.parameters.dwm));
  }

  function getTobaccoIntent(agent){
    agent.add(tobaccoIntent(agent.parameters.TobaccoType));
  }

  function getProhibitedItems(agent){
    agent.add(prohibitedItems());
  }

  function getFoodPlantsAnimals(agent){
    agent.add(foodPlantsAnimals());
  }

  function getFirearmsWeapons(agent){
    agent.add(firearmsWeapons());
  }

  function getExplosivesFireworksAmmunition(agent){
    agent.add(explosivesFireworksAmmunition());
  }

  function getVehicles(agent){
    agent.add(vehicles());
  }

  function getConsumerProducts(agent){
    agent.add(consumerProducts());
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('CurrentTimeIntent', getCurrentTimeAnswer);
  intentMap.set('WelcomeIntent', getWelcomeMessage);
  intentMap.set('ExemptionsIntent', getExemptionsAnswer);
  intentMap.set('AlcoholIntent', getAlcoholIntent);
  intentMap.set('TobaccoIntent', getTobaccoIntent);
  intentMap.set('ProhibitedIntent', getProhibitedItems);
  intentMap.set('FirearmsWeaponsIntent', getFirearmsWeapons);
  intentMap.set('FoodPlantsAnimalsIntent', getFoodPlantsAnimals);
  intentMap.set('ExplosivesFireworksAmmunitionIntent', getExplosivesFireworksAmmunition);
  intentMap.set('VehiclesIntent', getVehicles);
  intentMap.set('ConsumerProductsIntent', getConsumerProducts);
  intentMap.set('SendSMSIntent', getSMSIntent);
  intentMap.set('EmailIntent', getEmailIntent);
  
  agent.handleRequest(intentMap);
});

/**********************************************************************************/
/********************************Alexa Skill***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/
exports.alexaSkill = functions.https.onRequest((request, response) => {

  /* START  ###### npm alexa-validator    -- TEST --  ######*/
  console.log('Alexa request: '+ JSON.stringify(request.body));
  console.log('Alexa headers: '+ JSON.stringify(request.headers));
  //console.log('Alexa rawBody: '+ JSON.stringify(request));

  // var cert_url = request.headers.signaturecertchainurl;
  // var signature = request.headers.signature;
  // var requestRawBody = JSON.stringify(request.rawBody);
  
  // try {
  //   verifier(cert_url, signature, requestRawBody, (er)=> {
  //     console.log("error: "+ er);
  //   });
  // } catch (error) {
  //   console.log("catch error: "+error);
  //   response.status(404).send('Sorry, cant find that');
  //   return response;
  // }
   /* END  ###### npm alexa-validator    -- TEST --  ######*/


  //Collect type - name and slots
  const type = JSON.stringify(request.body.request.type);
  var name = '';
  var slots = '';
  if(request.body.request.intent){
    console.log("getting name and slots");
    name = JSON.stringify(request.body.request.intent.name);
    slots = request.body.request.intent.slots;
  }  

  console.log("Test - type: " + type);

  const result = getAlexaResponse(type, name, slots);

  response.send(result);
});

//Default answer, change SSML and CARD.CONTENT only
const getAlexaResponse = (type, name, slots) => {  
  var AlexaDefaultAnswer = {
    "version": "1.0",
    "response": {
      "defaultResponse":{
        "type": "_DEFAULT_RESPONSE",
        "content": "Welcome to CBSA Helper, how can I help you?"
      },
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Welcome to CBSA Helper, how can I help you?</speak>"
      },
      "shouldEndSession": false,
      "card": {
        "type": "Simple",
        "title": "LaunchRequest",
        "content": "Welcome to CBSA Helper, how can I help you?"
      }
    },
    "userAgent": "ask-node/2.3.0 Node/v8.10.0",
    "sessionAttributes": {}
  }

  //Requests
  if(type === '"LaunchRequest"' || type === '<LaunchRequest>') {
      return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name ==='"GetCurrentTimeIntent"'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + currentTime() + "</speak>";
      AlexaDefaultAnswer.response.card.content = currentTime();
      return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name ==='"ExemptionsIntent"'){
    if(slots.time.value === '"?"'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I don't know if I understand. Could you repeat your question?</speak>";
      AlexaDefaultAnswer.response.card.content = "I don't know if I understand. Could you repeat your question?";  
    }else{
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + travelTimeExemptions(Number(slots.time.value), slots.dwm.value) + "</speak>";
      AlexaDefaultAnswer.response.card.content = travelTimeExemptions(Number(slots.time.value), slots.dwm.value);
    } 
    return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name === '"SendSMSIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an SMS message." + twilioSMS() + "</speak>";
    AlexaDefaultAnswer.response.card.content = twilioSMS();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"SendEmailIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an email." + sandgridEmail() + "</speak>";
    AlexaDefaultAnswer.response.card.content = sandgridEmail();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AlcoholIntent"'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + alcoholIntent(slots.AlcoholType.value , Number(slots.time.value), slots.dwm.value) + "</speak>";
      AlexaDefaultAnswer.response.card.content = alcoholIntent(slots.AlcoholType.value , Number(slots.time.value), slots.dwm.value);
      return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"TobaccoIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + tobaccoIntent(slots.TobaccoType.value) + "</speak>";
    AlexaDefaultAnswer.response.card.content = tobaccoIntent(slots.TobaccoType.value);
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"ProhibitedIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + prohibitedItems() + "</speak>";
    AlexaDefaultAnswer.response.card.content = prohibitedItems();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"FirearmsWeaponsIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + firearmsWeapons() + "</speak>";
    AlexaDefaultAnswer.response.card.content = firearmsWeapons();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"FoodPlantsAnimalsIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + foodPlantsAnimals() + "</speak>";
    AlexaDefaultAnswer.response.card.content = foodPlantsAnimals();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"ExplosivesFireworksAmmunitionIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + explosivesFireworksAmmunition() + "</speak>";
    AlexaDefaultAnswer.response.card.content = explosivesFireworksAmmunition();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"VehiclesIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + vehicles() + "</speak>";
    AlexaDefaultAnswer.response.card.content = vehicles();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"ConsumerProductsIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + consumerProducts() + "</speak>";
    AlexaDefaultAnswer.response.card.content = consumerProducts();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.HelpIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> You can ask me about rules and regulations, like prohibited items or personal exemptions. </speak>";
    AlexaDefaultAnswer.response.card.content = "You can ask me about rules and regulations, like prohibited items or personal exemptions."; 
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.FallbackIntent"'){
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.CancelIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> Cancelled. </speak>";
    AlexaDefaultAnswer.response.card.content = "Cancelled."; 
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.StopIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> Stopped. </speak>";
    AlexaDefaultAnswer.response.card.content = "Stopped."; 
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.NavigateHomeIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> Navigate Home. </speak>";
    AlexaDefaultAnswer.response.card.content = "Navigate Home."; 
    return AlexaDefaultAnswer;
  }
  else {
    return AlexaDefaultAnswer;
  }

};

/**********************************************************************************/
/***********************************ANSWERS****************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

//Welcome message
function welcomeMessage(){
  return "Welcome to CBSA Helper, how can I help you?"
}

//Return current time - test function
function currentTime(){
    const date = new Date();
    //Return time in UTC !!!
    return date.getHours() + ":" + date.getMinutes();
}

//Day(s), Week(s), Month(s), Year(s) ans Hour(s) converter
function dwmConverter(dwm){
  var travel_time = 0;
  
  if(dwm === 'week' || dwm === 'weeks' || dwm ==='month' || dwm ==='months'
  || dwm ==='year' || dwm ==='years'){
    travel_time = 7;
  }

  if(dwm === 'hour' || dwm === 'hours'){
    if(travel_time <= 24){
      travel_time = 1;
    } else if(travel_time > 24 && travel_time <= 48){
      travel_time = 2;
    } else if(travel_time > 49){
      travel_time = 3;
    }
  }

  return travel_time;
}

//General travel exemptions
function travelTimeExemptions(travel_time, dwm){
  var speechText = "";

  if(dwm !== 'day' && dwm !== 'days'){
    travel_time = dwmConverter(dwm);
  }

  //Exemptions responses
  if(travel_time <= 1){
    speechText = "Personal exemptions do not apply to same-day cross-border shoppers."; 
  }else if(travel_time > 1 && travel_time < 3){
      speechText = "You can claim goods worth up to two hundred Canadian dollars. Tobacco products and alcoholic beverages are not included in this exemption. If the value of the goods you are bringing back exceeds two hundred Canadian dollars, you cannot claim this exemption. Instead, duty and taxes are applicable on the entire amount of the imported goods. Goods must be in your possession and reported at time of entry to Canada. A minimum absence of twenty four hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than seven PM on Saturday the sixteenth to claim the exemption.";
  }else if(travel_time >= 3){
      speechText = "You can claim goods worth up to eight hundred Canadian dollars. You may include alcoholic beverages and tobacco products, within the prescribed limits. Refer to sections Tobacco Products and Alcoholic Beverages. Goods must be in your possession and reported at time of entry to Canada. If the value of the goods you are bringing back exceeds eight hundred Canadian dollars., duties and taxes are applicable only on amount of the imported goods that exceeds eight hundred Canadian dollars. A minimum absence of forty-eight hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than  seven PM on Sunday the seventeenth to claim the exemption.";
  }

  return speechText;
}

//Alcohol exemptions
function alcoholIntent(alcohol_type, travel_time, dwm){
  var speechText = "";

  if(dwm !== 'day' && dwm !== 'days'){
    travel_time = dwmConverter(dwm);
  }

  //Alcohol responses
  if(travel_time >= 2){
    switch (alcohol_type) {
      case 'beer':
        speechText = "You can bring up to eight point five litres of beer, approximately twenty four cans or bottles.";
        break;
      case 'wine':
        speechText = "You can bring up to one point five litres of wine, approximately two bottles.";
        break;
      default:
        speechText = "You can bring up to one point fourteen litres of " + alcohol_type + ", approximately one large standard bottle of liquor.";
        break;
    }
  }else{
    speechText = "You must declare all the " + alcohol_type + " you are bringing and may pay duties.";
  }

  return speechText;
}

//Tobacco exemptions
function tobaccoIntent(tobacco_type){
  var speechText = "";

  //convert plural words to singular
  if(tobacco_type === 'cigars'){
    tobacco_type = 'cigar'
  } else if(tobacco_type === 'cigarretes'){
    tobacco_type = 'cigarrete';
  }

  //Tobacco responses
  switch(tobacco_type){
    case 'tobacco sticks':
      speechText = "If you have been away from Canada for forty-eight hours or more,  you can bring up to two hundred tobacco sticks.";
      break;
    case 'tobacco':
      speechText = "If you have been away from Canada for forty-eight hours or more, you can bring up to two hundred grams, seven ounces, of manufactured tobacco.";
      break;
    case 'cigar':
      speechText = "If you have been away from Canada for forty-eight hours or more, you can bring up to fifty cigars.";
      break;
    case 'cigarette':
      speechText = "If you have been away from Canada for forty-eight hours or more, you can bring up to two hundred cigarettes";
      break;
    default:
      speechText = "For more information regarding tobacco products entering Canada, please refer to CBSA website.";
      break;
  }

  return speechText;
}


//Prohibited Items
function prohibitedItems(){
  var speechText = "";

  speechText = "The prohibited and restricted goods are separeted in the following categories. To retrieve more information please say the name of the desired category: ";
  speechText += " Firearms and weapons; Food, plants and animals; Explosives, fireworks and ammunition; Vehicles; Consumer products";

  return speechText;
}

//Firearms
function firearmsWeapons(){
  var speechText = "";
  speechText = "You must declare all weapons and firearms at the CBSA port of entry when you enter Canada. Please refer to CBSA website for more information.";
  return speechText;
}

//Food, plants, animals and related products
function foodPlantsAnimals(){
  var speechText = "";
  speechText = "All food, plants, animals, and related products must be declared. Food can carry disease, such as E. coli. Plants and plant products can carry invasive alien species, such as the Asian Long-Horned Beetle. Animals and animal products can carry diseases, such as avian influenza and foot-and-mouth disease. Please refer to CBSA website for more information.";
  return speechText;
}

//Explosives, fireworks and ammunition
function explosivesFireworksAmmunition(){
  var speechText = "";
  speechText = "You are required to have written authorization and permits to bring explosives, fireworks and certain types of ammunition into Canada. Please refer to CBSA website for more information.";
  return speechText;
}

//Vehicles
function vehicles(){
  var speechText = "";
  speechText = "Vehicles include any kind of pleasure vehicles such as passenger cars, pickup trucks, snowmobiles and motor homes, as long as you use them for non-commercial purposes. There are many requirements that apply to the importation of vehicles. Please refer to CBSA website for more information.";
  return speechText;
}


//Consumer products
function consumerProducts(){
  var speechText = "";
  speechText = "The importation of certain consumer products that could pose a danger to the public (e.g., baby walkers, jequirity beans that are often found in art or bead work) is prohibited. Canadian residents should be aware of consumer products that have safety requirements in Canada. Many of these safety requirements are stricter than requirements of other countries. Please refer to CBSA website for more information.";
  return speechText;
}


/**********************************************************************************/
/***********************************TWILIO****************************************/
/**********************************SENDGRID***************************************/
/*********************************GMAIL SMTP***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

async function twilioSMS(){
  console.log("twilio function")
  const accountSid = "ACad1b7c3ba37835ba7fbcfb08b565ffd8";
  const authToken = "c8774a60a7b67cdf3208ee1cc98dd31e";
  const client = require("twilio")(accountSid, authToken);
  
  //Phone number that will receive the message
  var mob = "+18195761628";
  
  await client.messages
    .create({
      to: mob,
      from: "+15087182932",
      body: "Hi Rishi. Marcos testing twilio here."
    })
    .then(message => console.log(message.sid))
    .then(console.log('twilio run'))
    .catch(err => console.error(err));
  //message.apply();

    return 'text message';
}

async function sandgridEmail(){

  /* START  ###### SANDGRID ######*/

  //   const sgMail = require("@sendgrid/mail");
    
  //   await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  //   try {
  //     console.log("email function");
  //     await sgMail.send({
  //       to: "rprishi08@gmail.com",
  //       from: "rprishi08@gmail.com",
  //       subject: "Sending with Twilio SendGrid is Fun",
  //       text: "SendGrid Test Successful wohoo!!",
  //       html: "<strong>SendGrid Test Successful</strong>"
  //     });
  //   } catch (err) {
  //     console.log("Error message: "+ err);
  //   }

  // return 'email sent'

  /* END ###### SANDGRID ######*/


  /* START ###### GMAIL SMTP ######*/
  //Gmail SMTP: https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs

  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');

  var transporter = await nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, // 465 use SSL, you can try with TLS, but port is then 587
    secure: true,
    auth: {
      type: 'OAuth2',
      secure: true,
      accessToken: 'AIzaSyCTgfucMSI92eZLKiNkrwpP8N4AuZ-VZ1c',
      user: 'genteque007@gmail.com',
      pass: 'Appliedproject007'
    }
  }));

  var usr_email = '';  

  var mailOptions = {
    from: 'genteque007@gmail.com',
    to: usr_email,
    subject: 'CBSA Helper',
    text: 'CBSA Helper - Information',
    html: '<b>Hello world ✔</b>' 
  };

  const mailTransport = (error, info) =>{
    console.log('transporter function');
    if(error){
      console.log('Error'+ error);
      //return false;
    } else {
      console.log('Email sent: ' + info.response);
      //return true;
    }
  }

  transporter.sendMail(mailOptions, mailTransport);

  /* END ###### GMAIL SMTP ######*/

  return 'email sent';
}