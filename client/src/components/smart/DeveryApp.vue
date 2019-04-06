<template>
	<div class="devery-app">
		<h3 v-if="store.devery.isAppEmpty">No app selected</h3>
		<div v-else-if="store.ui.isAppLoading" class="centered-content">
			<a-icon type="loading" class="loader-icon" />
		</div>
		<div v-else>
			<h2>App's name <strong>{{store.devery.selectedApp.appName}}</strong></h2>
			<h3>Fee account <strong>{{store.devery.selectedApp.fee}}</strong></h3>
			<a-tag v-if="store.devery.selectedApp.isActive" color="green">Active</a-tag>
			<a-tag v-else color="red">Inactive</a-tag>
		</div>
	</div>
</template>

<script>
	import { observer } from 'mobx-vue';
	import store from '../../store';

	export default observer({
		name: "DeveryApp",
		data() {
			return {
				store
			}
		},
		mounted() {
			store.devery.fetchApps()
		}
	})
</script>

<style scoped>
	.devery-app {
		flex: 3;
		height: 100%;
		width: 100%;
		padding: 18px;
	}
</style>
