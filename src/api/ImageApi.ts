import axios from "axios";
import { IMAGE_API } from "../constants/BaseApi";

export const uploadMutiImage = async (file: File[], objectId: number, objectName: string): Promise<string[]> => {
    const requestBody = { file, objectId, objectName };
    const response = await axios({
        method: 'post',
        url: `${IMAGE_API}/api/v1/images`,
        data: requestBody,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.file.map((f: any) => f.url);
}

export const uploadOneImage = async (file: File[], objectId: number, objectName: string): Promise<string> => {
    const response = await uploadMutiImage(file, objectId, objectName)
    return response[0];
}
