import type {PaymentDetails, CreditCardPayment} from './types';

export function isCreditCardPayment(payment: PaymentDetails): payment is CreditCardPayment {
    return payment.type === 'card';
}

export function maskCardNumber(payment: PaymentDetails): string {
    if (isCreditCardPayment(payment)) {
        return `**** **** **** ${payment.cardNumber.slice(-4)}`;
    } else {
        return "Не вимагає маскування.";
    }
}

export function processPayment(payment: PaymentDetails, amount: number): string {
    switch (payment.type) {
        case 'card':
        return `Списано ${amount} з банківської картки ${maskCardNumber(payment)}.`;
        case 'cash':  
        return payment.cashAmountToPay > amount
            ? `Підготовка решти: ${payment.cashAmountToPay - amount}.`
            : `Отримано точну суму готівки: ${amount}.`;
        case 'online_service':
            return `Успішна авторизація через ${payment.serviceName}.`;
        default:
            const _exhaustiveCheck: never = payment;
            throw new Error(`Необроблений тип платежу: ${_exhaustiveCheck}`);
    }
}
