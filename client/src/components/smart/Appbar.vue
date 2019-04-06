<template>
	<div
		class="app-bar"
	>
		<h2
			class="nav-bar-text"
		>
			Devery boilerplate
		</h2>
		<div
			class="app-navigation"
		>
			<p
				class="app-menu-text"
				@click="logout"
			>
				Logout
			</p>
		</div>
	</div>
</template>

<script>
	import { observer } from 'mobx-vue';

	import store from '../../store';
	import router from '../../router';

	export default observer({
		name: "Appbar",
		methods: {
			logout() {
				this.$confirm({
					title: 'Are you sure?',
					onOk() {
						router.push('/');
						store.auth.logout();
					},
					onCancel() {}
				})
			}
		}
	})
</script>

<style scoped lang="scss">
	@import '../../styles/app.scss';

	.nav-bar-text {
		margin: 0;
		cursor: pointer;
	}

	.nav-bar-item {
		color: #FFF;
		font-weight: normal;
	}

	.app-menu-text {
		cursor: pointer;
		margin-left: $content_margin;
		margin-bottom: 0;
	}

	.app-navigation {
		margin-left: auto;
		margin-right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.app-bar {
		background: $base-color;
		top: 0;
		height: 64px;
		min-height: 64px;
		/* background-color: #515a6e; */
		width: 100%;
		z-index: 10;
		/* border-bottom: 1px solid gray; */
		padding: 0 $app_horizontal_margin;
		color: #FFF;
		display: flex;
		/*position: fixed;*/
		align-items: center;
		h2, h4, div{
			color: #FFF;
		}
	}
</style>
