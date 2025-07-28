import { z } from 'zod/v4';

export const ApiEnvSchema = z.object({
  API_PREFIX: z
    .string()
    .meta({
      title: 'Api prefix',
      description: 'Base path for the api',
      example: '/v1',
    }),
  API_UI_PATH: z
    .string()
    .meta({
      title: 'Api ui path',
      description: 'Path for OpenAPI UI, for example, scalar or swagger',
      example: '/docs',
    }),
  API_VERSION: z
    .string()
    .meta({
      title: 'Api version',
      description: 'API semantic version',
      example: '0.0.1',
    }),
  API_TITLE: z
    .string()
    .meta({
      title: 'Api title',
      description: 'API title',
      example: 'Portals API',
    }),
  API_CONTACT_NAME: z
    .string()
    .meta({
      title: 'Api contact',
      description: 'API contact name',
      example: 'Rodrigo Gúzman',
    }),
  API_CONTACT_EMAIL: z
    .email()
    .meta({
      title: 'Api contact',
      description: 'API contact email',
      example: 'raguzmanm@falabella.cl',
    }),
  API_CONTACT_URL: z
    .url()
    .meta({
      title: 'Api contact',
      description: 'API contact URL',
      example: 'https://fif.tech',
    }),
});

export const BaseEnvSchema = z.object({
  ENV_NAME: z
    .enum(['dev', 'int', 'qa', 'prod'])
    .default('dev')
    .meta({ title: 'Environment', description: 'Payments environment name' }),
  ENV_RUNTIME: z
    .enum(['node', 'bun', 'browser'])
    .default('node')
    .meta({ title: 'Runtime', description: 'Javascript runtime' }),
  LOG_SERVICE_NAME: z
    .string()
    .default('fif-payments-payments-gateway-service')
    .meta({ title: 'Service name', description: 'Payments service name' }),
  LOG_IS_EXPRESS: z
    .stringbool()
    .default(true)
    .meta({
      title: 'Express schemas',
      description: 'Is the schemas an express schemas?',
    }),
  LOG_TO_FILE: z
    .stringbool()
    .default(true)
    .meta({ title: 'Log file', description: 'Is the log file enabled?' }),
  LOG_NAME_SPACE: z
    .string()
    .default('fif')
    .meta({ title: 'Namespace', description: 'Log namespace' }),
  LOG_PATH: z
    .string()
    .default('./logs')
    .meta({ title: 'Log path', description: 'Project log path' }),
  LOG_FILE_NAME: z
    .string()
    .default('fif-payments-payments-gateway-service.log')
    .meta({ title: 'Log file name', description: 'File name for logs' }),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('debug')
    .meta({ title: 'Log level', description: 'Log level' }),
  APP_NAME: z
    .string()
    .default('fif-payments-payments-gateway-service')
    .meta({ title: 'App name', description: 'Payments app name' }),
  APP_COUNTRY: z
    .enum(['cl', 'pe', 'co'])
    .default('cl')
    .meta({ title: 'App country', description: 'Payments app country' }),
});

export const IntentionSchema = z.object({
  PSP_CANCEL_URL: z
    .url()
    .meta({
      title: 'PSP cancel URL',
      description: 'URL to redirect when the payment is cancelled',
      example: 'https://example.com/cancel',
    }),
  PSP_RETURN_URL: z
    .url()
    .meta({
      title: 'PSP return URL',
      description: 'URL to redirect when the payment is successful',
      example: 'https://example.com/success',
    }),
  PSP_NOTIFY_URL: z
    .url()
    .meta({
      title: 'PSP notification URL',
      description: 'URL to notify the PSP about the transaction status',
      example: 'https://example.com/notify',
    }),
  PSP_API_URL: z
    .url()
    .meta({
      title: 'PSP API URL',
      description: 'Base URL for the PSP API',
      example: 'https://api.example.com',
    }),
  PSP_API_CLIENT_ID: z
    .string()
    .meta({
      title: 'PSP API Client ID',
      description: 'Client ID for the PSP API authentication',
      example: 'your-client-id',
    }),
  PSP_API_CLIENT_SECRET: z
    .string()
    .meta({
      title: 'PSP API Client Secret',
      description: 'Client secret for the PSP API authentication',
      example: 'your-client-secret',
    }),
  PSP_API_AUTH_PATH: z
    .string()
    .meta({
      title: 'PSP API Auth Path',
      description: 'Path for the PSP API authentication endpoint',
      example: '/auth/token',
    }),
  PSP_API_CREATE_TRANSACTION_PATH: z
    .string()
    .meta({
      title: 'PSP API Create Transaction Path',
      description: 'Path for the PSP API create transaction endpoint',
      example: '/transactions/create',
    }),
});

export const MongoEnvSchema = z.object({
  MONGO_URI: z
    .url()
    .meta({
      title: 'MongoDB uri',
      description: 'MongoDB uri for connection',
      example: 'mongodb://localhost:27017/',
    }),
  MONGO_DB_NAME: z
    .string()
    .meta({
      title: 'MongoDB database name',
      description: 'Mongo database name to connect',
      example: 'payments',
    }),
});

export const NotificationEnvSchema = z.object({
  TGR_API_URL: z
    .url()
    .meta({
      title: 'TGR API URL',
      description: 'Base URL for the TGR API',
      example: 'https://api.example.com',
    }),
  TGR_NOTIFY_PATH: z
    .string()
    .meta({
      title: 'TGR notification URL',
      description: 'URL to notify the TGR about the transaction status',
      example: '/notify',
    }),
  TGR_API_CLIENT_ID: z
    .string()
    .meta({
      title: 'TGR API Client ID',
      description: 'Client ID for the TGR API authentication',
      example: 'your-client-id',
    }),
  TGR_API_CLIENT_SECRET: z
    .string()
    .meta({
      title: 'TGR API Client Secret',
      description: 'Client secret for the TGR API authentication',
      example: 'your-client-secret',
    }),
  TGR_API_AUTH_PATH: z
    .string()
    .meta({
      title: 'TGR API Auth Path',
      description: 'Path for the TGR API authentication endpoint',
      example: '/auth/token',
    }),
});

export const ServerEnvSchema = z.object({
  SERVER_HOST: z
    .string()
    .meta({
      title: 'Hostname',
      description: 'Name of host',
      example: 'localhost',
    }),
  SERVER_PORT: z.coerce
    .number()
    .meta({
      title: 'Port number',
      description: 'Port server number',
      example: 3000,
    }),
  SERVER_PROTOCOL: z
    .enum(['http', 'https'])
    .meta({
      title: 'Protocol',
      description: 'Server protocol',
      example: 'http',
    }),
});

export const MergedConfigSchema = BaseEnvSchema.extend(ApiEnvSchema.shape)
  .extend(MongoEnvSchema.shape)
  .extend(ServerEnvSchema.shape)
  .extend(IntentionSchema.shape)
  .extend(NotificationEnvSchema.shape);

const configValues = MergedConfigSchema.safeParse(process.env);

if (configValues.error) {
  throw new Error(
    `Config validation error: ${z.prettifyError(configValues.error)}`,
  );
}

export type Config = z.infer<typeof MergedConfigSchema>;
export const Config: Config = configValues.data;
