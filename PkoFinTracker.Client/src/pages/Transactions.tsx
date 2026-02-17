import * as React from "react";
import {useTransactions} from "../context/TransactionContext.tsx";
import StatCard from "../components/StatCard.tsx";
import { BanknoteArrowDown, BanknoteArrowUp, WalletCards } from 'lucide-react';
import TransactionTable from "../components/TransactionTable.tsx";

const Transactions: React.FC = () => {
    const {paginatedData, goToPage ,stats, accounts} = useTransactions();


    // const currMonth = new Date().getMonth();
    // const currYear = new Date().getFullYear();
    //
    // const currMonthTransactions = paginatedData.items.filter(t => {
    //     const tDate = new Date(t.bookingDate);
    //     return tDate.getMonth() === currMonth && tDate.getFullYear() === currYear;
    // });

    // console.log(currMonthTransactions);
    
    return (
        <div className="grid grid-cols-12 gap-3">
            {accounts.length > 0 &&
                <>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Transactions"
                            qty={stats.totalCount}
                            diff={stats.countDiff} currency={accounts[0].currency}
                            type='info'
                            page='transaction'
                            icon={<WalletCards className="w-6 h-6"/>}/>
                    </div>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Income"
                            amount={stats.totalIncome}
                            diff={stats.incomeDiff} currency={accounts[0].currency}
                            type='income'
                            page='transaction'
                            icon={<BanknoteArrowDown className="w-6 h-6"/>}/>
                    </div>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Expense"
                            amount={stats.totalExpense}
                            diff={stats.expenseDiff} currency={accounts[0].currency}
                            type='expense'
                            page='transaction'
                            icon={<BanknoteArrowUp className="w-6 h-6"/>}/>
                    </div>
                    <div className="col-span-3">
                        <StatCard
                            title="Total Expense"
                            amount={stats.totalExpense}
                            diff={stats.expenseDiff} currency={accounts[0].currency}
                            type='expense'
                            page='transaction'
                            icon={<BanknoteArrowUp className="w-6 h-6"/>}/>
                    </div>
                </>
            }
            <div className="col-span-9 row-span-12 overflow-x-auto rounded-xl border border-gray-800 bg-bank-comp text-white">
                <TransactionTable  
                    transactions={paginatedData.items} 
                    pageType="transactions" 
                    totalCount={paginatedData.totalCount}
                    currentPage={paginatedData.currentPage}
                    totalPages={paginatedData.totalPages}
                    onPageChange={(page) => goToPage(page)}
                />
            </div>
        </div>
    )
}

export default Transactions