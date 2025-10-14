import { Client } from 'pg';

const connectString = 'postgresql://yjut:yoh0KIKfEaxfNctqiiX1t9rNh9NLEAJE@dpg-d3mff2mmcj7s73aldqq0-a.singapore-postgres.render.com/yjut_db';


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
