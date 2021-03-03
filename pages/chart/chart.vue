<template>
	<view class="content">
		<u-navbar :is-back="true" :title="title" title-color="white" :background="background"></u-navbar>
		<view class="title">
			<view class="">
				<view>日期</view>
				<view class="u-demo-result-line" @click="isshow = true">{{ input|date('yy-mm')}}</view>
				<u-picker :mode="mode" :defaultTime="defaultTime" v-model="isshow" :params="params" end-year="2030" @confirm="confirm"
				 :defaultSelector="defaultSelector" :range-key="rangKey"></u-picker>
			</view>
			<view class="">
				<view class="">
					月支出
				</view>
				<view class="">
					{{expenditureSubtotal}}
				</view>
			</view>
			<view class="">
				<view class="">
					月收入
				</view>
				<view class="">
					{{incomeSubtotal}}
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS || H5  -->
		<view id="container"></view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS || H5 -->
		<view>非 APP、H5 环境不支持</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		onLoad() {},
		methods: {}
	}
</script>

<script module="f2" lang="renderjs">
	let myChart
	export default {
		data: function() {
			return {
				title: "账单统计",
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				canvas: '',
				chartData: [],

				defaultTime: '2021-01',
				expenditureSubtotal: 0,
				incomeSubtotal: 0,
				mode: 'time',
				isshow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,
					province: true,
					city: true,
					area: true,
					timestamp: true
				},
				defaultSelector: [0],
				rangKey: 'name',
				input: '',
			}
		},
		async mounted() {

			const value = uni.getStorageSync('setUserData');
			let data = new Date();
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			console.log(data.getTime());
			let res = await this.$api.getMouth({
				startTime: data.getTime(),
				endTime: data.getTime() + 2592000000,
				userId: value.userId
			});
			if (res.data.status == 200) {
				this.incomeSubtotal = res.data.data.incomeSubtotal
				this.expenditureSubtotal = res.data.data.expenditureSubtotal
				const expention = res.data.data.expenditureProportion
				const incometion = res.data.data.incomeProportion
				const that = this
				var proData = []

				if (expention.length > 0) {
					for (let i = 0; i < expention.length; i++) {
						proData.push(
						{
							type: 'bar',
							data: [expention[i].money],
							coordinateSystem: 'polar',
							name: expention[i].name,
							stack: expention[i].name
						}
						)
					}
					that.chartData = proData

				}
				proData = that.chartData
				if (incometion.length > 0) {
					for (let i = 0; i < incometion.length; i++) {
						proData.push(
						{
							type: 'bar',
							data: [incometion[i].money],
							coordinateSystem: 'polar',
							name: incometion[i].name,
							stack: incometion[i].name
						}
						)
					}
					that.chartData = proData
					// renderjs 里可以自由操作 window 、dom等浏览器环境属性
					const container = document.getElementById('container')
					// 创建 html5 canvas DOM
					const canvas = document.createElement('canvas')
					// id 不可重复
					canvas.id = 'f2'
					canvas.width = uni.upx2px(750)
					canvas.height = uni.upx2px(750)
					container.appendChild(canvas)
					this.canvas = canvas;

					if (typeof window.F2 === 'function') {
						this.initF4()
					} else {
						// 动态引入较大类库避免影响页面展示
						const script = document.createElement('script')
						script.src = 'static/echarts.min.js'
						script.onload = this.initF4.bind(this)
						document.head.appendChild(script)

					}
				}
			}
		},
		methods: {
			init5: function() {
				console.log(234);
			},
			async confirm(e) {
				console.log(e);
				this.input = '';
				this.chartData=[]
				if (this.params.year) this.input += e.year;
				if (this.params.month) this.input += '-' + e.month;
				const that = this
				const value = uni.getStorageSync('setUserData');
				let res = await this.$api.getMouth({
					startTime: e.timestamp * 1000,
					endTime: (e.timestamp + 2592000) * 1000,
					userId: value.userId
				});
				if (res.data.status == 200) {
					if (res.data.data.incomeSubtotal && res.data.data.expenditureSubtotal) {
						this.incomeSubtotal = res.data.data.incomeSubtotal
						this.expenditureSubtotal = res.data.data.expenditureSubtotal
					}

					const expention = res.data.data.expenditureProportion
					const incometion = res.data.data.incomeProportion
					const that = this
					var proData = []
					if (expention.length > 0) {
						for (let i = 0; i < expention.length; i++) {
							
							proData.push({
								type: 'bar',
								data: [expention[i].money],
								coordinateSystem: 'polar',
								name: expention[i].name,
								stack: expention[i].name
							}
							)
							
						}
						that.chartData = proData
					
					}
					proData = that.chartData
					if (incometion.length > 0) {
						for (let i = 0; i < incometion.length; i++) {
							proData.push(
							{
								type: 'bar',
								data: [incometion[i].money],
								coordinateSystem: 'polar',
								name: incometion[i].name,
								stack: incometion[i].name
							}
							)
						}
						that.chartData = proData
						console.log(proData,1111111111111111111111111111)
				}
				console.log(this.chartData)
				if (typeof window.F2 === 'function') {
					this.initF4()
				} else {
					// 动态引入较大类库避免影响页面展示
					const script = document.createElement('script')
					script.src = 'static/echarts.min.js'
					script.onload = this.initF4.bind(this)
					document.head.appendChild(script)

				}
				}

			},
			initF4() {
				var myChart = echarts.init(this.canvas);
				console.log([this.chartData],77777777777777777777777777)
				var option = {
					angleAxis: {},
					radiusAxis: {
						type: 'category',
						data: ['总计'],
						z: 10
					},
					polar: {},
					series: this.chartData,
					legend: {
						show: true,
					}
				}


				myChart.setOption(option);
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 20px;
		background-color: #fff;
	}

	.fitness-ring {
		background-color: #151515;
		box-shadow: 0px 0px 1px 0px #06060d;
	}

	.title {
		padding: 20upx;
		background-color: #00dbe6;
		text-align: center;
		display: flex;
		justify-content: space-around;
		color: #fff;
		width: 100%;
		margin-top: -50rpx;
		margin-bottom: 200rpx;
	}
</style>
