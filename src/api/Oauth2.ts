import {OAuth2Config, OAuth2ConfigFB} from "../config/auth2Config.ts";

export const handleContinueWithGoogle = () => {
    const callbackUrl = OAuth2Config.redirectUri;
    const authUrl = OAuth2Config.authUri;
    const googleClientId = OAuth2Config.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
        callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
};

export const handleContinueWithFacebook = () => {
    const callbackUrl = OAuth2ConfigFB.redirectUri;
    const authUrl = OAuth2ConfigFB.authUri;
    const facebookClientId = OAuth2ConfigFB.clientId;

    const targetUrl = `${authUrl}?client_id=${facebookClientId}&redirect_uri=${encodeURIComponent(
        callbackUrl
    )}&state=${encodeURIComponent(
        JSON.stringify({callbackUrl})
    )}&response_type=code&scope=email,public_profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
};
