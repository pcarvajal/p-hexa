import * as http from 'http';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { AwilixContainer } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-express';
import express, { Request, Response } from 'express';

export interface ServerConfig {
  port: number;
}

export class Server {
  private express: express.Express;
  private readonly serverConfig: ServerConfig;
  private httpServer?: http.Server;

  constructor({ serverConfig }: { serverConfig: ServerConfig }) {
    this.serverConfig = serverConfig;
    this.express = express();
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(
      (err: Error, req: Request, res: Response, next: Function) => {
        console.log(
          'Error occurred, express handler:',
          err,
          err.stack,
          err.name,
          err.message,
          err.stack,
        );
        res.status(500).send('Internal Server Error');
      },
    );
  }

  async listen(container: AwilixContainer): Promise<void> {
    // @ts-ignore
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    this.express.use(scopePerRequest(container));
    this.express.use(
      loadControllers('controllers/*Controller.ts', { cwd: __dirname }),
    );

    this.httpServer = this.express.listen(this.serverConfig.port, () =>
      console.log(`Server is listening on port ${this.serverConfig.port}`),
    );
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(err => {
          if (err) {
            console.error('Error stopping controllers:', err);
            reject(err);
          } else {
            console.log('Server stopped successfully');
            resolve();
          }
        });
      } else {
        console.warn('Server is not running, nothing to stop');
        resolve();
      }
    });
  }
}
