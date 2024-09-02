type User = {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    birth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    avatar: string | null;
    roles: string[] | null;
}

export default User