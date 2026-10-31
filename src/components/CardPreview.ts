
import { IProduct } from '../types';
import { Card } from './Card';
import { CDN_URL } from '../utils/constants';

export class CardPreview extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this._category = container.querySelector('.card__category')!;
        this._image = container.querySelector('.card__image')!;
        this._description = container.querySelector('.card__text')!;
        this._button = container.querySelector('.card__button')!;

        this._button.addEventListener('click', onClick);
    }

    set category(value: string) {
        this._category.textContent = value;
    }

    set image(value: string) {
        this.setImage(
            this._image,
            `${CDN_URL}${value}`,
            this._title.textContent ?? ''
        );
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;
        this._button.disabled = value === null;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }
}
