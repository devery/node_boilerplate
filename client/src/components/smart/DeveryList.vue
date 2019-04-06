<template>
	<div class="devery-list">
		<h3>Current Devery Apps</h3>
		<div class="centered-content" v-if="store.ui.areAppsLoading">
			<a-icon type="loading" class="loader-icon" />
		</div>
		<a
			v-else
			v-for="(app, appIndex) in store.devery.apps"
			:key="app"
			class="ant-dropdown-link"
			@click="() => store.devery.fetchListByAddress(app)"
		>
			{{appIndex + 1}}. {{app}}
		</a>
	</div>
</template>

<script>
	import { observer } from 'mobx-vue';
	import store from '../../store';

	export default observer({
		name: "DeveryList",
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
	.devery-list {
		flex: 1;
		border-right: 1px solid gray;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 18px;
		overflow-y: scroll;
	}
</style>
