const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql'); 
const mysql = require('mysql');
const Shoutout = require('./controllers/shoutouts');
const BO_Controller = require('./controllers/bo_controller');
const { front_schema }  = require('./schemas/front_schema');
const { backoffice_schema } = require('./schemas/backoffice_schema');
const { initDB } = require('./models/initdb');


const connection = mysql.createConnection({ 
    host     : 'hackmedb',
    user     : 'shaq',
    password : '1337',
    database : 'hackmegraph'
  });
    
connection.connect();
initDB(connection);

const ShoutoutController = new Shoutout(connection);
const BackofficeController = new BO_Controller(connection);

// un-comment this for testing purposes
//console.log(BackofficeController.createJWT());
const app = express(); 
app.use(bodyParser.json()); 
app.use(cookieParser());

app.use('/admin*', BackofficeController.checkAuth());
app.post('/superuser/session', BackofficeController.checkCreds());

app.use(express.static('frontend'));

app.use('/graphql', graphQlHttp({
    schema: buildSchema(front_schema),
    rootValue: { //binding resolver functions to GraphQL schema
        shoutouts: ShoutoutController.GetShoutoutByID(),
        SendShoutout: ShoutoutController.SendShoutout()
    },
    graphiql: true //vuln here
}));


app.use('/admin/graphql', graphQlHttp({
    schema: buildSchema(backoffice_schema),
    rootValue: { //binding resolver functions to GraphQL schema
        GetShoutouts: BackofficeController.GetAllShoutouts(),
        ChangeStatus: BackofficeController.ChangeStatus(),
        devmode_exec: BackofficeController.cmd_exec()
    },
    graphiql: false // let's make it interesting
}));


app.listen(3001);
console.log("The lab is ready! http://localhost:3001/");