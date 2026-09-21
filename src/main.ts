import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/ApiService";
import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const catalog = new Catalog();

catalog.setProducts(apiProducts.items);

const api = new Api(API_URL);
const apiService = new ApiService(api);



console.log("Массив товаров:", catalog.getProducts());

const product = catalog.getProduct(apiProducts.items[0].id);
console.log("Товар по id:", product);

catalog.setSelectedProduct(apiProducts.items[0]);
console.log("Выбранный товар:", catalog.getSelectedProduct());


const basket = new Basket();

basket.addProduct(apiProducts.items[0]);
basket.addProduct(apiProducts.items[1]);

console.log("Товары в корзине:", basket.getProducts());
console.log("Количество товаров:", basket.getCount());
console.log("Общая стоимость:", basket.getTotal());

console.log(
  "Есть первый товар:",
  basket.hasProduct(apiProducts.items[0].id)
);

basket.removeProduct(apiProducts.items[0].id);

console.log("После удаления:", basket.getProducts());
console.log("Количество после удаления:", basket.getCount());

basket.clear();

console.log("После очистки:", basket.getProducts());
console.log("Корзина пуста:", basket.getCount() === 0);


const buyer = new Buyer();

console.log("Начальные данные покупателя:", buyer.getBuyer());

console.log("Ошибки пустого покупателя:", buyer.validate());

buyer.setPayment("card");
buyer.setEmail("test@example.com");
buyer.setPhone("+77001234567");
buyer.setAddress("Усть-Каменогорск");

console.log("Заполненные данные покупателя:", buyer.getBuyer());
console.log("Ошибки после заполнения:", buyer.validate());

buyer.setEmail("new@example.com");
buyer.setPhone("+77009876543");

console.log("После частичного обновления:", buyer.getBuyer());

buyer.clear();

console.log("После очистки покупателя:", buyer.getBuyer());
console.log("Ошибки после очистки:", buyer.validate());

apiService.getProducts()
    .then((data) => {
        catalog.setProducts(data.items);

        console.log("Каталог с сервера:", catalog.getProducts());
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });
