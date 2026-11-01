import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/ApiService";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { API_URL } from "./utils/constants";
import { Page } from "./components/page";
import { Presenter } from "./components/Presenter";
import { Modal } from "./components/Modal";
import { CardPreview } from "./components/CardPreview";
import { BasketView } from "./components/BasketView";
import { FormOrder } from "./components/FormOrder";
import { FormContacts } from "./components/FormContacts";
import { Success } from "./components/Success";

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('.modal')!);
const previewTemplate = document.querySelector(
    '#card-preview'
) as HTMLTemplateElement;

const previewElement = previewTemplate.content
    .querySelector('.card')!
    .cloneNode(true) as HTMLElement;

const cardPreview = new CardPreview(previewElement, () => {
    events.emit('card:buy');
});
const basketTemplate = document.querySelector(
    '#basket'
) as HTMLTemplateElement;

const basketElement = basketTemplate.content
    .querySelector('.basket')!
    .cloneNode(true) as HTMLElement;

const basketView = new BasketView(basketElement, () => {
    events.emit('basket:checkout');
});
const orderTemplate = document.querySelector(
    '#order'
) as HTMLTemplateElement;

const orderElement = orderTemplate.content
    .querySelector('form')!
    .cloneNode(true) as HTMLFormElement;

const formOrder = new FormOrder(orderElement, events);

const contactsTemplate = document.querySelector(
    '#contacts'
) as HTMLTemplateElement;

const contactsElement = contactsTemplate.content
    .querySelector('form')!
    .cloneNode(true) as HTMLFormElement;

const formContacts = new FormContacts(contactsElement, events);
const successTemplate = document.querySelector(
    '#success'
) as HTMLTemplateElement;

const successElement = successTemplate.content
    .querySelector('.order-success')!
    .cloneNode(true) as HTMLElement;

const success = new Success(successElement, events);
new Presenter(
    events,
    catalog,
    basket,
    buyer,
    apiService,
    page,
    modal,
    cardPreview,
    basketView,
    formOrder,
    formContacts,
    success
);