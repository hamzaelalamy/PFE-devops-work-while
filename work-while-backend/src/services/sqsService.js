const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');

const region = process.env.AWS_REGION || 'us-east-1';
const queueUrl = process.env.SQS_QUEUE_URL;

const sqsClient = new SQSClient({ region });

async function sendApplicationMessage(payload) {
  if (!queueUrl) {
    // In dev or misconfigured environments, skip silently but log once
    // eslint-disable-next-line no-console
    console.warn('SQS_QUEUE_URL not set, skipping sendApplicationMessage');
    return;
  }

  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload),
  });

  await sqsClient.send(command);
}

module.exports = {
  sqsClient,
  sendApplicationMessage,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  QUEUE_URL: queueUrl,
};

