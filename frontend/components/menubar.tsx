import { Icon } from "@iconify/react";
import { SelectField } from "./inputs";
import { LinkListTile } from "./tiles";
import { useParams, useRouter } from "next/navigation";
import { OutlinedButton } from "./buttons";
import clx from "clsx";
import { startTransition, useActionState, useEffect } from "react";
import { Registry, SharedRegistry } from "@/lib/services/registry/types";
import { logout } from "@/lib/services/auth/actions";
import { useHulk, useHulkAlert, useHulkFetch } from "hulk-react-utils";
import { LoadingModal } from "./modals";


export function Menubar(props: {
    className?: string;
    onClose?: () => void;
    onClickNewPage?: () => void;
}) {
    const { registryId, sharedId } = useParams();
    const router = useRouter()
    const { auth } = useHulk()
    const alert = useHulkAlert()
    const [state, logoutAction, isPending] = useActionState(logout, null)
    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<Registry[]>("/registries/r/")
    const {
        dispatch: goShared,
        data: sharedData
    } = useHulkFetch<SharedRegistry[]>("/registries/shared/")


    useEffect(() => {
        goRegistries({ method: 'GET' })
        goShared({ method: 'GET' })
    }, [registryId])

    const onRegistrySwitch = (e: any) => {
        const value = e.target.value
        if (value === "") return;
        router.push(`/mom/registries/${value}`)
        props.onClickNewPage?.()
    }

    useEffect(() => {
        if (state?.status === 'success') {
            // If the logout action is successful, reset the auth state and redirect to login
            router.push('/onboarding/login');
            auth.reset();
        }
    }, [state]);

    useEffect(() => {
        const alertId = 'logout-loading-modal';
        if (isPending) {
            alert?.push(<LoadingModal isLoading />, { alertId });
        } else {
            alert?.pop({ alertId });
        }
    }, [isPending]);

    const onLogout = () => {
        // Start the logout action
        // This will trigger the logout action
        startTransition(() => {
            logoutAction();
        })
    }

    return (
        <aside className={clx('bg-primary-500 overflow-y-auto', props.className)}>
            <div className='h-32 text-primary-100 flex flex-col justify-between px-4 py-4'>
                <div className='flex justify-between items-center'>
                    <div className='text-title-desktop'>PamperMomma</div>
                    <button className="menu-close-btn" onClick={props.onClose}>
                        <Icon icon="material-symbols-light:close" className='h-8 w-8 cursor-pointer' />
                    </button>
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <Icon icon="material-symbols-light:frame-person" className='text-5xl text-primary-100' />
                    <div className='flex-1 text-left'>
                        <h1 className='text-title-desktop'>Hi, {auth.state.user?.first_name ?? "Darling"}!</h1>
                    </div>
                </div>
            </div>
            <div className='pt-6 px-3'>
                <SelectField
                    className='w-full'
                    labelclassname="text-primary-100"
                    labeltext='SWITCH LIST'
                    value={`${registryId || ''}${sharedId ? `shared/${sharedId}` : ''}`}
                    onChange={onRegistrySwitch}
                >
                    {!registryId && <option value="">Select a registry</option>}
                    {registriesData?.map((registry) => (
                        <option key={registry.id} value={`${registry.id}`}>
                            {registry.name}
                        </option>
                    ))}
                    {sharedData?.map((shared) => (
                        <option key={shared.id} value={`shared/${shared.id}`}>
                            {shared.registry.name} (Shared)
                        </option>
                    ))}
                </SelectField>
            </div>
            <nav className='flex flex-col gap-2 pt-6 pb-12 px-2'>
                <LinkListTile
                    label='Dashboard'
                    icon='material-symbols-light:home-outline-rounded'
                    href="/mom/registries"
                    onClick={props.onClickNewPage}
                />
                {registryId && (
                    <LinkListTile
                        label='Add New Service'
                        icon='material-symbols-light:approval-delegation-outline-rounded'
                        href={`/mom/registries/${registryId}/services/new`}
                        onClick={props.onClickNewPage}
                    />
                )}
                <LinkListTile
                    label='Create Pamper Registry'
                    icon='material-symbols-light:medical-services-outline'
                    href="/mom/registries/new"
                    onClick={props.onClickNewPage}
                />
                <LinkListTile
                    label='FAQ & Support'
                    icon='material-symbols-light:support-agent-outline-rounded'
                    href='/faq'
                    onClick={props.onClickNewPage}
                />
                {/* Logout */}
                <OutlinedButton
                    className='mx-4 mt-12 bg-primary-100 hover:bg-red-500 hover:text-primary-100'
                    onClick={onLogout}
                >Logout
                </OutlinedButton>
            </nav>
        </aside>
    )
}



export function Appbar(props: { className?: string, onMenuPressed?: () => void }) {
    const router = useRouter()
    const { auth } = useHulk()
    return (
        <header className='px-4 md:px-12 flex items-center justify-between h-16 border-b border-neutral-300 sticky top-0 z-10 bg-background'>
            <div>
                <button className="menu-open-btn" onClick={props.onMenuPressed}>
                    <Icon icon="material-symbols-light:menu" className='h-8 w-8 text-neutral-600 left-4 cursor-pointer' />
                </button>
            </div>
            <div className='flex items-center gap-4'>
                <OutlinedButton className='py-2 px-3 flex flex-row gap-2 items-center' onClick={() => router.push("/mom/settings")}><Icon icon="material-symbols-light:person-rounded" className='h-6 w-6' />{auth.state.user?.first_name ?? "Darling"}</OutlinedButton>
                <OutlinedButton className='py-2 px-2 flex flex-row gap-2 items-center' onClick={() => router.push("/mom/notifications")}><Icon icon="material-symbols-light:notifications-outline-rounded" className='h-6 w-6' /></OutlinedButton>
            </div>
        </header>
    )
}