import { action, computed, observable } from 'mobx';

import store from '..';
import sdk from '../../utilities/sdk';

export default class Auth {
	@observable me = null;
	@observable token = localStorage.getItem('__auth_id__') || '';
	@observable isConfirmingMail = localStorage.getItem('isConfirming') || '';

	@computed get isConfirming() 	{
		return this.isConfirmingMail === 'yes';
	}

	@computed get isMeLoaded() {
		return !!this.me;
	}

	@computed get haveToken() {
		return this.token !== '';
	}

	@action.bound signIn({ email, password }) {
		const signInData = { email, password };
		return sdk.login(signInData)
			.then(loginInfo => {
				this.token = loginInfo.token;
				localStorage.setItem('__auth_id__', loginInfo.token);
				sdk.setAuthHeader(loginInfo.token);
				return 'success'
			});
	}

	@action.bound signUp({ email, password, name }) {
		const signUpData = { email, password, name };
		return sdk.register(signUpData)
			.then(() => {
				this.isConfirmingMail = 'yes';
				localStorage.setItem('isConfirming', 'yes');
				store.ui.toggleSignIn();
			})
	}

	@action.bound confirm(id) {
		return sdk.confirm(id)
			.then(() => {
				localStorage.removeItem('isConfirming');
			})
	}

	@action.bound getMe() {
		sdk.setAuthHeader(this.token);
		return sdk.getMe()
			.then((res) => {
				this.me = res;
				return null;
			})
	}

	@action.bound logout() {
		sdk.deleteAuthHeader();
		localStorage.removeItem('isConfirming');
		localStorage.removeItem('__auth_id__');
		this.me = null;
		this.token = '';
		this.isConfirmingMail = '';
	}
}
