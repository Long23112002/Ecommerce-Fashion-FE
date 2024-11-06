import axiosInstance from "./AxiosInstance";

const API_BASE_URL = `http://ecommerce-fashion.site:9099/api/v1/images`

export interface FileImage {
    url: string;
}

interface ImageData {
    file: FileImage[];
    objectId: number;
    objectName: string;
}

export const postImage = async (imageData: ImageData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    };
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}`, imageData, config)
        return response.data;
    } catch (error: any) {
        console.log("Error post image", error);
        throw error;
    }
}