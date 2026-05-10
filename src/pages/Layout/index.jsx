import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBillList } from "@/store/modules/billStore"
import { TabBar } from "antd-mobile"
import './index.scss'
import {BillOutline, CalculatorOutline, AddCircleOutline } from 'antd-mobile-icons'

const tabs = [
    {
      key: '/',
      title: '月度账单',
      icon: <BillOutline />,
    },
    {
      key: '/new',
      title: '记账',
      icon: <CalculatorOutline />,
    },
    {
      key: '/year',
      title: '年度账单',
      icon: <AddCircleOutline />,
    },
  ]

const Layout = () => {
    const dispatch = useDispatch()
    const billList = useSelector(state => state.bill.billList); // 取数据用的
    useEffect(()=>{
        dispatch(getBillList())
    },[dispatch])
    console.log('当前billList:', billList); // 控制台打印，看有没有数据

    // 切换菜单跳转路由
    const navigate = useNavigate()
    const location = useLocation() // 获取当前路由
    // 让高亮永远跟随当前路由
    const activeKey = location.pathname

    const switchRoute = (path) => {
        console.log(path)
        navigate(path)
    }

    return (
        <div className="layout">
            <div className="container">
                <Outlet />
            </div>
            <div className="footer">
                <TabBar activeKey={activeKey} onChange={switchRoute}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} title={item.title} icon={item.icon}/>
                    ))}
                </TabBar>
            </div>
        </div>
    )
}

export default Layout