module.exports = { initDB: (connection) => {
    console.log("[Database initialization] Started ... ");
    try {
        connection.query(`DROP TABLE IF EXISTS shoutout_requests`);
        connection.query(`CREATE TABLE shoutout_requests  (
            id VARCHAR(10),
            shoutout_text VARCHAR(100) NOT NULL, 
            name VARCHAR(30) NOT NULL,
            approved BOOLEAN DEFAULT false,
            date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

        connection.query(`INSERT INTO shoutout_requests(id, name, shoutout_text, approved) VALUES ('1', 'Admin', 'the very first shoutout!', true)`);
        connection.query(`INSERT INTO shoutout_requests(id, name, shoutout_text, approved) VALUES ('2','test', 'test', false)`);
        connection.query(`INSERT INTO shoutout_requests(id, name, shoutout_text, approved) VALUES ('3', 'hacktheplanet', 'Dedicating this shoutout to zero-cool!', true)`);

        connection.query(`DROP TABLE IF EXISTS users`);
        connection.query(`CREATE TABLE users (
            username VARCHAR(50),
            password VARCHAR(50)
        )`);

        connection.query(`INSERT INTO users VALUES ('admin', 'h4ckthepl@n3t')`);

        console.log("[Database initialization] Done.");
    } catch (err) {
        console.log("Database initialization failed!", err);
    }
}
}

