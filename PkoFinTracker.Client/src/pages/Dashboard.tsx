import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect, useMemo} from "react";
import axios from "axios";
import AccountCard, {type AccountCardProps} from "../components/AccountCard.tsx";
import type {BankAccount} from "../types/BankAccount.ts";

import { ArrowDownToLine, CalendarDays } from 'lucide-react';
import Cashflow from "../components/Cashflow.tsx";
import TransactionTable from "../components/TransactionTable.tsx";


export const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);

    const { totalIncome, totalExpense, incomeDiff, expenseDiff } = useMemo(() => {
        // current date
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();
        
        // prev date
        const prevDate = new Date(currYear, currMonth - 1, 1);
        const prevMonth = prevDate.getMonth();
        const prevYear = prevDate.getFullYear();
   
        const stats = transactions.reduce(
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
            totalIncome: stats.currInc,
            totalExpense: stats.currExp,
            incomeDiff: calcDiff(stats.currInc, stats.prevInc),
            expenseDiff: calcDiff(stats.currExp, stats.prevExp),
        }
    }, [transactions]);
    
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction')
            .then(res => {
                setTransactions(res.data);
            }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction?limit=5')
            .then(res => {
                setRecentTransactions(res.data);
            }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5093/api/Account')
            .then(res => setAccounts(res.data))
            .catch(err => console.log(err));
    }, []);
    
    return (
            <div className="grid grid-cols-12 gap-3">
                <Greetings accounts={accounts}/>
                {accounts.length > 0 && <AccountCard accounts={accounts} />}
                <Cashflow transactions={transactions} />
                {accounts.length > 0 && <>
                    <div className="col-start-1 col-span-2">
                        <StatCard title="Total Income" amount={totalIncome} diff={incomeDiff} currency={accounts[0].currency} type='income' />
                    </div>
                    <div className="col-span-2">
                        <StatCard title="Total Expense" amount={totalExpense} diff={expenseDiff} currency={accounts[0].currency} type='expense' />
                    </div>
                </>}
                <TransactionTable  transactions={recentTransactions}/>
            </div>
    )
}

interface StatCardProps {
    title: string,
    amount: number,
    diff: number,
    currency: string,
    type: 'income' | 'expense'
    
}

const CURRENCY_SYMBOLS: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'UAH': '₴',
    'GBP': '£',
    'PLN': 'zł'
};

const StatCard: React.FC<StatCardProps> = ({title, amount, diff, currency, type}) => {
    const isIncome = type === 'income';
    const isPositive = diff > 0;
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    return (
        <div className="bg-bank-comp p-5 rounded-2xl flex flex-col">
            <span className="text-white text-xl font-normal">
                {title}
            </span>
            
            <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-semibold text-white">
                    {currencySymbol}{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
            </div>
            
            <div className="mt-3 flex items-center start flex-wrap gap-1 ">
                <div className={`flex font-bold text-lg space-x-1 ${isIncome ? 'text-emerald-500' : 'text-red-600'}`}>
                    <span>{isPositive ? '↑' : '↓'} </span>
                    <span>{diff.toFixed(1)}%</span>
                </div>
                <span className="text-white opacity-60"> From last month</span>
            </div>
        </div>
    )
}

const Greetings: React.FC<AccountCardProps> = ({accounts}) =>{
    const account = accounts[0];
    const currDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).replace(',', '');
    return (
        <div className="flex col-span-12 text-white mb-2 justify-between items-end">
            <div className="flex flex-col">
                <h1 className="text-2xl">Good day, {accounts.length > 0 && account.name} </h1>
                <p className="text-lg text-white opacity-60">Track your balance, spending, and progress with ease</p>
            </div>
            <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-lg px-4 py-2 bg-bank-comp">
                    <CalendarDays className="w-5 h-5" />
                    <span>{currDate}</span>
                </div>
                <button className="flex items-center gap-2 bg-bank-purple rounded-lg px-4 py-2 hover:bg-purple-700 transition">
                    <ArrowDownToLine className="w-5 h-5" />
                    <span>Export</span>
                </button>
            </div>
        </div>
    )
} 