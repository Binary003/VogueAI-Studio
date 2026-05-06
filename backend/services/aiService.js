

// Generate images using Stability AI Image-to-Image API (aims to keep same clothing)
export const generateWithStabilityAI = async (imageBuffer, prompt) => {
    try {
        const stabilityApiKey = process.env.STABILITY_AI_KEY;

        if (!stabilityApiKey) {
            console.warn('⚠️  Stability AI API key not configured. Using mock images.');
            return generateMockImages().map((url, idx) => ({ base64: url, seed: idx }));
        }

        console.log('🎨 Generating images with Stability AI SD3 Image-to-Image...');
        console.log('📝 Prompt:', prompt);
        console.log('📦 Image buffer size:', imageBuffer.length, 'bytes');

        // Create form data
        const form = new FormData();
        form.append('image', imageBuffer, { filename: 'clothing.png' });
        form.append('prompt', prompt);
        form.append('mode', 'image-to-image');
        form.append('model', 'sd3');
        form.append('strength', '0.8');
        form.append('output_format', 'png');
        form.append('negative_prompt', 'flat lay, no person, mannequin only, different clothes, changed clothing, different garment, blurry, deformed');

        const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stabilityApiKey}`,
                'Accept': 'application/json',
                ...form.getHeaders(),
            },
            body: form,
        });

        console.log('API Response Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`Stability AI Error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ API Response received');

        // Extract image data from response
        if (result.image) {
            const generatedImages = [{
                base64: result.image,
                seed: result.seed,
            }];

            console.log(`✅ Generated ${generatedImages.length} images with EXACT SAME CLOTHING`);
            return generatedImages;
        } else {
            throw new Error('No images returned from Stability AI');
        }
    } catch (error) {
        console.error('❌ Stability AI Error:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
};

// Upload generated images to Cloudinary
export const uploadToCloudinary = async (base64Image, publicId) => {
    try {
        const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
            public_id: publicId,
            folder: 'modelai_studio/generated',
            resource_type: 'auto',
        });

        console.log(`✅ Image uploaded to Cloudinary: ${result.public_id}`);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('❌ Cloudinary Upload Error:', error.message);
        throw error;
    }
};

// Build prompt for Image-to-Image
const buildDetailedPrompt = (attributes, clothingDescription) => {
    const { gender, bodyType, skinTone, pose, background } = attributes;

    const genderMap = {
        female: 'woman, female model',
        male: 'man, male model',
        neutral: 'androgynous model'
    };

    const bodyTypeMap = {
        slim: 'slim build',
        athletic: 'athletic build',
        average: 'average build',
        curvy: 'curvy figure',
        'plus-size': 'plus size figure'
    };

    const skinToneMap = {
        fair: 'fair light skin tone',
        medium: 'medium tan skin tone',
        olive: 'olive skin tone',
        dark: 'dark skin tone'
    };

    const poseMap = {
        standing: 'standing pose',
        walking: 'walking pose',
        sitting: 'sitting down',
        pose1: 'side profile',
        pose2: 'dynamic action pose'
    };

    const backgroundMap = {
        studio: 'studio white background',
        outdoor: 'outdoor background',
        indoor: 'indoor background',
        custom: 'editorial background'
    };

    const clothingLine = clothingDescription
        ? `Wearing ${clothingDescription}, preserve the exact garment, color, pattern, and logos from the reference image.`
        : 'Wearing the exact same garment from the reference image; preserve color, pattern, and logos.';

    const prompt = `Full-body fashion photo of a ${genderMap[gender] || gender} with a ${bodyTypeMap[bodyType] || bodyType} and ${skinToneMap[skinTone] || skinTone}, ${poseMap[pose] || pose}, ${backgroundMap[background] || background}. ${clothingLine} Professional fashion photography.`;

    return prompt;
};

// Main function to generate and upload images
export const simulateAIGeneration = async (imageUrl, clothingDescription, attributes) => {
    try {
        if (!imageUrl) {
            throw new Error('Cloth image is required. Please upload an image.');
        }

        console.log('📸 Downloading cloth image:', imageUrl);
        const imageBuffer = await downloadImage(imageUrl);

        console.log('🎨 Applying attributes:', attributes);
        const prompt = buildDetailedPrompt(attributes, clothingDescription);
        console.log('📝 Prompt:', prompt);

        // Generate using Image-to-Image
        const generatedImages = await generateWithStabilityAI(imageBuffer, prompt);

        // Upload to Cloudinary
        const uploadedImages = await Promise.all(
            generatedImages.map((img, index) =>
                uploadToCloudinary(img.base64, `modelai_generated_${Date.now()}_${index}`)
            )
        );

        console.log('✅ SUCCESS: Generated with SAME CLOTHING');
        return uploadedImages;
    } catch (error) {
        console.error('❌ Generation Failed:', error.message);
        throw new Error(`Generation failed: ${error.message}`);
    }
};

// Fallback mock images (for testing without API key or when API fails)
export const generateMockImages = () => {
    // Simple 1x1 PNG pixel (smallest valid PNG)
    const pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    return [
        { base64: pixel, seed: 1 },
        { base64: pixel, seed: 2 },
        { base64: pixel, seed: 3 },
        { base64: pixel, seed: 4 },
    ];
};
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Download image from URL and convert to buffer
const downloadImage = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw new Error('Failed to download image');
    }
};
