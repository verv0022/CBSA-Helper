/* eslint-disable no-unreachable */
const functions = require('firebase-functions');
//const verifier = require('alexa-verifier');


//Start - Sendgrid requirements
process.env.DEBUG = 'dialogflow:debug';
process.env.SENDGRID_API_KEY = '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';
//End - Sendgrid requirements


/**********************************************************************************/
/********************************Google Assistant**********************************/
/************************************************+++++++++++++++++++++++++++++++++*/
const {
    WebhookClient
} = require('dialogflow-fulfillment');


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.dialogflowFirebaseFulfillement = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({
        request,
        response
    });
    //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    //Functions to add agent for each intent called
    function getCurrentTimeAnswer(agent) {
        agent.add(currentTime());
    }

    async function getWelcomeMessage(agent) {

        let cbsa = welcomeMessage();
        let convType = request.body.originalDetectIntentRequest.payload.conversation;

        let userInput = request.body.originalDetectIntentRequest.payload.inputs;
        userInput.forEach(function(item) {
            let t = item.rawInputs;
            t.forEach(function(i){
                let user = i.query;
                saveData(user,cbsa,convType.type,1);
            });
        });

        await agent.add(welcomeMessage());
    }

    async function getExemptionsAnswer(agent) {
        let temp =  travelTimeExemptions(request.body.queryResult.parameters.time, request.body.queryResult.parameters.dwm);
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        let time = request.body.queryResult.parameters.time;
        let dwm = request.body.queryResult.parameters.dwm;
        let user = "what are my travel exemptions?";
        let cbsa = `Exemptions for ${time} ${dwm} trip are : ${temp}`;
        
        saveData(user,cbsa,convType.type,2)
        
        await agent.add(temp);
    }

    async function getSMSIntent(agent) {
        await agent.add(twilioSMS());
    }

    async function getEmailIntent(agent) {
        let user = request.body.queryResult.queryText;
        getData();
        await agent.add("sandgridEmail()");
    }

    async function getAlcoholIntent(agent) {
        let temp = alcoholIntent(agent.parameters.AlcoholType[0], agent.parameters.time, agent.parameters.dwm);
        
        let time = agent.parameters.time;
        let dwm = agent.parameters.dwm;
        let alcoholType = agent.parameters.AlcoholType;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        let user = "How much alcohol can I bring back duty free";
        
        let cbsa = `For ${time} ${dwm} trip, the exemptions for ${alcoholType} are : ${temp}`;
        
        saveData(user, cbsa, convType.type,3)
        
        await agent.add(temp);
    }

    async function getTobaccoIntent(agent) {
        let cbsa = tobaccoIntent(agent.parameters.TobaccoType);
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,9);
        
        await agent.add(cbsa);
        
    }

    async function getProhibitedItems(agent) {
        let cbsa = prohibitedItems();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,8);
        
        await agent.add(cbsa);
    }

    async function getFoodPlantsAnimals(agent) {
        let cbsa = foodPlantsAnimals();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,6);
        
        await agent.add(cbsa);
    }

    async function getFirearmsWeapons(agent) {
        let cbsa = firearmsWeapons();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,5);
        
        await agent.add(cbsa);
    }

    async function getExplosivesFireworksAmmunition(agent) {
        let cbsa = explosivesFireworksAmmunition();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,4);
        
        await agent.add(cbsa);
    }

    async function getVehicles(agent) {
        let cbsa = vehicles();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,10);
        
        await agent.add(cbsa);
    }

    async function getConsumerProducts(agent) {
        let cbsa = consumerProducts();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,11);
        
        await agent.add(cbsa);
    }

    async function getGifts(agent) {
        
        let cbsa = gifts();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,7);
        
        await agent.add(cbsa);
    }

    function getHelp(agent) {
        agent.add(help());
    }

    async function getMoney(agent){
        let cbsa = money();
        let user = request.body.queryResult.queryText;
        let convType = request.body.originalDetectIntentRequest.payload.conversation;
        
        saveData(user ,cbsa, convType.type,7);

        await agent.add(cbsa);
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
    intentMap.set('GiftsIntent', getGifts);
    intentMap.set('HelpIntent', getHelp);
    intentMap.set('SendSMSIntent', getSMSIntent);
    intentMap.set('EmailIntent', getEmailIntent);
    intentMap.set('MoneyIntent', getMoney);
    agent.handleRequest(intentMap);
});

