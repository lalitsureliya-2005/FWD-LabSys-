import SearchInterface from '../SearchInterface';

const mockRecords = [
  {
    id: "1",
    patientId: "PT123456",
    patientName: "John Doe",
    age: 45,
    gender: "Male",
    testType: "CBC",
    purpose: "Routine health checkup",
    sampleReceivedTime: new Date().toISOString(),
    sampleTestedTime: new Date(Date.now() + 3600000).toISOString(),
    testData: JSON.stringify({ "Hemoglobin": "14.5 g/dL", "WBC Count": "7500/μL" })
  },
  {
    id: "2",
    patientId: "PT789012",
    patientName: "Jane Smith",
    age: 32,
    gender: "Female",
    testType: "Blood Glucose",
    purpose: "Diabetes screening",
    sampleReceivedTime: new Date(Date.now() - 86400000).toISOString(),
    sampleTestedTime: new Date(Date.now() - 82800000).toISOString(),
    testData: JSON.stringify({ "Fasting": "95 mg/dL", "Post Prandial": "140 mg/dL" })
  }
];

export default function SearchInterfaceExample() {
  return (
    <div className="p-8">
      <SearchInterface records={mockRecords} onSearch={(q) => console.log('Search:', q)} />
    </div>
  );
}
