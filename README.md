# Практична робота №2. Базові засоби системи типів TypeScript

**Виконав: ПІБ, група
**Варіант:** 6 (Будівельні матеріали)

## Опис

Типізоване ядро інтернет-магазину (E-Commerce Core Engine) на чистому TypeScript, без `any`. Модель охоплює каталог товарів, кошик, замовлення та способи оплати.

## Структура проєкту
![structure](screenshots/structure.png)

## Запуск
npm install
npm start


Перевірка типів: `npx tsc --noEmit`

## Налаштування (tsconfig.json)

Увімкнено `strict`, `noImplicitAny`, `target: ES2022`, `module` і `moduleResolution`: `NodeNext`.

![tsconfig](screenshots/tsconfig.png)

## Рівень 1. Сутності каталогу

- `EntityId = string | number`
- `BaseProduct` має поля `id` (readonly), `title`, `price`, `description?`, `tags`, `inStock`.
- `Product` розширює `BaseProduct` полями варіанта 6: `unitOfMeasure` (`'kg' | 'm2' | 'm3'`), `weightPerUnitKg`, `isHeavyCargo`.
- `createProduct` повертає копію товару й кидає `Error` при від'ємній ціні.
- `calculateLineTotal(price, quantity, discountPercent = 0)` рахує суму позиції й кидає `Error` при від'ємних ціні чи кількості.

![types](screenshots/types.png)
![products](screenshots/products.png)

## Рівень 2. Замовлення і безпечні дані

- `OrderStatus` і `DeliveryMethod` (`'cargo_freight' | 'courier' | 'warehouse_pickup'`) є union-типами рядкових літералів.
- `Order` складається через перетин (`&`) з `TimestampMetadata`.
- `updateOrderStatus` є чистою функцією: повертає новий об'єкт, не змінює вхідний. Зі статусів `delivered` та `cancelled` перехід заборонений (кидає помилку).
- `validateCustomerInput(input: unknown)` через `typeof` звужує тип до `string`. Не рядок дає `TypeError`, порожній рядок або відсутність `@` дає `Error`.

![orders](screenshots/orders.png)
![validation](screenshots/validation.png)

## Рівень 3. Discriminated Unions, Type Guards, never

- `CreditCardPayment`, `CashOnDeliveryPayment`, `OnlineServicePayment` мають спільний дискримінатор `type`, об'єднані в `PaymentDetails`.
- `isCreditCardPayment` є захисником типу (`payment is CreditCardPayment`).
- `maskCardNumber` показує лише останні 4 цифри картки, для інших способів повертає повідомлення, що маскування не потрібне.
- `processPayment` використовує `switch (payment.type)`. У гілці `default` змінна типу `never` гарантує, що додавання нового способу оплати без обробки викличе помилку компіляції.

![payments](screenshots/payments.png)

## Результат роботи

Перевірка типів без помилок:

![tsc](screenshots/tsc-no-errors.png)

Вивід програми (`npm start`):

![output](screenshots/output.png)

## Відповіді на контрольні питання

1. TypeScript і JavaScript

TypeScript це надмножина JavaScript зі статичною типізацією: типи перевіряються до запуску, ще на етапі компіляції, а JavaScript виявляє помилки типів лише під час виконання. Браузер і Node.js TypeScript напряму не розуміють, тому код транспілюється (tsc) у чистий JS. При цьому всі типи видаляються (type erasure): interface, type, анотації типів у результаті зникають, лишається звичайний JavaScript. Типи існують тільки для розробника й компілятора.

2. strict: true

Це прапорець, що вмикає набір суворих перевірок одразу. Він ловить більше помилок на етапі компіляції й робить код передбачуванішим.

noImplicitAny: забороняє змінні й параметри без типу, якщо компілятор не може його вивести. Інакше вони мовчки стали б any, і перевірка вимкнулась би.
strictNullChecks: null та undefined стають окремими типами і не підходять під string, number тощо. Щоб використати значення, яке може бути null, треба спершу перевірити його. Це захищає від помилки «Cannot read properties of null».
3. any та unknown

any повністю вимикає перевірку типів: з ним можна робити що завгодно (викликати методи, звертатись до полів), і помилки вилізуть лише під час роботи програми. unknown теж приймає будь-яке значення, але не дозволяє нічого з ним робити, доки ти не звузиш тип (typeof, in, type guard). Тому unknown безпечніший: компілятор змушує перевірити дані перед використанням. У нашій роботі це validateCustomerInput(input: unknown).

4. Кортеж і масив

Array<T> це список будь-якої довжини з елементами одного типу (string[]). Кортеж має фіксовану кількість елементів, і кожна позиція має свій тип: [latitude: number, longitude: number] або [cpu: string, ramGb: number]. У кортежі важливі порядок і довжина, у масиві ні.

5. Union та intersection
Union (|): значення має тип одного з перелічених. Приклад: type EntityId = string | number або OrderStatus = 'pending' | 'shipped'.
Intersection (&): значення має усі властивості всіх типів одночасно. Приклад: Order = {...} & TimestampMetadata, де замовлення містить і свої поля, і createdAt/updatedAt.

Простими словами: union це «або», intersection це «і».

6. Discriminated union

Це union об'єктних типів, де кожен варіант має спільне поле з унікальним літеральним значенням (дискримінатор). У нас це type у PaymentDetails: 'card', 'cash', 'online_service'. Коли ти перевіряєш це поле (if чи switch), TypeScript автоматично розуміє, який саме варіант перед ним, і дає доступ до його специфічних полів (наприклад, payment.cardHolder лише в гілці 'card').

7. Type guard

Це функція, що перевіряє тип під час виконання й повідомляє компілятору результат. Оголошується через предикат у типі повернення:

ts
function isCreditCardPayment(payment: PaymentDetails): payment is CreditCardPayment {
    return payment.type === 'card';
}

payment is CreditCardPayment означає: якщо функція повернула true, то всередині if змінна payment має тип CreditCardPayment.

8. never у default і exhaustiveness checking

У гілці default після обробки всіх варіантів union значення вже не може існувати, і його тип це never. Запис const _exhaustiveCheck: never = payment; працює як перевірка повноти: якщо всі варіанти оброблені, усе компілюється. Якщо потім у PaymentDetails додати новий спосіб оплати й забути додати case, у default потрапить цей тип, який не можна присвоїти never, і компілятор видасть помилку. Тож баг (необроблений новий варіант) ловиться під час збірки, а не в роботі програми.
