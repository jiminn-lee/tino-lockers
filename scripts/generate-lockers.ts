import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { partnerLockers, singleLockers } from '../src/lib/server/db/schema/lockers';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('environment variable missing');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function generateLockerData() {
    try {
        
        const singleLockersData = fs.readFileSync(
            join(__dirname, 'single-lockers.txt'),
            'utf-8'
        );
     
        const partnerLockersData = fs.readFileSync(
            join(__dirname, 'partner-lockers.txt'),
            'utf-8'
        );

        const singleLockerIds = [...new Set(
            singleLockersData
                .split('\n')
                .map(id => id.trim())
                .filter(Boolean)
        )].map(id => ({
            id,
            user_id: null,
            name: null,
            grade: null,
            student_id: null,
            available: true
        }));

        const partnerLockerIds = [...new Set(
            partnerLockersData
                .split('\n')
                .map(id => id.trim())
                .filter(Boolean)
        )].map(id => ({
            id,
            user_id: null,
            primary_name: null,
            primary_grade: null,
            primary_student_id: null,
            secondary_name: null,
            secondary_grade: null,
            secondary_student_id: null,
            available: true
        }));

        if (singleLockerIds.length > 0) {
            await db.insert(singleLockers).values(singleLockerIds);
            console.log(`Inserted ${singleLockerIds.length} single lockers`);
        }

        if (partnerLockerIds.length > 0) {
            await db.insert(partnerLockers).values(partnerLockerIds);
            console.log(`Inserted ${partnerLockerIds.length} partner lockers`);
        }

        console.log('Locker data generation completed successfully');
    } catch (error) {
        console.error('Error generating locker data:', error);
    } finally {
        await client.end();
    }
}

generateLockerData();