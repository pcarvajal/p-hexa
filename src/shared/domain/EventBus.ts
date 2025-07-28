import { DomainEventSubscriber } from '@shared/domain/DomainEventSubscriber';

import { DomainEvent } from './DomainEvent';

export interface EventBus {
  publish(events: Array<DomainEvent>): Promise<void>;
  addSubscribers(domainEventSubscribers: Array<DomainEventSubscriber>): void;
}
