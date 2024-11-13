import axios from "axios"

const SHOP_ID = 4467830
const FROM_DISTRICT = 3440
const SERVICE_TYPE_ID = 2
const LENGTH = 500
const WIDTH = 500

const GHTKAxios = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api',
    headers: {
        token: '9612de31-80ce-11ef-be7f-626f70b8f792',
        'Content-Type': 'application/json'
    }
})

export const getAllProvinces = async () => {
    const { data } = await GHTKAxios({
        method: 'GET',
        url: '/master-data/province'
    })
    return data
}

export const getAllDistrictByProvinceId = async (id: number | string) => {
    const { data } = await GHTKAxios({
        method: 'GET',
        url: '/master-data/district',
        params: {
            province_id: id
        }
    })
    return data
}

export const getAllWardByDistrictId = async (id: number | string) => {
    const { data } = await GHTKAxios({
        method: 'GET',
        url: '/master-data/ward',
        params: {
            district_id: id
        }
    })
    return data
}

export const availableServices = async (toDistrict: number | string) => {
    const { data } = await GHTKAxios({
        method: 'GET',
        url: '/v2/shipping-order/available-services',
        params: {
            shop_id: SHOP_ID,
            from_district: FROM_DISTRICT,
            to_district: toDistrict
        }
    })
    return data
}


export const shippingOrderFee = async (
    value: number,
    toDistrict: number | string,
    toWardCode: number | string,
    height: number,
    weight: number
) => {
    const { data } = await GHTKAxios({
        method: 'GET',
        url: '/v2/shipping-order/fee',
        params: {
            service_type_id: SERVICE_TYPE_ID,
            insurance_value: value,
            coupon: null,
            from_district_id: FROM_DISTRICT,
            to_district_id: toDistrict,
            to_ward_code: toWardCode,
            height: height,
            weight: weight,
            length: LENGTH,
            width: WIDTH,
        }
    })
    return data
}