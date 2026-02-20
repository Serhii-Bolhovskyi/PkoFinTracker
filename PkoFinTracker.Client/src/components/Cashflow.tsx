import * as React from "react";
import type {TransactionProps} from "./TransactionTable.tsx";
import {useMemo, useState} from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


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
            <MixBarChart data={chartData} />
        </div>

    )
}

const MixBarChart: React.FC<{ data: any }> = ({ data }) => {
    const [focusedDataKey, setFocusedDataKey] = useState<string | null>(null);
    const [locked, setLocked] = useState<boolean>(false);

    const onLegendMouseEnter = (payload: any) => {
        if (!locked) {
            setFocusedDataKey(String(payload.dataKey));
        }
    };

    const onLegendMouseOut = () => {
        if (!locked) {
            setFocusedDataKey(null);
        }
    };

    const onLegendClick = (payload: any) => {
        if (focusedDataKey === String(payload.dataKey)) {
            if (locked) {
                setFocusedDataKey(null);
                setLocked(false);
            } else {
                setLocked(true);
            }
        } else {
            setFocusedDataKey(String(payload.dataKey));
            setLocked(true);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D2B3F" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => <span className="flex flex-col text-gray-400 text-base text-left">€{Number(value).toFixed(1)}</span>} 
                    />
                    <Legend
                        onMouseEnter={onLegendMouseEnter}
                        onMouseOut={onLegendMouseOut}
                        onClick={onLegendClick}
                        verticalAlign="top" 
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ top: "0px" }}
                        formatter={(value) => <span className="text-white font-medium">{value}</span>}
                    />
                    <Bar
                        dataKey="expense"
                        stackId="a"
                        fill={focusedDataKey == null || focusedDataKey === 'expense' ? '#A855F7' : '#2D2B3F'}
                        radius={[0, 0, 0, 0]}
                    />
                    <Bar
                        dataKey="income"
                        stackId="a"
                        fill={focusedDataKey == null || focusedDataKey === 'income' ? '#201e30' : '#2D2B3F'}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// class SimpleBarChart extends React.Component<{ data: any }> {
//     render() {
//         let {data} = this.props;
//         return (
//             <BarChart
//                 style={{width: '100%', maxHeight: '45vh', aspectRatio: 1.618}}
//                 responsive
//                 data={data}
//                 margin={{
//                     top: 5,
//                     right: 0,
//                     left: 0,
//                     bottom: 5,
//                 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3"/>
//                 <XAxis dataKey="name"/>
//                 <YAxis width="auto"/>
//                 <Tooltip/>
//                 <Legend/>
//                 <Bar name="Income" dataKey="income" fill="#A855F7" radius={[4, 4, 0, 0]}/>
//                 <Bar name="Expense" dataKey="expense" fill="#DAA520" radius={[4, 4, 0, 0]}
//                 />
//                 <RechartsDevtools/>
//             </BarChart>
//         );
//     }
// }

export default Cashflow;