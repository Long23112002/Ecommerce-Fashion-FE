import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Typography} from "@mui/material"
import {storeUserData} from "../../../api/AuthApi.ts";
import Cookie from "js-cookie";
import {Spin} from "antd";
import {BASE_API} from "../../../constants/BaseApi.ts";

export default function AuthenticateFacebook() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(window.location.href);

        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];

            fetch(`${BASE_API}/api/v1/auth/facebook-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({code: authCode}),
            })
                .then((response) => response.json())
                .then((data) => {
                    storeUserData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setLoading(false);
                });
        }else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading && Cookie.get('accessToken')) {
            navigate('/');
        }
    }, [loading, navigate]);
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin tip={"loading"} size="large"></Spin>
                <Typography>Đang xác minh...</Typography>
            </Box>
        </>
    );
}