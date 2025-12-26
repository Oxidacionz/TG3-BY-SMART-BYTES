/**
 * Image Compression Utility
 * Reduces image size before sending to API to improve performance
 */

export interface ImageCompressionOptions {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    outputFormat: 'image/jpeg' | 'image/webp' | 'image/png';
}

export class ImageCompressor {
    private defaultOptions: ImageCompressionOptions = {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.85,
        outputFormat: 'image/jpeg'
    };

    /**
     * Compress an image to reduce file size
     * @param base64 - Base64 encoded image string
     * @param options - Compression options (optional)
     * @returns Compressed base64 image
     */
    async compress(
        base64: string,
        options: Partial<ImageCompressionOptions> = {}
    ): Promise<string> {
        const config = { ...this.defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                try {
                    // Calculate scaling ratio
                    const ratio = Math.min(
                        config.maxWidth / img.width,
                        config.maxHeight / img.height,
                        1 // Don't upscale if image is smaller
                    );

                    // Create canvas with scaled dimensions
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.floor(img.width * ratio);
                    canvas.height = Math.floor(img.height * ratio);

                    // Draw and compress
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    // Enable image smoothing for better quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert to base64 with compression
                    const compressed = canvas.toDataURL(config.outputFormat, config.quality);

                    resolve(compressed);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = base64;
        });
    }

    /**
     * Get the size of a base64 image in bytes
     */
    getSize(base64: string): number {
        // Remove data URL prefix if present
        const base64Data = base64.split(',')[1] || base64;
        // Calculate size (base64 is ~33% larger than binary)
        return Math.floor((base64Data.length * 3) / 4);
    }

    /**
     * Get human-readable size
     */
    getReadableSize(base64: string): string {
        const bytes = this.getSize(base64);
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Singleton instance
export const imageCompressor = new ImageCompressor();
