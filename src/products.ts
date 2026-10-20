import type { Product } from "./types";
export function calculateLineTotal(price: number, quantity: number, discountPercent: number = 0): number {
    if (price < 0 || quantity < 0 ) {
        throw new Error("Price and quantity must be non-negative.");
    } 
        return  price * quantity * (1 - discountPercent / 100);
      
}
export function createProduct(productData: Product): Product { 
    if (productData.price < 0) {
        throw new Error("Price cannot be negative.");
     }
        return { ...productData };
}

