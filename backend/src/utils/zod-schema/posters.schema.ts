/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import { z } from 'zod'

const OBJECT_ID = /^[0-9a-fA-F]{24}$/

export const createPosterSchema = z.object(
    {
        userId: z
            .string('User ID is required')
            .regex(OBJECT_ID, 'User ID must be a valid ID'),

        templateId: z
            .string('Template ID is required')
            .regex(OBJECT_ID, 'Template ID must be a valid ID'),

        formData: z.object(
            {
                name: z
                    .string('Name is required')
                    .trim()
                    .min(1, 'Name cannot be empty')
                    .max(100, 'Name must be at most 100 characters'),

                designation: z
                    .string('Designation is required')
                    .trim()
                    .min(1, 'Designation cannot be empty')
                    .max(100, 'Designation must be at most 100 characters'),

                party: z
                    .string('Party is required')
                    .trim()
                    .min(1, 'Party cannot be empty')
                    .max(100, 'Party must be at most 100 characters'),

                district: z
                    .string('District is required')
                    .trim()
                    .min(1, 'District cannot be empty')
                    .max(100, 'District must be at most 100 characters'),
            },
            'Form data is required'
        ),

        uploadedPhotoUrls: z
            .array(
                z
                    .string('Uploaded photo URL must be text')
                    .trim()
                    .min(1, 'Uploaded photo URL cannot be empty')
                    .url('Uploaded photo URL must be a valid URL'),
                'Uploaded photos are required'
            )
            .min(1, 'Upload at least one photo'),

      
    },
    'Invalid poster data'
)


// For the create-poster form: the server fills in userId (from the session),
// and the generation process sets generatedImagesUrl, status and createdAt


