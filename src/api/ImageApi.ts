import axios from "axios";
import { API_IMAGE } from "../constants/BaseApi";

<<<<<<< HEAD
export const uploadImage = async (file: File[], objectId: number, objectName: string) => {
=======
export const uploadMutiImage = async (file: File[], objectId: number, objectName: string): Promise<string[]> => {
>>>>>>> 8dc1d42804196e8fa5575a6b6389fa852f9e38b9
    const requestBody = { file, objectId, objectName };
    const response = await axios({
        method: 'post',
        url: `${API_IMAGE}/api/v1/images`,
        data: requestBody,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
<<<<<<< HEAD
    return response.data.file[0].url;
=======
    return response.data.file.map((f: any) => f.url);
}

export const uploadOneImage = async (file: File[], objectId: number, objectName: string): Promise<string> => {
    const response = await uploadMutiImage([file[0]], objectId, objectName)
    return response[0];
>>>>>>> 8dc1d42804196e8fa5575a6b6389fa852f9e38b9
}