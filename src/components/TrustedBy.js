import React from "react";
import { Box, Typography } from "@mui/material";
import CLD10 from "@/../public/assets/images/CLD-10.png";
import CLD9 from "@/../public/assets/images/CLD-09.png";
import CLD8 from "@/../public/assets/images/CLD-08.png";
import CLD7 from "@/../public/assets/images/CLD-07.png";
import CLD6 from "@/../public/assets/images/CLD-06.png";
import CLD5 from "@/../public/assets/images/CLD-05.png";
import CLD4 from "@/../public/assets/images/CLD-04.png";
import CLD3 from "@/../public/assets/images/CLD-03.png";
import CLD2 from "@/../public/assets/images/CLD-02.png";
import CLD1 from "@/../public/assets/images/CLD-01.png";
import Image from "next/image";

function TrustedBy() {
  return (
    <>
      <Box className="mb-[5rem] relative">
        <Box className="logo-slider">
          <Box className="block text-center pb-6">
            <Typography
              className="capitalize !text-3xl !font-[600] text-center font-poppins"
              variant="h2"
              component={"h2"}
              gutterBottom
            >
              Trusted <span className="text-ersPrimary">By</span>
            </Typography>
          </Box>
          <div class="slider">
            <div class="slide-track">
              <div class="slide">
                <Image src={CLD5} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD4} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD3} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD2} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD1} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD6} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD7} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD8} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD9} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD10} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD5} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD4} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD3} height="100" width="250" alt="" />
              </div>
              <div class="slide">
                <Image src={CLD2} height="100" width="250" alt="" />
              </div>
            </div>
          </div>
          <div class="slider-left">
            <div class="slide-track-left">
              <div class="slide-left">
                <Image src={CLD5} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD4} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD3} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD2} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD1} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD6} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD7} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD8} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD9} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD10} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD5} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD4} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD3} height="100" width="250" alt="" />
              </div>
              <div class="slide-left">
                <Image src={CLD2} height="100" width="250" alt="" />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default TrustedBy;
// 4xl:!container xxxl:!container xxl:!container xl:!container lg:!container md:!container sm:max-w-full xsm:max-w-full xxs:max-w-full xxxs:max-w-full