export interface CreateOrder {
    customerLocation: string;
    orderDate: string; // ISO 8601 date-time string
    quantity: number;
}

