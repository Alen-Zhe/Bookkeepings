import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

// 单独导出(测试接口) import {test} from '@/common/vmeitime-http/'
export const test = (data) => {
	/* http.config.baseUrl = "http://localhost:8080/api/"
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		baseUrl: 'localhost',
		url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
		data,
	})
}

// 登录
export const login = (data) => {
	return http.request({
		url: 'user/login',
		method: 'POST',
		data,
		// handle:true
	})
}
// 获取收支明细列表
export const getList = (params) => {
	return http.request({
		url: `order/pageOrder?${JSON.stringify(params).replace("{", "").replace("}", "").
                replace("\"", "").replace(/\"/g,"").
                replace(/\:/g,"=").replace(/\,/g, "&")}`,
		method: 'GET',
		// handle:true
	})
}
// 获取记账笔数
export const getCount = (params) => {
	return http.request({
		url: `user/getDayAndOrder?${JSON.stringify(params).replace("{", "").replace("}", "").
                replace("\"", "").replace(/\"/g,"").
                replace(/\:/g,"=").replace(/\,/g, "&")}`,
		method: 'GET',
		// handle:true
	})
}
// 获取记账笔数
export const getMouth = (params) => {
	return http.request({
		url: `order/getSubtotal?${JSON.stringify(params).replace("{", "").replace("}", "").
                replace("\"", "").replace(/\"/g,"").
                replace(/\:/g,"=").replace(/\,/g, "&")}`,
		method: 'GET',
		// handle:true
	})
}
// 删除记录
export const deleteOrder = (data) => {
	return http.request({
		url: 'order/delete',
		method: 'DELETE',
		data,
	})
}
// 获取记账笔数
export const getType = (params) => {
	return http.request({
		url: `income/getPage/${params.type}/${params.pageNum}/${params.pageSize}/${params.userId}`,
		method: 'GET',
		// handle:true
	})
}
// 新增订单
export const addOrder = (data) => {
	return http.request({
		url: 'order/add',
		method: 'POST',
		data,
		// handle:true
	})
}
// 新增类别
export const addPro = (data) => {
	return http.request({
		url: 'income/add',
		method: 'POST',
		data,
		// handle:true
	})
}
// 注册
export const register = (data) => {
	return http.request({
		url: 'user/registered',
		method: 'POST',
		data,
		// handle:true
	})
}
// 发送验证码
export const sendEmail = (data) => {
	return http.request({
		url: 'user/sendEmail',
		method: 'POST',
		data,
		// handle:true
	})
}
// 清空数据
export const delData = (data) => {
	return http.request({
		url: 'user/deleteData',
		method: 'Delete',
		data,
		// handle:true
	})
}
// 修改密码
export const updataPwd = (data) => {
	return http.request({
		url: 'user/updatePassword',
		method: 'PUT',
		data,
		// handle:true
	})
}
// 修改用户信息
export const updataUserinfo = (data) => {
	return http.request({
		url: 'user/update',
		method: 'PUT',
		data,
		// handle:true
	})
}
// 修改订单信息
export const updataOder = (data) => {
	return http.request({
		url: 'order/updateOder',
		method: 'PUT',
		data,
		// handle:true
	})
}
// 删除分类
export const deleteClass = (data) => {
	return http.request({
		url: 'income/delete',
		method: 'DELETE',
		data,
		// handle:true
	})
}
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	test,
	login,
	getList,
	getCount,
	getMouth,
	deleteOrder,
	getType,
	addOrder,
	addPro,
	register,
	sendEmail,
	delData,
	updataPwd,
	updataUserinfo,
	updataOder,
	deleteClass
}