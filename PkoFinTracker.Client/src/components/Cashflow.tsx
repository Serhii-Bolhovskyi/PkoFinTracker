import * as React from "react";
import type {TransactionProps} from "./TransactionTable.tsx";
import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import {RechartsDevtools} from "@recharts/devtools";

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

class SimpleBarChart extends React.Component<{ data: any }> {
    render() {
        let {data} = this.props;
        return (
            <BarChart
                style={{width: '100%', maxHeight: '45vh', aspectRatio: 1.618}}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis width="auto"/>
                <Tooltip/>
                <Legend/>
                <Bar name="Income" dataKey="income" fill="#A855F7" radius={[4, 4, 0, 0]}/>
                <Bar name="Expense" dataKey="expense" fill="#DAA520" radius={[4, 4, 0, 0]}
                />
                <RechartsDevtools/>
            </BarChart>
        );
    }
}

export default Cashflow;