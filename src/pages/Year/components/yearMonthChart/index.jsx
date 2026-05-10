import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import './index.scss'


const YearMonthChart = ({monthData}) => {

    return (
        <div className="outer">
            <ResponsiveContainer width="100%" height={200} minWidth={0} >
                <LineChart data={monthData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='name' stroke='#666' fontSize={12} />
                    <YAxis 
                        stroke='#666' 
                        fontSize={12} 
                        label={{
                            value: '金额 / 元',
                            angle: -90,
                            position: 'insideLeft'
                        }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="收入" 
                        stroke="#16a34a" 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="支出" 
                        stroke="#f43f5e" 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default YearMonthChart