/* eslint-disable no-unreachable */
const functions = require('firebase-functions');

process.env.DEBUG = 'dialogflow:debug';
process.env.SENDGRID_API_KEY = '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';

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
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function getCurrentTimeAnswer(agent) {
    agent.add(currentTime());
  }

  async function getWelcomeMessage(agent){
    await agent.add(welcomeMessage());
  }

  async function getExemptionsAnswer(agent){
    await agent.add(travelTimeExemptions(request.body.queryResult.parameters.time, agent.parameters.dwm));
  }

  async function getSMSIntent(agent){
    await agent.add(twiloSMS());
  }

  async function getEmailIntent(agent){
    await agent.add(sandgridEmail());
  }

  function getAlcoholIntent(agent){
    agent.add(alcoholIntent(request.body.queryResult.parameters.AlcoholType, request.body.queryResult.parameters.time));
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('CurrentTimeIntent', getCurrentTimeAnswer);
  intentMap.set('WelcomeIntent', getWelcomeMessage);
  intentMap.set('ExemptionsIntent', getExemptionsAnswer);
  intentMap.set('AlcoholIntent', getAlcoholIntent);
  intentMap.set('SendSMSIntent', getSMSIntent);
  intentMap.set('EmailIntent', getEmailIntent);
  
  agent.handleRequest(intentMap);
});

/**********************************************************************************/
/********************************Alexa Skill***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/
exports.alexaSkill = functions.https.onRequest((request, response) => {
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
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an SMS message." + twiloSMS() + "</speak>";
    AlexaDefaultAnswer.response.card.content = twiloSMS();
    return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AlcoholIntent"'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + alcoholIntent(slots.AlcoholType.value , Number(slots.time.value)) + "</speak>";
      AlexaDefaultAnswer.response.card.content = alcoholIntent(slots.AlcoholType.value , Number(slots.time.value));
      return AlexaDefaultAnswer;
  }else if(type === '"IntentRequest"' && name === '"AMAZON.HelpIntent"'){
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> You can ask me about rules and regulations, like prohibited itens or personal exemptions. </speak>";
    AlexaDefaultAnswer.response.card.content = "You can ask me about rules and regulations, like prohibited itens or personal exemptions."; 
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


function welcomeMessage(){
  return "Welcome to CBSA Helper, how can I help you?"
}

function currentTime(){
    const date = new Date();
    //Return time in UTC !!!
    return date.getHours() + ":" + date.getMinutes();
}

function travelTimeExemptions(travel_time, dwm){
  var speechText = "";

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

  if(travel_time <= 1){
    speechText = "Personal exemptions do not apply to same-day cross-border shoppers."; 
  }else if(travel_time > 1 && travel_time < 3){
      speechText = "You can claim goods worth up to two hundred Canadian dollars. Tobacco products and alcoholic beverages are not included in this exemption. If the value of the goods you are bringing back exceeds two hundred Canadian dollars, you cannot claim this exemption. Instead, duty and taxes are applicable on the entire amount of the imported goods. Goods must be in your possession and reported at time of entry to Canada. A minimum absence of twenty four hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than seven PM on Saturday the sixteenth to claim the exemption.";
  }else if(travel_time >= 3){
      speechText = "You can claim goods worth up to eight hundred Canadian dollars. You may include alcoholic beverages and tobacco products, within the prescribed limits. Refer to sections Tobacco Products and Alcoholic Beverages. Goods must be in your possession and reported at time of entry to Canada. If the value of the goods you are bringing back exceeds eight hundred Canadian dollars., duties and taxes are applicable only on amount of the imported goods that exceeds eight hundred Canadian dollars. A minimum absence of forty-eight hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than  seven PM on Sunday the seventeenth to claim the exemption.";
  }

  return speechText;
}


function alcoholIntent(alcohol_type, travel_time){
  var speechText = "";

  if(travel_time >= 2){
    switch (alcohol_type) {
      case 'beer':
        speechText = "You can bring up to eight point five litres of beer, approximately twenty four cans or bottles.";
        break;
        case 'wine':
          speechText = "You can bring up to one point five litres of wine, approximately two bottles.";
          break;
      default:
        speechText = "You can bring up to one point fourteen litres of alcoholic beverages, approximately one large standard bottle of liquor.";
        break;
    }
  }else{
    speechText = "You must declare all the alcoholic beverages you are bringing and pay duties.";
  }

  return speechText;
}




/**********************************************************************************/
/***********************************TWILIO****************************************/
/**********************************SENDGRID***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

async function twiloSMS(){
  console.log("twilio function")
  const accountSid = "ACad1b7c3ba37835ba7fbcfb08b565ffd8";
  const authToken = "c8774a60a7b67cdf3208ee1cc98dd31e";
  const client = require("twilio")(accountSid, authToken);
  

  var mob = "+18195761628";
  //exports.dialogflowFirebaseFulfillement
  
  
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




  //Gmail try: https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs

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
      pass: 'appliedproject'
    }
  }));

  

  var mailOptions = {
    from: 'genteque007@gmail.com',
    to: 'zorz0004@algonquinlive.com',
    subject: 'Sending Email using Node.js[nodemailer]',
    text: 'That was easy!',
    html: '<b>Hello world ✔</b>' 
  };
const mailTransport = (error, info) =>{
  console.log('transporter function');
  if(error){
    console.log('Error'+ error);
    return false;
  } else {
    console.log('Email sent: ' + info.response);
    return true;
  }
}

  transporter.sendMail(mailOptions, mailTransport);

  return 'email sent';
}