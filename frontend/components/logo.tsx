import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export function AppLogo(props: any) {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Icon icon="material-symbols:favorite" className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-primary-700">PamperMomma</span>
        </Link>
    )
}