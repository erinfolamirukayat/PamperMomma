export interface DefaultService {
    name: string;
    description: string;
    hours: number;
    cost_per_hour: string;
    is_active?: boolean;

}

export interface Service extends DefaultService {
    id: number;
    is_owned_by_user: boolean;
    total_cost: string; // Assuming monetary values are strings
    total_contributions: string; // Assuming monetary values are strings
    is_completed: boolean;
    is_available: boolean;
    contributions: Contribution[]; // Replace `any` with a more specific type if available
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    total_withdrawn: string; // Assuming monetary values are strings
    available_withdrawable_amount: string; // Assuming monetary values are strings
    registry: number;
};

export interface Registry {
    id: number;
    name: string;
    services: Service[]
    is_first_time: boolean;
    babies_count: number;
    shareable_id: string;
    arrival_date: string; // ISO date string
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    created_by: string; // UUID string
    thank_you_message: string; // Thank you message
    welcome_message: string; // Welcome message
};

export interface CreateService extends DefaultService {}

export interface CreateRegistry {
    name: string;
    is_first_time: boolean;
    arrival_date: string; // ISO date string
    babies_count: number;
    thank_you_message: string; // Thank you message
    welcome_message: string; // Welcome message
    services: CreateService[];
}

export type SharedRegistry = {
    id: number;
    created_at: string; // ISO date string
    registry: Registry;
}

export type Contribution = {
    id: number;
    amount: string; // Assuming monetary values are strings
    contributor: string; // UUID string
    created_at: string; // ISO date string
    fulfilled: boolean;
    service: number; // Service ID
    summary: string;
}

export interface PublicServiceProps extends Service {
    name: string;
    description: string;
    hours: number;
    cost_per_hour: string;
    is_active?: boolean;
    is_owned_by_user: boolean,
    total_cost: string,
    total_contributions: string;
    is_completed: boolean;
    is_available: boolean;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    registry: number;
}


export interface PublicRegistryProps extends Registry {
    id: number;
    name: string;
    services: PublicServiceProps[]
    is_first_time: boolean;
    babies_count: number;
    shareable_id: string;
    arrival_date: string; // ISO date string
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    created_by: string; // UUID string
}