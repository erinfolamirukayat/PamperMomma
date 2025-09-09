export function parseErrorText(errorText: string): string[] {
    try {
        const parsed = JSON.parse(errorText);

        if (Array.isArray(parsed)) {
            return parsed.map((item) => typeof item === "object" ? item.message || String(item) : String(item));
        }

        if (typeof parsed === "object" && parsed !== null) {
            return Object.entries<any>(parsed).flatMap(([key, value]) => {
                const formattedKey = key === "detail" ? null : capitalizeFirstLetter(key);

                if (Array.isArray(value)) {
                    return value.map((item) => `${formattedKey ? `${formattedKey}: ` : ""}${item.message || String(item)}`);
                }

                return [`${formattedKey ? `${formattedKey}: ` : ""}${value.message || String(value)}`];
            });
        }

        return [String(parsed)];
    } catch {
        return [errorText];
    }
}

function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


// Calculate days until arrival
export const getDaysUntilArrival = (arrivalDate: string) => {
    const today = new Date();
    const arrival = new Date(arrivalDate);
    const diffTime = arrival.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Format date helper
export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};