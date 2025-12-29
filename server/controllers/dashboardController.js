export const getDashboardStats = async (req, res) => {
    try {
        const Patient = (await import('../models/Patient.js')).default;
        const TestResult = (await import('../models/TestResult.js')).default;

        // 1. Total Patients
        const totalPatients = await Patient.countDocuments();

        // 2. Tests Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const testsToday = await TestResult.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 3. Active Cases (Pending or In Progress)
        const activeCases = await TestResult.countDocuments({
            status: { $in: ['Pending', 'In Progress'] }
        });

        res.json({
            totalPatients,
            testsToday,
            activeCases
        });
    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
