import { BASE_API } from "../constants/BaseApi.js";
import axiosInstance from "./AxiosInstance.js";
import { ResponseData } from "../types/responseApi.js";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { OrderStatus } from "../enum/OrderStatusEnum.js";

export const fetchOrdersByUserId = async (token: any, status = "") => {

  const decodedToken: { userId: number } = jwtDecode(token);
  const userId = decodedToken.userId;

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   },
  // };

  try {
    const url = `${BASE_API}/api/v1/orders?${
      status ? `&status=${status}` : ""
    }&userId=${userId}`;
    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo ID người dùng", error);
    throw error;
  }
};

export const fetchOrderDetails = async (orderId: number) => {
  try {
    const url = `${BASE_API}/api/v1/orders/${orderId}`;
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error('Failed to fetch order details');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}

export const cancelOrder = async (orderId: number, status : string, note: string) => {
  
  try {
    const url = `${BASE_API}/api/v1/orders/${orderId}`;
    const response = await axiosInstance.put(
      url,
      { status,
        note
       }
    );
    console.log("Order updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

