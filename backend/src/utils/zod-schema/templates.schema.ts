/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import { z } from 'zod'

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const templateSchema = z.object(
    {
        title: z
            .string('Title is required')
            .trim()
            .min(1, 'Title cannot be empty')
            .max(100, 'Title must be at most 100 characters'),

        occasionType: z
            .string('Occasion type is required')
            .trim()
            .min(1, 'Occasion type cannot be empty')
            .max(50, 'Occasion type must be at most 50 characters'),

        thumbnailUrl: z
            .string('Thumbnail URL is required')
            .trim()
            .min(1, 'Thumbnail URL cannot be empty')
            .url('Thumbnail URL must be a valid URL (e.g. https://example.com/image.png)'),

        layoutConfig: z.object(
            {
                photoSlots: z
                    .array(
                        z.string('Photo slot name must be text').url().trim().min(1, 'Photo slot name cannot be empty'),
                        'Photo slots are required'
                    )
                    .min(1, 'Add at least one photo slot'),

                textSlots: z
                    .array(
                        z.string('Text slot name must be text').trim().min(1, 'Text slot name cannot be empty'),
                        'Text slots are required'
                    )
                    .min(1, 'Add at least one text slot'),

                colorScheme: z.object(
                    {
                        primary: z
                            .string('Primary color is required')
                            .regex(HEX_COLOR, 'Primary color must be a valid hex code (e.g. #ff0000)'),
                        secondary: z
                            .string('Secondary color is required')
                            .regex(HEX_COLOR, 'Secondary color must be a valid hex code (e.g. #ff0000)'),
                        accent: z
                            .string('Accent color is required')
                            .regex(HEX_COLOR, 'Accent color must be a valid hex code (e.g. #ff0000)'),
                    },
                    'Color scheme is required'
                ),
            },
            'Layout configuration is required'
        )
    },
    'Invalid template data'
)

export type TemplateInput = z.infer<typeof templateSchema>
export default templateSchema

