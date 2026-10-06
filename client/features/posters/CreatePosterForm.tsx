/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

"use client";

import { toast } from "@/components/shadcn/toast";
import { SERVER_URL } from "@/lib/config/env";
import { bangladeshiOccasions } from "@/lib/data/occasions";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";



interface ITemplate {
    _id: string;
    title: string;
    occasionType: string,
    thumbnailUrl: string,
    layoutConfig: {
        photoSlots: string[];
        textSlots: string[];
        colorScheme: {
            primary: string;
            secondary: string;
            accent: string;
        }
    },
    createdAt: Date
}

export default function CreatePosterForm({ setPosterUrl }: { setPosterUrl: (value : string) => void }) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    let [templateId, setTemplateId] = useState<string>('');
    let [templates, setTemplates] = useState<ITemplate[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        party: "",
        district: "",
        occasionType: "",
        uploadedPhotoUrls: "",
    });

    useEffect(() => {
        (async function () {
            if (!formData.occasionType) return;
            let response = await fetch(`${SERVER_URL}/api/templates?occasion=` + formData.occasionType, {
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.ok) {
                let { data: { templates } } = await response.json();
                setTemplates(templates);
                if (templates.length === 1) {
                    setTemplateId(templates[0]._id)
                }
            } else {
                toast.add({ title: 'failed to load templates' })
            }
        })();
    }, [formData.occasionType])
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const ImageFileToUrl = async (file: File): Promise<string> => {
        const form = new FormData();

        form.append("image", file);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/`,
            {
                method: "POST",
                body: form,
                credentials: "include",
                cache: "no-cache",
            }
        );

        if (response.status !== 200) {
            throw new Error("Failed to upload image");
        }

        const {
            data: { url },
        } = await response.json();

        return url;
    };

    const handlePhotoChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }

            setIsUploadingPhoto(true);

            const url = await ImageFileToUrl(file);

            setFormData((prev) => ({
                ...prev,
                uploadedPhotoUrls: url,
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to upload photo.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setIsUploadingPhoto(true);
            let response = await fetch(`${SERVER_URL}/api/posters/`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    templateId: templateId,
                    formData: {
                        name: formData.name,
                        designation: formData.designation,
                        party: formData.party,
                        district: formData.district
                    },
                    uploadedPhotoUrls: [formData.uploadedPhotoUrls]
                }),
                cache: 'no-cache',
                credentials: 'include'
            });

            if (response.ok) {
                let jsonData = await response.json();
                setPosterUrl(jsonData.data.poster.url);
                console.log(jsonData.data.poster.aiResponse );
                
                toast.add({ title: 'Poster created' })
            } else {
                console.log(await response.json());
                toast.add({ title: 'Failed to Create Posters' })
            }
        } catch (error) {
            console.error(error);
            toast.add({ title : 'Failed to Create Posters'})
        }  finally {
            setIsUploadingPhoto(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Create Poster
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Enter the information below to create a poster.
                </p>
            </div>

            <div className="flex flex-row flex-wrap gap-5">
                {/* Name */}
                <div className="w-full">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Designation */}
                <div className="w-full sm:w-[calc(50%-10px)]">
                    <label
                        htmlFor="designation"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Designation
                    </label>

                    <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Chairman"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Party */}
                <div className="w-full sm:w-[calc(50%-10px)]">
                    <label
                        htmlFor="party"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Party
                    </label>

                    <input
                        id="party"
                        name="party"
                        type="text"
                        value={formData.party}
                        onChange={handleChange}
                        placeholder="Enter party name"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* District */}
                <div className="w-full sm:w-[calc(50%-10px)]">
                    <label
                        htmlFor="district"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        District
                    </label>

                    <input
                        id="district"
                        name="district"
                        type="text"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter district"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Occasion Type */}
                <div className="w-full sm:w-[calc(50%-10px)]">
                    <label
                        htmlFor="occasionType"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Occasion Type
                    </label>

                    <select
                        id="occasionType"
                        name="occasionType"
                        value={formData.occasionType}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="" disabled>
                            Select an occasion
                        </option>

                        {bangladeshiOccasions.map((occasion) => (
                            <option key={occasion} value={occasion}>
                                {occasion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col w-full" >
                    <h3>Templates</h3>
                    <div className="flex flex-row flex-wrap justify-start items-start gap-3">
                        {templates.length === 0 && <p className="text-sm text-gray-600" >No Templates is available for this occasion</p>}
                        {templates.map((t, key) =>
                            <div
                                key={key}
                                className={` box-border p-2 border-2 rounded-md ${t._id === templateId ? " border-primary" : 'border-gray-300'}`}
                                onClick={() => setTemplateId(t._id)}
                            >
                                <img
                                    src={t.thumbnailUrl}
                                    alt="thumnail url"
                                    className="w-30 h-30 object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Photo */}
                <div className="w-full">
                    <label
                        htmlFor="uploadedPhoto"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Photo
                    </label>

                    <input
                        ref={photoInputRef}
                        id="uploadedPhoto"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={isUploadingPhoto}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    {isUploadingPhoto && (
                        <p className="mt-2 text-sm text-gray-500">
                            Uploading photo...
                        </p>
                    )}

                    {formData.uploadedPhotoUrls && !isUploadingPhoto && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Uploaded Photo
                            </p>

                            <img
                                src={formData.uploadedPhotoUrls}
                                alt="Uploaded photo"
                                className="h-32 w-32 rounded-lg object-cover border-2 border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isUploadingPhoto}
                className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isUploadingPhoto ? "Uploading..." : "Create Poster"}
            </button>
        </form>
    );
}