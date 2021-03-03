<template>
	<view class="forget">
		<u-navbar :is-back="true"  title-color="white" ></u-navbar>
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
				<wInput
					v-model="email"
					type="text"
					placeholder="请输入邮箱"
				></wInput>
				<wInput
					v-model="newPassWord"
					type="password"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="code"
					type="number"
					maxlength="6"
					placeholder="验证码"
					isShowCode
					codeText="获取重置码"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			
			<wButton 
				class="wbutton"
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	export default {
		data() {
			return {
				email: "", //邮箱
				newPassWord: "", //密码
				code:"", //验证码
				isRotate: false, //是否加载旋转
				codeId:''
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			async getVerCode(){
				//获取验证码
				const that = this
				let res = await this.$api.sendEmail({
					email: that.email,
				});
				if(res.data.status==200){
					that.$refs.runCode.$emit('runCode');
					that.codeId=res.data.data
					console.log(that.codeId)
				}else{
					setTimeout(function(){
						that.$refs.runCode.$emit('runCode',0); 
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: '获取验证码失败'
						});
					},3000)
				}
			},
			async startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				const that =this
				let res = await this.$api.updataPwd({
					email: that.email,
					newPassWord:that.newPassWord, //密码
					code:that.code, //验证码
					codeId:that.codeId
				});
				if(res.data.status==200){
					console.log("重置成功")
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '重置成功'
					});
					uni.navigateTo({
						url: "./login"
					})
				}else{
					
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: res.data.desc
					});
				}
				_this.isRotate=true
				setTimeout(function(){
					_this.isRotate=false
				},3000)
				_this.isRotate=true
				setTimeout(function(){
					_this.isRotate=false
				},3000)
				
				
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>

