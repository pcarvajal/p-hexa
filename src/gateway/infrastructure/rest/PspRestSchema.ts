import { z } from 'zod/v4';

const DetailsSchema = z.object({
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  shipping_discount: z.number(),
});

const AmountSchema = z.object({
  currency: z.string(),
  total: z.number(),
  details: DetailsSchema,
  installments_number: z.number(),
  deferred_months_number: z.number(),
  without_interest: z.boolean(),
});

const ItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
  tax: z.number(),
  item_id: z.string(),
});

const ItemListSchema = z.object({
  shipping_method: z.string(),
  items: z.array(ItemSchema),
});

const RiskAdditionalAttributesSchema = z.object({
  captured_card_days: z.number(),
  transaction_related_merchant: z.string(),
});

const TransactionSchema = z.object({
  purchase_order: z.string(),
  reconciliation_id: z.string(),
  merchant_unique_id: z.string(),
  description: z.string(),
  soft_descriptor: z.string(),
  invoice_type: z.string().optional(),
  terminal_id: z.string(),
  store_id: z.string(),
  fpay_calculate_tax_subtotal: z.boolean(),
  amount: AmountSchema,
  item_list: ItemListSchema,
  promotions: z.array(z.any()),
  risk_additional_attributes: RiskAdditionalAttributesSchema,
  entry_mode: z.string(),
  aggregation_code: z.string(),
});

const BuyerSchema = z.object({
  country: z.string(),
  document_number: z.string(),
  document_type: z.string(),
});

const TgrSchema = z.object({ idOperacion: z.string() });

const AdditionalAttributesSchema = z.object({ tgr: TgrSchema });

const RedirectUrlsSchema = z.object({
  return_url: z.string(),
  cancel_url: z.string(),
  adapter_notification_url: z.string(),
});

const LinkSchema = z.object({
  href: z.string(),
  rel: z.string(),
  method: z.string(),
  security: z.array(z.string()).optional(),
});

export const PspTransactionSchema = z.object({
  intent: z.string(),
  payment_method: z.string(),
  buyer: BuyerSchema,
  transaction: TransactionSchema,
  application: z.string().optional(),
  state: z.string().optional(),
  additional_attributes: AdditionalAttributesSchema,
  redirect_urls: RedirectUrlsSchema,
  timesMutated: z.number().optional(),
  _id: z.string().optional(),
  invoice_number: z.string().optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional(),
  links: z.array(LinkSchema).optional(),
  expiration_date: z.string().optional(),
  fpay_merchant_id: z.string().optional(),
  id: z.string().optional(),
});

export type PspTransaction = z.infer<typeof PspTransactionSchema>;
