import { Intention } from "@gateway/domain/Intention";

export interface IntentionRepository {
    findById(id: string): Promise<Intention | null>;
    save(intention: Intention): Promise<void>;}