import { Document, Schema } from 'mongoose';

interface IMongoNotification extends Document {
  state: string;
  createdAt: Date;
}

interface IMongoConfirmation extends Document {
  state: string;
  createdAt: Date;
}

interface IMongoOperation extends Document {
  pspId: string;
  callbackUrl: string;
  createdAt: Date;
}

interface IMongoIntentionItem extends Document {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  description: string | null;
}

interface IMongoIntention extends Document {
  _id: Schema.Types.UUID;
  requestPaymentId: string;
  method: string;
  channel: string;
  commerce: string;
  items: IMongoIntentionItem[];
  money: { country: string; total: number; currency: string };
  country: string;
  notification: IMongoNotification | null;
  operation: IMongoOperation | null;
  confirmation: IMongoConfirmation | null;
  updatedAt: Date;
  createdAt: Date;
}

const MongoNotificationSchema: Schema<IMongoNotification> = new Schema(
  {
    state: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const MongoConfirmationSchema: Schema<IMongoConfirmation> = new Schema(
  {
    state: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const MongoOperationSchema: Schema<IMongoOperation> = new Schema(
  {
    pspId: { type: String, required: true },
    callbackUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const MongoIntentionItemSchema: Schema<IMongoIntentionItem> = new Schema(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    description: { type: String, required: false },
  },
  { _id: false },
);

const MongoIntentionSchema: Schema<IMongoIntention> = new Schema(
  {
    _id: { type: Schema.Types.UUID, required: true },
    requestPaymentId: { type: String, required: true },
    method: { type: String, required: true },
    channel: { type: String, required: true },
    commerce: { type: String, required: true },
    items: { type: [MongoIntentionItemSchema], required: true },
    money: {
      country: { type: String, required: true },
      total: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    country: { type: String, required: true },
    notification: { type: MongoNotificationSchema, required: false },
    operation: { type: MongoOperationSchema, required: false },
    confirmation: { type: MongoConfirmationSchema, required: false },
    updatedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false }
);

export { MongoIntentionSchema };
export type { IMongoIntention };

