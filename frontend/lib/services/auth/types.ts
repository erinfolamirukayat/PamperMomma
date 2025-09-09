import {HulkFetchErrorProps} from "hulk-react-utils";

export type StatusType = "success" | "error" | "loading" | "idle";


export type ActionStateType<DataType> = {
    status: "success" | "error";
    error?: HulkFetchErrorProps;
    data?: DataType;
}

export type User = {
    id: string;
    phone_number: string | null;
    last_login: string | null;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string | null;
    email: string;
    email_verified: boolean;
    groups: string[]; // Assuming groups are represented as an array of strings
    user_permissions: string[]; // Assuming user permissions are represented as an array of strings
};