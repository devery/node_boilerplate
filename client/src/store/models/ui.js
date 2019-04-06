import { action, observable } from 'mobx';

export default class UI {
	@observable isSignIn = true;
	@observable isAppLoading = false;
	@observable areAppsLoading = false;

	@action.bound toggleSignIn = () => {
		this.isSignIn = !this.isSignIn;
	};

	@action.bound setAppLoading = loading => {
		this.isAppLoading = loading;
	};

	@action.bound setAppsLoading = loading => {
		this.areAppsLoading = loading;
	};
}
