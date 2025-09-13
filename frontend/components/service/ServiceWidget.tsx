import { Service } from "@/lib/services/registry/types";
import { ServiceCard } from "./ServiceCard";

interface ServiceWidgetProps {
    title: string;
    description: string;
    services: Service[];
    context: 'public' | 'owner' | 'mom' | 'shared';
    onContribute?: (service: Service) => void;
}

export function ServiceWidget({ title, description, services, context, onContribute }: ServiceWidgetProps) {
    return (
        <div>
            <h3 className="text-title-desktop font-bold text-neutral-800 mb-2">{title}</h3>
            <p className="text-body-desktop text-neutral-600 mb-8">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        context={context}
                        onContribute={onContribute}
                    />
                ))}
            </div>
        </div>
    );
}