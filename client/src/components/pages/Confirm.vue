<template>
	<div
		class="centered-content"
	>
		<h2 v-if="success">Your account was verified. <a @click="pushLogin">Click</a> to login</h2>
		<h2 v-else>Loading</h2>
	</div>
</template>

<script>
	import { observer } from 'mobx-vue';

	import store from '../../store';

	export default observer({
		name: "Confirm",
		data() {
			return {
				success: false
			}
		},
		methods: {
			pushLogin() {
				this.$router.push('/')
			}
		},
		mounted() {
			store.auth.confirm(this.$route.params.id)
				.then(() => {
					this.success = true;
				})
		}
	})
</script>
