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
import { CDN_URL } from '../utils/constants';

export class Presenter {
   constructor(
    private events: IEvents,
    private catalog: Catalog,
    private basket: Basket,
    private buyer: Buyer,
    private apiService: ApiService,
    private page: Page,
    private modal: Modal,
    private cardPreview: CardPreview,
    private basketView: BasketView,
    private formOrder: FormOrder,
    private formContacts: FormContacts,
    private success: Success
) 
{
    this.events.on('catalog:changed', () => {
        this.renderCatalog();
    });

  this.events.on('basket:changed', () => {
    this.page.counter = this.basket.getCount();
    this.updateBasketView();
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
this.events.on('payment:changed', (data: { payment: TPayment }) => {
    this.buyer.setPayment(data.payment);
});

this.events.on('address:changed', (data: { address: string }) => {
    this.buyer.setAddress(data.address);
});
this.events.on('email:changed', (data: { email: string }) => {
    this.buyer.setEmail(data.email);
});

this.events.on('phone:changed', (data: { phone: string }) => {
    this.buyer.setPhone(data.phone);
});
this.events.on('buyer:changed', () => {
    const buyer = this.buyer.getBuyer();
    const errors = this.buyer.validate();

        if (buyer.payment) {
        this.formOrder.payment = buyer.payment;
    }
    this.formOrder.address = buyer.address;
    this.formOrder.errors = [errors.payment, errors.address]
        .filter(Boolean)
        .join('. ');
    this.formOrder.valid = !errors.payment && !errors.address;

    // Форма контактных данных
    this.formContacts.email = buyer.email;
    this.formContacts.phone = buyer.phone;
    this.formContacts.errors = [errors.email, errors.phone]
        .filter(Boolean)
        .join('. ');
    this.formContacts.valid = !errors.email && !errors.phone;
});
this.events.on('order:finish', () => {
    this.submitOrder();
});
this.events.on('success:close', () => {
    this.modal.close();
});
  this.events.on('card:select', (product: IProduct) => {
    this.catalog.setSelectedProduct(product);

    this.cardPreview.title = product.title;
    this.cardPreview.price = product.price;
    this.cardPreview.buttonDisabled = product.price === null;
    this.cardPreview.category = product.category;
    this.cardPreview.image = {
        src: product.image,
        alt: product.title,
    };
    this.cardPreview.description = product.description;

    if (product.price === null) {
        this.cardPreview.buttonText = 'Недоступно';
    } else if (this.basket.hasProduct(product.id)) {
        this.cardPreview.buttonText = 'Удалить из корзины';
    } else {
        this.cardPreview.buttonText = 'Купить';
    }

    this.modal.content = this.cardPreview.render();
    this.modal.open();
});
this.events.on('card:buy', () => {
    const product = this.catalog.getSelectedProduct();

    if (!product) {
        return;
    }

    if (this.basket.hasProduct(product.id)) {
        this.basket.removeProduct(product.id);
    } else {
        this.basket.addProduct(product);
    }

    this.modal.close();
});
this.events.on('basket:remove', (data: { id: string }) => {
    this.basket.removeProduct(data.id);
});

this.apiService.getProducts()
    .then((data) => {
        const products = data.items.map((item) => ({
            ...item,
            image: `${CDN_URL}${item.image}`,
        }));

        this.catalog.setProducts(products);
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });
}


private renderBasket(): void {
    this.updateBasketView();
    this.modal.content = this.basketView.render();
    this.modal.open();
}

private updateBasketView(): void {
    const cardTemplate = document.querySelector(
        '#card-basket'
    ) as HTMLTemplateElement;

    const items = this.basket.getProducts().map((product, index) => {
        const cardElement = cardTemplate.content
            .querySelector('.basket__item')!
            .cloneNode(true) as HTMLElement;

        const card = new CardBasket(cardElement, () => {
            this.events.emit('basket:remove', { id: product.id });
        });

        card.title = product.title;
        card.price = product.price;
        card.index = index + 1;

        return card.render();
    });

    this.basketView.items = items;
    this.basketView.total = this.basket.getTotal();
    this.basketView.buttonDisabled = items.length === 0;
}
private renderOrderForm(): void {
    this.events.emit('buyer:changed');

    const form = this.formOrder;
    this.modal.content = form.render();
    this.modal.open();
}
private renderContactsForm(): void {
    const form = this.formContacts;
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
        this.basket.clear();
        this.buyer.clear();

        this.success.total = response.total;

        this.modal.content = this.success.render();
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
            card.image = {
    src: item.image,
    alt: item.title,
};

            return card.render();
        });

        this.page.catalog = cards;
    }
}