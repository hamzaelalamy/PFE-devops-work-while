require('dotenv').config();

const {
  sqsClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  QUEUE_URL,
} = require('../services/sqsService');
const logger = require('../utils/logger');

if (!QUEUE_URL) {
  throw new Error('SQS_QUEUE_URL is not set for SQS worker');
}

async function handleMessage(message) {
  const body = JSON.parse(message.Body);

  logger.info('[SQS] Received message', {
    messageId: message.MessageId,
    type: body.type,
  });

  if (body.type === 'APPLICATION_CREATED') {
    logger.info('[SQS] Processing APPLICATION_CREATED', {
      applicationId: body.applicationId,
      jobId: body.jobId,
      applicantId: body.applicantId,
    });

    // Place for heavy/async processing: emails, analytics, etc.
  }
}

async function poll() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response = await sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: QUEUE_URL,
          MaxNumberOfMessages: 5,
          WaitTimeSeconds: 20,
          VisibilityTimeout: 30,
        }),
      );

      const messages = response.Messages || [];

      if (!messages.length) {
        // No messages, loop again
        continue;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const message of messages) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await handleMessage(message);

          // eslint-disable-next-line no-await-in-loop
          await sqsClient.send(
            new DeleteMessageCommand({
              QueueUrl: QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
        } catch (err) {
          logger.error('[SQS] Error processing message', {
            error: err.message,
            stack: err.stack,
          });
          // Do not delete message → will go to DLQ after maxReceiveCount
        }
      }
    } catch (err) {
      logger.error('[SQS] Polling error', {
        error: err.message,
        stack: err.stack,
      });

      // Backoff on error
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

poll().catch((err) => {
  logger.error('[SQS] Fatal worker error', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

