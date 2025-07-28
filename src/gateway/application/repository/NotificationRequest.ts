export interface NotificationRequest {
  paymentId: string;
  intentionId: string;
  intentionState?: string;
  paymentCommerce: string;
  paymentCurrency: string;
  paymentTotal: number;
  createdAt: Date;
}
