export type User = {
    national_id: string;
    id: string;
    full_name: string;
    email: string;
    role: number;
    roles: {
        name: string
    };
    status: boolean;
}

export type addUserType = {
    full_name: string;
    national_id: string;
    email: string;
    roleId: number;
    status: boolean;
    password: string;
}