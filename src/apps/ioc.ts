import { asClass, asValue, AwilixContainer } from 'awilix';

import { ConfirmationCreator } from '@gateway/application/ConfirmationCreator';
import { IntentionCreator } from '@gateway/application/IntentionCreator';
import { MongoIntentionSchema } from '@gateway/infrastructure/MongoIntentionModel';
import { MongoIntentionRepository } from '@gateway/infrastructure/MongoIntentionRepository';
import { NotificationClient } from '@gateway/infrastructure/rest/NotificationClient';
import { NotificationTgrAdapter } from '@gateway/infrastructure/rest/NotificationTgrAdapter';
import { NotificationTgrMapper } from '@gateway/infrastructure/rest/NotificationTgrMapper';
import { PspRestAdapter } from '@gateway/infrastructure/rest/PspRestAdapter';
import { PspRestMapper } from '@gateway/infrastructure/rest/PspRestMapper';
import { PspTransactionSchema } from '@gateway/infrastructure/rest/PspRestSchema';

export const IOC = (container: AwilixContainer) => {
  container.register({
    notificationTgrMapper: asClass(NotificationTgrMapper),
    notificationTgrAdapter: asClass(NotificationTgrAdapter),
    notificationClient: asClass(NotificationClient),
    confirmationCreator: asClass(ConfirmationCreator),
    pspTransactionSchema: asValue(PspTransactionSchema),
    pspRestMapper: asClass(PspRestMapper),
    operationRepository: asClass(PspRestAdapter),
    intentionCreator: asClass(IntentionCreator),
    mongoIntentionSchema: asValue(MongoIntentionSchema),
    intentionRepository: asClass(MongoIntentionRepository),
  });
};
