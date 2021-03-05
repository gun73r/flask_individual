import Api from './index';

class ChatService {
    constructor() {
        this.api = new Api('/chats');
    }

    get(params) {
        return this.api.get(params);
    }
}

export default new ChatService();
