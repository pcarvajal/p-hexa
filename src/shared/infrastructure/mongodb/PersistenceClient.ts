import type { Connection } from 'mongoose';

export interface PersistenceClient<T> {
  createClient(contextName: string): Promise<T>;
  getClient(contextName: string): Connection | null;
}
