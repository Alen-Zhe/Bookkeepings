<template>
	<view class="container">
		<u-navbar :is-back="true" :title="title" title-color="white" :background="background"></u-navbar>
		<view class="user-box u-p-l-30 u-p-r-20 u-p-b-30 headers">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="110"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20 u-line-1">{{nickname}}</view>
			</view>
		</view>
		<view class="container" style="background-color: #fff;padding: 0 20rpx;margin-top: -30rpx;">
			<wInput v-model="email" type="text" placeholder="邮箱"></wInput>
			<wInput v-model="code" type="number" maxlength="6" placeholder="验证码" isShowCode ref="runCode" @setCode="getVerCode()"></wInput>
			<u-button type="primary" @click="submit">确定</u-button>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	export default {
		data() {
			return {
				title: "邮箱修改",
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				pic: 'https://c-ssl.duitang.com/uploads/blog/202101/13/20210113152711_e2408.jpg',
				show: true,
				nickname: "曾宴萍",
				code: '',
				form: {
					change: null,
					type: null,
					chinese_type: null,
					desc: null,
					descVal: null,
					remark: null
				},
			}
		},

		components: {
			wInput,
		},
		methods: {
			noOpen: () => {
				uni.showToast({
					title: "暂未开发",
					mask: true,
					icon: "none"
				});
			},
			async getVerCode() {
				//获取验证码
				const that = this
				let res = await this.$api.sendEmail({
					email: that.email,
				});
				if (res.data.status == 200) {
					that.$refs.runCode.$emit('runCode');
					that.codeId = res.data.data
					console.log(that.codeId)
				} else {
					setTimeout(function() {
						that.$refs.runCode.$emit('runCode', 0);
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '获取验证码失败'
						});
					}, 3000)
				}
			},
			goMe() {
				uni.navigateTo({
					url: '../add/add'
				})
			},
			async submit() {
				const that = this
				// updataUserinfo
				let res = await this.$api.updataUserinfo({
					email: that.email,
					codeId: that.codeId,
					id: uni.getStorageSync('setUserData').userId,
					code:that.code

				});
				if (res.data.status == 200) {
					uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '修改成功'
					}, 3000)
				} else {
					setTimeout(function() {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '修改失败'
						});
					}, 3000)
				}
				
			}
		},
		mounted() {
			const value = uni.getStorageSync('setUserData');
			console.log(value)
			this.nickname = value.username
			const that = this
			if (value.email) {
				that.email = value.email
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
