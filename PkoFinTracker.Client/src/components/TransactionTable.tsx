import * as React from "react";
import type {Transaction} from "../types/Transaction.ts";
import {EllipsisVertical, SquareChevronLeft, SquareChevronRight, CalendarDays, SlidersHorizontal} from 'lucide-react';
import {useTransactions} from "../context/TransactionContext.tsx";

import "react-datepicker/dist/react-datepicker.css";
import "../datepicker-custom.css"
import DatePicker from "react-datepicker";
import {forwardRef} from "react";

import notFoundImg from "../assets/not-found.png"
import Skeleton from "react-loading-skeleton";
import FilterModal from "./modal/FilterModal.tsx";

export interface TransactionProps {
    transactions: Transaction[];
    pageType: 'dashboard' | 'transactions';
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
}


interface CalendarTriggerProps {
    onClick?: () => void;
    value?: string;
}

const CalendarTrigger = forwardRef<HTMLButtonElement, CalendarTriggerProps>(
    ({ onClick }, ref) => (
        <button
            ref={ref}
            onClick={onClick}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
            <CalendarDays className="w-6 h-6" />
        </button>
    )
);

const TransactionTable:React.FC<TransactionProps> = ({transactions, pageType, currentPage, totalPages, totalCount, onPageChange, isLoading}) => {
    const {dateRange, description, categories, setDateRange, setDescription} = useTransactions();
    const [isOpen, setIsOpen] = React.useState(false);
    
    const onClose = () => setIsOpen(false);
    
    const pageSize = 10;
    const from = (currentPage!  - 1) * pageSize + 1;
    const to = Math.min(currentPage! * pageSize, totalCount!);
    
    return(
        <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <h1 className="text-xl font-normal">{pageType === 'dashboard' ? 'Recent Transactions': 'Transactions'}</h1>
                {pageType === 'transactions' && 
                    <div className="flex items-center relative z-20">
                        <input
                            className="w-60 p-2 mr-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors outline-none"
                            placeholder="Search..."
                            type="text" 
                            value={description ?? ""}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex items-center">
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange[0]}
                                endDate={dateRange[1]}
                                onChange={(update) => setDateRange(update)}
                                isClearable={true}
                                calendarClassName="dark-calendar"
                                customInput={<CalendarTrigger />}
                            />
                            <div className="relative p-2 ml-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <SlidersHorizontal
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-6 h-6" 
                                />
                            </div>
                        </div>
                </div>}
            </div>
            <div className={`${pageType === 'transactions' ? 'h-176' : 'h-60'} ${transactions.length === 0 && 'flex justify-center'} overflow-x-auto`}>
                <table className="relative w-full">
                    <thead className="">
                    <tr className="border-b border-gray-800">
                        <th>№</th>
                        <th>ID</th>
                        <th>Transaction</th>
                        <th>Category</th>
                        <th>Date Time</th>
                        <th>Cost</th>
                        <th className="pr-0">Status</th>
                        {pageType === 'transactions' && <th></th>}
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i}>
                                <td colSpan={pageType === 'transactions' ? 8 : 7} className="py-2 px-4">
                                    <Skeleton height={28} className="w-full rounded-lg" />
                                </td>
                            </tr>
                        ))
                    ) : transactions.length > 0 && (
                        transactions.map((t, index) => (
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
                                            <div className="w-24 overflow-x-auto whitespace-nowrap scrollbar-none">
                                                {t.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="">
                                        <div className="w-24 overflow-x-auto whitespace-nowrap scrollbar-none">
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
                                    <td>
                                        <div className={`whitespace-nowrap px-2 p-1 rounded-full flex justify-center
                                        ${t.status === "BOOK" ? 'bg-emerald-600/20  text-emerald-600' : ''}
                                        ${t.status === "PDNG" ? 'bg-yellow-600/20  text-yellow-600' : ''}
                                        ${t.status === "RJCT" ? 'bg-red-600/20  text-red-600' : ''}`}>
                                            {t.status === "BOOK" ? "Success" : t.status === "PDNG" ? "Pending" : t.status === "RJCT" ? "Rejected" : ""}
                                        </div>
                                        
                                    </td>
                                    {pageType === 'transactions' && <td className="px-1">
                                        <EllipsisVertical className="cursor-pointer"/>
                                    </td>}
                                </tr>
                            ))
                    )}
                    {!isLoading && transactions.length === 0 && (
                        <tr>
                            <td colSpan={pageType === 'transactions' ? 8 : 7} className="relative py-20">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p className={`${pageType === "transactions" ? "text-3xl" : "text-2xl"} text-gray-400`}>
                                        There are no transactions
                                    </p>
                                    <img
                                        src={notFoundImg}
                                        alt="empty state"
                                        className={`${pageType === "transactions" ? "w-60 h-60" : "w-40 h-40"} opacity-70`}
                                    />
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            
            {pageType === 'transactions' && 
                <div className="flex items-center justify-between p-5 border-t border-gray-800">
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
            {isOpen && <FilterModal categories={categories} onClose={onClose}/>}
        </>
    )
}

export default TransactionTable