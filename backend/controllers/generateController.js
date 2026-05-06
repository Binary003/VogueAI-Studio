import Project from '../models/Project.js';
import User from '../models/User.js';
import { simulateAIGeneration } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

export const generateImages = async (req, res) => {
    try {
        const { imageUrl, publicId, gender, bodyType, skinTone, pose, background, clothingDescription } = req.body;
        const userId = req.userId;

        // Validation
        if (!imageUrl || !publicId) {
            return errorResponse(res, 400, 'Image URL and publicId are required');
        }

        if (!gender || !bodyType || !skinTone || !pose || !background) {
            return errorResponse(res, 400, 'All attributes are required');
        }

        // Check user generation limit
        const user = await User.findById(userId);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        if (user.generationsUsed >= user.generationLimit) {
            return errorResponse(res, 429, 'Generation limit exceeded. Upgrade your plan.');
        }

        // Create project with pending status
        const project = await Project.create({
            userId,
            originalImage: {
                url: imageUrl,
                publicId,
            },
            attributes: {
                gender,
                bodyType,
                skinTone,
                pose,
                background,
            },
            status: 'pending',
        });

        // AI generation
        try {
            console.log('🎨 Starting image generation...');
            const generatedImages = await simulateAIGeneration(
                imageUrl, 
                clothingDescription || 'fashionable outfit', 
                {
                    gender,
                    bodyType,
                    skinTone,
                    pose,
                    background,
                }
            );

            // Update project with generated images
            project.generatedImages = generatedImages;
            project.status = 'completed';
            await project.save();

            // Increment user generations used
            user.generationsUsed += 1;
            await user.save();

            return successResponse(
                res,
                200,
                {
                    projectId: project._id,
                    generatedImages,
                },
                'Images generated successfully with your exact clothing style'
            );
        } catch (aiError) {
            console.error('AI Generation Error:', aiError);
            project.status = 'failed';
            project.error = aiError.message;
            await project.save();

            return errorResponse(res, 500, aiError.message || 'Error generating images. Please try again.');
        }
    } catch (error) {
        console.error('Generate Images Error:', error);
        return errorResponse(res, 500, 'Error generating images');
    }
};
