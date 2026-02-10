import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect} from "react";
import axios from "axios";

export const Home: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction/transactions')
            .then(res => {
                setTransactions(res.data);
            }).catch(err => console.log(err));
    }, []);
    return (
        <div>
            <h1>Pko Financial Tracker</h1>
            <ul>
                {transactions.map(t => (
                    <li key={t.id}>
                        {t.bookingDate.split("T")[0]}: {t.description} - {t.amount} {t.currency}
                        <span>{t.categoryName}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}