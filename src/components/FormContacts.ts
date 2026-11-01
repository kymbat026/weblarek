import { IEvents } from './base/Events';
import { IBuyer } from '../types';
import { Form } from './Form';

interface IFormContacts extends IBuyer {
    valid: boolean;
    errors: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;

        this._emailInput.addEventListener('input', () => {
    this.events.emit('email:changed', {
    email: this._emailInput.value,
});
});

        this._phoneInput.addEventListener('input', () => {
    this.events.emit('phone:changed', {
    phone: this._phoneInput.value,
});
});

        this.container.addEventListener('submit', (event) => {
    event.preventDefault();
    this.events.emit('order:finish');
});
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}
