<template>
	<a-form @submit="handleSubmit" :form="form">
		<a-form-item
			label=''
			:colon="false"
		>
			<a-input
				placeholder='Email'
				v-decorator="[
          'email',
          {rules: [
						{
							required: true,
							message: 'Input your e-mail'
						},
						{
							type: 'email',
							message: 'Not valid mail'
						}
					]}
        ]"
			/>
			<a-icon slot="prefix" type='mail' style="color:rgba(0,0,0,.25)"/>
		</a-form-item>
		<a-form-item
			label=''
			:colon="false"
		>
			<a-input
				placeholder='Password'
				type='password'
				v-decorator="[
          'password',
          {rules: [{ required: true, message: 'Please input your password!' }]}
        ]"
			/>
			<a-icon slot="prefix" type='lock' style="color:rgba(0,0,0,.25)"/>
		</a-form-item>
		<a-form-item>
			<a-button type='primary' html-type='submit' class="full-width">
				Sign In
			</a-button>
		</a-form-item>
	</a-form>
</template>

<script>
	import { observer } from 'mobx-vue';

	import store from '../../store';

	export default observer({
		name: "SignIn",
		data () {
			return {
				form: this.$form.createForm(this)
			}
		},
		methods: {
			handleSubmit (e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						return store.auth.signIn(values)
							.then(() => {
								this.$router.push('/devery');
							})
							.catch(error => {
								this.$message.error(error.response.data.error.type);
							})
					}
					this.$message.error('Not correct e-mail')
				})
			}
		}
	})
</script>

<style scoped>

</style>
