import React from "react";
import logo from "../../public/assets/icons/og.png";
import Image from "next/image";
function Loader() {
  return (
    <>
      <div className="flex items-center justify-center" style={{height:"100vh"}}>
        <Image
          src={logo}
          width={70}
          height={70}
          className="object-cover fade-animation"
          alt="logo"
        />
      </div>
    </>
  );
}

export default Loader;
