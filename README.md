# graphql-nats-streaming-subscriptions

This package implements the PubSubEngine Interface from the graphql-subscriptions package and also the new AsyncIterator interface. It allows you to connect your subscriptions manger to a nats streaming based Pub Sub mechanism to support multiple subscription manager instances.

## Usage

```javascript
const { NatsPubSub } = require('@niemen/graphql-nats-streaming-subscriptions');
const { connect } = require('node-nats-streaming');

const NATS_CLUSTER = 'faas-cluster';
const CLIENT_ID = 'streaming-client';
const NATS_URL = 'nats://nats.io:4222';

const client = connect(NATS_CLUSTER, CLIENT_ID, { url: NATS_URL });
const pubSub = new NatsPubSub(client);

const resolver = {
     Subscription: {
        NatsStreaming: {
            resolve: (msg) => {
                //get message data
                const data = msg;
                return msg;
            },
            subscribe: () => pubSub.asyncIterator(['topic1', 'topice2'])
        }
    }
}
// for more options see: https://github.com/nats-io/stan.js
```
