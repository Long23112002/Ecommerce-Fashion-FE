    import { BASE_API } from "../constants/BaseApi";
    import axiosInstance, { PageableRequest } from "./AxiosInstance";
    import { toast } from "react-toastify";
    import { getErrorMessage } from "../pages/Error/getErrorMessage";

    const API_BASE_URL = `${BASE_API}/api/v1/product`
    const API_SERVICE_UPLOAD_URL = `http://ecommerce-fashion.site:9099`;

    interface ProductData {
        name: string;
        code: string;
        description: string;
        idCategory: number;
        idBrand: number;
        idOrigin: number;
        idMaterial: number;
        image: string | null;
    }

    export interface ProductParams {
        keyword?: string | null,
        idBrand?: number | null,
        idOrigin?: number | null,
        idCategory?: number | null,
        idMaterial?: number | null,
        idColors?: number[] | null,
        idSizes?: number[] | null,
        maxPrice?: number | null,
        minPrice?: number | null,
        allowEmpty?: boolean;
    }

    export const getAllProducts = async (query: { params?: ProductParams; pageable?: PageableRequest } = {}) => {
        const { data } = await axiosInstance({
            method: 'GET',
            url: `${BASE_API}/api/v1/product`,
            params: { ...query.params, ...query.pageable },
            paramsSerializer: {
                indexes: null,
            }
        });
        return data;
    };


    export const getProductById = async (id: number | string) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product by ID", error);
            throw error;
        }
    }

    export const getSimilarProducts = async (query: { id: number | string, pageable: PageableRequest }) => {
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${API_BASE_URL}/similar`,
                params: {
                    id: query.id,
                    ...query.pageable
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getSimilarProducts", error);
            throw error;
        }
    }

    export const getHotProducts = async (pageable: PageableRequest) => {
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${API_BASE_URL}/hot`,
                params: {
                    ...pageable
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getHotProducts", error);
            throw error;
        }
    }

    export const getProductInPromotion = async (pageable: PageableRequest) => {
        try {
            const response = await axiosInstance({
                method: 'GET',
                url: `${API_BASE_URL}/in_promotion`,
                params: {
                    ...pageable
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getProductInPromotion", error);
            throw error;
        }
    }

    export const fetchAllProducts = async (
        pageSize: number,
        page: number,
        keyword?: string,
        idOrigin?: number,
        idBrand?: number,
        idMaterial?: number,
        idCategory?: number,
        allowEmpty?: boolean) => {
        const params = {
            size: pageSize,
            page: page,
            keyword: keyword || '',
            idOrigin: idOrigin || '',
            idBrand: idBrand || '',
            idMaterial: idMaterial || '',
            idCategory: idCategory || '',
            allowEmpty: true,
        };
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}`, { params });
            return response.data;
        } catch (error: any) {
            throw new Error(`Error fetching products: ${error.response?.data?.message || error.message}`)
        }
    }

    export const deleteProduct = async (productId: number) => {
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/${productId}`)
            return response.data;
        } catch (error: any) {
            throw new Error(`Error deleting product: ${error.response?.data?.message || error.message}`);
        }
    }

    export const updateProduct = async (productId: number, productData: ProductData) => {
        try {
            const response = await axiosInstance.put(`${API_BASE_URL}/${productId}`, productData)
            return response.data;
        } catch (error: any) {
            console.log("Error update product ", error);
            throw error;
        }
    }

    export const addProduct = async (productData: ProductData) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}`, productData)
            return response.data;
        } catch (error: any) {
            console.log("Error add product ", error);
            throw error;
        }
    }

    export const downloadTemplate = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/export-sample-file`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Mẫu_nhập_sản_phẩm.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.info("Tải file mẫu thành công");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    export const historyImport = async (page: number, size: number) => {
        try {
            const response = await axiosInstance.get(`${API_SERVICE_UPLOAD_URL}/api/v1/files`, {
                params: {
                    size,
                    page,
                },
            })
            return response.data
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    }

    export const exportProduct = async (
        pageSize: number,
        page: number,
        keyword?: string,
        idOrigin?: number,
        idBrand?: number,
        idMaterial?: number,
        idCategory?: number) => {

        const params = {
            size: pageSize,
            page: page,
            keyword: keyword || '',
            idOrigin: idOrigin || '',
            idBrand: idBrand || '',
            idMaterial: idMaterial || '',
            idCategory: idCategory || '',
        };

        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/export`, {
                params,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Dữ_Liệu_Sản_Phẩm.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    }


    export const importProduct = async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            return await axiosInstance.post(`${API_BASE_URL}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    export const exportQRCode = async (productDetailId: number, qty: number) => {
        try {
            const response = await axiosInstance.get(`${BASE_API}/api/v1/qr_code`, {
                params: { productDetailId, qty },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `QR_CODE.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Tải mã QR thành công");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };
