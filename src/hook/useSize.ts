import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
    return useMediaQuery('(max-width:600px)');
}

export const useUserHeaderSize = (): number | null => {
    const [height, setHeight] = useState<number | null>(null)

    useEffect(() => {
        const updateHeight = () => {
            const header = document.querySelector('#user-header');
            if (header) {
                setHeight(header.clientHeight);
            } else {
                setHeight(null);
            }
        }
        updateHeight()
        window.addEventListener('resize', updateHeight)

        return () => {
            window.removeEventListener('resize', updateHeight);
        }
    }, [])

    return height;
}