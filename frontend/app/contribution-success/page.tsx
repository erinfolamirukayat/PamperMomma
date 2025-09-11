import { Suspense } from 'react';
import { ContributionStatus } from '@/components/service/ContributionStatus';
import { Icon } from '@iconify/react';

function Loading() {
    return (
        <div className='flex-1 flex items-center justify-center'>
            <Icon icon="line-md:loading-twotone-loop" className="h-12 w-12 text-primary-500" />
        </div>
    );
}

export default function ContributionSuccessPage() {
    return (
        <main className='relative min-h-screen flex-1 flex items-center justify-center'>
            <div className='max-w-lg mx-auto p-8'>
                <Suspense fallback={<Loading />}>
                    <ContributionStatus />
                </Suspense>
            </div>
        </main>
    );
}