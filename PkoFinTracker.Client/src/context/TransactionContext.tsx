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

interface TransactionFilterStats {
    filteredCount: number,
    filteredIncome: number,
    filteredExpense: number,
}

interface PaginatedData {
    items: Transaction[],
    totalCount: number;
    totalPages: number,
    currentPage: number
}

export interface Category {
    id: number;
    name: string;
}

interface TransactionContext {
    allTransactions: Transaction[],
    filteredTransactions: Transaction[];
    paginatedData: PaginatedData,
    accounts: BankAccount[],
    stats: TransactionStats,
    filterStats: TransactionFilterStats,
    loading: boolean,
 
    goToPage: (page: number) => Promise<void>;
    
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    
    description: string | null;
    setDescription: (description: string | null) => void;

    categories: Category[];
    selectedCategoryIds: number[];
    setSelectedCategoryIds: (selectedCategoryIds: number[]) => void;
    
    indicator: string | null;
    setIndicator: (indicator: string | null) => void;

    amountRange: [number | null, number | null];
    setAmountRange: (range: [number | null, number | null]) => void;
}

const TransactionContext = createContext<TransactionContext | null>(null);

export const TransactionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true)

    const [paginatedData, setPaginatedData] = useState<PaginatedData>({
        items: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1
    });

    const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>(() => {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return [first, last];
    });
    const [description, setDescription] = React.useState<string | null>("");
    
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<number[]>([]);
    
    const [indicator, setIndicator] = React.useState<string | null>("");
    
    const [amountRange, setAmountRange] = React.useState<[number | null, number | null]>([null, null])
    
    const getFilterParams = () => {
        const [minAmount, maxAmount] = amountRange || [null, null]
        const from = dateRange[0] ? `from=${dateRange[0]?.toLocaleDateString("en-US")}` : "";
        const to = dateRange[1] ? `&to=${dateRange[1]?.toLocaleDateString("en-US")}` : "";
        
        const descSearch = description! && `&description=${description}`;
        const categoryParams = selectedCategoryIds && selectedCategoryIds.length > 0
            ? selectedCategoryIds.map(id => `&categoryIds=${id}`).join('')
            : "";
        const indicatorParams = indicator ? `&indicator=${indicator}` : "";
        const minParam = (minAmount !== null && minAmount > 0) ? `&minAmount=${minAmount}` : "";
        const maxParam = (maxAmount !== null && maxAmount > 0) ? `&maxAmount=${maxAmount}` : "";
        
        return `${from}${to}${descSearch}${categoryParams}${indicatorParams}${minParam}${maxParam}`
    } 
    
    const loadInitialData = async () => {
        setLoading(true)
        try{

            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const [transRes, accRes, catRes] = await Promise.all([
                axios.get(`http://localhost:5093/api/Transaction?pageSize=1000`),
                axios.get('http://localhost:5093/api/Account'),
                axios.get('http://localhost:5093/api/Transaction/categories')
            ])
            
            setAllTransactions(transRes.data.items);
            setAccounts(accRes.data);
            setCategories(catRes.data);

        } finally {
            setLoading(false);
        }
    }
    
    const loadPaginatedData = async() => {
        try{
            setLoading(true)
            
            const filterParams = getFilterParams();

            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const res = await axios.get(
                `http://localhost:5093/api/Transaction?${filterParams}&pageNumber=1&pageSize=10`);
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
            const filterParams = getFilterParams();
            
            const res = await axios.get(
                `http://localhost:5093/api/Transaction/?${filterParams}&pageNumber=${pageNumber}&pageSize=10`);
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
    
    const fetchFilteredTransactions = async () => {
        const filterParams = getFilterParams();

        await new Promise(resolve => setTimeout(resolve, 3000));
    
        const res = await axios.get(
            `http://localhost:5093/api/Transaction/?${filterParams}&pageSize=1000`);

        setFilteredTransactions(res.data.items);
    }

    useEffect(() => {
        loadInitialData();
        loadPaginatedData()
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            loadPaginatedData();
            fetchFilteredTransactions();
        }, 1000)
        return () => clearTimeout(handler);
    }, [dateRange, description, selectedCategoryIds, indicator, amountRange]);
    
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
            { totalFilteredInc: 0, totalFilteredExp: 0, totalFilteredCount: 0,
                currInc: 0, currExp: 0, prevInc: 0, prevExp: 0, currCount: 0, prevCount: 0 },
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

    const filterStats = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            acc.filteredCount += 1;
            if (t.indicator === 'CRDT') acc.filteredIncome += t.amount;
            else acc.filteredExpense += Math.abs(t.amount);
            return acc;
        }, { filteredIncome: 0, filteredExpense: 0, filteredCount: 0 });
    }, [filteredTransactions]);
    
    return (
        <TransactionContext.Provider value={{
            allTransactions,
            filteredTransactions,
            filterStats,
            paginatedData,
            accounts,
            stats,
            loading,
            dateRange,
            description,
            categories,
            selectedCategoryIds,
            indicator,
            amountRange,
            setAmountRange,
            setIndicator,
            setSelectedCategoryIds,
            setDescription,
            setDateRange,
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