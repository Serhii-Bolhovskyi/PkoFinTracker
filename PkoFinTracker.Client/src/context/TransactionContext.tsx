import type {Transaction} from "../types/Transaction.ts";
import {createContext, useEffect, useMemo, useState} from "react";
import * as React from "react";
import axios from "axios";

interface TransactionStats {
    totalIncome: number;
    totalExpense: number;
    incomeDiff: number;
    expenseDiff: number;
}

interface TransactionContext {
    transactions: Transaction[],
    stats: TransactionStats,
    loading: boolean,
    refreshTransactions: () => Promise<void> // refresh data
}

const TransactionContext = createContext<TransactionContext | null>(null);

export const TransactionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true)
    
    const fetchTransactions = async () => {
        setLoading(true)
        try{
            const res = await axios.get('http://localhost:5093/api/Transaction');
            setTransactions(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const stats = useMemo(() => {
        // current date
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();

        // prev date
        const prevDate = new Date(currYear, currMonth - 1, 1);
        const prevMonth = prevDate.getMonth();
        const prevYear = prevDate.getFullYear();

        const result = transactions.reduce(
            (acc, t) => {
                const tDate = new Date(t.bookingDate);
                const tMonth = tDate.getMonth();
                const tYear = tDate.getFullYear();

                // current month
                if(tMonth === currMonth && tYear === currYear){
                    if (t.indicator === 'CRDT') {
                        acc.currInc += t.amount;
                    } else if (t.indicator === 'DBIT') {
                        acc.currExp += t.amount;
                    }
                }

                // prev month
                if(tMonth === prevMonth && tYear === prevYear){
                    if (t.indicator === 'CRDT') {
                        acc.prevInc += t.amount;
                    } else if (t.indicator === 'DBIT') {
                        acc.prevExp += t.amount;
                    }
                }

                return acc;
            },
            { currInc: 0, currExp: 0, prevInc: 0, prevExp: 0 },
        );

        const calcDiff = (curr: number, prev: number) =>
            prev === 0 ? 0 : ((curr - prev)/ prev) * 100;

        return {
            totalIncome: result.currInc,
            totalExpense: result.currExp,
            incomeDiff: calcDiff(result.currInc, result.prevInc),
            expenseDiff: calcDiff(result.currExp, result.prevExp),
        }
    }, [transactions]);
    
    return (
        <TransactionContext.Provider value={{
            transactions,
            stats,
            loading,
            refreshTransactions: fetchTransactions
        }}>
            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactions = () => {
    const context = React.useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionsProvider");
    }
    return context;
}