<template>
	<div
		class="centered-content"
	>
		<a-card
			:title="ui.isSignIn ? 'Sign In' : 'Sign Up'"
			class="auth-card"
		>
			<SignIn v-if="ui.isSignIn" />
			<SignUp v-else/>
			<p v-if="ui.isSignIn" class="help-text" @click="ui.toggleSignIn">No account? <a>Sign Up</a></p>
			<p v-else class="help-text" @click="ui.toggleSignIn">Have Account? <a>Sign In</a></p>
		</a-card>
	</div>
</template>

<script>
	import { observer } from 'mobx-vue';

	import store from '../../store';

	import SignIn from '../smart/SignIn';
	import SignUp from '../smart/SignUp';

	export default observer({
		name: "Login",
		components: {
			SignIn,
			SignUp
		},
		data() {
			return {
				ui: store.ui
			}
		},
		methods: {
			click() {
				store.auth.sign()
					.then(() => {
						if (!store.ui.isSignIn) {
							this.$message.info('Check your e-mail to confirm your account');
						}
					})
			}
		}
	})
</script>

<style scoped>
	.auth-main-container {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	.auth-card {
		width: 392px;
	}

	.auth-button {
		margin-top: 18px;
	}

	.help-text {
		margin-top: 18px;
		margin-bottom: 0px;
	}
</style>
