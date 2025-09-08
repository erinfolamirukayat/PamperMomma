import { NotificationProps } from '@/lib/services/notification/types';
import { Icon } from '@iconify/react'

export function NotificationCard(props: {
    notification: NotificationProps
}) {
    const { notification } = props;

    // Determine if it's a general or user notification and get the appropriate data
    const isGeneralNotification = notification.general_notification !== undefined;
    const isUserNotification = notification.user_notification !== undefined;

    const title = notification.title;
    const message = notification.message;
    const createdAt = new Date(notification.created_at);
    const tag = isGeneralNotification ? notification.general_notification?.tag : null;

    // Get appropriate icon based on notification type and tag
    const getNotificationIcon = () => {
        // if (isGeneralNotification && tag) {
        //     switch (tag) {
        //         case 'info':
        //             return { icon: 'material-symbols:check-circle-outline', color: 'text-green-500' };
        //         case 'reminder':
        //             return { icon: 'material-symbols:warning-outline', color: 'text-yellow-500' };
        //         case 'alert':
        //             return { icon: 'material-symbols:error-outline', color: 'text-red-500' };
        //         default:
        //             return { icon: 'material-symbols:info-outline', color: 'text-blue-500' };
        //     }
        // }
        return { icon: 'material-symbols-light:notification-multiple-outline-rounded', color: 'text-primary-500' };
    };

    const iconConfig = getNotificationIcon();

    return (
        <article className={`space-y-4 relative bg-primary-50 border border-primary-200 rounded-lg p-4`}>
            {/* {isUnread && (
                <div className='absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full'></div>
            )} */}

            <header className='bg-primary-100 p-4 rounded-lg'>
                <div className='flex flex-row'>
                    <h3 className='flex-1 text-title-desktop-small font-semibold text-neutral-900'>{title}</h3>
                    <div className='flex flex-row flex-wrap justify-end gap-1 text-right'>
                        {tag && (
                            <span className={`text-xs px-2 py-1 rounded-full ${tag === 'info' ? 'bg-green-100 text-green-700' :
                                tag === 'reminder' ? 'bg-yellow-100 text-yellow-700' :
                                    tag === 'alert' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                }`}>
                                {tag}
                            </span>
                        )}
                        <span className='text-body-desktop-small text-neutral-500'>
                            {createdAt.toLocaleDateString()}
                        </span>
                        <span className='text-body-desktop-small text-neutral-400'>
                            {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </header>

            <section className='flex flex-row gap-6'>
                <Icon
                    icon={iconConfig.icon}
                    className={`h-12 w-12 ${iconConfig.color} flex-shrink-0`}
                />
                <p className='flex-1 text-body-desktop-small text-neutral-700 leading-relaxed mt-2'>{message}</p>
            </section>
        </article>
    )
}