import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect} from "react";
import axios from "axios";
import TransactionTable from "../components/TransactionTable.tsx";


export const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction/transactions')
            .then(res => {
                setTransactions(res.data);
            }).catch(err => console.log(err));
    }, []);
    return (
        <>
            <TransactionTable  transactions={transactions}/>
        </>
    )
}