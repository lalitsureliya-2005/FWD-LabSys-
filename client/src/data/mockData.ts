export interface TestRecord {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  testType: string;
  purpose: string;
  sampleReceivedTime: string;
  sampleTestedTime: string;
  testData: string;
}

export const mockRecords: TestRecord[] = [
  {
    id: "1",
    patientId: "PT123456",
    patientName: "John Doe",
    age: 45,
    gender: "Male",
    testType: "CBC",
    purpose: "Routine health checkup and blood count analysis",
    sampleReceivedTime: new Date().toISOString(),
    sampleTestedTime: new Date(Date.now() + 3600000).toISOString(),
    testData: JSON.stringify({
      "Hemoglobin": "14.5 g/dL",
      "RBC Count": "5.2 M/μL",
      "WBC Count": "7500/μL",
      "Platelet Count": "250,000/μL"
    })
  },
  {
    id: "2",
    patientId: "PT789012",
    patientName: "Jane Smith",
    age: 32,
    gender: "Female",
    testType: "Blood Glucose",
    purpose: "Diabetes screening and glucose level monitoring",
    sampleReceivedTime: new Date(Date.now() - 86400000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 82800000).toISOString(),
    testData: JSON.stringify({
      "Fasting": "95 mg/dL",
      "Post Prandial": "140 mg/dL"
    })
  },
  {
    id: "3",
    patientId: "PT345678",
    patientName: "Robert Johnson",
    age: 58,
    gender: "Male",
    testType: "Lipid Profile",
    purpose: "Cardiovascular risk assessment and cholesterol monitoring",
    sampleReceivedTime: new Date(Date.now() - 172800000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 169200000).toISOString(),
    testData: JSON.stringify({
      "Total Cholesterol": "195 mg/dL",
      "LDL": "120 mg/dL",
      "HDL": "55 mg/dL",
      "Triglycerides": "110 mg/dL"
    })
  },
  {
    id: "4",
    patientId: "PT901234",
    patientName: "Emily Davis",
    age: 28,
    gender: "Female",
    testType: "Urinalysis",
    purpose: "Urinary tract infection screening",
    sampleReceivedTime: new Date(Date.now() - 259200000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 255600000).toISOString(),
    testData: JSON.stringify({
      "Color": "Pale Yellow",
      "pH": "6.0",
      "Protein": "Negative",
      "Glucose": "Negative"
    })
  },
  {
    id: "5",
    patientId: "PT567890",
    patientName: "Michael Brown",
    age: 52,
    gender: "Male",
    testType: "CBC",
    purpose: "Pre-operative assessment and blood work evaluation",
    sampleReceivedTime: new Date(Date.now() - 345600000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 342000000).toISOString(),
    testData: JSON.stringify({
      "Hemoglobin": "15.2 g/dL",
      "RBC Count": "5.5 M/μL",
      "WBC Count": "8200/μL",
      "Platelet Count": "280,000/μL"
    })
  }
];

// Calculate stats from records data
export const calculateStats = (records: TestRecord[] = mockRecords) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisWeekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Total unique patients
  const uniquePatients = new Set(records.map(r => r.patientId)).size;

  // Tests today (received today)
  const testsToday = records.filter(r => {
    const receivedDate = new Date(r.sampleReceivedTime);
    return receivedDate >= todayStart;
  }).length;

  // Active cases (tests that are received but not yet tested)
  const activeCases = records.filter(r => {
    const receivedDate = new Date(r.sampleReceivedTime);
    const testedDate = new Date(r.sampleTestedTime);
    return receivedDate <= today && testedDate > today;
  }).length;

  // Test types count
  const testTypes = new Set(records.map(r => r.testType)).size;

  // This week records
  const thisWeekRecords = records.filter(r => {
    const receivedDate = new Date(r.sampleReceivedTime);
    return receivedDate >= thisWeekStart;
  }).length;

  return {
    totalPatients: uniquePatients,
    testsToday,
    activeCases,
    testTypes,
    thisWeekRecords,
    totalRecords: records.length
  };
};
