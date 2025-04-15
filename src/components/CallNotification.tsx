// components/CallNotification.tsx
import React, { FC } from "react";
import { FiPhoneCall, FiCheck, FiX } from "react-icons/fi";

interface CallNotificationProps {
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const CallNotification: FC<CallNotificationProps> = ({
  callerName,
  onAccept,
  onDecline,
}) => (
  // className=" rounded-lg w-75 h-70 bg-zinc-800 p-4 mx-2  space-y-4"
  <div className="bg-white rounded-lg p-4 mx-2 w-75 h-30 flex items-start space-y-3">
    <div className="flex-1">
      <div className="font-semibold text-gray-800 text-lg">
        {callerName} Placeholder <span className="text-sm"> is calling…</span>
      </div>
      <div className="mt-3 flex justify-centre space-x-2">
        <button
          onClick={onAccept}
          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-2xl hover:bg-green-400 hover:text-green-700 text-sm"
        >
          <FiCheck className="mr-1" /> Accept
        </button>
        <button
          onClick={onDecline}
          className="flex items-center px-3 py-1 bg-red-600 text-white rounded rounded-2xl hover:bg-red-300 hover:text-red-700 text-sm"
        >
          <FiX className="mr-1" /> Decline
        </button>
      </div>
    </div>
  </div>
);

export default CallNotification;
