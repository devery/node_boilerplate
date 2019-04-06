<template>
	<div class="devery-container">
		<DeveryList />
		<DeveryApp />
	</div>
</template>

<script>
	import DeveryList from '../smart/DeveryList';
	import DeveryApp from '../smart/DeveryApp';

	export default {
		name: "DeveryMain",
		components: {
			DeveryList,
			DeveryApp
		}
	}
</script>

<style scoped>
	.devery-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}
</style>
