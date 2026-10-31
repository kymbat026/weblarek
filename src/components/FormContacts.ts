
import { IBuyer } from '../types';
import { Form } from './Form';

interface IFormContacts extends IBuyer {
    valid: boolean;
    errors: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, onSubmit: () => void) {
        super(container);

        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;

        this._emailInput.addEventListener('input', () => {
            this.container.dispatchEvent(
                new CustomEvent('email:changed', {
                    detail: this._emailInput.value,
                })
            );
        });

        this._phoneInput.addEventListener('input', () => {
            this.container.dispatchEvent(
                new CustomEvent('phone:changed', {
                    detail: this._phoneInput.value,
                })
            );
        });

        this.container.addEventListener('submit', () => {
            onSubmit();
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}
