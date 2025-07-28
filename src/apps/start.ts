import 'dotenv/config';

import { App } from '@apps/App';

const run = async () => {
  await new App().start();
};

run().then(r => console.log('Application started successfully'));
