import { IProduct, TPayment } from '../types';
import { IEvents } from './base/Events';
import { Catalog } from './Models/Catalog';
import { Basket } from './Models/Basket';
import { Buyer } from './Models/Buyer';
import { Page } from './page';
import { CardCatalog } from './CardCatalog';
import { Modal } from './Modal';
import { CardPreview } from './CardPreview';
import { BasketView } from './BasketView';
import { CardBasket } from './CardBasket';
import { ApiService } from './ApiService';
import { FormOrder } from './FormOrder';
import { FormContacts } from './FormContacts';
import { Success } from './Success';
import { ICreateOrderRequest } from '../types';

export class Presenter {
   constructor(
    private events: IEvents,
    private catalog: Catalog,
    private basket: Basket,
private buyer: Buyer,
private apiService: ApiService,
private page: Page,
private modal: Modal
) {
    this.events.on('catalog:changed', () => {
        this.renderCatalog();
    });

    this.events.on('basket:changed', () => {
    this.page.counter = this.basket.getCount();
});

this.events.on('basket:open', () => {
    this.renderBasket();
});

this.events.on('basket:checkout', () => {
    this.renderOrderForm();
});
this.events.on('order:submit', () => {
    this.renderContactsForm();
});


this.events.on('order:finish', () => {
    this.submitOrder();
});

  this.events.on('card:select', (product: IProduct) => {
    this.catalog.setSelectedProduct(product);

    const template = document.querySelector(
        '#card-preview'
    ) as HTMLTemplateElement;

    const cardElement = template.content
        .querySelector('.card')!
        .cloneNode(true) as HTMLElement;

    const card = new CardPreview(cardElement, () => {
        if (this.basket.hasProduct(product.id)) {
            this.basket.removeProduct(product.id);
        } else {
            this.basket.addProduct(product);
        }

        this.modal.close();
    });

    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    card.description = product.description;

    if (product.price === null) {
        card.buttonText = 'Недоступно';
    } else if (this.basket.hasProduct(product.id)) {
        card.buttonText = 'Удалить из корзины';
    } else {
        card.buttonText = 'Купить';
    }

    this.modal.content = card.render();
    this.modal.open();
});

}
private renderBasket(): void {
    const template = document.querySelector(
        '#basket'
    ) as HTMLTemplateElement;

    const basketElement = template.content
        .querySelector('.basket')!
        .cloneNode(true) as HTMLElement;

    const basketView = new BasketView(basketElement, () => {
        this.events.emit('basket:checkout');
    });

    const cardTemplate = document.querySelector(
        '#card-basket'
    ) as HTMLTemplateElement;

    const items = this.basket.getProducts().map((product, index) => {
        const cardElement = cardTemplate.content
            .querySelector('.basket__item')!
            .cloneNode(true) as HTMLElement;

        const card = new CardBasket(cardElement, () => {
            this.basket.removeProduct(product.id);
            this.renderBasket();
        });

        card.title = product.title;
        card.price = product.price;
        card.index = index + 1;

        return card.render();
    });

    basketView.items = items;
    basketView.total = this.basket.getTotal();

    this.modal.content = basketView.render();
    this.modal.open();
}
private renderOrderForm(): void {
    const template = document.querySelector(
        '#order'
    ) as HTMLTemplateElement;

    const formElement = template.content
        .querySelector('form')!
        .cloneNode(true) as HTMLFormElement;

    const form = new FormOrder(formElement, () => {
        this.events.emit('order:submit');
    });

    const updateValidity = () => {
    const buyer = this.buyer.getBuyer();
    const errors: string[] = [];

    if (!buyer.payment) {
        errors.push('Выберите способ оплаты');
    }

    if (!buyer.address.trim()) {
        errors.push('Введите адрес доставки');
    }

    form.errors = errors.join('. ');
    form.valid = errors.length === 0;

};

formElement.addEventListener('payment:changed', (event) => {
    const payment = (event as CustomEvent<TPayment>).detail;
    this.buyer.setPayment(payment);
    updateValidity();
});

formElement.addEventListener('address:changed', (event) => {
    const address = (event as CustomEvent<string>).detail;
    this.buyer.setAddress(address);
    updateValidity();
});

    const buyer = this.buyer.getBuyer();

    if (buyer.payment) {
        form.payment = buyer.payment;
    }

    form.address = buyer.address;
    updateValidity();
   

    this.modal.content = form.render();
    this.modal.open();
}


private renderContactsForm(): void {
    const template = document.querySelector(
        '#contacts'
    ) as HTMLTemplateElement;

    const formElement = template.content
        .querySelector('form')!
        .cloneNode(true) as HTMLFormElement;

    const form = new FormContacts(formElement, () => {
        this.events.emit('order:finish');
    });

    const updateValidity = () => {
    const buyer = this.buyer.getBuyer();
    const errors: string[] = [];

    if (!buyer.email.trim()) {
        errors.push('Не указан email');
    }

    if (!buyer.phone.trim()) {
        errors.push('Не указан телефон');
    }

    form.errors = errors.join('. ');
    form.valid = errors.length === 0;
};

    formElement.addEventListener('email:changed', (event) => {
        const email = (event as CustomEvent<string>).detail;
        this.buyer.setEmail(email);
        updateValidity();
    });

    formElement.addEventListener('phone:changed', (event) => {
        const phone = (event as CustomEvent<string>).detail;
        this.buyer.setPhone(phone);
        updateValidity();
    });

    const buyer = this.buyer.getBuyer();

    form.email = buyer.email;
    form.phone = buyer.phone;

    updateValidity();

    this.modal.content = form.render();
    this.modal.open();
}

private submitOrder(): void {
    const buyer = this.buyer.getBuyer();

    const order: ICreateOrderRequest = {
        ...buyer,
        total: this.basket.getTotal(),
        items: this.basket.getProducts().map((product) => product.id),
    };

    this.apiService.createOrder(order)
        .then((response) => {
            const template = document.querySelector(
                '#success'
            ) as HTMLTemplateElement;

            const successElement = template.content
                .querySelector('.order-success')!
                .cloneNode(true) as HTMLElement;

            const success = new Success(successElement, () => {
                this.modal.close();
                this.basket.clear();
                this.buyer.clear();
            });

            success.total = response.total;

            this.modal.content = success.render();
            this.modal.open();
        })
        .catch((error) => {
            console.error('Ошибка при оформлении заказа:', error);
        });
}

    private renderCatalog(): void {
        const template = document.querySelector(
            '#card-catalog'
        ) as HTMLTemplateElement;

        const cards = this.catalog.getProducts().map((item) => {
            const cardElement = template.content
                .querySelector('.card')!
                .cloneNode(true) as HTMLElement;

            const card = new CardCatalog(cardElement, () => {
                this.events.emit('card:select', item);
            });

            card.title = item.title;
            card.price = item.price;
            card.category = item.category;
            card.image = item.image;

            return card.render();
        });

        this.page.catalog = cards;
    }
}