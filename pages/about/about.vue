<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color="white" :background="background"></u-navbar>
		<view class="user-box u-p-l-30 u-p-r-20 u-p-b-30 headers">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="110"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20 u-line-1">{{nickname}}</view>
			</view>
		</view>
		<view class="u-m-t-1">
			<u-cell-group>
				<view class="countNum">
				星星之火，可以燎原
				</view>
			</u-cell-group>
		</view>
		<view class="u-m-t-1">
			<u-cell-group>
					<u-cell-item icon="setting" title="作者:曾宴萍" ></u-cell-item>
					<u-cell-item icon="setting" title="年龄:21" ></u-cell-item>
					<u-cell-item icon="setting" title="学校:四川工商学院" ></u-cell-item>
					<u-cell-item icon="setting" title="邮箱:2049146393@qq.com" ></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "关于我们",
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				pic: 'https://c-ssl.duitang.com/uploads/blog/202101/13/20210113152711_e2408.jpg',
				show: true,
				nickname: "曾宴萍",
				dayNum:0,
				orderNum:0
			}
		},
		onLoad() {
			this.getMemberNum()
		},
		methods: {
			noOpen: () => {
				uni.showToast({
					title: "暂未开发",
					mask: true,
					icon: "none"
				});
			},
			async getMemberNum() {
				let that = this
				let res = await this.$api.getCount({
					userId: '1'
				});
				that.dayNum=res.data.data.dayNum
				that.orderNum=res.data.data.orderNum
			},
			goMe() {
				uni.navigateTo({
				    url: '../add/add'
				})
			}
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
		text-align: center;
	}

	.countNum {
		display: flex;
		justify-content: space-around;
		height: 150rpx;
		align-items: center;
		text-align: center;
	}
</style>
