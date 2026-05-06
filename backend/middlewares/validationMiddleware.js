// Input validation middleware
export const validateImageGeneration = (req, res, next) => {
    const { imageUrl, publicId, gender, bodyType, skinTone, pose, background } = req.body;

    // Check required fields
    if (!imageUrl || !publicId) {
        return res.status(400).json({
            success: false,
            message: 'Image URL and publicId are required',
        });
    }

    if (!gender || !bodyType || !skinTone || !pose || !background) {
        return res.status(400).json({
            success: false,
            message: 'All attributes (gender, bodyType, skinTone, pose, background) are required',
        });
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(imageUrl)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid image URL format',
        });
    }

    // Validate enum values
    const validGenders = ['male', 'female', 'neutral'];
    const validBodyTypes = ['slim', 'athletic', 'average', 'curvy', 'plus-size'];
    const validSkinTones = ['fair', 'medium', 'olive', 'dark'];
    const validPoses = ['standing', 'walking', 'sitting', 'pose1', 'pose2'];
    const validBackgrounds = ['studio', 'outdoor', 'indoor', 'custom'];

    if (!validGenders.includes(gender?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid gender. Valid options: ${validGenders.join(', ')}`,
        });
    }

    if (!validBodyTypes.includes(bodyType?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid bodyType. Valid options: ${validBodyTypes.join(', ')}`,
        });
    }

    if (!validSkinTones.includes(skinTone?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid skinTone. Valid options: ${validSkinTones.join(', ')}`,
        });
    }

    if (!validPoses.includes(pose?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid pose. Valid options: ${validPoses.join(', ')}`,
        });
    }

    if (!validBackgrounds.includes(background?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Invalid background. Valid options: ${validBackgrounds.join(', ')}`,
        });
    }

    next();
};

export const validateSignup = (req, res, next) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Email, password, and name are required',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
    }

    next();
};
