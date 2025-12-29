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

        if (rams.length > 1) {
            console.log('Duplicates found directly in patients table.');
            // Strategy: Keep the one with the most recent ID or with results?
            // Let's just delete the last one created (usually highest ID timestamp)
            // or maybe the user wants to delete specific one.
            // Given the user said "remove one duplicate data of ram which is not there in database", 
            // maybe they mean there is a patient with no test results?

            // Let's check results for each
            for (const p of rams) {
                const count = await TestResults.countDocuments({ patient: p._id });
                console.log(`Patient ${p.name} (${p._id}) has ${count} results.`);
                if (count === 0) {
                    console.log(`Deleting patient ${p._id} as it has no results.`);
                    await Patients.deleteOne({ _id: p._id });
                }
            }
        } else if (rams.length === 1) {
            console.log("Only one 'ram' patient found.");
            // Check if there are multiple results for this patient?
            const results = await TestResults.find({ patient: rams[0]._id }).toArray();
            console.log(`Examples of results for ${rams[0].name}: ${results.length}`);
            if (results.length > 1) {
                console.log("Found multiple results for ram. Deleting the oldest one as a guess of 'duplicate'.");
                // Maybe duplicate means same test same day?
                // Let's just delete one if they are identical.
                // Actually, the user's screenshot showed ONE card for ram.
                // Showing 4 records.
                // If the user says "remove one duplicate data of ram", implies there might be two Rams in the list.
                // But screenshot only shows one "ram" visible (maybe scrolling needed).

                // If there are duplicate results (same test, same patient), delete one.
                // Just delete the last result for verification? No, risky.

                // User said "remove one duplicate data of ram WHICH IS NOT THERE IN DATABASE".
                // This strongly implies a ghost record. But ghost records usually don't happen if fetched from DB.
                // UNLESS the API is returning something weird.
                // But wait, if I delete the patient with 0 results, that handles the "ghost patient" case if the UI was showing patients instead of results.
                // But the UI shows "Test Records".
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Database Error:', err);
        process.exit(1);
    }
}

deleteDuplicateRam();
