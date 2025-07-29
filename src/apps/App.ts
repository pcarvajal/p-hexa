import { asClass, asValue, AwilixContainer, createContainer } from 'awilix';

import { Config } from '@apps/Config';
import { IOC } from '@apps/ioc';
import { Server, ServerConfig } from '@apps/Server';

import { MongoClientConfig } from '@shared/infrastructure/mongodb/MongoClientConfig';
import { MongoClientFactory } from '@shared/infrastructure/mongodb/MongoClientFactory';
import { FetchRestClient } from '@shared/infrastructure/rest/FetchRestClient';

export class App {
  private readonly container: AwilixContainer;
  private readonly config: Config;
  private readonly contexts: string[];
  private readonly webServerEnabled: boolean;
  private readonly persistenceEnabled: boolean;

  constructor() {
    this.container = createContainer({ injectionMode: 'PROXY', strict: true });
    this.config = this.container
      .register({ config: asValue(Config) })
      .resolve('config');
    this.contexts = ['intention'];
    this.webServerEnabled = true;
    this.persistenceEnabled = true;
  }

  async start() {
    try {
      this.setupPersistence();
      this.setupRestClients();
      this.setupWebServer()?.listen(this.container);
      this.registerAppDependencies();
      console.log('App started successfully');
    } catch (error) {
      console.error('Error starting app:', error);
      throw error;
    }
  }

  private setupWebServer(): Server | undefined {
    if (!this.webServerEnabled) return;
    this.container.register({
      server: asClass(Server).singleton(),
      serverConfig: asValue<ServerConfig>({ port: 3000 }),
    });
    return this.container.resolve<Server>('server');
  }

  private setupPersistence(): void {
    if (!this.persistenceEnabled) return;
    this.container.register({
      mongoClientConfig: asValue<MongoClientConfig>({
        url: this.config.MONGO_URI,
      }),
      mongoClientFactory: asClass(MongoClientFactory).singleton(),
    });
    const factory =
      this.container.resolve<MongoClientFactory>('mongoClientFactory');
    this.contexts.forEach(context => factory.createClient(context));
  }

  private registerAppDependencies(): void {
    IOC(this.container);
  }

  private setupRestClients(): void {
    this.container.register({
      restClient: asClass(FetchRestClient).singleton(),
    });
  }
}
