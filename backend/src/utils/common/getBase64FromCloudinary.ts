/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

export default async function getBase64FromCloudinary(cloudinaryUrl: string) {
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const mimeType = response.headers.get('content-type');
    if (mimeType === null) {
        throw new Error('Invalid MimeType in base64 data');
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    return [mimeType, `data:${mimeType};base64,${base64String}`];
}