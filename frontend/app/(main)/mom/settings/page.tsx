'use client'

import { FilledButton, OutlinedButton } from '@/components/buttons'
import { InputField } from '@/components/inputs'
import { User } from '@/lib/services/auth/types'
import { useHulk, useHulkFetch } from 'hulk-react-utils'
import React from 'react'

function Page() {
    const { auth } = useHulk()
    // fetch for profile update
    const {
        dispatch: goProfileUpdate,
        data: profileUpdateData
    } = useHulkFetch<User>('/accounts/me/update-profile/', {
        onSuccess(data, alert) {
            // If the profile update is successful, update the auth context
            auth.update({ user: { ...data.user, ...profileUpdateData } })
            console.log('Profile updated successfully:', profileUpdateData)
        },
    })

    // fetch change password
    const {
        dispatch: goChangePassword,
        data: changePasswordData
    } = useHulkFetch<User>('/accounts/me/change-password/')

    const onChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get('current_password') as string
        const newPassword = formData.get('new_password') as string
        const verifyNewPassword = formData.get('verify_new_password') as string
        if (newPassword !== verifyNewPassword) {
            // Handle password mismatch error
            console.error('New passwords do not match')
            alert('New passwords do not match')
            return
        }
        try {
            await goChangePassword({
                method: 'POST',
                body: JSON.stringify({ old_password: currentPassword, new_password: newPassword }),
            })
            // Handle success, e.g., show a success message or redirect
        } catch (error) {
            // Handle error, e.g., show an error message
            console.error('Password change failed:', error)
        }
    }

    const onProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const firstName = formData.get('first_name') as string
        const lastName = formData.get('last_name') as string
        try {
            await goProfileUpdate({
                method: 'PATCH',
                body: JSON.stringify({ first_name: firstName, last_name: lastName }),
            })
            // Handle success, e.g., show a success message or redirect
        } catch (error) {
            // Handle error, e.g., show an error message
            console.error('Profile update failed:', error)
        }
    }


    return (
        <main>
            <form onSubmit={onProfileUpdate} className='space-y-6 p-12 max-w-4xl'>
                <h2 className='text-headline-desktop-small text-neutral-700'>Account Info</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <InputField
                        name='first_name'
                        labeltext='First Name'
                        defaultValue={auth.state?.user?.first_name || ''}
                        required
                    />
                    <InputField
                        name='last_name'
                        labeltext='Last Name'
                        defaultValue={auth.state?.user?.last_name || ''}
                        required
                    />
                    {/* <InputField
                        labeltext='Email Address'
                    /> */}
                    <FilledButton className='h-fit w-fit mt-auto min-w-32'>
                        Save
                    </FilledButton>
                </div>
            </form>
            <form onSubmit={onChangePassword} className='space-y-6 p-12 max-w-4xl'>
                <h2 className='text-headline-desktop-small text-neutral-700'>Change Password</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <InputField
                        labeltext='Current Password'
                    />
                    <InputField
                        labeltext='New Password'
                    />
                    <InputField
                        labeltext='Verify New Password'
                    />
                    <FilledButton className='h-fit w-fit mt-auto min-w-32'>
                        Update Password
                    </FilledButton>
                </div>
            </form>
            <section className='space-y-6 p-12 max-w-4xl'>
                <h2 className='text-headline-desktop-small text-neutral-700'>Deactivate Account</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <OutlinedButton className='border-red-500 text-red-500'>Deactivate My Account</OutlinedButton>
                </div>
            </section>
        </main>
    )
}

export default Page