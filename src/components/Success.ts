
import { Component } from './base/Component';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);

        this._description = container.querySelector(
            '.order-success__description'
        )!;
        this._closeButton = container.querySelector(
            '.order-success__close'
        )!;

        this._closeButton.addEventListener('click', onClose);
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}
