
import { Component } from './base/Component';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errors = container.querySelector('.form__errors')!;

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }
}
