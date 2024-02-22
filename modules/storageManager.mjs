import pg from "pg"

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    async updateUser(user, id) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Users" SET username = $1, email = $2, password = $3 WHERE id = $4;', [user.username, user.email, user.passwordHash, id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        }catch(error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        }finally {
            client.end(); // Always disconnect from the database.
        }

        //return user;
    }

    async deleteUser(id) {

        const client = new pg.Client(this.#credentials);

        let gotDeleted;

        try {
            await client.connect();
            const output = await client.query('DELETE FROM "public"."Users" WHERE id = $1;', [id]);

            if (output.rowCount == 0){
                gotDeleted = false;
            }
            else {
                gotDeleted = true;
            }

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        }catch(error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        }finally {
            client.end(); // Always disconnect from the database.
        }
        return gotDeleted;
    }

    async createUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("username", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.username, user.email, user.passwordHash]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            // Kan sikkert bare fjerne ifen, det vil alltid bare være 1 uansett
            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        }catch(error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        }finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async loginUser(email){
        const client = new pg.Client(this.#credentials);

        let pass;

        try {
            await client.connect();
            const output = await client.query('SELECT password FROM "public"."Users" WHERE email = $1;', [email]);

            // Kan sikkert bare fjerne ifen, det vil alltid bare være 1 uansett
            if (output.rows.length == 1){
                pass = output.rows[0].password;
            }

        }catch(error){
            console.error(error);
        }finally{
            client.end(); // Always disconnect from the database.
        }

        return pass;
    }

    async getUser(id){
        const client = new pg.Client(this.#credentials);

        let user;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE id = $1;', [id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            user = output.rows[0];

        }catch(error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        }finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async getId(email){
        const client = new pg.Client(this.#credentials);

        let id;

        try {
            await client.connect();
            const output = await client.query('SELECT id FROM "public"."Users" WHERE email = $1;', [email]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            id = output.rows[0].id;

        }catch(error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        }finally {
            client.end(); // Always disconnect from the database.
        }

        return id;
    }
}

export default new DBManager(process.env.DB_CONNECTIONSTRING);