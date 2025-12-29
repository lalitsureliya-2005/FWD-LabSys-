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

        console.log('--- TEST RESULTS ---');
        // Get all results with patient details
        const results = await mongoose.connection.collection('testresults').aggregate([
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patientData'
                }
            },
            {
                $unwind: {
                    path: '$patientData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        results.forEach(r => {
            const pName = r.patientData ? r.patientData.name : 'UNKNOWN_PATIENT';
            const email = r.patientData ? r.patientData.email : 'No Email';
            console.log(`ResultID: ${r._id} | Patient: ${pName} (${email}) | Test: ${r.test} | Status: ${r.status}`);
        });

        console.log('\n--- PATIENTS NAMED RAM ---');
        const rams = await mongoose.connection.collection('patients').find({ name: { $regex: 'ram', $options: 'i' } }).toArray();
        rams.forEach(p => {
            console.log(`PatientID: ${p._id} | Name: ${p.name} | Email: ${p.email}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Database Error:', err);
        process.exit(1);
    }
}

checkData();
