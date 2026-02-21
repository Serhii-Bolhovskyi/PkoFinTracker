import {type Category, useTransactions} from "../../context/TransactionContext.tsx";
import * as React from "react";
import {useState} from "react";

interface FilterModalProps {
    categories: Category[];
    onClose: () => void;
}

interface filterBtnProps {
    label: string,
    isActive: boolean,
    onClick: () => void
}


const statusArr = [
    {label: 'All', value: ""},
    {label: 'Success', value: "BOOK"},
    {label: 'Rejected', value: 'RJCT'},
    {label: 'Pending', value: "PDNG"}
]

const indicatorArr = [
    {label: 'All', value: ""},
    {label: 'Income', value: 'CRDT'},
    {label: 'Expense', value: "DBIT"}
]

const FilterModal: React.FC<FilterModalProps> = ({categories, onClose}) => {
    const {
        selectedCategoryIds,setSelectedCategoryIds,
        indicator, setIndicator,
        amountRange, setAmountRange,
        status, setStatus} = useTransactions();

    const [tempIds, setTempIds] = useState<number[]>(selectedCategoryIds);
    const [tempIndicator, setTempIndicator] = useState<string>(indicator || "");
    const [tempAmount, setTempAmount] = useState<[number | null, number | null]>(amountRange);
    const [tempStatus, setTempStatus] = useState<string>(status || "");

    const toggleCategory = (id: number) => {
        setTempIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }

    const handleMinChange = (value: string) => {
        const num = value === "" ? null : Number(value);
        setTempAmount([num, tempAmount[1]]);
    }
    const handleMaxChange = (value: string) => {
        const num = value === "" ? null : Number(value);
        setTempAmount([tempAmount[0], num]);
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedCategoryIds(tempIds);
        setIndicator(tempIndicator);
        setAmountRange(tempAmount);
        setStatus(tempStatus);
        onClose();
    }

    return(
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="relative w-120 p-6 rounded-2xl bg-bank-comp shadow-2xl border border-white/10 z-50">

                <FilterModalTitle title="Category"/>

                <div className="max-h-40 overflow-y-auto flex gap-3 flex-wrap text-white/70 text-sm leading-relaxed">
                    {categories.map((category) => {
                        const isSelected = tempIds.includes(category.id);
                        return (
                            <FilterBtn
                                key={category.id}
                                label={category.name}
                                isActive={isSelected}
                                onClick={() => toggleCategory(category.id)}
                            />
                        )
                    })}
                </div>

                <FilterModalTitle title="Transaction type"/>

                <div className="flex gap-3 text-white/70 text-sm leading-relaxed">
                    {indicatorArr.map((type) => {
                        return (
                            <FilterBtn
                                key={type.value}
                                label={type.label}
                                isActive={tempIndicator === type.value}
                                onClick={() => setTempIndicator(type.value)}
                            />
                        )
                    })}
                </div>

                <FilterModalTitle title="Amount"/>

                <div className="flex items-center gap-4 justify-between text-white/70 text-sm leading-relaxed">
                    <input
                        className="w-1/2 p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors outline-none"
                        placeholder="Min"
                        type="number"
                        value={tempAmount[0] ?? ""}
                        onChange={(e) => handleMinChange(e.target.value)}
                    />
                    <input
                        className="w-1/2 p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors outline-none"
                        placeholder="Max"
                        type="number"
                        value={tempAmount[1] ?? ""}
                        onChange={(e) => handleMaxChange(e.target.value)}
                    />
                </div>

                <FilterModalTitle title="Status"/>

                <div className="flex gap-3 text-white/70 text-sm leading-relaxed">
                    {statusArr.map((type) => {
                        return (
                            <FilterBtn
                                key={type.value}
                                label={type.label}
                                isActive={tempStatus === type.value}
                                onClick={() => setTempStatus(type.value)}
                            />
                        )
                    })}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategoryIds([])
                            setTempIds([])
                            setIndicator("")
                            setTempIndicator("")
                            setTempAmount([null, null])
                            setAmountRange([null, null])
                            setTempStatus("")
                            setStatus("")
                            onClose()
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-bank-purple text-white font-bold hover:bg-purple-500 shadow-lg shadow-purple-600/20 transition"
                    >
                        Apply
                    </button>
                </div>
            </form>
        </div>
    )
}

const FilterBtn: React.FC<filterBtnProps> = ({label, isActive, onClick}) => {
    return(
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-xl border transition-all duration-200 text-sm
             ${isActive
                ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'
            }`}>
            {label}
        </button>
    )
}

const FilterModalTitle: React.FC<{ title: string }> = ({title}) => {
    return (
        <div className="flex py-4 items-center gap-3">
            <div className="h-px w-full bg-white/30"></div>
            <h1 className="text-2xl font-semibold whitespace-nowrap tracking-wide">{title}</h1>
            <div className="h-px w-full bg-white/30"></div>
        </div>
    )
}

export default FilterModal;