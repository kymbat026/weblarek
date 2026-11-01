import { IProduct } from '../types';
import { Card } from './Card';
import { categoryMap } from '../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this._category = container.querySelector('.card__category')!;
        this._image = container.querySelector('.card__image')!;
        this.container.addEventListener('click', onClick);
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

set image(value: { src: string; alt: string }) {
    this.setImage(this._image, value.src, value.alt);
}
}
