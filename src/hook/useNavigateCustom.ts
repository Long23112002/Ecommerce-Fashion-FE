// KHÔNG CẦN SỬ DỤNG NỮA VÌ ĐÃ CONFIG LẠI RỒI

import { useNavigate as useNavigateDom } from "react-router-dom"
/**
 * NOTE: Function này đơn giản chỉ tương tự như useNavigate của router-dom
 * tuy nhiên có custom lại việc phải scroll lên đầu trang mỗi lần chuyển trang
 * việc mà gặp bug giữ nguyên scroll position khi dùng navigate của router-dom
 * nên dùng useNavigate này thay vì của router-dom vì đơn giản không chỉ giống nhau mà lại còn tránh được bug :vv
 */
const useNavigate = (): ((path: string) => void) => {
    const navigate = useNavigateDom();

    const navigateCustom = (path: string) => {
        navigate(path)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    return navigateCustom
}

export default useNavigate