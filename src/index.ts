import { createProduct, calculateLineTotal } from './products';
import { updateOrderStatus } from './orders';
import { validateCustomerInput } from './validation';
import { maskCardNumber, processPayment } from './payments';
import type { CartItem, Order, PaymentDetails } from './types';

const cement = createProduct({
    id: 1,
    title: "Cement",
    price: 10,
    tags: ["construction", "building", "cement"],
    inStock: true,
    unitOfMeasure: 'kg',
    weightPerUnitKg: 1,
    isHeavyCargo: true
});

const tiles = createProduct({
    id: 2,
    title: "ceramic tile",
    price: 480,
    description: "For flooring",
    tags: ["finishingS"],
    inStock: true,
    unitOfMeasure: "m2",
    weightPerUnitKg: 18,
    isHeavyCargo: false,
});

console.log("=== E-Commerce Products ===");
console.log("[Products]")
console.log(`- Created product #${cement.id}: [${cement.title}] - ${cement.price} грн (In stock: ${cement.inStock ? "yes" : "no"})`);
console.log(`- Created product #${tiles.id}: [${tiles.title}] - ${tiles.price} грн (In stock: ${tiles.inStock ? "yes" : "no"})`);
const cartItem2: CartItem = { product: tiles, quantity: 2 };
const cart: CartItem[] = [cartItem2];

console.log("[Cart]");
let total = 0;
cart.forEach((item, index) => {
    const lineTotal = calculateLineTotal(item.product.price, item.quantity);
    total += lineTotal;
    console.log(`${index + 1}. ${item.product.title} x ${item.quantity} = ${lineTotal} грн`);
});
console.log(`Order total: ${total} грн`);

const email = validateCustomerInput("  customer@example.com ");
const now = new Date();

const order: Order = {
    orderId: "ord-98214-abc",
    customerEmail: email,
    items: cart,
    status: "pending",
    delivery: "courier",
    createdAt: now,
    updatedAt: now,
};

console.log("[Order]");
console.log(`ID: ${order.orderId}, client: ${order.customerEmail}`);
console.log(`Delivery: ${order.delivery}, status: ${order.status}, created: ${order.createdAt.toISOString()}`);

const processing = updateOrderStatus(order, "processing");
console.log(`Status: ${order.status} -> ${processing.status} (updated: ${processing.updatedAt.toISOString()})`);
const shipped = updateOrderStatus(processing, "shipped");
console.log(`Status: ${processing.status} -> ${shipped.status} (updated: ${shipped.updatedAt.toISOString()})`);

const payments: PaymentDetails[] = [
    { type: "card", cardNumber: "4111111111118821", cardHolder: "John Doe", cvv: "123" },
    { type: "cash", cashAmountToPay: 3000 },
    { type: "online_service", serviceName: "ApplePay", transactionRef: "tx-001" },
];

console.log("[Payments]");
for (const payment of payments) {
    console.log(`Method: ${payment.type}`);
    console.log(`Masking: ${maskCardNumber(payment)}`);
    console.log(`Result: ${processPayment(payment, total)}`);
}

try {
    validateCustomerInput(123);
} catch (e) {
    console.log(`Validation: ${(e as Error).name}: ${(e as Error).message}`);
}


