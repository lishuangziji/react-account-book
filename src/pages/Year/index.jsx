import { Button, Card } from 'antd-mobile'
import {LeftOutline, RightOutline} from 'antd-mobile-icons'
import './index.scss'
import { useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import YearMonthChart from './components/yearMonthChart'
import { billTypeToName } from '@/contants'
import Icon from '@/components/icon'
import YearPieChart from './components/yearPieChart.jsx'

const Year = () => {
    // 从redux拿到账单数据
    const billList = useSelector(state => state.bill.billList)

    // 按年分组数据
    const yearGroup = useMemo(() => {
        return _.groupBy(billList,(item) => dayjs(item.date).format('YYYY'))
    },[billList])

    // 当前选中的年份
    const [currentYear, setCurrentYear] = useState(() => {
        return dayjs().format('YYYY')
    })

    // 当前年份的账单列表
    const currentYearList = useMemo(() => {
        return yearGroup[currentYear] || []
    },[yearGroup,currentYear])

    // 年度统计：收入、支出、结余
    const yearResult = useMemo(() => {
        if(!currentYearList ||currentYearList.length === 0){
            return {
                pay: 0,
                income: 0,
                total: 0
            }
        }

        const pay = currentYearList.filter(item => item.type === 'pay').reduce((a,c) => a + Math.abs(c.money),0)
        const income = currentYearList.filter(item => item.type === 'income').reduce((a,c) => a + c.money,0)
        return {
            pay: pay,
            income: income,
            total: pay + income
        }
    },[currentYearList])

    // 本年 1-12月 每月收入、支出
    const monthData = useMemo(() => {
        const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        // 将当前年账按 【YYYY-MM】分组
        const groupByMonth = _.groupBy(currentYearList,item => dayjs(item.date).format('YYYY-MM'))

        // 生成1-12月数据（无数据为0）
        return months.map((m,index) => {
            const key = `${currentYear}-${String(index+1).padStart(2,'0')}`
            const list = groupByMonth[key] || []
            const pay = list.filter(i => i.type === 'pay').reduce((a,c) => a+Math.abs(c.money),0)
            const income = list.filter(i => i.type === 'income').reduce((a,c) => a+c.money,0) 
            return {
                name: m,
                支出: pay,
                收入: income
            }
        })
    },[currentYearList,currentYear])

    // 支出分类统计
    const yearCateData = useMemo(() => {
        // 只看支出
        const payList = currentYearList.filter(item => item.type === 'pay')
        if(!payList.length) return []
        // 按useFor分组
        const groupData = _.groupBy(payList,'useFor')
        // 计算每个分类总金额,并过滤掉 0 元的
        return Object.keys(groupData).map(key => {
            const totalMoney = groupData[key].reduce((sum,item) => sum+Math.abs(item.money) ,0)
            return {
                type: key,
                name: billTypeToName[key] || key,
                money: totalMoney
            }
        }).filter(item => item.money > 0) //  过滤掉金额为 0 的分类
     },[currentYearList])

    // 点击左右箭头切换年份
    const changeYear = (type) => {
        const newYear = type === 'prev'
          ? dayjs(currentYear).subtract(1,'year').format('YYYY')
          : dayjs(currentYear).add(1,'year').format('YYYY')
        setCurrentYear(newYear)
     }



    return (
        <div className='yearlyBillPage'>
            
            <div className='header'>
                <Button size='small' ghost className='arrow-btn' onClick={()=>changeYear('prev')}>
                    <LeftOutline />
                </Button>
                <h1 className='title'>{currentYear} 年度账单</h1>
                <Button size='small' ghost className='arrow-btn'onClick={()=>changeYear('next')}>
                    <RightOutline />
                </Button>
            </div>

            <div className='yearly-content'>
                {/* 无数据时直接显示空状态，不渲染图表 */}
                {currentYearList.length === 0 ? (
                    <div className="empty">暂无数据，快去记账吧</div>
                ) : (
                    <>
                        {/* 总览卡片 */}
                        <Card className='summary-card'>
                            <div className='summary-row'>
                                <div className='summary-item'>
                                    <div className='label'>总收入</div>
                                    <div className='income'>{yearResult.income.toFixed(2)}</div>
                                </div>
                                <div className='summary-item'>
                                    <div className='label'>总支出</div>
                                    <div className='pay'>{yearResult.pay.toFixed(2)}</div>
                                </div>
                                <div className='summary-item'>
                                    <div className='label'>总结余</div>
                                    <div className='total'>{yearResult.total.toFixed(2)}</div>
                                </div>
                            </div>
                        </Card>

                        {/* 月度趋势 */}
                        <Card title='月度收支趋势' className='card'>
                            <YearMonthChart monthData={monthData}/>
                        </Card>

                        {/* 支出分类 */}
                        <Card title='支出分类占比' className='card'>
                            <YearPieChart cateData={yearCateData} />
                            
                            <div className="cate-list">
                                {yearCateData.length > 0 ? (
                                    yearCateData.map((item) => (
                                        <div className="cate-item" key={item.type}>
                                            <div className='icon'>
                                                <Icon type={item.type} />
                                                <span>{item.name}</span>
                                            </div>
                                            <span>{item.money.toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div>暂无支出分类数据</div>
                                )}
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}

export default Year