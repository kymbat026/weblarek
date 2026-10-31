
import { Component } from './base/Component';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._closeButton = container.querySelector('.modal__close')!;
        this._content = container.querySelector('.modal__content')!;

        this._closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
    }
}
