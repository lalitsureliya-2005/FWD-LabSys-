import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const TestResult = mongoose.connection.collection('testresults');
        const Patients = mongoose.connection.collection('patients');

        console.log('--- PATIENTS "ram" ---');
        const patients = await Patients.find({ name: { $regex: 'ram', $options: 'i' } }).toArray();
        console.log(JSON.stringify(patients, null, 2));

        console.log('--- ALL TEST RESULTS ---');
        const results = await TestResult.aggregate([
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patientData'
                }
            }
        ]).toArray();

        console.log(`Total Results: ${results.length}`);
        results.forEach(r => {
            const pName = r.patientData[0] ? r.patientData[0].name : 'UNKNOWN';
            console.log(`Result ID: ${r._id}, Patient: ${pName} (${r.patient}), Status: ${r.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Database Error:', err);
        process.exit(1);
    }
}

checkData();
