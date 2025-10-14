import { Client } from 'pg';

const connectString = 'postgresql://neondb_owner:npg_u2j8VRrZQiAL@ep-calm-poetry-ab7svr3o-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';


const client = new Client({
    connectionString: connectString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to the database successfully.');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

export { client, connectToDatabase };
