import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {useEffect, useMemo} from "react";
import axios from "axios";
import TransactionTable, {type TransactionProps} from "../components/TransactionTable.tsx";
import AccountCard, {type AccountCardProps} from "../components/AccountCard.tsx";
import type {BankAccount} from "../types/BankAccount.ts";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


export const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [accounts, setAccounts] = React.useState<BankAccount[]>([]);

    const { totalIncome, totalExpense } = useMemo(() => {
        return transactions.reduce(
            (acc, t) => {
                if (t.indicator === 'CRDT') {
                    acc.totalIncome += t.amount;
                } else if (t.indicator === 'DBIT') {
                    acc.totalExpense += t.amount;
                }
                return acc;
            },
            { totalIncome: 0, totalExpense: 0 }
        );
    }, [transactions]);
    
    useEffect(() => {
        axios.get('http://localhost:5093/api/Transaction')
            .then(res => {
                setTransactions(res.data);
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
                        <StatCard title="Total Income" amount={totalIncome} currency={accounts[0].currency} type='income' />
                    </div>
                    <div className="col-span-2">
                        <StatCard title="Total Expense" amount={totalExpense} currency={accounts[0].currency} type='expense' />
                    </div>
                </>}
                <TransactionTable  transactions={transactions}/>
            </div>
    )
}

interface StatCardProps {
    title: string,
    amount: number,
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

const StatCard: React.FC<StatCardProps> = ({title, amount, currency, type}) => {
    const isIncome = type === 'income';
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    return (
        <div className="bg-bank-comp p-5 rounded-2xl flex flex-col">
            <span className="text-white text-xl font-normal">
                {title}
            </span>
            
            <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-semibold text-white">
                    {currencySymbol}{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
            </div>
            
            <div className={`mt-3 flex items-center gap-1 font-bold ${isIncome ? 'text-emerald-500' : 'text-purple-400'}`}>
                <span>{isIncome ? '↑' : '↓'}</span>
                <span>{isIncome ? 'Income' : 'Spending'}</span>
            </div>
        </div>
    )
}

const Cashflow: React.FC<TransactionProps> = ({transactions}) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const chartData = useMemo(() => {
        
        const data = monthNames.map(name => ({
            name: name,
            income: 0,
            expense: 0
        }));
        
        transactions.forEach(t => {
            const date = new Date(t.bookingDate)
            
            const monthIndex = date.getMonth();
            
            if(t.indicator === "CRDT"){
                data[monthIndex].income += t.amount;
            } else {
                data[monthIndex].expense += Math.abs(t.amount);
            }
        })
        
        return data;
    }, [transactions]);
    
    return (
        <div className="col-span-8 row-span-2 col-start-5 bg-bank-comp rounded-2xl p-5">
            {/*<p className="text-2xl text-white">Cashflow</p>*/}
            <SimpleBarChart data={chartData} />
        </div>
        
    )
}

const SimpleBarChart = ({data}) => {
    return (
        <BarChart
            style={{ width: '100%', maxHeight: '45vh', aspectRatio: 1.618 }}
            responsive
            data={data}
            margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar name="Income" dataKey="income" fill="#A855F7" radius={[4, 4, 0, 0]} />
            <Bar name="Expense"  dataKey="expense" fill="#DAA520"  radius={[4, 4, 0, 0]}
            />
            <RechartsDevtools />
        </BarChart>
    );
};


const Greetings: React.FC<AccountCardProps> = ({accounts}) =>{
    const account = accounts[0];
    return (
        <div className="col-span-12 text-white mb-2">
           <h1 className="text-2xl">Good day, {accounts.length > 0 && account.name} </h1>
           <p className="text-lg text-white opacity-60">Track your balance, spending, and progress with ease</p> 
        </div>
    )
} 