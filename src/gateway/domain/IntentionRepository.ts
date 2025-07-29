import { Intention } from "@gateway/domain/Intention";
import { Nullable } from '@shared/domain/nullable';
import { IntentionId } from '@gateway/domain/IntentionId';

export interface IntentionRepository {
    findByPaymentIdAndCommerce(requestPaymentId: string, commerce: string): Promise<Nullable<Intention>>;
    findById(intentionId: IntentionId): Promise<Nullable<Intention>>;
    save(intention: Intention): Promise<void>;}