import { Intention } from "@gateway/domain/Intention";
import { IntentionRepository } from "@gateway/domain/IntentionRepository";

export class IntentionCreator {
    private readonly intentionRepository: IntentionRepository;

    constructor(intentionRepository: IntentionRepository) {
        this.intentionRepository = intentionRepository;
    }

    async createIntention(data: any): Promise<void> {}
}