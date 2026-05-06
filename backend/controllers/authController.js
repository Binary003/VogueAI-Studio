import User from '../models/User.js';
import { generateToken, validateEmail, validatePassword } from '../utils/helpers.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return errorResponse(res, 400, 'Please provide all required fields');
        }

        if (!validateEmail(email)) {
            return errorResponse(res, 400, 'Please provide a valid email');
        }

        if (!validatePassword(password)) {
            return errorResponse(res, 400, 'Password must be at least 6 characters');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'User already exists with this email');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id, user.email);

        // Return response
        return successResponse(
            res,
            201,
            {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    plan: user.plan,
                    generationsUsed: user.generationsUsed,
                },
            },
            'User created successfully'
        );
    } catch (error) {
        console.error('Signup Error:', error);
        return errorResponse(res, 500, 'Error during signup');
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return errorResponse(res, 400, 'Please provide email and password');
        }

        // Find user and select password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password);

        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken(user._id, user.email);

        // Return response
        return successResponse(
            res,
            200,
            {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    plan: user.plan,
                    generationsUsed: user.generationsUsed,
                },
            },
            'Login successful'
        );
    } catch (error) {
        console.error('Login Error:', error);
        return errorResponse(res, 500, 'Error during login');
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, user, 'Profile retrieved successfully');
    } catch (error) {
        console.error('Get Profile Error:', error);
        return errorResponse(res, 500, 'Error retrieving profile');
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return errorResponse(res, 400, 'Please provide name and email');
        }

        if (!validateEmail(email)) {
            return errorResponse(res, 400, 'Please provide a valid email');
        }

        const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
        if (existingUser) {
            return errorResponse(res, 400, 'Email is already in use');
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        user.name = name;
        user.email = email;
        await user.save();

        return successResponse(
            res,
            200,
            {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                generationsUsed: user.generationsUsed,
            },
            'Profile updated successfully'
        );
    } catch (error) {
        console.error('Update Profile Error:', error);
        return errorResponse(res, 500, 'Error updating profile');
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return errorResponse(res, 400, 'Please provide current and new password');
        }

        if (!validatePassword(newPassword)) {
            return errorResponse(res, 400, 'Password must be at least 6 characters');
        }

        const user = await User.findById(req.userId).select('+password');
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        const isPasswordValid = await user.matchPassword(currentPassword);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        return successResponse(res, 200, {}, 'Password updated successfully');
    } catch (error) {
        console.error('Update Password Error:', error);
        return errorResponse(res, 500, 'Error updating password');
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, {}, 'Account deleted successfully');
    } catch (error) {
        console.error('Delete Account Error:', error);
        return errorResponse(res, 500, 'Error deleting account');
    }
};
