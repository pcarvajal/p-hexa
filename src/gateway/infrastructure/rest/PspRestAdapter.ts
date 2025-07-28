

import { RestClient } from '@shared/infrastructure/rest/RestClient';
import { OperationRepository } from '@gateway/application/repository/OperationRepository';
import { Config } from '@apps/Config';
import { PspRestMapper } from '@gateway/infrastructure/rest/PspRestMapper';
import { OperationRequest } from '@gateway/application/repository/OperationRequest';
import { OperationResponse } from '@gateway/application/repository/OperationResponse';
import { PspTransaction } from '@gateway/infrastructure/rest/PspRestSchema';

export class PspRestAdapter implements OperationRepository {
  private readonly restClient: RestClient;
  private readonly config: Config;
  private readonly pspRestMapper: PspRestMapper;
  private readonly baseUrl: string;

  constructor({
    restClient,
    config,
    pspRestMapper,
  }: {
    restClient: RestClient;
    config: Config;
    pspRestMapper: PspRestMapper;
  }) {
    this.restClient = restClient;
    this.config = config;
    this.pspRestMapper = pspRestMapper;
    this.baseUrl = this.config.PSP_API_URL;
  }

  async create(operationRequest: OperationRequest): Promise<OperationResponse> {
    const token = await this.getToken();
    const url = `${this.baseUrl}${this.config.PSP_API_CREATE_TRANSACTION_PATH}`;

    const response = await this.restClient.post<PspTransaction>(
      url,
      this.pspRestMapper.toRequest(operationRequest),
      this.buildHeaders('request', token.token),
    );

    return this.pspRestMapper.toResponse(response);
  }

  private async getToken(): Promise<{ token: string }> {
    const headers = this.buildHeaders('auth');
    const url = `${this.baseUrl}${this.config.PSP_API_AUTH_PATH}`;
    const body = { grant_type: 'client_credentials' };
    const response = await this.restClient.post<{ access_token: string }>(
      url,
      body,
      headers,
    );

    return { token: response.access_token };
  }

  private buildHeaders(
    type: 'auth' | 'request',
    token?: string,
  ): Record<string, string> {
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'fp-flow-country': this.config.APP_COUNTRY,
    };

    if (type === 'auth') {
      return {
        ...headers,
        Authorization: `Basic ${this.config.PSP_API_CLIENT_ID}:${this.config.PSP_API_CLIENT_SECRET}`,
      };
    }

    if (type === 'request' && token) {
      return { ...headers, Authorization: `Bearer ${token}` };
    }

    throw new Error(`Invalid auth type: ${type} or missing token`);
  }
}
