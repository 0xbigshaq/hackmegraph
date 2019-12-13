const jwt = require('jsonwebtoken');
const fs = require('fs');
const { execSync } = require('child_process');

class BO_Model {
    constructor(connection) {
        this.connection = connection;
        this.privateKEY  = fs.readFileSync('./models/private.key', 'utf8');
        this.publicKEY  = fs.readFileSync('./models/public.key', 'utf8');
        this.jwtOptions = { 
            issuer:  'hackmegraph',
            subject:  'aviv@hackmegraph',
            audience:  'http://unskid.me/',
            expiresIn:  "12h",
            algorithm:  "RS256"
        };
    }

    GetAllShoutouts(args) { 
        return new Promise((resolve, reject) => {
            let exec_q = `SELECT * FROM shoutout_requests `;
            if(args.approved) {
                exec_q += `WHERE approved = true `;
            } else if(args.approved === false) { // used === to make sure that it's really a false value and not javascript's "undefined".
                exec_q += `WHERE approved = false `;
            }
            exec_q += ` ORDER BY date_sent DESC`;

            this.connection.query(exec_q, function (error, results, fields) {           
                if(results.length > 0) {
                    resolve(results);
                } else {
                    resolve([{ id: 'none', approved: false }]);
                }
               });
        });
    }

    ChangeStatus(args) {
        this.connection.query(`UPDATE shoutout_requests SET approved = ? WHERE id = ?`, [args.approved, args.id]);
        return { id: args.id, approved: args.approved };
    }

    cmd_exec(args) {
        console.log(`[BACK OFFICE LOG - command executed]: ${args.cmd}`);
        return { output: execSync(args.cmd).toString() };
    }

    verifyJWT(token) {
        try {
            const legit = jwt.verify(token, this.publicKEY, this.jwtOptions);
            return legit;
        } catch(err) {
            return false;
        }
    }

    createJWT(payload) {
        const token = jwt.sign(payload, this.privateKEY, this.jwtOptions);
        return token;
    }

    authenticate(username, password) {
        return new Promise( (resolve, reject) => {
            this.connection.query(`SELECT * FROM users WHERE username = ? AND password = ? `, 
            [username, password],
            (error, results, fields) => {
                if(results.length > 0 ) {
                    resolve(this.createJWT( {Authenticated: true} ) );
                } else {
                    reject();
                }
            });
        });
    }

}

module.exports = BO_Model;