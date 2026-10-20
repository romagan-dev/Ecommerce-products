import type {Order, OrderStatus} from './types';
export function updateOrderStatus(order: Order, newStatus: OrderStatus): Order {

    if (order.status === 'delivered' || order.status === 'cancelled') {
        throw new Error("Cannot change status of a delivered or cancelled order.");
    }
    return {
        ... order, 
        status: newStatus,
        updatedAt: new Date()    };
}