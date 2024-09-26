import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {storeUserData} from "../../../api/AuthApi.ts";
import {Box, Typography} from "@mui/material";
import {Spin} from "antd";
import Cookie from "js-cookie";
import {BASE_API} from "../../../constants/BaseApi.ts";


export default function AuthenticateGoogle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];

            fetch(`${BASE_API}/api/v1/auth/google-login?code=${authCode}`, {
                method: "POST",
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    storeUserData(data);
                    setLoading(false);
                });
        } else {
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