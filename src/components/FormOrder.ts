
import { IBuyer, TPayment } from '../types';
import { Form } from './Form';
import { IEvents } from './base/Events';

interface IFormOrder extends IBuyer {
    valid: boolean;
    errors: string;
}

export class FormOrder extends Form<IFormOrder> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._paymentButtons = Array.from(
            container.querySelectorAll<HTMLButtonElement>('.order__buttons button')
        );
        this._addressInput = container.querySelector('input[name="address"]')!;

        this._paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const payment = button.name as TPayment;
        this.payment = payment;
        this.events.emit('payment:changed', { payment });
    });
});
      

       this._addressInput.addEventListener('input', () => {
    this.events.emit('address:changed', {
    address: this._addressInput.value,
});});

        this.container.addEventListener('submit', (event) => {
    event.preventDefault();
    this.events.emit('order:submit');
});
    }

    set payment(value: TPayment) {
        this._paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}
