export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export type TPayment = 'cash' | 'card';

export type TProductId = string;

export interface IProduct {
    id: TProductId;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IProductResponse {
    total: number;
    items: IProduct[];
}

export type ICreateOrderItem = TProductId;

export interface ICreateOrderRequest extends IBuyer {
    total: number;
    items: ICreateOrderItem[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}