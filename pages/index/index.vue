<template>
	<view>
		<u-navbar :is-back="false" :title="title" title-color="white" :background="background"></u-navbar>
		<refresh ref="refresh" @refresh='refreshs()'>
			<list ref="list" @success="onListSuccess">
				<view class="title">
					<view class="">
						<view>日期</view>
						<view class="u-demo-result-line" @click="openTime()">{{ input|date('yy-mm')}}</view>
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
					<!-- <view class=""> -->
					<!-- <u-input type="select" @click="type_show = true" placeholder="选择类型"/> -->
					<!-- <text @click="type_show = true">类型</text> -->
					<!-- <view @click="type_show = true">{{inputType}}</view> -->
					<!-- <u-action-sheet :list="typeList" v-model="type_show" @click="selectType">123</u-action-sheet> -->
					<!-- </view> -->
				</view>
				<!-- 循环数据 -->

				<u-swipe-action bg-color="rgb(250, 250, 250)" @open="open" :disabled="disabled" :index="index" v-for="(item, index) in list"
				 :key="item.id" :show="item.show" @click="click" :btn-width="btnWidth" @close="close" :options="options">
					<view class="item u-border-bottom" style="width: 800rpx;margin: 0 auto;">
						<view class="itemContent">
							<view>
								<view class="">
									{{item.name}}
								</view>
							</view>
							<view class="">

								<view>
									{{
										 `${new Date(item.productionDate.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getFullYear()}-${new Date(item.productionDate.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getMonth()+1}-${new Date(item.productionDate.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getDate()} ${new Date(item.productionDate.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getHours()}:${new Date(item.productionDate.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')).getMinutes()}										 
										 `
										
									 }}
								</view>
							</view>
							<view class="money">
								{{item.money}}
							</view>

						</view>
						<view class="remarks">
							备注：{{item.remarks}}
						</view>
					</view>
				</u-swipe-action>
			</list>
		</refresh>
		<u-modal ref="uModal" v-model="editShow" :show-cancel-button="true" title="编辑" @confirm="editOrder">
			<view class="" style="padding: 40rpx;">
				<text>金额</text>
				<u-input  v-model="modelMoney" />
			</view>
			<view class="" style="padding: 40rpx;">
				<text>备注:</text>
				<u-input  v-model="modelRemark" />
			</view>
		</u-modal>
		<view class="point" @click="toAdd">
			+
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				title: "收支明细",
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				pic: 'https://uviewui.com/common/logo.png',
				disabled: false,
				btnWidth: 180,
				show: false,

				typeList: [{
						value: 1,
						text: "收入"
					},
					{
						value: 2,
						text: "支出"
					}
				],
				options: [{
						text: '编辑',
						style: {
							backgroundColor: '#007aff',
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
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
				inputType: '收入',
				type_show: false,
				userInfo: {},
				editShow:false,
				modelRemark:'',
				modelMoney:0,modelId:""
			}
		},
		computed: {

			options() {
				return {
					url: '/api/order/pageOrder',
					params: {

					},

				}

			}

		},
		methods: {
			async refreshs(){
				this.$refs.list.refresh()
				
				const value = uni.getStorageSync('setUserData');
				this.userInfo = value
				var data = new Date();
				data.setDate(1);
				data.setHours(0);
				data.setSeconds(0);
				data.setMinutes(0);
				let res = await this.$api.getMouth({
					startTime: data.getTime(),
					endTime: (data.getTime() + 2592000000),
					userId: value.userId
				});
				this.incomeSubtotal = res.data.data.incomeSubtotal
				this.expenditureSubtotal = res.data.data.expenditureSubtotal
			},
			async editOrder(){
				const that = this
				let res = await this.$api.updataOder({
					  id: that.modelId,
					  money: that.modelMoney,
					  remarks: that.modelRemark
				});
				this.$refs.refresh.endAfter()
				this.onListSuccess()
				const value = uni.getStorageSync('setUserData');
				var data = new Date();
				data.setDate(1);
				data.setHours(0);
				data.setSeconds(0);
				data.setMinutes(0);
				let res2 = await this.$api.getMouth({
					startTime: data.getTime(),
					endTime: (data.getTime() + 2592000000),
					userId: value.userId
				});
				this.incomeSubtotal = res2.data.data.incomeSubtotal
				this.expenditureSubtotal = res2.data.data.expenditureSubtotal
			},
			async onListSuccess(list) {
				const that = this
				var data = new Date();
				data.setDate(1);
				data.setHours(0);
				data.setSeconds(0);
				data.setMinutes(0);
				let res = await this.$api.getList({
					pageNum: '1',
					pageSize: '100',
					userId: that.userInfo.userId,
					startTime: data.getTime(),
					endTime: (data.getTime() + 2592000000),
				});
				this.list = res.data.records
				this.$refs.refresh.endAfter()
			},
			selectType(index) {
				// let chinese_type = this.typeList[index].text
				// let type = this.typeList[index].value
			},
			open(index) {
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				});
			},
			close(index) {
				this.list[index].show = false;
			},
			contentClick(index) {
				// console.log(index);
			},
			async click(index, index1) {
				if (index1 == 1) {
					const that = this
					console.log(this.list[index].id)
					let res = await this.$api.deleteOrder({
						id: that.list[index].id
					});
					if (res.data.status == 200) {
						this.list.splice(index, 1);
					} else {
						this.$u.toast(`删除失败`);
					}
				} else {
					this.editShow=true
					const that =this
					console.log(that.list[index])
					this.modelRemark= this.list[index].remarks
					this.modelMoney= this.list[index].money
					this.modelId= this.list[index].id
					// this.$u.toast(`收藏成功`);
				}
			},
			defaultTimeChange(index) {
				this.defaultTime = index == 0 ? '2019-12-11 20:15:35' : '2020-02-05 13:09:42';
				this.mode = 'time';
				this.show = true;
			},
			async confirm(e) {
				console.log(e);
				this.input = '';
				const value = uni.getStorageSync('setUserData');
				if (this.params.year) this.input += e.year;
				if (this.params.month) this.input += '-' + e.month;
				const that = this
				let res = await this.$api.getMouth({
					startTime: e.timestamp * 1000,
					endTime: (e.timestamp + 2592000) * 1000,
					userId: value.userId
				});
				this.incomeSubtotal = res.data.data.incomeSubtotal
				this.expenditureSubtotal = res.data.data.expenditureSubtotal
				let res2 = await this.$api.getList({
					pageNum: '1',
					pageSize: '100',
					userId: value.userId,
					startTime: e.timestamp * 1000,
					endTime: (e.timestamp + 2592000) * 1000,
				});
				this.list = res2.data.records
				this.$refs.refresh.endAfter()

			},
			columnchange(e) {
				let column = e.column,
					index = e.index;
				this.defaultSelector[column] = index;

			},
			openTime() {
				this.isshow = true
			},
			toAdd() {
				uni.navigateTo({
					url: '../add/add'
				})
			},
			getUser() {
				const value = uni.getStorageSync('setUserData');
				var uid = uni.getStorageSync('uid')
				console.log(value, uid)
			}
		},
		async mounted() {
			// 调用组件的request方法开始获取数据
			this.$refs.list.request()

			const value = uni.getStorageSync('setUserData');
			this.userInfo = value
			var data = new Date();
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			let res = await this.$api.getMouth({
				startTime: data.getTime(),
				endTime: (data.getTime() + 2592000000),
				userId: value.userId
			});
			this.incomeSubtotal = res.data.data.incomeSubtotal
			this.expenditureSubtotal = res.data.data.expenditureSubtotal
		}
	}
</script>

<style>
	.title {
		padding: 20upx;
		background-color: #00dbe6;
		text-align: center;
		display: flex;
		justify-content: space-around;
		color: #fff;
	}

	.item {
		padding: 20upx;
		margin: 10upx;
		border-bottom: 1px solid #E5E5E5;
		text-align: center;
		font-size: 30upx;
	}

	.itemContent {
		display: flex;
		justify-content: space-around;
	}

	.money {

		color: #09BB07;
	}

	.btn {
		display: inline-block;
		border-radius: 0;
		border: 0 solid #fff;
		width: 100rpx;
	}

	.remarks {
		color: #ccc;
		text-align: left;
		margin-top: 20rpx;
		margin-left: 40rpx;
		font-size: 20rpx;
	}

	.point {
		position: fixed;
		background-color: rgba(33, 243, 236, 0.6);
		bottom: 150rpx;
		right: 10rpx;
		z-index: 999;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		font-size: 100rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
	}
</style>
