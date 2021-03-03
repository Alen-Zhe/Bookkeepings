<template>
	<view>
		<u-navbar :is-back="false" :title="title" title-color="white" :background="background"></u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 headers">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="110"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20 u-line-1">{{nickname}}</view>
			</view>
			<view class="u-m-l-10 u-p-10" @click="noOpen">
				<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
			</view>
		</view>
		<view class="u-m-t-1">
			<u-cell-group>
				<view class="countNum">
					<view class="">
						<view>{{dayNum}}</view>
						<view>记账总天数</view>
					</view>
					<view class="">
						<view>{{orderNum}}</view>
						<view>记账总笔数</view>
					</view>
					<view class="">
						<button type="primary" @click="refresh()">刷新</button>
					</view>
				</view>
			</u-cell-group>
		</view>
		<view class="u-m-t-1">
			<u-cell-group>
					<u-cell-item icon="setting" title="重置密码" @click='goReset()'></u-cell-item>
					<u-cell-item icon="setting" title="管理分类" @click='goAddOrder()'></u-cell-item>
					<!-- <u-cell-item icon="setting" title="账单统计" @click='goTotle()'></u-cell-item> -->
					<u-cell-item icon="setting" title="清除数据" @click='proshow=true'></u-cell-item>
					<u-cell-item icon="setting" title="关于我们" @click='goMe()'></u-cell-item>
					<u-cell-item icon="setting" title="退出登录" @click='goOut()'></u-cell-item>
			</u-cell-group>
		</view>
		<u-modal ref="uModal" v-model="proshow" :show-cancel-button="true" :title="showTitle" @confirm="goClear()">
			<view class="" style="padding: 40rpx;">
				<text>是否清空全部数据</text>
			</view>
			
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "个人中心",
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				pic: 'https://c-ssl.duitang.com/uploads/blog/202101/13/20210113152711_e2408.jpg',
				show: true,
				nickname: "木春",
				dayNum:0,
				orderNum:0,
				userInfo:{},
				showTitle:'提示',
				proshow:false
			}
		},
		onLoad() {
			this.getMemberNum()
		},
		methods: {
			noOpen: () => {
				uni.navigateTo({
				    url: '../userInfo/userInfo'
				})
			},
			async getMemberNum() {
				let that = this
				
				const value = uni.getStorageSync('setUserData');
				let res = await this.$api.getCount({
					userId:value.userId
				});
				that.dayNum=res.data.data.dayNum
				that.orderNum=res.data.data.orderNum
			},
			goMe() {
				uni.navigateTo({
				    url: '../about/about'
				})
			},
			refresh(){
				this.getMemberNum()
			}
			,
			goReset(){
				uni.navigateTo({
				    url: '../login/forget'
				})
			},
			goTotle(){
				uni.navigateTo({
				    url: '../chart/chart'
				})
			},
			goAddOrder(){
				uni.navigateTo({
				    url: '../edittype/edittype'
				})
			},
			goOut(){
				uni.clearStorageSync('setUserData')
				uni.navigateTo({
				    url: '../login/login'
				})
			},
			async goClear(){
				let that = this
				const value = uni.getStorageSync('setUserData');
				let res = await this.$api.delData({
					userId:value.userId
				});
				let res2 = await this.$api.getCount({
					userId:value.userId
				});
				that.dayNum=res2.data.data.dayNum
				that.orderNum=res2.data.data.orderNum
				
			}
		},
		mounted(){
			const value = uni.getStorageSync('setUserData');
			this.userInfo=value
			this.nickname=value.username
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.headers {
		background-color: #00dbe6;
		color: #fff;
	}

	.countNum {
		display: flex;
		justify-content: space-around;
		height: 150rpx;
		align-items: center;
		text-align: center;
	}
</style>
