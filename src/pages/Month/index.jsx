import { NavBar, DatePicker } from "antd-mobile";
import './index.scss'
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import _ from 'lodash'
import DailyBill from "./components/DayBill";

const Month = () => {
    // 按月做数据的分组
    const billList = useSelector(state => state.bill.billList)
    //数据的二次处理 分组后当前月份数组
    const monthGroup = useMemo(() => {
        // return 出去计算之后的值
        return _.groupBy(billList,(item) => dayjs(item.date).format('YYYY-MM'))
    },[billList])
    console.log(monthGroup)

    // 控制弹框的打开与关闭
    const [dateVisible, setDateVisible] = useState(false)

    // 控制时间显示的状态
    const [currentDate, setCurrentDate] = useState(()=>{
        return dayjs(new Date()).format('YYYY-MM')
    })

    // 当前月份数组 初始化直接取当月数据，去掉 useEffect
    // const [currentMonthList, setMonthList] = useState([])
    // const [currentMonthList, setMonthList] = useState([])

    // 直接用 useMemo 计算当前月数据
    // const currentMonthList = useMemo(() => {
    //     const nowDate = dayjs(new Date()).format('YYYY-MM')
    //     return monthGroup[nowDate] || []
    // }, [monthGroup])

    // 当前月份数组 —— 跟随日期选择器变化
    const currentMonthList = useMemo(() => {
        return monthGroup[currentDate] || []
    }, [monthGroup, currentDate])

    const monthResult = useMemo(()=>{
        // 如果当前没有账单，直接返回 0
        if(!currentMonthList || currentMonthList.length === 0){
            return {
                pay:0,
                income:0,
                total: 0
            }
        }

        // 返回计算后的结果
        // 支出 、收入 、结余
        const pay = currentMonthList.filter(item => item.type==='pay').reduce((a,c)=>a+c.money,0)
        const income = currentMonthList.filter(item => item.type==='income').reduce((a,c)=>a+c.money,0)
        return {
            pay,
            income,
            total: pay + income
        }
    },[currentMonthList])

    // 初始化时把当前月的统计数据显示出来
    // useEffect(()=>{
    //     // 初始化逻辑
    //     const nowDate = dayjs(new Date()).format('YYYY-MM')
    //     if(monthGroup[nowDate]){
    //         setMonthList(monthGroup[nowDate])
    //     }
        
    // },[monthGroup])

    // 确认回调
    const onConfirm = (date) => {
        setDateVisible(false)
        // 补写其他逻辑
        console.log(date)
        const formatDate = dayjs(date).format('YYYY-MM')
        console.log(formatDate)
        // 获取对应年月数组
        // setMonthList(monthGroup[formatDate])
        setCurrentDate(formatDate)
    }


    // 当前月按照日来分组
    const dayGroup = useMemo(()=>{
        // 🔥 先过滤掉 0 元、无效数据
        const validList = currentMonthList.filter(item => 
            item.money !== 0 && item.type && item.useFor
        )
        //return 计算之后的结果
        const groupData = _.groupBy(validList,(item) => dayjs(item.date).format('YYYY-MM-DD'))
        const keys = Object.keys(groupData).sort((a,b) => dayjs(b) - dayjs(a))
        return {
            groupData,
            keys
        }
    },[currentMonthList])

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={null}>月度收支</NavBar>
            <div className="content">
                <div className="header">
                    {/* 时间切换区域 */}
                    <div className="date" onClick = {() => {setDateVisible(true)}}>
                        <span className="text">
                            {currentDate+''}账单
                        </span>
                        {/* 思路：根据当前弹框打开的状态控制expand类名是否存在 */}
                        <span className={classNames('arrow',dateVisible && 'expand')}></span>
                    </div>
                    {/* 统计区域 */}
                    <div className="twoLineOverview">
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    {/* 时间选择器 */}
                    <DatePicker
                       className="kaDate"
                       title="记账日期"
                       precision="month"
                       visible={dateVisible}
                       onCancel={() => setDateVisible(false)}
                       onConfirm={onConfirm}
                       onClose={() => setDateVisible(false)}
                       max={new Date()}
                    />
                </div>
                {/* 单日列表统计 */}
                {
                    dayGroup.keys.map((key) => {
                    return <DailyBill key={key} date={key} billList={dayGroup.groupData[key]}/>
                })
                }
                
            </div>
        </div>
    )
}

export default Month