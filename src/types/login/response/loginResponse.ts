interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

interface UserResponse {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    birth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    avatar: string | null;
    roles: string[] | null;
}

interface LoginResponse {
    authResponse: AuthResponse;
    userResponse: UserResponse;
}



