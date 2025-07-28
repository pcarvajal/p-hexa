import { Config } from "@apps/Config";
import { Server, ServerConfig } from "@apps/Server";
import { asClass, asValue, AwilixContainer, createContainer } from "awilix";

export class App {
  private readonly container: AwilixContainer;
  private readonly config: Config;
    private readonly webServerEnabled: boolean;


  constructor() {
    this.container = createContainer({ injectionMode: 'PROXY', strict:true });
    this.config = this.container.register({ config:asValue(Config) }).resolve("config");
    this.webServerEnabled = true;
  }

    async start() {
        try{
            this.setupWebServer()?.listen(this.container)
            console.log('App started successfully');
        }catch (error) {
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
}
