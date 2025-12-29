import mongoose from 'mongoose';
import Test from '../models/Test.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lalitsureliya8_db_user:lalit%407732@myprojects.yz7xanl.mongodb.net/labentryviewer';

const tests = [
  { name: 'CBC', normalRange: 'Varies', cost: 200 },
  { name: 'Blood Glucose', normalRange: '70-110 mg/dL', cost: 100 },
  { name: 'Lipid Profile', normalRange: 'Varies', cost: 300 },
  { name: 'Urinalysis', normalRange: 'Varies', cost: 150 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Test.deleteMany({});
  await Test.insertMany(tests);
  console.log('Test types seeded!');
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
