import mongoose, { Connection } from 'mongoose';

import { PersistenceClient } from '@shared/infrastructure/mongodb/PersistenceClient';

import { MongoClientConfig } from './MongoClientConfig';

export class MongoClientFactory implements PersistenceClient<Connection> {
  private readonly mongoClientConfig: MongoClientConfig;
  private readonly clients: { [key: string]: Connection };

  constructor({ mongoClientConfig }: { mongoClientConfig: MongoClientConfig }) {
    this.clients = {};
    this.mongoClientConfig = mongoClientConfig;
  }

  async createClient(contextName: string): Promise<Connection> {
    let client = this.clients[contextName];

    if (!client) {
      client = mongoose.createConnection(this.mongoClientConfig.url, {
        ignoreUndefined: true,
      });
      console.log(
        `New client for context: ${contextName} in connection`,
      );

      this.clients[contextName] = client;
    }

    return client;
  }

  getClient(contextName: string): Connection | null {
    return this.clients[contextName] ?? null;
  }
}
