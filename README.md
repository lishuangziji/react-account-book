# 📊 个人记账管理系统

> 基于 React + Redux + Recharts 开发的移动端个人记账应用，支持收支记录、年度数据统计与可视化展示。

## ✨ 功能亮点
- 💰 日常收入/支出记录与分类管理
- 📈 年度账单统计：总收入/总支出/总结余
- 📊 月度收支趋势折线图 + 支出分类占比饼图
- 📱 移动端响应式布局，适配手机端使用
- 🧹 空数据/异常状态处理，提升用户体验

## ✨ 项目亮点
- 状态管理：使用 Redux Toolkit 统一管理收支数据，实现跨组件数据共享
- 数据可视化：通过 Recharts 实现月度收支趋势和支出分类占比图表，数据直观展示
- 响应式适配：基于 Ant Design Mobile 实现移动端响应式布局，适配不同手机屏幕
- 自动化部署：配置 Netlify 持续部署，推送代码后自动构建发布，在线预览稳定可访问

## 🛠️ 技术栈
- 框架：React 19 + Redux Toolkit
- UI 组件库：Ant Design Mobile
- 数据可视化：Recharts
- 日期处理：Day.js
- 样式：SCSS
- 工具库：Lodash
- 构建工具：Vite

## 📂 项目结构
src/           
├── components/              # 公共组件（图表、图标等）     
├── pages/                   # 页面组件（年度账单等）      
├── store/                   # Redux 状态管理       
├── constants/               # 常量配置        
└── App.jsx                  # 入口文件

## 📦 项目启动
```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev

# 打包构建
npm run build
```
## 🔗 在线预览
[点击查看项目演示](https://resonant-moxie-93600f.netlify.app)
