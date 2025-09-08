"use client";


import { ErrorModal, LoadingModal } from "@/components/modals";
import { retrieveAccessToken } from "@/lib/services/auth/actions";
import { HulkFetchErrorProps, hulkGlobalConfigDefault, HulkGlobalConfigProps, withHulk } from "hulk-react-utils";

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children
}

const config: HulkGlobalConfigProps = {
    ...hulkGlobalConfigDefault,
    fetchGlobalOptions: {
        ...hulkGlobalConfigDefault.fetchGlobalOptions,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        unauthorizedRedirectUrl: '/onboarding/login',
        onPending(state, alert) {
            const alertId = 'loading-modal'
            console.log('Loading beginning:', state, "Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
            if (state === 'start') {
                console.log('Loading started');
                alert?.push(<LoadingModal isLoading />, { alertId })
            } else if (state === 'end') {
                console.log('Loading ended');
                alert?.pop({ alertId })
            }
            console.log('Loading finished:', state);
        },
        onError: (error: HulkFetchErrorProps, alert) => {
            const alertId = 'error-modal'
            alert?.push(
                <ErrorModal
                    error={error}
                    onClose={() => alert?.pop({ alertId })}
                />,
                { alertId }
            )
        },
        async accessTokenRetriever() {
            const res = await retrieveAccessToken()
            if (res.status === 'success') {
                return { access_token: res.data }
            } 
            return undefined;
        },
    }
}


export default withHulk(Layout, config)