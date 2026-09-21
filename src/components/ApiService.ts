import {
    ICreateOrderRequest,
    IOrderResponse,
    IProductResponse,
    IApi,
} from '../types';

export class ApiService {
    constructor(private api: IApi) {}

    getProducts(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>('/product/');
    }

    createOrder(order: ICreateOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}