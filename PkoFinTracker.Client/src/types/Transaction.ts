export interface Transaction {
    id: string;
    currency: string;
    amount: number;
    description: string;
    bookingDate: string;
    categoryName: string;
    indicator: string;
    status: string;
}