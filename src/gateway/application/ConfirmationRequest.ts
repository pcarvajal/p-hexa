export interface ConfirmationRequest {
  paymentId: string;
  intentionId: string;
  commerce: string;
  total: number;
  currency: string;
  state?: string;
}
