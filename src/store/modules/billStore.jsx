// 账单列表相关store
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { MOCK_DATA } from "@/mock/billMock";

const billStore = createSlice({
    name: 'bill' ,
    initialState:{
        billList: []
    },
    reducers: {
        //同步修改方法
        setBillList(state,action){
            state.billList = action.payload;
        },
        // 同步添加账单方法
        addBill(state,action){
            state.billList.push(action.payload)
        }
    }
})

//解构actionCreater函数
const {setBillList, addBill} = billStore.actions

const STORAGE_KEY = 'bill_list_data'

// 读取本地缓存，无数据返回mock
const getLocalData = () => {
  const local = localStorage.getItem(STORAGE_KEY)
  if(local){
    return JSON.parse(local)
  }
  // 初始化存入mock
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA))
  return MOCK_DATA
}

// 保存到本地
const saveLocalData = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

//编写异步
const getBillList = () => {
    return async (dispatch) => {
        if(import.meta.env.DEV){
            try {
                // 编写异步请求
                const res = await axios.get('http://localhost:8888/ka')
                // 触发同步reducer
                dispatch(setBillList(res.data))
            } catch (error) {
                // 没开server也兜底用mock
                const list = getLocalData()
                dispatch(setBillList(list))
            }
        }else{
            // 线上预览：直接加载mock静态数据
            const list = getLocalData()
            dispatch(setBillList(list))
        }  
    }
}

// 异步添加
const addBillList = (data) => {
    return async (dispatch) => {
        // 只有本地开发允许新增请求
        if(import.meta.env.DEV){
            try {
                // 开发环境先走后端接口
                const res = await axios.post('http://localhost:8888/ka',data)
                dispatch(addBill(res.data))
                // 更新本地缓存
                const nowList = getLocalData()
                nowList.push(res.data)
                saveLocalData(nowList)
            } catch (err) {
                // 后端没开，走本地存储新增
                const nowList = getLocalData()
                const newItem = { id: Date.now(), ...data }
                nowList.push(newItem)
                saveLocalData(nowList)
                dispatch(addBill(newItem))
            }
        }else{
            // 线上环境：只用localStorage新增
            const nowList = getLocalData()
            const newItem = { id: Date.now(), ...data }
            nowList.push(newItem)
            saveLocalData(nowList)
            dispatch(addBill(newItem))
        }
    }
}

export {getBillList, addBillList}
// 导出reducer
const reducer = billStore.reducer

export default reducer