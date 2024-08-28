import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, CircularProgress, Typography} from "@mui/material";
import {storeUserData} from "../../../api/LoginApi.ts";
import Cookie from "js-cookie";
import {Spin} from "antd";

export default function AuthenticateGoogle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];

            fetch(`http://localhost:8080/api/v1/auth/google-login?code=${authCode}`, {
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
            navigate('/admin/user/role');
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
                <Typography>Authenticating...</Typography>
            </Box>
        </>
    );
}