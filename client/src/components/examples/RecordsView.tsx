import RecordsView from '../RecordsView';

const mockRecords = [
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
    purpose: "Cardiovascular risk assessment",
    sampleReceivedTime: new Date(Date.now() - 172800000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 169200000).toISOString(),
    testData: JSON.stringify({
      "Total Cholesterol": "195 mg/dL",
      "LDL": "120 mg/dL",
      "HDL": "55 mg/dL",
      "Triglycerides": "110 mg/dL"
    })
  }
];

export default function RecordsViewExample() {
  return (
    <div className="p-8">
      <RecordsView records={mockRecords} />
    </div>
  );
}
