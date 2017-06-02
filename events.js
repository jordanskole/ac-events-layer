'use strict';

const querystring = require('querystring');
const eventList = require('./ac-events');

module.exports.catch = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    })
  };
  let webhookBody = querystring.parse(event.body);
  console.log(JSON.stringify(webhookBody));

  // I am doing switch wrong. This should drop into default probably

  switch (webhookBody.type) {    
    // case 'subscribe':
    // case 'unsubscribe':
    // case 'sent':
    // case 'reply':
    // case 'forward':
    // case 'click':
    // case 'share': // contact added
    //   eventList
    //     .default(webhookBody.type, webhookBody)
    //     .then(() => {
    //       console.log('Event Success');
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    //   break;
    
    // case 'click':
    //   break;
    
    
    case 'open':
      eventList
        .campaignOpen(webhookBody)
        .then(() => {
          console.log('Open event success');
        })
        .catch((err) => {
          console.error(err);
        });
      break;
      
    case 'click': 
      eventList
        .campaignClick(webhookBody)
        .then(() => {
          console.log('Click event success');
        })
        .catch((err) => {
          console.error(err);
        })
      break;

    // case 'subscribe':
    //   eventList
    //     .subscribe(webhookBody)
    //     .then(() => {
    //       console.log('Subscribe event success');
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    //   break;
    case 'update':
      break;
    case 'deal_task_complete':
      break;
    case 'contact_tag_added':
      break;

    default:
      console.log('undefined type');
      break;
  }

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
