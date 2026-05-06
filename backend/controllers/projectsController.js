import Project from '../models/Project.js';
import { v2 as cloudinary } from 'cloudinary';
import { successResponse, errorResponse } from '../utils/responses.js';

export const getAllProjects = async (req, res) => {
    try {
        const userId = req.userId;

        const projects = await Project.find({ userId }).sort({ createdAt: -1 });

        return successResponse(res, 200, projects, 'Projects retrieved successfully');
    } catch (error) {
        console.error('Get Projects Error:', error);
        return errorResponse(res, 500, 'Error retrieving projects');
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return errorResponse(res, 404, 'Project not found');
        }

        return successResponse(res, 200, project, 'Project retrieved successfully');
    } catch (error) {
        console.error('Get Project Error:', error);
        return errorResponse(res, 500, 'Error retrieving project');
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return errorResponse(res, 404, 'Project not found');
        }

        // Delete images from Cloudinary
        try {
            if (project.originalImage?.publicId) {
                await cloudinary.uploader.destroy(project.originalImage.publicId);
            }

            for (const image of project.generatedImages || []) {
                if (image.publicId) {
                    await cloudinary.uploader.destroy(image.publicId);
                }
            }
        } catch (cloudinaryError) {
            console.error('Cloudinary Deletion Error:', cloudinaryError);
            // Continue with project deletion even if Cloudinary fails
        }

        // Delete project from database
        await Project.findByIdAndDelete(id);

        return successResponse(res, 200, {}, 'Project deleted successfully');
    } catch (error) {
        console.error('Delete Project Error:', error);
        return errorResponse(res, 500, 'Error deleting project');
    }
};
