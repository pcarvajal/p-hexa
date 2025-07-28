
import { RestClient } from '@shared/infrastructure/rest/RestClient';
import { Config } from '@apps/Config';
import { NotificationResponse } from '@gateway/application/repository/NotificationResponse';
import { NotificationTgrMapper } from '@gateway/infrastructure/rest/NotificationTgrMapper';
import { NotificationRequest } from '@gateway/application/repository/NotificationRequest';

export class NotificationTgrAdapter {
  private restClient: RestClient;
  private readonly config: Config;

  constructor({
    restClient,
    config,
  }: {
    restClient: RestClient;
    config: Config;
  }) {
    this.restClient = restClient;
    this.config = config;
  }

  async send(
    notificationRequest: NotificationRequest,
  ): Promise<NotificationResponse> {
    try {
      const { TGR_NOTIFY_PATH, TGR_API_URL } = this.config;

      const accessToken = await this.getAuth();
      const url = `${TGR_API_URL}${TGR_NOTIFY_PATH}`;
      const headers = this.buildHeaders(accessToken);

      const data = NotificationTgrMapper.toRequest(notificationRequest);

      const response = await this.restClient.post<{
        resultado: string;
        fechaRespuesta: string;
      }>(url, data, headers);

      return NotificationTgrMapper.toResponse(response);
    } catch (error) {
      console.error('Error sending notification:', error);
      return { sent: false, createdAt: new Date() } as NotificationResponse;
    }
  }

  private async getAuth(): Promise<string> {
    const {
      TGR_API_URL,
      TGR_API_AUTH_PATH,
      TGR_API_CLIENT_ID,
      TGR_API_CLIENT_SECRET,
    } = this.config;
    try {
      const url = `${TGR_API_URL}${TGR_API_AUTH_PATH}`;
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
      };

      const data = {
        client_id: TGR_API_CLIENT_ID,
        client_secret: TGR_API_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'ira/ext',
      };

      const response = await this.restClient.post<{ access_token: string }>(
        url,
        data,
        headers,
      );

      return response.access_token;
    } catch (error) {
      console.error('Error TGR getting auth:', error);
      throw error;
    }
  }

  private buildHeaders(accessToken: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }
}
