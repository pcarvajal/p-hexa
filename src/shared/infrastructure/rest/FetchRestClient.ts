import { RestClient } from '@shared/infrastructure/rest/RestClient';

export class FetchRestClient implements RestClient {
  constructor() {}

  async delete<T>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(params),
    });
    if (response.ok) {
      return (await response.json()) as Promise<T>;
    }
    const errorText = await response.text();
    throw new Error(
      `Error in DELETE request: ${response.status} - ${errorText}`,
    );
  }

  async get<T>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await fetch(url, { method: 'GET', headers: headers });
    if (response.ok) {
      return (await response.json()) as Promise<T>;
    }
    const errorText = await response.text();
    throw new Error(`Error in GET request: ${response.status} - ${errorText}`);
  }

  async post<T>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ): Promise<T> {
    const isForm =
      headers?.['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8';

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: isForm
        ? new URLSearchParams(params as any)
        : JSON.stringify(params),
    });
    if (response.ok) {
      return (await response.json()) as Promise<T>;
    }
    const errorText = await response.text();
    throw new Error(`Error in POST request: ${response.status} - ${errorText}`);
  }

  async put<T>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(params),
    });
    if (response.ok) {
      return (await response.json()) as Promise<T>;
    }
    const errorText = await response.text();
    throw new Error(`Error in PUT request: ${response.status} - ${errorText}`);
  }
}
