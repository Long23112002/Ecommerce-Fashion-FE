
export interface RevenueReport {
    total: number,
    data: RevenueData[]
}

export interface RevenueData {
    name: string;
    revenue: number;
}

export interface InventoryData {
    product: string;
    quantity: number;
}

export interface CurrentDayReport {
    increase: number;
    today: RevenueData;
    yesterday: RevenueData;
}

export interface SoldProduct {
    id: number,
    name: string,
    sold: number,
    soldProductDetails: SoldProductDetail[]
}

export interface SoldProductDetail {
    id: number,
    size: string,
    color: string,
    sold: number
}

export interface InventoryProduct {
    id: number,
    name: string,
    quantity: number,
    productDetails: InventoryProductDetail[]
}

export interface InventoryProductDetail {
    id: number,
    size: string,
    color: string,
    quantity: number
}


export interface RevenueRequest {
    day?: number | string;
    month: number | string;
    year: number | string
}