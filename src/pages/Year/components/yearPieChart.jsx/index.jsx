import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './index.scss'

const YearPieChart = ({ cateData }) => {
  // 饼图颜色
  const COLORS = ['#f43f5e', '#fb923c', '#38bdf8', '#a855f7', '#10b981', '#8b5cf6', '#ec4899']

  return (
    <div className="pie-box">
      <ResponsiveContainer width="100%" height={200} minWidth={0}>
        <PieChart>
          <Pie
            data={cateData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            dataKey="money"
            nameKey="name"
          >
            {cateData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default YearPieChart