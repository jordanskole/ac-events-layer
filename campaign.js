'use strict';

const querystring = require('querystring');
const AMP_API_KEY = '7bb9f15fdf08166ac280904f8239d674';
const AMP_API_SECRET = '1b754eb2fc4b6462a942883456c4b9b4';
const Amplitude = require('amplitude');
const amplitude = new Amplitude(AMP_API_KEY);
const md5 = require('md5');

module.exports.sent = (event, context, callback) => {
  
  // this will kill the process right after callbac()
  context.callbackWaitsForEmptyLoop = false;
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    })
  };
  
  // check that the webhook has an email-name
  if (typeof event.queryStringParameters['email-name'] !== 'string') {
    let errorResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'property email-name must be of type string, ' + typeof event.queryStringParameters['email-name'] + ' given',
        input: event,
      })
    };    
    
    callback(errorResponse);
  }
  
  
  // check that email-name is length not zero
  if (event.queryStringParameters['email-name'].length === 0) {
    let errorResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'property email-name must be of type string, null given',
        input: event,
      })
    };    
    
    callback(errorResponse);
  }
  
  let webhookBody = querystring.parse(event.body);  
  console.log(JSON.stringify(webhookBody));
  console.log('Tracking event: ', event.queryStringParameters);
  
  // track the event 
  let contactId = md5(webhookBody['contact[email]']);
  
  amplitude.track({
    eventType: 'campaign_sent',
    userId: contactId,
    eventProperties: {
        campaign_name: event.queryStringParameters['email-name']        
    }
  }).then(() => {
    callback(null, response);      
  }).catch((err) => {
    console.log(JSON.stringify(err));
    callback(null, response);
  });
}