import {generateResourceId} from "./generate-resource-id";

export const getFileFromBlob = (blob) => {
    const match = blob.type.match(/[^/]*$/)
    const extension = match.length > 0 ? match[0] : null
    if (extension) {
        const filename = generateResourceId() + '.' + extension;
        return new File([blob], filename, {
            type: blob.type
        })
    }
    return null
}