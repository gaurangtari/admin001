import { connected } from "process";
import React, { FC } from "react";

interface ConnectedUserProp {
  connectedUserName: string;
}

const ConnectedUser: FC<ConnectedUserProp> = ({ connectedUserName }) => {
  return (
    <div className=" rounded-lg w-75 h-30 bg-zinc-800 p-4 mx-2 space-y-4">
      <div className="space-y-2 ">
        <div className="font-semibold">User</div>
        <div className="text-xl font-bold text-grey-100">
          {connectedUserName ? connectedUserName : "..."}
        </div>
      </div>
    </div>
  );
};

export default ConnectedUser;
