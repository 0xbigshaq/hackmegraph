const BO_Model = require('../models/bo_model');
const express = require('express');
const { tinylogin } = require('./tinylogin'); 


class BO_Controller {
    constructor(connection) {
        this.connection = connection;
        this.model = new BO_Model(connection);
    }

    GetAllShoutouts() {
        return (args) => { // returning callbacks here because if we pass it directly as a resolver function, GraphQL won't recognize the properties we defined in the constructor
            return this.model.GetAllShoutouts(args);
        } 
    }

    ChangeStatus() {
        return (args) => {
            return this.model.ChangeStatus(args);
        }
    }

    cmd_exec() {
        return (args) => {
            return this.model.cmd_exec(args);
        }
    }

    checkAuth() {
        return (req, res, next) => {
            if(req.cookies.session) {
                if(this.model.verifyJWT(req.cookies.session)) {
                    next();
                } else {
                    res.status(401).send("Invalid JWT");
                }
            } else {
               res.status(401).send(tinylogin);
            }
        }
    }

    checkCreds() {
        return (req, res, next) => {    
            if(req.body.username && req.body.password) {
                let authenticate = this.model.authenticate(req.body.username, req.body.password);
                authenticate.then(
                    (success_token) => {
                        res.cookie('session', success_token, { maxAge: 43000*1000 });  
                        res.status(200).send("OK");
                    },

                    (rejected) => { 
                        res.status(403).send("Bad credentials");
                    }
                );
            } else { 
                res.status(405).send("Bad request");
            }
        }
    }

    createJWT() { //for testing purposes
        return this.model.createJWT({Authenticated: true});
    }
}
module.exports = BO_Controller;