import { cookies } from 'next/headers';
import PageClient from './page-client';

async function Page() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || null;

    return <PageClient accessToken={accessToken} />;
}

export default Page;