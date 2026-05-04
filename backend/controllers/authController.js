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