/**********************************************************************************/
/********************************Alexa Skill***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/
exports.alexaSkill = functions.https.onRequest((request, response) => {

    /* START  ###### npm alexa-validator ######*/
    //START - Amazon validation - https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs
    const {
        SkillRequestSignatureVerifier,
        TimestampVerifier
    } = require('ask-sdk-express-adapter');
    const Alexa = require('ask-sdk-core');

    const skillBuilder = Alexa.SkillBuilders.custom();
    const skill = skillBuilder.create();

    async function validator(requestStr, response) {
        try {
            await new SkillRequestSignatureVerifier().verify(requestStr, request.headers);
            await new TimestampVerifier().verify(requestStr);
        } catch (err) {
            // server return err message
            response.status(400).send('Bad Request');
            console.log("Validator error: " + err);
        }
        //response = skill.invoke(request.body);
        //response = skill.invoke(JSON.parse(request.body));
        //response.send(result)
    }
    //END - Amazon validation


    /* END  ###### npm alexa-validator ######*/


    //Collect type - name and slots
    const type = JSON.stringify(request.body.request.type);
    var name = '';
    var slots = '';
    if (request.body.request.intent) {
        console.log("getting name and slots");
        name = JSON.stringify(request.body.request.intent.name);
        slots = request.body.request.intent.slots;
    }

    //console.log("Test - type: " + type);

    const result = getAlexaResponse(type, name, slots);


    try {
        validator(JSON.stringify(request.body), response); //call Amazon validator, after consume request
    } catch (err) {
        console.log("Not validated.");
    }

    response.send(result);
});

