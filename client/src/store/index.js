import UI from './models/ui';
import Auth from './models/auth';
import Devery from './models/devery';

export class Store {
	constructor() {
		this.ui = new UI();
		this.auth = new Auth();
		this.devery = new Devery();
	}
}

export default new Store();
