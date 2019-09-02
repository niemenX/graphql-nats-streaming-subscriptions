import { Stan, Subscription } from 'node-nats-streaming'
import { PubSubEngine } from 'graphql-subscriptions'
import { PubSubAsyncIterator } from './pubsub-async-iterator'

export class NatsPubSub implements PubSubEngine {
  private nats: Stan
  private subscriptions: Subscription[];

  constructor(stan: Stan) {
    this.nats = stan;
    this.subscriptions = [];
  }

  public async publish(subject: string, payload: any): Promise<void> {
    await this.nats.publish(subject, JSON.stringify(payload));
  }

  public async subscribe(subject: string, onMessage: Function): Promise<number> {
    const subscription = await this.nats.subscribe(subject);
    subscription.on('message', msg => onMessage(JSON.parse(msg.getData())));
    this.subscriptions.push(subscription);
    return Promise.resolve(this.subscriptions.length);
  }

  public unsubscribe(sid: number) {
    const subscription = this.subscriptions[sid];
    if (subscription) {
      subscription.unsubscribe()
    }
  }

  public asyncIterator<T>(subjects: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, subjects)
  }
}
