<template>
	<a-form
		:form="form"
		@submit="handleSubmit"
	>
		<a-form-item
			label="E-mail"
		>
			<a-input
				v-decorator="[
          'email',
          {
            rules: [{
              type: 'email', message: 'Not valid mail',
            }, {
              required: true, message: 'Input your mail',
            }]
          }
        ]"
			/>
		</a-form-item>
		<a-form-item
			label="Password"
		>
			<a-input
				v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
				type="password"
			/>
		</a-form-item>
		<a-form-item
			label="Confirm Password"
		>
			<a-input
				v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
				type="password"
				@blur="handleConfirmBlur"
			/>
		</a-form-item>
		<a-form-item>
      <span slot="label">
        Name
      </span>
			<a-input
				v-decorator="[
          'name',
          {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
          }
        ]"
			/>
		</a-form-item>
		<a-form-item>
			<a-button
				type="primary"
				html-type="submit"
				class="full-width"
			>
				Sign Up
			</a-button>
		</a-form-item>
	</a-form>
</template>

<script>
	import { observer } from 'mobx-vue';

	import store from '../../store';

	export default observer({
		name: "SignUp",
		data() {
			return {
				confirmDirty: false,
				form: this.$form.createForm(this)
			}
		},
		methods: {
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						return store.auth.signUp(values)
							.then(() => {
								this.$router.push('/confirmations/mail')
							})
							.catch(error => {
								this.$message.error(error.response.data.error.type);
							})
					}
					this.$message.error('Input error')
				});
			},
			handleConfirmBlur(e) {
				const value = e.target.value;
				this.confirmDirty = this.confirmDirty || !!value;
			},
			compareToFirstPassword(rule, value, callback) {
				const form = this.form;
				if (value && value !== form.getFieldValue('password')) {
					callback('Two passwords that you enter is inconsistent!');
				} else {
					callback();
				}
			},
			validateToNextPassword(rule, value, callback) {
				const form = this.form;
				if (value && this.confirmDirty) {
					form.validateFields(['confirm'], {force: true});
				}
				callback();
			},
		}
	})
</script>

<style scoped>
	.ant-form-item {
		margin-bottom: 8px;
	}
</style>
