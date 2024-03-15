import pg from "pg"

if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

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
        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }
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

        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }
        return gotDeleted;
    }

    async createUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("username", "email", "password", "games", "wins", "losses") VALUES($1::Text, $2::Text, $3::Text, $4::Integer, $5::Integer, $6::Integer) RETURNING id;', [user.username, user.email, user.passwordHash, user.games, user.wins, user.losses]);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }

        return user;
    }

    async loginUser(email){
        const client = new pg.Client(this.#credentials);

        let pass;

        try {
            await client.connect();
            const output = await client.query('SELECT password FROM "public"."Users" WHERE email = $1;', [email]);

            if (output.rows.length == 1){
                pass = output.rows[0].password;
            }

        }catch(error){
            console.error(error);
        }finally{
            client.end();
        }

        return pass;
    }

    async getUser(id){
        const client = new pg.Client(this.#credentials);

        let user;

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE id = $1;', [id]);

            user = output.rows[0];

        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }

        return user;
    }

    async getId(email){
        const client = new pg.Client(this.#credentials);

        let id;

        try {
            await client.connect();
            const output = await client.query('SELECT id FROM "public"."Users" WHERE email = $1;', [email]);

            id = output.rows[0].id;

        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }

        return id;
    }

    async checkIfUserExists(username, email){
        const client = new pg.Client(this.#credentials);

        let users;

        try {
            await client.connect();
            const output = await client.query('SELECT EXISTS(SELECT * FROM "public"."Users" WHERE username = $1 OR email = $2);', [username, email]);

            users = output.rows;
        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }

        return users;
    }

    async updateGames(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Users" SET games = $1, wins = $2, losses = $3 WHERE id = $4;', [user.games, user.wins, user.losses, user.id]);

        }catch(error) {
            console.error(error);
        }finally {
            client.end();
        }
    }
}

export default new DBManager(process.env.DB_CONNECTIONSTRING);