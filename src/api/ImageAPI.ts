import axios from "axios";
import { API_IMAGE } from "../constants/BaseApi";

export const uploadImage = async (file: File[], objectId: number, objectName: string) => {
    try {
        const requestBody = { file, objectId, objectName };
        const response = await axios({
            method: 'post',
            url: `${API_IMAGE}/api/v1/images`,
            data: requestBody,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.file[0].url;
    } catch (error) {
        throw error;
    }
}