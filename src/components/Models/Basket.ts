import { IProduct } from '../../types';

export class Basket {
  private products: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  removeProduct(id: string): void {
    this.products = this.products.filter((product) => product.id !== id);
  }

  clear(): void {
    this.products = [];
  }

  getTotal(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.products.length;
  }

  hasProduct(id: string): boolean {
    return this.products.some((product) => product.id === id);
  }
}