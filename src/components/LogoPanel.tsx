import Image from "next/image";
import React, { FC } from "react";

const LogoPanel: FC = () => {
  const logoSize = 150; // percentage

  return (
    <div className=" rounded-lg w-75 h-70 bg-zinc-800 p-4 mx-2  space-y-4">
      <div className="space-y-10">
        <div className="font-semibold flex flex-row justify-between">
          <Image
            src="/images/nio-logo-light.png"
            alt="Logo"
            width={logoSize}
            height={logoSize}
          />
          <Image
            src="/images/csir-logo.png"
            alt="Logo"
            width={logoSize}
            height={logoSize}
          />
        </div>
        <div className="flex justify-center items-center  w-full">
          <Image
            src="/images/jigyasa.png"
            alt="Logo"
            width={300}
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoPanel;
