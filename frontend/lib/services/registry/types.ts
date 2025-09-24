export interface Contribution {
    id: number;
    amount: string;
    contributor_name: string;
    contributor_email: string;
    status: string;
    created_at: string;
    fee: string;
    updated_at: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    hours: number;
    cost_per_hour: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    total_withdrawn: string;
    is_owned_by_user: boolean;
    total_cost: string;
    total_contributions: string;
    is_completed: boolean;
    is_available: boolean;
    available_withdrawable_amount: string;
    contributions: Contribution[];
}

export interface Registry {
    id: number;
    name: string;
    is_first_time: boolean;
    babies_count: number;
    arrival_date: string;
    shareable_id: string;
    thank_you_message: string;
    welcome_message: string;
    owner_first_name: string;
    created_at: string;
    updated_at: string;
    stripe_balance?: {
        available: string;
        pending: string;
    };
    total_withdrawn: string;
    total_fees: string;
    payouts_enabled: boolean;
    services: Service[];
}

export interface PublicRegistryProps extends Registry {}

export interface SharedRegistry {
    id: number;
    registry: Registry;
    created_at: string;
}

export interface DefaultService {
    name: string;
    description: string;
    hours: number;
    cost_per_hour: string;
    is_active?: boolean;
}

export interface CreateRegistry {
    name: string;
    is_first_time: boolean;
    babies_count: number;
    arrival_date: string;
    services?: DefaultService[];
    thank_you_message?: string;
    welcome_message?: string;
}