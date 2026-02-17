import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {EllipsisVertical, SquareChevronLeft, SquareChevronRight} from 'lucide-react';
import {useTransactions} from "../context/TransactionContext.tsx";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export interface TransactionProps {
    transactions: Transaction[];
    pageType: 'dashboard' | 'transactions';
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
    onPageChange?: (page: number) => void;
}
const TransactionTable:React.FC<TransactionProps> = ({transactions, pageType, currentPage, totalPages, totalCount, onPageChange}) => {
    const {dateRange, setDateRange} = useTransactions();
    const pageSize = 10;
    const from = (currentPage!  - 1) * pageSize + 1;
    const to = Math.min(currentPage! * pageSize, totalCount!);
    return(
        <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <h1 className="text-xl font-normal">{pageType === 'dashboard' ? 'Recent Transactions': 'Transactions'}</h1>
                {pageType === 'transactions' && 
                    <div className="relative z-20">
                    <DatePicker
                        selectsRange={true}
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        onChange={(update) => setDateRange(update)}
                        isClearable={true}
                        placeholderText="Filter by date range"
                        className="z-100 bg-bank-comp border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer w-64"
                    />
                </div>}
            </div>

            <div className={`${pageType === 'transactions' ? 'h-168' : 'max-h-60'} overflow-x-auto`}>
                <table className="w-full">
                    <thead className="">
                    <tr className="border-b border-gray-800">
                        <th>№</th>
                        <th>ID</th>
                        <th>Transaction</th>
                        <th>Category</th>
                        <th>Date Time</th>
                        <th className="pr-0">Cost</th>
                        {pageType === 'transactions' && <th></th>}
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((t, index) => (
                        <tr
                            key={t.id}
                            className={`hover:bg-gray-800/50 transition ${
                                index !== transactions.length - 1 ? 'border-b border-gray-800' : ''
                            }`}
                        >
                            <td className="pl-5"> {pageType === "transactions" 
                                ? (currentPage! - 1) * 10 + (index + 1)
                                : (index + 1)
                            }
                            </td>
                            <td>
                                #{t.id.substring(0, 8)}...
                            </td>
                            <td className="">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-light"
                                        style={{
                                            backgroundColor: `hsl(${(index * 137) % 360}, 65%, 55%)`
                                        }}
                                    >
                                        {t.description?.charAt(0).toUpperCase() || 'T'}
                                    </div>
                                    <div className="w-30 overflow-x-auto whitespace-nowrap scrollbar-none">
                                        {t.description}
                                    </div>
                                </div>
                            </td>
                            <td className="">
                                <div className="w-30 overflow-x-auto whitespace-nowrap scrollbar-none">
                                    {t.categoryName}
                                </div>
                            </td>
                            <td className="whitespace-nowrap">
                                {new Date(t.bookingDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                            <td className={`whitespace-nowrap ${t.indicator === "DBIT" ? 'text-red-600' : 'text-emerald-600'} pr-2`}>
                                {t.indicator === 'DBIT' ? '-' : '+'}{t.amount} {t.currency}
                            </td>
                            {pageType === 'transactions' && <td>
                                <EllipsisVertical className="cursor-pointer"/>
                            </td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {transactions.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                    <p>Немає транзакцій для відображення</p>
                </div>
            )}
            {pageType === 'transactions' && 
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3 opacity-60">
                        <span>{from} - {to}</span>
                        of
                        <span>{totalCount}</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <span>Rows per page: 10 </span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => onPageChange?.(currentPage! - 1)}
                                disabled={currentPage === 1}
                                className="disabled:opacity-30"
                            >
                                <SquareChevronLeft className="w-6 h-6 cursor-pointer" />
                            </button>
                            
                            <span>{currentPage}/{totalPages}</span>

                            <button
                                onClick={() => onPageChange?.(currentPage! + 1)}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-30"
                            >
                                <SquareChevronRight className="w-6 h-6 cursor-pointer" />
                            </button>
                        </div>
                        
                    </div>
                </div>}
        </>
    )
}
export default TransactionTable