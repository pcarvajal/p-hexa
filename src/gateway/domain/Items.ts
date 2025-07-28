import { Item } from '@gateway/domain/Item';

export class Items {
  public readonly value: Item[];
  constructor({ value}: { value: {
      sku: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
      description: string | null;
    }[] }) {
    this.value = value.map(item => new Item({ ...item }));
  }

  toScalars() {
    return this.value.map((item: Item) => ({ ...item.toScalars()}));
  }

  static fromScalars(scalars: ItemsScalars): Items {
    return new Items({ value: scalars });
  }
}

export type ItemsScalars = ReturnType<Items['toScalars']>;
