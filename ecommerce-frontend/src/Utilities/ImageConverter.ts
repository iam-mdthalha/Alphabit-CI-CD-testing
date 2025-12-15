//Converts base64String to imageUrl
export function getImage(base64String: string | null) {
    if(base64String !== null) {
        const decodedData = atob(base64String);

        const byteArr = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
            byteArr[i] = decodedData.charCodeAt(i);
        }

        const blob = new Blob([byteArr], { type: 'image/jpeg' });

        const imageUrl = URL.createObjectURL(blob);

        return imageUrl;
    }

    return null;
    
}