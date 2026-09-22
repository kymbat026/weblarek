import { IProduct, TProductId } from '../../types';

export class Catalog {
    private products: IProduct[] = [];

    private selectedProduct: IProduct | null = null;

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProduct(id: TProductId): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}