export class Item {
  private readonly sku: string;
  private readonly name: string;
  private readonly quantity: number;
  private readonly price: number;
  private readonly total: number;
  private readonly description: string | null;

  constructor({
    sku,
    name,
    quantity,
    price,
    total,
    description
  }:{
    sku: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    description: string | null;
  }) {
    this.sku = sku;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.total = total;
    this.description = description;
  }

  toScalars() {
    return {
      sku: this.sku,
      name: this.name,
      quantity: this.quantity,
      price: this.price,
      total: this.total,
      description: this.description
    };
  }

  static fromScalars(scalars: ItemScalars): Item {
    return new Item({ ...scalars });
  }
}

export type ItemScalars = ReturnType<Item['toScalars']>;
