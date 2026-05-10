import classNames from "classnames";
import './index.scss'
import { useMemo, useState } from "react";
import { billTypeToName } from "@/contants";
import Icon from "@/components/icon";

const DailyBill = ({date, billList}) => {
    // 🔥 过滤：只保留 金额≠0 且 有类型 的数据
    const filteredList = useMemo(() => {
        return billList?.filter(item => 
            item.money !== 0 &&          // 金额不是0
            item.type &&                // 有收入/支出类型
            item.useFor                 // 有消费类型
        ) || []
    }, [billList])

    const dayResult = useMemo(()=>{
        // 如果当前没有账单 返回0
        if (!billList || billList.length===0){
            return {
                pay:0,
                income:0,
                total:0
            }
        }

        // 返回计算后的结果
        // 支出、收入、结余
        const pay = billList.filter((item) => item.type === "pay").reduce((a,c)=>a+c.money,0)
        const income = billList.filter((item) => item.type === "income").reduce((a,c)=>a+c.money,0)
        return {
            pay,
            income,
            total: pay+income
        }
    },[billList])

    // 控制展开收起
    const [visible, setVisible] = useState(false)

    return (
        <div className={classNames('dailyBill')}>
            <div className="header">
                <div className="dateIcon">
                    <span className="date">{date}</span>
                    {/* expand 有这个 箭头朝上 */}
                    <span className={classNames('arrow',visible && 'expand')} onClick={() => setVisible(!visible)}></span>
                </div>
                <div className="oneLineOverview">
                    <div className="pay">
                        <span className="type">支出</span>
                        <span className="money">{dayResult.pay.toFixed(2)}</span>
                    </div>
                    <div className="income">
                        <span className="type">收入</span>
                        <span className="money">{dayResult.income.toFixed(2)}</span>
                    </div>
                    <div className="balance">
                        <span className="type">结余</span>
                        <span className="money">{dayResult.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* 单日列表 */}
            <div className="billList" style={{display:visible?"block":"none"}}>
                {
                    filteredList.map((item) => {
                        return (
                            <div className="bill" key={item.id}>
                                {/* 图标 */}
                                <Icon type={item.useFor}/>
                                <div className="detail">
                                    <div className="billType">{billTypeToName[item.useFor]}</div>
                                </div>
                                <div className={classNames('money',item.type)}>
                                    {item.money.toFixed(2)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DailyBill