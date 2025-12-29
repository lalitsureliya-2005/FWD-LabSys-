import Patient from '../models/Patient.js';

export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone } = req.body;
    // Check if patient exists with SAME name and SAME email
    const existing = await Patient.findOne({ email, name });
    if (existing) {
      // If patient exists, return them with 200 OK so we can proceed to add test results
      return res.status(200).json(existing);
    }
    const patient = await Patient.create({ name, age, gender, email, phone });
    res.status(201).json(patient);
  } catch (err) {
    console.error('AddPatient error:', err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const patient = await Patient.findByIdAndUpdate(id, update, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
