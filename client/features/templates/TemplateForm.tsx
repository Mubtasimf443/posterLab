/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Plus, X } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select' // <- adjust path
import { bangladeshiOccasions } from '@/lib/data/occasions'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import Image from 'next/image'
import { SERVER_URL } from '@/lib/config/env'
import { toast } from '@/components/shadcn/toast'
import { useRouter } from 'next/navigation'



export type TemplateInput = {
    title: string
    occasionType: (typeof bangladeshiOccasions)[number]
    thumbnailUrl: string
    layoutConfig: {
        photoSlots: string[]
        textSlots: string[]
        colorScheme: {
            primary: string
            secondary: string
            accent: string
        }
    }
}

/* Same rules as the schema, expressed as native HTML attributes */
const NOT_BLANK = '.*\\S.*' // at least one non-space character
const HEX_COLOR = '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})'
const HEX_HINT = 'Must be a valid hex code (e.g. #ff0000)'

type ColorKey = keyof TemplateInput['layoutConfig']['colorScheme']

/* -------------------------------------------------------------------------- */
/*  Small layout helper                                                       */
/* -------------------------------------------------------------------------- */
function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string
    htmlFor?: string
    hint?: string
    children: ReactNode
}) {
    return (
        <div className='space-y-2'>
            <Label htmlFor={htmlFor}>{label}</Label>
            {hint && <p className='text-sm text-muted-foreground'>{hint}</p>}
            {children}
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/*  Repeatable list of string inputs                                          */
/* -------------------------------------------------------------------------- */
function SlotList({
    label,
    hint,
    values,
    onChange,
    type,
    placeholder,
    itemTitle,
    addLabel,
}: {
    label: string
    hint?: string
    values: string[]
    onChange: (next: string[]) => void
    type: 'url' | 'text'
    placeholder?: string
    itemTitle: string
    addLabel: string
}) {
    return (
        <Field label={label} hint={hint}>
            <div className='space-y-2'>
                {values.map((value, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <Input
                            type={type}
                            required
                            pattern={type === 'text' ? NOT_BLANK : undefined}
                            title={itemTitle}
                            placeholder={placeholder}
                            aria-label={`${label} ${index + 1}`}
                            value={value}
                            onChange={(e) => onChange(values.map((v, i) => (i === index ? e.target.value : v)))}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                            disabled={values.length === 1} // at least one slot is required
                            onClick={() => onChange(values.filter((_, i) => i !== index))}
                        >
                            <X className='size-4' />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type='button' variant='outline' size='sm' onClick={() => onChange([...values, ''])}>
                <Plus className='size-4' />
                {addLabel}
            </Button>
        </Field>
    )
}

/* -------------------------------------------------------------------------- */
/*  Hex color input (native picker + text field)                              */
/* -------------------------------------------------------------------------- */
const toPickerValue = (hex: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) return '#' + [...hex.slice(1)].map((c) => c + c).join('')
    return '#000000'
}

function ColorInput({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (next: string) => void
}) {
    const id = useId()
    return (
        <Field label={label} htmlFor={id}>
            <div className='flex items-center gap-2'>
                <input
                    type='color'
                    aria-label={`${label} color picker`}
                    value={toPickerValue(value)}
                    onChange={(e) => onChange(e.target.value)}
                    className='h-9 w-11 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1'
                />
                <Input
                    id={id}
                    required
                    pattern={HEX_COLOR}
                    title={HEX_HINT}
                    placeholder='#ff0000'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </Field>
    )
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                      */
/* -------------------------------------------------------------------------- */
export function TemplateForm({ defaultValues, onSubmit, }: { defaultValues?: Partial<TemplateInput>, onSubmit: (values: TemplateInput) => Promise<boolean> }) {
    const titleId = useId()
    const thumbnailId = useId()
    const [title, setTitle] = useState(defaultValues?.title ?? '')
    const [occasionType, setOccasionType] = useState<string>(defaultValues?.occasionType ?? '')
    const [thumbnailUrl, setThumbnailUrl] = useState(defaultValues?.thumbnailUrl ?? '')
    const [photoSlots, setPhotoSlots] = useState<string[]>([])
    const [textSlots, setTextSlots] = useState<string[]>(defaultValues?.layoutConfig?.textSlots ?? [''])
    const thumbnailInputRef= useRef<HTMLInputElement>(null);
    const photoSlotsInputRef= useRef<HTMLInputElement>(null);
    let [isUploadingThumb, setIsUploadingThumb]= useState(false);
    let [isUploadingPhotoSlots, setIsUploadingPhotoSlots]= useState(false);
    const [colors, setColors] = useState<Record<ColorKey, string>>({
        primary: defaultValues?.layoutConfig?.colorScheme?.primary ?? '#000000',
        secondary: defaultValues?.layoutConfig?.colorScheme?.secondary ?? '#ffffff',
        accent: defaultValues?.layoutConfig?.colorScheme?.accent ?? '#ff0000',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    
    async function ImageFileToUrl(file:any) {
        let form= new FormData();
        form.append('image', file);
        const response = await fetch(SERVER_URL + '/api/upload/', {
            method : 'POST',
            body : form,
            credentials : 'include',
            cache : 'no-cache'
        });
        if (response.status !== 200) {
            console.log('failed to upload Image, the response is ', (await response.json()));
            throw new Error( 'failed to upload Image')
        } else {
            let { data: { url } } = await response.json()
            return url
        }
    }

    async function onthumbnailFileChange() {
        try {
            setIsUploadingThumb(true)
            if (thumbnailInputRef.current && thumbnailInputRef.current.files) {
                let file = thumbnailInputRef.current.files[0];
                setThumbnailUrl(await ImageFileToUrl(file))
            }
        } catch (error) {
            toast.add({ title: 'failed to upload thubmnail' })
        } finally {
            setIsUploadingThumb(false)
        }
    }

    async function onPhotoSlotFileChange() {
        try {
            setIsUploadingPhotoSlots(true)
            if (photoSlotsInputRef.current && photoSlotsInputRef.current.files) {
                let file = photoSlotsInputRef.current.files[0];
                let url=await ImageFileToUrl(file);
                setPhotoSlots(prev=> [...prev, url]);
            }
        } catch (error) {
            toast.add({ title: 'failed to upload Photo Slot' })
        } finally {
            setIsUploadingPhotoSlots(false)
        }
    }


    const reset = () => {
        setTitle(defaultValues?.title ?? '')
        setOccasionType(defaultValues?.occasionType ?? '')
        setThumbnailUrl(defaultValues?.thumbnailUrl ?? '')
        setPhotoSlots(defaultValues?.layoutConfig?.photoSlots ?? [])
        setTextSlots(defaultValues?.layoutConfig?.textSlots ?? [''])
        setColors({
            primary: defaultValues?.layoutConfig?.colorScheme?.primary ?? '#000000',
            secondary: defaultValues?.layoutConfig?.colorScheme?.secondary ?? '#ffffff',
            accent: defaultValues?.layoutConfig?.colorScheme?.accent ?? '#ff0000',
        })
    }

    // The browser only calls this once every field's native validation has passed.
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const values: TemplateInput = {
            title: title.trim(),
            occasionType: occasionType as TemplateInput['occasionType'],
            thumbnailUrl: thumbnailUrl.trim(),
            layoutConfig: {
                photoSlots: photoSlots.map((s) => s.trim()),
                textSlots: textSlots.map((s) => s.trim()),
                colorScheme: colors,
            },
        }

        setIsSubmitting(true)
        try {
            let isSubmited =await onSubmit(values);
            if (isSubmited) {
                toast.add({ title : 'template created'});
                setTimeout(() => {
                    router.push('/admin/templates');
                    router.refresh();
                }, 3000);
            } else {
                toast.add({ title: 'Template creation failed' })
            }
        } finally {
            setIsSubmitting(false)
        }
    }



    return (
        <form onSubmit={handleSubmit} className='mx-auto w-full max-w-2xl space-y-8'>
            {/* Basics */}
            <section className='space-y-4'>
                <h2 className='text-lg font-semibold'>Template details</h2>

                <Field label='Title' htmlFor={titleId} hint='Up to 100 characters.'>
                    <Input
                        id={titleId}
                        required
                        maxLength={100}
                        pattern={NOT_BLANK}
                        title='Title cannot be empty'
                        placeholder='Eid Mubarak greeting card'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Field>

                <Field label='Occasion'>
                    <Select value={occasionType} onValueChange={(val) => !!val && setOccasionType(val)} required>
                        <SelectTrigger className='w-full' aria-label='Occasion'>
                            <SelectValue placeholder='Select an occasion' />
                        </SelectTrigger>
                        <SelectContent>
                            {bangladeshiOccasions.map((occasion) => (
                                <SelectItem key={occasion} value={occasion}>
                                    {occasion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label='Thumbnail URL' htmlFor={thumbnailId}>
                    {!!thumbnailUrl && !isUploadingThumb && <Image width={100} height={100} src={thumbnailUrl} alt='thumbnail' />}
                    {isUploadingThumb && <Image src={'/images/loading.gif'} alt='loading' width={100} height={100}/>}
                    <Input
                        className=' disabled:opacity-50'
                        id={thumbnailId}
                        ref={thumbnailInputRef}
                        type='file'
                        accept='image/*'
                        required
                        onChange={onthumbnailFileChange}
                        disabled={isUploadingThumb}
                    />
                </Field>
            </section>

            {/* Layout */}
            <section className='space-y-6'>
                <h2 className='text-lg font-semibold'>Layout</h2>

                 <div className='flex flex-col justify-start items-start gap-2'>
                    <Label>Photo Slots</Label>
                    <div className="flex flex-row flex-wrap justify-start items-center gap-5">
                        {photoSlots.length > 0 && photoSlots.map((photo, key) => 
                            <Image key={key} src={photo} alt='photo slots' width={100} height={100} />
                        )}
                        {isUploadingPhotoSlots && <Image src={'/images/loading.gif'} width={100} height={100} alt='loading' />}
                    </div>

                    <Input
                        type='file'
                        name='image_slots'
                        accept='image/*'
                        ref={photoSlotsInputRef}
                        onChange={onPhotoSlotFileChange}
                        multiple={false}
                        disabled={isUploadingPhotoSlots}
                        className=' disabled:opacity-50'
                    />
                 </div>
                <SlotList
                    label='Text slots'
                    hint='A name for each editable text area, e.g. “Greeting” or “Sender name”.'
                    type='text'
                    placeholder='Greeting'
                    itemTitle='Text slot name cannot be empty'
                    addLabel='Add text slot'
                    values={textSlots}
                    onChange={setTextSlots}
                />
            </section>

            {/* Colors */}
            <section className='space-y-4'>
                <h2 className='text-lg font-semibold'>Color scheme</h2>
                <div className='grid gap-4 sm:grid-cols-3'>
                    {(['primary', 'secondary', 'accent'] as const).map((key) => (
                        <ColorInput
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={colors[key]}
                            onChange={(next) => setColors((prev) => ({ ...prev, [key]: next }))}
                        />
                    ))}
                </div>
            </section>

            <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={reset}>
                    Reset
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create template'}
                </Button>
            </div>
        </form>
    )
}

export default TemplateForm