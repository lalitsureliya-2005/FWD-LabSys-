import Test from '../models/Test.js';

export const addTest = async (req, res) => {
  try {
    const { name, normalRange, cost } = req.body;
    const existing = await Test.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Test already exists' });
    const test = await Test.create({ name, normalRange, cost });
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const test = await Test.findByIdAndUpdate(id, update, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
