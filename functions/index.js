/* eslint-disable no-unreachable */
const functions = require('firebase-functions');

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

  function getExemptionsAnswer(agent){
    agent.add(travelTimeExemptions(request.body.queryResult.parameters.time));
  }

  function getSMSIntent(agent){
    agent.add(twiloSMS());
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('GetCurrentTimeIntent', getCurrentTimeAnswer);
  intentMap.set('GetExemptionsIntent', getExemptionsAnswer);
  intentMap.set('SendSMSIntent', getSMSIntent);
  agent.handleRequest(intentMap);
});

/**********************************************************************************/
/********************************Alexa Skill***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/
exports.alexaSkill = functions.https.onRequest((request, response) => {
  const type = JSON.stringify(request.body.request.type);
  const name = JSON.stringify(request.body.request.intent.name);
  const slots = request.body.request.intent.slots;
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

  // var AlexaDefaultAnswer = {
  //   "body": {
  //     "version": "1.0",
  //     "response": {
  //       "outputSpeech": {
  //         "type": "SSML",
  //         "ssml": "<speak>Welcome to to CBSA APP2, you can ask me questions or say help!</speak>"
  //       },
  //       "card": {
  //         "type": "Simple",
  //         "title": "LaunchRequest",
  //         "content": "Welcome to to CBSA APP2, you can ask me questions or say help!"
  //       },
  //       "shouldEndSession": false,
  //       "type": "_DEFAULT_RESPONSE"
  //     },
  //     "sessionAttributes": {},
  //     "userAgent": "ask-node/2.3.0 Node/v8.10.0"
  //   }
  // }

  if(type === '"LaunchRequest"' || type === '<LaunchRequest>') {
      return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name ==='"GetCurrentTimeIntent"'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + currentTime() + "</speak>";
      AlexaDefaultAnswer.response.card.content = currentTime();
      return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name ==='"ExemptionsIntent"'){
    if(slots.time.name === 'time'){
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + travelTimeExemptions(Number(slots.time.value)) + "</speak>";
      AlexaDefaultAnswer.response.card.content = travelTimeExemptions(Number(slots.time.value));
    }else{
      AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>How long will you be travelling?</speak>";
    }
    return AlexaDefaultAnswer;
  } else if(type === '"IntentRequest"' && name === '"SendSMSIntent"'){
    //twiloSMS();
    AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an" + twiloSMS() + "</speak>";
    AlexaDefaultAnswer.response.card.content = twiloSMS();
  }else {
    return AlexaDefaultAnswer;
  }

};

/**********************************************************************************/
/***********************************ANSWERS****************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

function currentTime(){
    const date = new Date();
    //Return time in UTC !!!
    return date.getHours() + ":" + date.getMinutes();
}

function travelTimeExemptions(travel_time){
  var speechText = "";
  
  if(travel_time <= 1){
    speechText = "Personal exemptions do not apply to same-day cross-border shoppers."; 
  }else if(travel_time > 1 && travel_time < 3){
      speechText = "You can claim goods worth up to two hundred Canadian dollars. Tobacco products and alcoholic beverages are not included in this exemption. If the value of the goods you are bringing back exceeds two hundred Canadian dollars, you cannot claim this exemption. Instead, duty and taxes are applicable on the entire amount of the imported goods. Goods must be in your possession and reported at time of entry to Canada. A minimum absence of twenty four hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than seven PM on Saturday the sixteenth to claim the exemption.";
  }else if(travel_time >= 3){
      speechText = "You can claim goods worth up to eight hundred Canadian dollars. You may include alcoholic beverages and tobacco products, within the prescribed limits. Refer to sections Tobacco Products and Alcoholic Beverages. Goods must be in your possession and reported at time of entry to Canada. If the value of the goods you are bringing back exceeds eight hundred Canadian dollars., duties and taxes are applicable only on amount of the imported goods that exceeds eight hundred Canadian dollars. A minimum absence of forty-eight hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than  seven PM on Sunday the seventeenth to claim the exemption.";
  }

  return speechText;
}




/**********************************************************************************/
/***********************************TWILIO****************************************/
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