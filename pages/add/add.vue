<template>
	<view class="container">
		<u-navbar :is-back="true" back-icon-color="white" :title="title" title-color="white" :background="background"></u-navbar>
		<view class="u-m-20 content">
			<u-form>
				<u-form-item label="金额">
					<u-input v-model="form.change" />
				</u-form-item>
				<u-form-item label="类型">
					<u-input v-model="form.chinese_type" type="select" @click="type_show = true" placeholder="选择类型" />
					<u-action-sheet :list="typeList" v-model="type_show" @click="selectType"></u-action-sheet>
				</u-form-item>
				<u-form-item label="项目">
					<u-input v-model="form.desc" type="select" @click="desc_show = true" placeholder="选择项目" />
					<u-action-sheet :list="descList" v-model="desc_show" @click="selectDesc"></u-action-sheet>
				</u-form-item>
				<u-form-item label="备注">
					<u-input v-model="form.remark" />
				</u-form-item>
				<u-form-item label="日期">
					<view class="u-demo-result-line" @click="isshow=true">{{ input|date('yy-mm-dd hh:ss')}}</view>
					<u-picker mode="time" :defaultTime="defaultTime" v-model="isshow" :params="params" end-year="2030" @confirm="selectTime"
					 :defaultSelector="defaultSelector" :range-key="rangKey"></u-picker>
				</u-form-item>
				<u-button type="primary" @click="submit">确定</u-button>
			</u-form>
			<u-button style="margin-top: 30rpx;" type="primary" @click="proshow = true">添加项目</u-button>
			<u-modal ref="uModal" v-model="proshow" :show-cancel-button="true" :title="showTitle" @confirm="confirm">
				<view class="" style="padding: 40rpx;">
					<u-input  v-model="projects" />
				</view>
				<radio-group @change="radioChange" style="display: flex;justify-content: space-around;padding-bottom: 20rpx;">
					<label v-for="(item, index) in typeList2" :key="item.value" style="display: flex;">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.text}}</view>
					</label>
				</radio-group>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "添加账单",
				projects: '',
				proshow: false,
				showTitle: '添加项目',
				background: {
					backgroundImage: "linear-gradient(to right, #00dbe6 0%, #00dbe6 0%, #00dbe6 21%, #00dbe6 52%, #00dbe6 78%, #00dbe6 100%)"
				},
				typeList: [{
						value: 0,
						text: "收入"
					},
					{
						value: 1,
						text: "支出"
					}
				],
				typeList2: [{
						value: '0',
						text: "收入"
					},
					{
						value: '1',
						text: "支出"
					}
				],
				current: null,
				type_show: false,
				desc_show: false,
				form: {
					change: null,
					type: null,
					chinese_type: null,
					desc: null,
					descVal: null,
					remark: null,
					time:null,
				},
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
				defaultTime: '2021-01',
				rangKey: 'name',
				input: '',
				descList: [
				],
			}
		},
		onLoad() {

		},
		methods: {
			async selectTime(e) {
				console.log(e);
				this.form.time = e;
				const value = uni.getStorageSync('setUserData');
				
				if (this.params.year) this.input += e.year;
				if (this.params.month) this.input += '-' + e.month;
				if (this.params.day) this.input += '-' + e.day;
				if (this.params.hour) this.input += ' ' + e.hour;
				if (this.params.minute) this.input += ':' + e.minute;
				if (this.params.second) this.input += ':' + e.second;
			},
			async selectType(index) {
				let chinese_type = this.typeList[index].text
				this.form.chinese_type = chinese_type
				let type = this.typeList[index].value
				this.form.type = type
				let res = await this.$api.getType({
					pageNum: 1,
					pageSize: 100,
					type: type,
					userId: uni.getStorageSync('setUserData').userId
				});
				var proData = []
				for (let i = 0; i < res.data.records.length; i++) {
					proData.push({
						value: res.data.records[i].id,
						text: res.data.records[i].name
					})
				}
				// res.data.records.Map(item=>{
				this.descList = proData
				// })
			},
			selectDesc(index) {
				let descVal = this.descList[index].value
				this.form.descVal = descVal
				let desc = this.descList[index].text
				this.form.desc = desc

			},
			async confirm() {
				setTimeout(() => {
					this.proshow = false;
				}, 2000)
				const that =this
				let res = await this.$api.addPro({
					name: that.projects,
					type: that.current,
					userId: uni.getStorageSync('setUserData').userId,
				});
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.typeList2.length; i++) {
					if (this.typeList2[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			async submit() {
				let that = this
				if (!this.form.change) {
					uni.showToast({
						title: '金额必须填写',
						icon: "none",
						mask: true
					});
					return false;
				}
				if (this.form.type == null) {
					uni.showToast({
						title: '类型必须选择',
						icon: "none",
						mask: true
					});
					return false;
				}
				if (!this.form.desc) {
					uni.showToast({
						title: '项目必须选择',
						icon: "none",
						mask: true
					});
					return false;
				}

				let change = this.form.change
				let desc = this.form.descVal
				let chinese_type = this.form.chinese_type
				let remark = this.form.remark
				let time = null
				if(this.form.time){
					 time = this.form.time.timestamp*1000
				}
				let data = {
					userId: uni.getStorageSync('setUserData').userId,
					// create_time: Date.parse(new Date()),
					category: desc,
					money: change,
					remarks: remark,
					productionDate:time?time:Date.parse(new Date())
				}
				let res = await this.$api.addOrder(data);
				if (res.data.status == 200) {
					console.log(res)
					uni.showToast({
						title: '创建成功',
						icon: "none",
						mask: true
					})
				} else {
					uni.showToast({
						title: '创建失败',
						icon: "none",
						mask: true
					})
				}
			}
		}
	}
</script>

<style>

</style>
