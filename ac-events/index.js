'use strict';

const AMP_API_KEY = '7bb9f15fdf08166ac280904f8239d674';
const AMP_API_SECRET = '1b754eb2fc4b6462a942883456c4b9b4';
const Amplitude = require('amplitude');
const amplitude = new Amplitude(AMP_API_KEY);
const list = require('./lists');
const md5 = require('md5');


// case 'update':
//   break;
// case 'forward':
//   break;
// case 'subscribe': // contact added
//   break;
// case 'unsubscribe': // contact unsubscribe
//   break;
// case 'sent': // campaign starts sending
//   break;
// case 'open': // campaign email open
//   break;
// case 'reply': // campaign email reply
//   break;
// case 'click': // link click from email
//   break;
// case 'share': // campaign email share
//   break;
// case 'deal_task_complete':

//
exports.default = (eventName, payload) => {
  return amplitude.track({
    eventType: eventName,
    userId: payload['contact[email]'],
    eventProperties: payload
  });
}

exports.campaignOpen = (payload) => {
  
  let contactId = md5(payload['contact[email]']);
  let properties = {
    "Campaign ID": payload['campaign[id]'],
    "Campaign Status": payload['campaign[status]'],
    "Campaign Name": payload['campaign[name]'],
    "Campaign Type": payload['campaign[type]'],
    "Campaign Subject": payload['campaign[message][subject]']
  };
  
  return amplitude.track({
    eventType: "open",
    userId: contactId,
    eventProperties: properties
  })
}

exports.campaignClick = (payload) => {
  let contactId = md5(payload['contact[email]']);
  let properties = {
    "Campaign ID": payload['campaign[id]'],
    "Campaign Status": payload['campaign[status]'],
    "Campaign Name": payload['campaign[name]'],
    "Campaign Type": payload['campaign[type]'],
    "Campaign Subject": payload['campaign[message][subject]'],
    "Campaign Link URL": payload['link[url]'],
    "Campaign Link ID": payload['link[id]']    
  }
  
  return amplitude.track({
    eventType: "click",
    userId: contactId,
    eventProperties: properties
  })
}

exports.campaignStartsSending = (payload) => {
  
  // this is bad! 
  // campaign[recipients] is actually the number of receipients an email has been sent to.
  let contactId = payload['campaign[recipients]'];
  let properties = {
    "Campaign ID": payload['campaign[id]'],
    "Campaign Name": payload['campaign[name]'],
    "Campaign Type": payload['campaign[type]'],
    "Campaign Status": payload['campaign[status]']
  }
  
  return amplitude.track({
    eventType: "sent",
    userId: contactId,
    eventProperties: properties
  })  
}

exports.subscribe = (payload) => {
  if (payload.type !== 'subscribe') {
    console.error('expected payload type subscribe, got ', payload.type);
    // kill it. This isnt a subscribe event
    return;
  }

  let eventName;
  switch (payload.list) {
    case list["Users"]:
      eventName = "New Trial Signup";
      break;
    default:
      eventName = "New Subscriber";
      break;
  }

  return amplitude.track({
    eventType: eventName,
    userId: payload['contact[email]'],
    eventProperties: payload
  });

}

// exports.update = require('./update');
// exports.tagAdded = require('./contact-tag-added');
