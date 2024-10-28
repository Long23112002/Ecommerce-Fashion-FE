import { useMediaQuery } from "@mui/material";

export const useIsMobile = (): boolean => {
    return useMediaQuery('(max-width:600px)');
}