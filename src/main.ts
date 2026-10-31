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

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('.modal')!);
new Presenter(
    events,
    catalog,
    basket,
    buyer,
    apiService,
    page,
    modal
);

apiService.getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });