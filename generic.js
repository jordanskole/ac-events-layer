'use strict';

const querystring = require('querystring');
const AMP_API_KEY = '7bb9f15fdf08166ac280904f8239d674';
const AMP_API_SECRET = '1b754eb2fc4b6462a942883456c4b9b4';
const Amplitude = require('amplitude');
const amplitude = new Amplitude(AMP_API_KEY);
const md5 = require('md5');

module.exports.catch = (event, context, callback) => {
  
  // this will kill the process right after callbac()
  context.callbackWaitsForEmptyLoop = false;
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    })
  };

  // check that the webhook has an event-name
  if (typeof event.queryStringParameters['event-name'] !== 'string') {
    let errorResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'property event-name must be of type string, ' + typeof event.queryStringParameters['event-name'] + ' given',
        input: event,
      })
    };    
    
    callback(errorResponse);
  } 
  
  // check that event-name is length not zero
  if (event.queryStringParameters['event-name'].length === 0) {
    let errorResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'property event-name must be of type string, null given',
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
  // let properties = {
  //   "Campaign ID": payload['campaign[id]'],
  //   "Campaign Status": payload['campaign[status]'],
  //   "Campaign Name": payload['campaign[name]'],
  //   "Campaign Type": payload['campaign[type]'],
  //   "Campaign Subject": payload['campaign[message][subject]']
  // };
  
  return amplitude.track({
    eventType: event.queryStringParameters['event-name'],
    userId: contactId
  });
  
  
  
  callback(null, response);  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
