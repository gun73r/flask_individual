import Api from './index';

class ApprovalService {
    constructor() {
        this.api = new Api('/approvals');
    }

    get(params) {
        return this.api.get(params);
    }

    create(signature) {
        return this.api.post(signature);
    }

    delete(data) {
        return this.api.delete(data);
    }
}

export default new ApprovalService();
