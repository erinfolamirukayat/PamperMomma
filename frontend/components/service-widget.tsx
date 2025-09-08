import Link from "next/link"
import { ServiceCard } from "./cards"
import { Service } from "@/lib/services/registry/types"

export function ServiceWidget(props: {
    title?: string,
    services?: Service[],
    className?: string,
    href?: string
}) {
    if (!props.services || props.services.length === 0) {
        return null; // Return null if there are no services to display
    }
    return (
        <section className=''>
            <div className='flex flex-row items-center justify-between py-8'>
                <h4 className="text-label-desktop text-neutral-700">{props.title} ({props.services.length.toString()})</h4>
                <Link href={props.href ?? ""} className='text-label-desktop-large text-primary'>View All</Link>
            </div>
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {
                    props.services?.map((service) => (
                        <ServiceCard
                            key={service.id}
                            {...service}
                        />
                    ))
                }
            </section>
        </section>
    )
}

export function ServiceWidgetStandalone(props: {
    title?: string,
    services?: Service[],
    className?: string,
    href?: string
}) {
    if (!props.services || props.services.length === 0) {
        return null; // Return null if there are no services to display
    }
    return (
        <section className=''>
            <div className='flex flex-row items-center justify-between py-8'>
                <h4 className="text-headline-mobile-small sm:text-headline-desktop-small text-neutral-700">{props.title} ({props.services.length.toString()})</h4>
            </div>
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {
                    props.services?.map((service) => (
                        <ServiceCard
                            key={service.id}
                            {...service}
                        />
                    ))
                }
            </section>
        </section>
    )
}