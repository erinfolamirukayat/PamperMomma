import { Icon } from "@iconify/react";
import clx from "clsx";


export function FilledButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    // This is a reusable button component
    return (
        <button
            {...props}
            className={clx(
                "bg-primary-500 text-neutral-100 rounded-full px-5 py-3 hover:bg-primary-600 transition-colors",
                props.className
            )}
        >
            {props.children}
        </button>
    )
}

export function OutlinedButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    // This is a reusable outlined button component
    return (
        <button
            {...props}
            className={clx(
                "border border-primary-500 text-primary-500 rounded-full px-5 py-3 hover:bg-primary-100 transition-colors",
                props.className
            )}
        >
            {props.children}
        </button>
    )
}

export function GoogleButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    // This is a reusable button component
    return (
        <button
            {...props}
            className={clx(
                "bg-primary-100 text-neutral-900 rounded-full px-5 py-3 hover:bg-neutral-300 transition-colors",
                props.className
            )}
        >
            <Icon icon="flat-color-icons:google" className="inline-block mr-2 h-6 w-6" />
            Continue with Google
        </button>
    )
}