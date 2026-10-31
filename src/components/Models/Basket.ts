
import { IProduct, TProductId } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private products: IProduct[] = [];

    constructor(private events: IEvents) {}

    getProducts(): IProduct[] {
        return this.products;
    }

    addProduct(product: IProduct): void {
        this.products.push(product);
        this.events.emit('basket:changed');
    }

    removeProduct(id: TProductId): void {
        this.products = this.products.filter((product) => product.id !== id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.products = [];
        this.events.emit('basket:changed');
    }

    getTotal(): number {
        return this.products.reduce((total, product) => {
            return total + (product.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this.products.length;
    }

    hasProduct(id: TProductId): boolean {
        return this.products.some((product) => product.id === id);
    }
}
