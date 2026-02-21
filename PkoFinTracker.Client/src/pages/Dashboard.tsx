import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect} from "react";
import axios from "axios";
import AccountCard, {type AccountCardProps} from "../components/AccountCard.tsx";

import { ArrowDownToLine, CalendarDays } from 'lucide-react';
import Cashflow from "../components/Cashflow.tsx";
import TransactionTable from "../components/TransactionTable.tsx";
import StatCard from "../components/StatCard.tsx";
import {useTransactions} from "../context/TransactionContext.tsx";


export const Dashboard: React.FC = () => {
    const { allTransactions, stats, accounts, loading } = useTransactions()
    const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
    
    const currency = accounts?.[0]?.currency;
    
    
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction?limit=5')
            .then(res => {
                setRecentTransactions(res.data.items);
            }).catch(err => console.log(err));
    }, []);
    
    return (
            <div className="grid grid-cols-12 gap-3">
                <Greetings accounts={accounts}/>
                <AccountCard accounts={accounts} />
                <Cashflow transactions={allTransactions} isLoading={loading} pageType="dashboard"/>
               <div className="col-start-1 col-span-2 ">
                        <StatCard 
                            title="Total Income" 
                            amount={stats.totalIncome} 
                            diff={stats.incomeDiff} 
                            currency={currency} 
                            type='income' 
                            page='dashboard'
                            isLoading={loading}
                        />
               </div>
                <div className="col-start-3 col-span-2">
                        <StatCard 
                            title="Total Expense" 
                            amount={stats.totalExpense} 
                            diff={stats.expenseDiff} 
                            currency={currency} 
                            type='expense' 
                            page='dashboard' 
                            isLoading={loading}/>
                </div>
                <div className="col-span-8 row-span-2 col-start-1 overflow-x-auto rounded-xl border border-gray-800 bg-bank-comp text-white">
                    <TransactionTable transactions={recentTransactions} pageType="dashboard" isLoading={loading}/>
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