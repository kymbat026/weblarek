
import { Component } from './base/Component';


interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);

        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._checkoutButton = container.querySelector('.basket__button')!;

        this._checkoutButton.addEventListener('click', onCheckout);
    }

    set items(value: HTMLElement[]) {
    this._list.replaceChildren(...value);
}

    set buttonDisabled(value: boolean) {
    this._checkoutButton.disabled = value;
}

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }
}
