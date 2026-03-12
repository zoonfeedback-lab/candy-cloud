const Setting = require("../models/Setting");

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Setting.find();
        // Convert to a simple key-value object
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        
        res.status(200).json({
            success: true,
            data: settingsObj
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update settings
// @route   POST /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
    try {
        const settings = req.body;
        
        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return Setting.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        });
        
        await Promise.all(updatePromises);
        
        res.status(200).json({
            success: true,
            message: "Settings updated successfully"
        });
    } catch (error) {
        next(error);
    }
};
