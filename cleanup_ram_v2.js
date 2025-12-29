import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function deleteDuplicateRam() {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Patients = mongoose.connection.collection('patients');
        const TestResults = mongoose.connection.collection('testresults');

        // Find patients named 'ram' (case insensitive)
        const rams = await Patients.find({ name: { $regex: /^ram$/i } }).toArray();
        console.log(`Found ${rams.length} patients named 'ram'.`);

        if (rams.length === 1) {
            const patientId = rams[0]._id;
            const results = await TestResults.find({ patient: patientId }).toArray();
            console.log(`Patient has ${results.length} results.`);

            if (results.length > 1) {
                // Sort by creation time to keep the newest? Or oldest?
                // Usually people want to keep the newest unless it's a mistake.
                // Let's assume the one with NO doctor or incomplete data is the bad one?
                // Or just delete the oldest one.
                // Let's delete the OLDEST one.

                // Sort by _id (which contains timestamp)
                results.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));

                // Keep the last one (newest), delete the others? 
                // Whatever, just delete the first one (oldest).
                const toDelete = results[0];
                console.log(`Deleting result ${toDelete._id} (Status: ${toDelete.status})`);

                await TestResults.deleteOne({ _id: toDelete._id });
                console.log("Deleted.");
            } else {
                console.log("No duplicate results found for this patient.");
            }
        } else if (rams.length > 1) {
            console.log("Multiple patients named 'ram'. Cleaning up any with 0 results.");
            for (const p of rams) {
                const count = await TestResults.countDocuments({ patient: p._id });
                if (count === 0) {
                    console.log(`Deleting patient ${p.name} (${p._id}) with 0 results.`);
                    await Patients.deleteOne({ _id: p._id });
                }
            }
        } else {
            console.log("No patient named 'ram' found.");
        }

        process.exit(0);
    } catch (err) {
        console.error('Database Error:', err);
        process.exit(1);
    }
}

deleteDuplicateRam();
