const shortid = require('shortid');


class ShoutoutsModel {
    constructor(connection) {
        this.connection = connection;
    }

    GetShoutout(shoutout_id, approved) { 
        return new Promise((resolve, reject) => { 
            let exec_q = `SELECT * FROM shoutout_requests `;
            if(shoutout_id) { exec_q += `WHERE id = '${shoutout_id}' `; } 
            if(approved != null)    {
                 if(shoutout_id) {
                    exec_q += `AND approved = ${approved}`; 
                  } else { 
                    exec_q += `WHERE approved = ${approved}`; 
                  } 
            }
            exec_q += ` ORDER BY date_sent DESC`;

            console.log("[Query Executed] "+exec_q); // view the logs to inspect the SQL injection attempts while testing the machine
            this.connection.query(exec_q, function (error, results, fields) {
                if (error) {
                    resolve([ { id: error.sqlMessage } ]);
                    return;
                }
                
                if(results.length > 0) {
                    resolve(results);
                } else {
                    resolve([{ id: 'none', approved: false }]);
                }
               });
        });
    }

    SendShoutout(args) {
        let unique_id = shortid.generate();
        this.connection.query(`INSERT INTO shoutout_requests(id, name, shoutout_text) VALUES (?, ?, ?)`, [unique_id, args.requestInput.name, args.requestInput.shoutout_text]);
        return { id: unique_id, approved: false };
    }

}

module.exports = ShoutoutsModel;