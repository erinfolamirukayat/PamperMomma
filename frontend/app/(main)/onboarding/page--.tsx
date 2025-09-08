'use client';

import { useRouter } from 'next/navigation';
import React from 'react'

function Page() {
    const router = useRouter()
    router.replace('/onboarding/registry');
    // This page is intentionally left blank to redirect to the registry creation page
    return null;
}

export default Page