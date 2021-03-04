import Api from './index';

export default class InviteService {
    constructor() {
        this.api = new Api();
        this.path = '/api/invites';
    }

    create(invite) {
        return this.api.post(this.path, invite);
    }
    delete(inviteObj, answer) {
        const invite = JSON.stringify(inviteObj);
        return this.api.delete(this.path, {invite, answer});
    }
    get(params) {
        return this.api.get(this.path, params);
    }
}
