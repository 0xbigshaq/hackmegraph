const ShoutoutsModel = require('../models/shoutouts');

class ShoutoutController { 
    constructor(connection) {
        this.connection = connection;
        this.model = new ShoutoutsModel(connection);
    }

    GetShoutoutByID() {
        return (args) => { // returning callbacks here because if we pass it directly as a resolver function, GraphQL won't recognize the properties we defined in the constructor
            return this.model.GetShoutout(args.id, args.approved);
        }
    }

    SendShoutout() {
        return (args) => {
            return this.model.SendShoutout(args);
        }
    }
}
module.exports = ShoutoutController;