//Default answer, change SSML and CARD.CONTENT only
const getAlexaResponse = (type, name, slots) => {
    var AlexaDefaultAnswer = {
        "version": "1.0",
        "response": {
            "defaultResponse": {
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
    if (type === '"LaunchRequest"' || type === '<LaunchRequest>') {
        saveData("Open cbsa helper" , welcomeMessage(), "NEW" ,1);
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"GetCurrentTimeIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + currentTime() + "</speak>";
        AlexaDefaultAnswer.response.card.content = currentTime();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"ExemptionsIntent"') {
        if (slots.time.value === '"?"') {
            AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I don't know if I understand. Could you repeat your question?</speak>";
            AlexaDefaultAnswer.response.card.content = "I don't know if I understand. Could you repeat your question?";
        } else {
            let user = "What are my travel exemptions on a "+slots.time.value+ " "+ slots.dwm.value+" trip?";
            let cbsa = travelTimeExemptions(Number(slots.time.value), slots.dwm.value);
            saveData(user, cbsa, "NEW", 2 )
            AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + travelTimeExemptions(Number(slots.time.value), slots.dwm.value) + "</speak>";
            AlexaDefaultAnswer.response.card.content = travelTimeExemptions(Number(slots.time.value), slots.dwm.value);
        }
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"SendSMSIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an SMS message." + twilioSMS() + "</speak>";
        AlexaDefaultAnswer.response.card.content = twilioSMS();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"SendEmailIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak> I have sent you an email." + sandgridEmail() + "</speak>";
        AlexaDefaultAnswer.response.card.content = sandgridEmail();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AlcoholIntent"') {
        let user = "How many "+slots.AlcoholType.value +"can I bring from a "+ slots.time.value + " " + slots.dwm.value + "trip?";
        let cbsa = alcoholIntent(slots.AlcoholType.value, Number(slots.time.value), slots.dwm.value);
        saveData(user, cbsa, "NEW", 3)
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + alcoholIntent(slots.AlcoholType.value, Number(slots.time.value), slots.dwm.value) + "</speak>";
        AlexaDefaultAnswer.response.card.content = alcoholIntent(slots.AlcoholType.value, Number(slots.time.value), slots.dwm.value);
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"TobaccoIntent"') {
        saveData("How many " +slots.TobaccoType.value+" can I bring back to Canada?" , tobaccoIntent(slots.TobaccoType.value), "NEW" ,4);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + tobaccoIntent(slots.TobaccoType.value) + "</speak>";
        AlexaDefaultAnswer.response.card.content = tobaccoIntent(slots.TobaccoType.value);
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"ProhibitedIntent"') {
        saveData("What are the prohibited items?" , prohibitedItems(), "NEW" ,5);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + prohibitedItems() + "</speak>";
        AlexaDefaultAnswer.response.card.content = prohibitedItems();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"FirearmsWeaponsIntent"') {
        saveData("Firearms and weapons allowances?" , firearmsWeapons(), "NEW" ,6);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + firearmsWeapons() + "</speak>";
        AlexaDefaultAnswer.response.card.content = firearmsWeapons();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"FoodPlantsAnimalsIntent"') {
        saveData("Food, Plants and Animals allowances?" , foodPlantsAnimals(), "NEW" ,7);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + foodPlantsAnimals() + "</speak>";
        AlexaDefaultAnswer.response.card.content = foodPlantsAnimals();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"ExplosivesFireworksAmmunitionIntent"') {
        saveData("Explosives, Fireworks and Ammunition allowances?" , explosivesFireworksAmmunition(), "NEW" ,8);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + explosivesFireworksAmmunition() + "</speak>";
        AlexaDefaultAnswer.response.card.content = explosivesFireworksAmmunition();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"VehiclesIntent"') {
        saveData("Vehicles allowances?" , vehicles(), "NEW" ,9);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + vehicles() + "</speak>";
        AlexaDefaultAnswer.response.card.content = vehicles();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"ConsumerProductsIntent"') {
        saveData("Consumer Products alowances." , consumerProducts(), "NEW" ,10);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + consumerProducts() + "</speak>";
        AlexaDefaultAnswer.response.card.content = consumerProducts();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"GiftsIntent"') {
        saveData("Gifts alowances." , gifts(), "NEW" ,11);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + gifts() + "</speak>";
        AlexaDefaultAnswer.response.card.content = gifts();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AMAZON.HelpIntent"') {
        saveData("Help." , help(), "NEW" ,12);
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + help() + "</speak>";
        AlexaDefaultAnswer.response.card.content = help();
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AMAZON.FallbackIntent"') {
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AMAZON.CancelIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>It is Cancelled.</speak>";
        AlexaDefaultAnswer.response.card.content = "It is Cancelled.";
        AlexaDefaultAnswer.response.shouldEndSession = true;
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AMAZON.StopIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>OK I'll stop.</speak>";
        AlexaDefaultAnswer.response.card.content = "OK I'll stop.";
        AlexaDefaultAnswer.response.shouldEndSession = true;
        return AlexaDefaultAnswer;
    } else if (type === '"IntentRequest"' && name === '"AMAZON.NavigateHomeIntent"') {
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>Navigate Home.</speak>";
        AlexaDefaultAnswer.response.card.content = "Navigate Home.";
        AlexaDefaultAnswer.response.shouldEndSession = true;
        return AlexaDefaultAnswer;
    }else if (type === '"IntentRequest"' && name === '"MoneyIntent"') {
        saveData("How much money can I cross the border with?", money(), "NEW", 13)
        AlexaDefaultAnswer.response.outputSpeech.ssml = "<speak>" + money() + "</speak>";
        AlexaDefaultAnswer.response.card.content = money();
        return AlexaDefaultAnswer;
    }  
    else {
        return AlexaDefaultAnswer;
    }

};

/**********************************************************************************/
/******************************** Firebase ***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

function saveData(userQues, cbsaAns, convType,count) {
    let data = {};
    if(convType === "NEW"){
        db.collection('conversation').doc(getUserEmail()).delete();
    }
    
    data['counter'] = count;
    data['skill' + count] = cbsaAns;
    data['user' + count] = userQues;
    
    db.collection('conversation').doc(getUserEmail()).set(data, {
        merge: true
    });

}

function getUserEmail(){
    return "genteque007@gmail.com";
}

function getData(){
    db.collection('conversation').doc(getUserEmail()).get()
    .then(doc => {
        if (!doc.exists) {
            throw new Error("data does not exists");
        } else {
            let conversation = "";
            conversation += doc.data();
            return conversation;
        }
    })
    .catch(err => {
        return console.log('Error getting document', err);
    });
}

/**********************************************************************************/
/***********************************ANSWERS****************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

//Welcome message
function welcomeMessage() {
    return "Welcome to CBSA Helper, how can I help you?"
}

//Return current time - test function
function currentTime() {
    const date = new Date();
    //Return time in UTC !!!
    return date.getHours() + ":" + date.getMinutes();
}

//Day(s), Week(s), Month(s), Year(s) ans Hour(s) converter
function dwmConverter(dwm) {
    var travel_time = 0;

    if (dwm === 'week' || dwm === 'weeks' || dwm === 'month' || dwm === 'months' ||
        dwm === 'year' || dwm === 'years') {
        travel_time = 7;
    }

    if (dwm === 'hour' || dwm === 'hours') {
        if (travel_time <= 24) {
            travel_time = 1;
        } else if (travel_time > 24 && travel_time <= 48) {
            travel_time = 2;
        } else if (travel_time > 49) {
            travel_time = 3;
        }
    }

    return travel_time;
}

//General travel exemptions
function travelTimeExemptions(travel_time, dwm) {
    var speechText = "";

    //Validate slots received and return error message
    if (travel_time === '?' || dwm === '?' || isNaN(travel_time) || dwm === '') {
        speechText = "I'm not sure if I understand, please ask me again.";
        return speechText;
    }

    if (dwm !== 'day' && dwm !== 'days') {
        travel_time = dwmConverter(dwm);
    }

    //Exemptions responses
    if (travel_time <= 1) {
        speechText = "Personal exemptions do not apply to same-day cross-border shoppers.";
    } else if (travel_time > 1 && travel_time < 3) {
        speechText = "You can claim goods worth up to two hundred Canadian dollars. Tobacco products and alcoholic beverages are not included in this exemption. If the value of the goods you are bringing back exceeds two hundred Canadian dollars, you cannot claim this exemption. Instead, duty and taxes are applicable on the entire amount of the imported goods. Goods must be in your possession and reported at time of entry to Canada. A minimum absence of twenty four hours from Canada is required. For example, if you left at seven PM on Friday the fifteenth, you may return no earlier than seven PM on Saturday the sixteenth to claim the exemption.";
    } else if (travel_time >= 3) {
        speechText = "You can claim goods worth up to eight hundred Canadian dollars. If exceeded, duties and taxes are applicable only on the amount of the imported goods that exceeds eight hundred dollars. Remember, goods must be in your possession and reported at time of entry to Canada. You can ask me about Alcoholic Beverages and Tobacco Products.";
    }

    return speechText;
}

//Alcohol exemptions
function alcoholIntent(alcohol_type, travel_time, dwm) {
    var speechText = "";

    //Validate slots received and return error message
    if (alcohol_type === '?' || dwm === '?' || alcohol_type === '' || dwm === '') {
        speechText = "I'm not sure if I understand, please ask me again.";
        return speechText;
    }

    if (dwm !== 'day' && dwm !== 'days') {
        travel_time = dwmConverter(dwm);
    }

    //Alcohol responses
    if (travel_time >= 2) {
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
    } else {
        speechText = "You must declare all the " + alcohol_type + " you are bringing and may pay duties.";
    }

    return speechText;
}

//Tobacco exemptions
function tobaccoIntent(tobacco_type) {
    var speechText = "";

    //Validate slots received and return error message
    if (tobacco_type === '?' || tobacco_type === '') {
        speechText = "I'm not sure if I understand, please ask me again.";
        return speechText;
    }

    //convert plural words to singular
    if (tobacco_type === 'cigars') {
        tobacco_type = 'cigar'
    } else if (tobacco_type === 'cigarretes') {
        tobacco_type = 'cigarrete';
    }

    //Tobacco responses
    switch (tobacco_type) {
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
function prohibitedItems() {
    var speechText = "";

    speechText = "The prohibited and restricted goods are separeted in the following categories. To retrieve more information please say the name of the desired category: ";
    speechText += " Firearms and weapons; Food, plants and animals; Explosives, fireworks and ammunition; Vehicles; Consumer products";

    return speechText;
}

//Firearms
function firearmsWeapons() {
    var speechText = "";
    speechText = "You must declare all weapons and firearms at the CBSA port of entry when you enter Canada. Please refer to CBSA website for more information.";
    return speechText;
}

//Food, plants, animals and related products
function foodPlantsAnimals() {
    var speechText = "";
    speechText = "All food, plants, animals, and related products must be declared. Food can carry disease, such as E. coli. Plants and plant products can carry invasive alien species, such as the Asian Long-Horned Beetle. Animals and animal products can carry diseases, such as avian influenza and foot-and-mouth disease. Please refer to CBSA website for more information.";
    return speechText;
}

//Explosives, fireworks and ammunition
function explosivesFireworksAmmunition() {
    var speechText = "";
    speechText = "You are required to have written authorization and permits to bring explosives, fireworks and certain types of ammunition into Canada. Please refer to CBSA website for more information.";
    return speechText;
}

//Vehicles
function vehicles() {
    var speechText = "";
    speechText = "You can bring back any kind of pleasure vehicles such as passenger cars, pickup trucks, snowmobiles and motor homes, as long as you use them for non-commercial purposes. There are many requirements that apply to the importation of vehicles. Please refer to CBSA website for more information.";
    return speechText;
}


//Consumer products
function consumerProducts() {
    var speechText = "";
    speechText = "The importation of certain consumer products that could pose a danger to the public (e.g., baby walkers, jequirity beans that are often found in art or bead work) is prohibited. Canadian residents should be aware of consumer products that have safety requirements in Canada. Many of these safety requirements are stricter than requirements of other countries. Please refer to CBSA website for more information.";
    return speechText;
}


//Gifts
function gifts() {
    var speechText = "";
    speechText = "While you are away you can send gifts worth up to sixty canadian dollars free of duty if they are not a tobacco product, an alcoholic beverage or advertising matter. If the gift value is more than sixty canadian dollars, the recipient will pay taxes on the excess amount. Remember to add a greeting card to avoid misunderstandings. While gifts you send from outside Canada do not count as part of your personal exemption, gifts you bring back in your personal baggage do. Remember not to wrap the gifts as a CBSA agent might need to unwrap them for examination when you cross the border.";
    return speechText;
}


//Help message
function help() {
    var speechText = "";
    speechText = "I can help you with border rules and regulations. For example, you can ask me about prohibited items or personal exemptions."
    return speechText;
}


//Money
function money(){
    var speechText = "";
    speechText = "If you have currency or monetary instruments equal to or greater than ten thousand canadian dollars (or the equivalent in a foreign currency) in your possession when arriving in or departing from Canada, you must report this to the CBSA.";
    return speechText;
}

/**********************************************************************************/
/***********************************TWILIO****************************************/
/**********************************SENDGRID***************************************/
/*********************************GMAIL SMTP***************************************/
/************************************************+++++++++++++++++++++++++++++++++*/

async function twilioSMS() {
    
    /* Get Converstion data */
    var converstion = await getData();
    
     //Twilio requirements
    const accountSid = "ACad1b7c3ba37835ba7fbcfb08b565ffd8";
    const authToken = "c8774a60a7b67cdf3208ee1cc98dd31e";
    const client = require("twilio")(accountSid, authToken);

    //Phone number that will receive the message
    var mob = "+18195761628";

    await client.messages
        .create({
            to: mob,
            from: "+15087182932",
            body: conversation
        })
        .then(message => console.log(message.sid))
        .then(console.log('twilio run'))
        .catch(err => console.error(err));
    //message.apply();

    return 'text message';
}

async function sandgridEmail() {

    /* Get Converstion data */
    var converstion = await getData();

    /* START  ###### SANDGRID ######*/

    //   const sgMail = require("@sendgrid/mail");

    //   await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    //   try {
    //     console.log("email function");
    //     await sgMail.send({
    //       to: "rprishi08@gmail.com",
    //       from: "rprishi08@gmail.com",
    //       subject: "Sending with Twilio SendGrid is Fun",
    //       text: conversation,
    //       html: conversation
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
        text: converstion,
        html: converstion
    };

    const mailTransport = (error, info) => {
        console.log('transporter function');
        if (error) {
            console.log('Error' + error);
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
