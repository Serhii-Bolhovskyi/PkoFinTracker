import * as React from "react";
import {useTransactions} from "../context/TransactionContext.tsx";
import StatCard from "../components/StatCard.tsx";
import { BanknoteArrowDown, BanknoteArrowUp, WalletCards } from 'lucide-react';
import TransactionTable from "../components/TransactionTable.tsx";

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

import {useMemo} from "react";
import Skeleton from "react-loading-skeleton";

const COLORS = [
    '#7E22CE',
    '#9333EA',
    '#A855F7',
    '#C084FC',
    '#D8B4FE'
];

const Transactions: React.FC = () => {
    const {paginatedData, filteredTransactions, goToPage, filterStats, accounts, loading} = useTransactions();

    const currency = accounts?.[0]?.currency;
    
    const pieData = useMemo(() => {
        const categoryMap: Record<string, number> = {};
        
        filteredTransactions.forEach(t => {
            if(t.indicator === 'DBIT'){
                const name = t.categoryName || "Other";
                categoryMap[name] = (categoryMap[name] || 0) + Math.abs(t.amount);
            }
        });
        
        const data = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2))
        }))
        return data.sort((a, b) => b.value - a.value).slice(0, 5);
    }, [filteredTransactions]);

    
    return (
        <div className="grid grid-cols-12 gap-3">
                <>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Transactions"
                            qty={filterStats.filteredCount}
                            currency={currency}
                            type='info'
                            page='transaction'
                            icon={<WalletCards className="w-6 h-6"/>}
                            isLoading={loading}
                        />
                    </div>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Income"
                            amount={filterStats.filteredIncome}
                            currency={currency}
                            type='income'
                            page='transaction'
                            icon={<BanknoteArrowDown className="w-6 h-6"/>}
                            isLoading={loading}
                        />
                    </div>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Expense"
                            amount={filterStats.filteredExpense}
                            currency={currency}
                            type='expense'
                            page='transaction'
                            icon={<BanknoteArrowUp className="w-6 h-6"/>}
                            isLoading={loading}
                        />
                    </div>
                    <div className="col-span-3 row-span-9 bg-bank-comp p-7 rounded-2xl flex flex-col">
                        <div className="text-center mb-4">
                            <p className="text-white text-xl">
                                {loading ? <Skeleton width={180} /> : "Top Spending Categories"}
                            </p>
                        </div>
                        
                        <div className="h-60 w-full flex items-center justify-center my-4">
                            {loading ? (
                                <Skeleton circle width={180} height={180} />
                            ) : (
                                <PieChartWithPaddingAngle data={pieData} />
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-3  mt-4">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton circle width={12} height={12} />
                                        <Skeleton width={60} height={12} />
                                    </div>
                                ))
                            ) : (
                                pieData.map((d, index) => (
                                    <div key={d.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full border border-white/10"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-white/80 text-sm whitespace-nowrap">{d.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            <div className="col-span-9 row-span-12 overflow-x-auto rounded-xl border border-gray-800 bg-bank-comp text-white">
                <TransactionTable  
                    transactions={paginatedData.items} 
                    pageType="transactions" 
                    totalCount={paginatedData.totalCount}
                    currentPage={paginatedData.currentPage}
                    totalPages={paginatedData.totalPages}
                    onPageChange={(page) => goToPage(page)}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}

interface PieChartProps {
    data: any[]; // Твій масив [{name, value}]
    isAnimationActive?: boolean;
}

function PieChartWithPaddingAngle({ data, isAnimationActive = true }: PieChartProps) {
    return (
        <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="90%"
                        cornerRadius={6}
                        paddingAngle={2}
                        dataKey="value"
                        isAnimationActive={isAnimationActive}
                        stroke="none"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{ backgroundColor: '#1C1A2E', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => <span className="flex flex-col text-gray-400 text-base text-left">€{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Transactions