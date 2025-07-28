export interface RestClient {
  get: <T extends object>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ) => Promise<T>;
  post: <T extends object>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ) => Promise<T>;
  put: <T extends object>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ) => Promise<T>;
  delete: <T extends object>(
    url: string,
    params: object,
    headers?: Record<string, string>,
  ) => Promise<T>;
}
