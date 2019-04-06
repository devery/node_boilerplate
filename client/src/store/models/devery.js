import { action, observable, computed } from 'mobx';

import store from '..';
import sdk from '../../utilities/sdk';

class Devery {
	@observable apps = null;
	@observable selectedApp = null;

	constructor() {
		this.apps = [];
		this.selectedApp = null;
	}

	@computed get isAppEmpty() {
		return !this.selectedApp;
	}

	@action.bound fetchApps = () => {
		store.ui.setAppsLoading(true);
		sdk.fetchApps()
			.then(apps => {
				this.apps = apps;
				setTimeout(() => {
					store.ui.setAppsLoading(false);
				}, 500)
			})
	};

	@action.bound fetchListByAddress = address => {
		store.ui.setAppLoading(true);
		sdk.fetchAppByAddress(address)
			.then(app => {
				this.selectedApp = app;
				setTimeout(() => {
					store.ui.setAppLoading(false);
				}, 500)
			})
	};
}

export default Devery;
