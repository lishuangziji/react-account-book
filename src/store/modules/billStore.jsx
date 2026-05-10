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
                dispatch(setBillList(MOCK_DATA))
            }
        }else{
            // 线上预览：直接加载mock静态数据
            dispatch(setBillList(MOCK_DATA))
        }  
    }
}

// 异步添加
const addBillList = (data) => {
    return async (dispatch) => {
        // 只有本地开发允许新增请求
        if(import.meta.env.DEV){
            // 编写异步请求
            const res = await axios.post('http://localhost:8888/ka',data)
            // 触发同步reducer
            dispatch(addBill(res.data))
        }
        // 线上直接禁用新增逻辑，只做预览
    }
}

export {getBillList, addBillList}
// 导出reducer
const reducer = billStore.reducer

export default reducer