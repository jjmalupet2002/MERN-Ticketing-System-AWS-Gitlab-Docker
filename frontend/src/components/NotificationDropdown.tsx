import { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, clearNotifications } from '../features/notifications/notificationSlice';
import type { RootState, AppDispatch } from '../app/store';
import { formatDistanceToNow } from 'date-fns';

function NotificationDropdown() {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notification);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(getNotifications());
            dispatch(getUnreadCount());

            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                dispatch(getUnreadCount());
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [dispatch, user]);

    const handleMarkAsRead = (id: string) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    const handleClearAll = () => {
        dispatch(clearNotifications());
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ASSIGNED':
                return '👤';
            case 'REPLY':
                return '💬';
            case 'UPDATED':
                return '🔄';
            case 'CLOSED':
                return '✅';
            default:
                return '📬';
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                onClick={handleMarkAllAsRead}
                className="relative p-2 text-gray-300 hover:text-white transition"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {!Array.isArray(notifications) || notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">No notifications yet</p>
                                <p className="text-sm">We'll notify you when something happens</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Menu.Item key={notification._id}>
                                    {({ active }) => (
                                        <Link
                                            to={`/ticket/${notification.ticket._id}`}
                                            onClick={() => !notification.seen && handleMarkAsRead(notification._id)}
                                            className={`block px-4 py-3 border-b border-gray-100 transition ${active ? 'bg-gray-50' : ''
                                                } ${!notification.seen ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notification.seen ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                {!notification.seen && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                </Menu.Item>
                            ))
                        )}
                    </div>

                    {Array.isArray(notifications) && notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 flex justify-between items-center">
                            <button
                                onClick={handleClearAll}
                                className="text-sm text-red-600 hover:text-red-700 font-semibold"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

export default NotificationDropdown;
