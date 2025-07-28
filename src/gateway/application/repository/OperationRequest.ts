export interface OperationRequest {
  paymentId: string;
  total: number;
  currency: string;
  intentionId: string;
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}
