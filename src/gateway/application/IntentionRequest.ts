export interface IntentionRequest {
  id: string;
  paymentId: string;
  method: string;
  channel: string;
  commerce: string;
  money: { country: string; total: number; currency: string };
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    description: string | null;
  }[];
  country: string;
}
