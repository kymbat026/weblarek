
import { Component } from './base/Component';

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent =
            value === null ? 'Недоступно' : `${value} синапсов`;
    }
}
