
import React from 'react';
import { Notification } from '../types';

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div className="space-y-2">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${notif.read ? 'bg-white border-slate-50 opacity-70' : 'bg-emerald-50/50 border-emerald-100 shadow-sm'}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'meetup' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
             {notif.type === 'like' && (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                 <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9c-2.636-2.357-4.436-5.122-4.32-7.48.045-1.02.37-1.98.974-2.711 1.203-1.457 3.053-2.056 4.808-1.167l.402.204.402-.204c1.755-.89 3.605-.29 4.81.167.604.73.929 1.69.974 2.711.115 2.358-1.685 5.123-4.32 7.48a22.045 22.045 0 0 1-2.583 1.9 20.76 20.76 0 0 1-1.161.682l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
               </svg>
             )}
             {notif.type === 'meetup' && (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                 <path d="M5.75 2a.75.75 0 0 1 .75.75V4h7.5V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18.5 6.75v8.5A2.75 2.75 0 0 1 15.75 18H4.25A2.75 2.75 0 0 1 1.5 15.25v-8.5A2.75 2.75 0 0 1 4.25 4h.25V2.75A.75.75 0 0 1 5.75 2Zm-1.5 3.5h11.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H4.25c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25Z" />
               </svg>
             )}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-bold">{notif.fromUser}</span> {notif.text}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">10 mins ago</p>
          </div>
          {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
