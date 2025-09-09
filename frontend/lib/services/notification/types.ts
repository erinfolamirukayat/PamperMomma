export interface GeneralNotificationProps {
    id: number;
    notification_type: "general";
    title: string;
    message: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    is_active: boolean;
    tag: "info" | "alert" | "reminder"; // Assuming common tag types
}

export interface UserNotificationProps {
    id: number;
    notification_type: "user"; // Assuming possible notification types
    title: string;
    message: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    is_read: boolean;
}

export interface NotificationProps {
    id: number;
    general_notification?: GeneralNotificationProps;
    user_notification?: UserNotificationProps;
    notification_type: "general" | "user"; // Assuming possible notification types
    title: string;
    message: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

