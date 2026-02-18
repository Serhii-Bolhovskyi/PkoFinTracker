import type {Transaction} from "../types/Transaction.ts";
import {createContext, useEffect, useMemo, useState} from "react";
import * as React from "react";
import axios from "axios";
import type {BankAccount} from "../types/BankAccount.ts";

interface TransactionStats {
    totalIncome: number;
    totalExpense: number;
    incomeDiff: number;
    expenseDiff: number;
    totalCount: number;
    countDiff: number;
}

interface PaginatedData {
    items: Transaction[],
    totalCount: number;
    totalPages: number,
    currentPage: number
}

interface TransactionContext {
    allTransactions: Transaction[],
    paginatedData: PaginatedData,
    accounts: BankAccount[],
    stats: TransactionStats,
    loading: boolean,
    refreshTransactions: () => Promise<void>// refresh data
    goToPage: (page: number) => Promise<void>;
    
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    
    description: string | null;
    setDescription: (description: string | null) => void;
}

const TransactionContext = createContext<TransactionContext | null>(null);

export const TransactionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]);
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true)

    const [paginatedData, setPaginatedData] = useState<PaginatedData>({
        items: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1
    });
    
    const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);
    const [description, setDescription] = React.useState<string | null>("");
    
    const loadInitialData = async () => {
        setLoading(true)
        try{
            const [transRes, accRes] = await Promise.all([
                axios.get(`http://localhost:5093/api/Transaction?pageSize=1000`),
                axios.get('http://localhost:5093/api/Account')
            ])
            
            setAllTransactions(transRes.data.items);
            setAccounts(accRes.data);
            console.log(1)
        } finally {
            setLoading(false);
        }
    }
    
    const loadPaginatedData = async() => {
        try{
            setLoading(true)
            const from = dateRange[0] ? `from=${dateRange[0]?.toLocaleDateString("en-US")}` : "";
            const to = dateRange[1] ? `&to=${dateRange[1]?.toLocaleDateString("en-US")}` : "";

            const descSearch = description! && `&description=${description}`;
            
            const res = await axios.get(`http://localhost:5093/api/Transaction?${from}${to}${descSearch}&pageNumber=1&pageSize=10`);
            setPaginatedData({
                items: res.data.items,
                totalCount: res.data.totalCount,
                totalPages: res.data.totalPages,
                currentPage: res.data.pageNumber
            });
        }finally {
            setLoading(false);
        }
    }
    
    const goToPage = async (pageNumber: number) => {
        setLoading(true)
        try {
            const from = dateRange[0] ? `from=${dateRange[0]?.toLocaleDateString("en-US")}` : "";
            const to = dateRange[1] ? `&to=${dateRange[1]?.toLocaleDateString("en-US")}` : "";
            const res = await axios.get(
                `http://localhost:5093/api/Transaction/?${from}${to}&pageNumber=${pageNumber}&pageSize=10`);
            setPaginatedData({
                items: res.data.items,
                totalCount: res.data.totalCount,
                totalPages: res.data.totalPages,
                currentPage: res.data.pageNumber
            });
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInitialData();
        loadPaginatedData()
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            loadPaginatedData();
        }, 1000)
        return () => clearTimeout(handler);
    }, [dateRange, description]);
    
    const stats = useMemo(() => {
        // current date
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();
        
        // prev date
        const prevDate = new Date(currYear, currMonth - 1, 1);
        const prevMonth = prevDate.getMonth();
        const prevYear = prevDate.getFullYear();

        const result = allTransactions.reduce(
            (acc, t) => {
                const tDate = new Date(t.bookingDate);
                const tMonth = tDate.getMonth();
                const tYear = tDate.getFullYear();

                // current month
                if(tMonth === currMonth && tYear === currYear){
                    acc.currCount += 1;
                    if (t.indicator === 'CRDT') {
                        acc.currInc += t.amount;
                    } else if (t.indicator === 'DBIT') {
                        acc.currExp += t.amount;
                    }
                }

                // prev month
                if(tMonth === prevMonth && tYear === prevYear){
                    acc.prevCount += 1;
                    if (t.indicator === 'CRDT') {
                        acc.prevInc += t.amount;
                    } else if (t.indicator === 'DBIT') {
                        acc.prevExp += t.amount;
                    }
                }

                return acc;
            },
            { currInc: 0, currExp: 0, prevInc: 0, prevExp: 0, currCount: 0, prevCount: 0 },
        );

        const calcDiff = (curr: number, prev: number) =>
            prev === 0 ? 0 : ((curr - prev)/ prev) * 100;
        
        const countDiff = calcDiff(result.currCount, result.prevCount);

        return {
            totalIncome: result.currInc,
            totalExpense: result.currExp,
            incomeDiff: calcDiff(result.currInc, result.prevInc),
            expenseDiff: calcDiff(result.currExp, result.prevExp),
            totalCount: result.currCount,
            countDiff: countDiff
        }
    }, [allTransactions]);
    
    return (
        <TransactionContext.Provider value={{
            allTransactions,
            paginatedData,
            accounts,
            stats,
            loading,
            dateRange,
            description,
            setDescription,
            setDateRange,
            refreshTransactions: loadInitialData,
            goToPage
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