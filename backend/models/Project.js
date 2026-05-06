import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        originalImage: {
            url: String,
            publicId: String,
        },
        generatedImages: [
            {
                url: String,
                publicId: String,
            },
        ],
        attributes: {
            gender: {
                type: String,
                enum: ['male', 'female', 'neutral'],
                required: true,
            },
            bodyType: {
                type: String,
                enum: ['slim', 'athletic', 'average', 'curvy', 'plus-size'],
                required: true,
            },
            skinTone: {
                type: String,
                enum: ['fair', 'medium', 'olive', 'dark'],
                required: true,
            },
            pose: {
                type: String,
                enum: ['standing', 'walking', 'sitting', 'pose1', 'pose2'],
                required: true,
            },
            background: {
                type: String,
                enum: ['studio', 'outdoor', 'indoor', 'custom'],
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        error: String,
    },
    { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
