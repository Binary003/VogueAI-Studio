export const generateMockImages = () => {
  // Mock generated images for demonstration
  return [
    'https://dummyimage.com/512x512/FF6B6B/FFFFFF?text=Generated+1',
    'https://dummyimage.com/512x512/4ECDC4/FFFFFF?text=Generated+2',
    'https://dummyimage.com/512x512/45B7D1/FFFFFF?text=Generated+3',
    'https://dummyimage.com/512x512/FFA07A/FFFFFF?text=Generated+4',
    'https://dummyimage.com/512x512/98D8C8/FFFFFF?text=Generated+5',
  ];
};

export const simulateAIGeneration = async (imageUrl, attributes) => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock generated images with Cloudinary-like structure
  const mockImages = generateMockImages();

  return mockImages.map((url, index) => ({
    url,
    publicId: `modelai_generated_${Date.now()}_${index}`,
  }));
};
