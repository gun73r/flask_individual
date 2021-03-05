import Api from './index';

class InviteService {
    constructor() {
        this.api = new Api('/invites');
    }

    create(invite) {
        return this.api.post(invite);
    }
    delete(inviteObj, answer) {
        const invite = JSON.stringify(inviteObj);
        return this.api.delete({invite, answer});
    }
    get(params) {
        return this.api.get(params);
    }
}

export default new InviteService();
