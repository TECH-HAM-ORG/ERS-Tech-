import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error | ERS TECH</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Box className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-gradient-to-b from-[#0E51CD] to-[#0A3892] text-white text-center">
        <Box className="max-w-2xl mx-auto">
          <Typography
            variant="h1"
            component="h1"
            className="!text-7xl md:!text-9xl !font-[700] font-poppins !text-ersPrimary !mb-4"
          >
            500
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            className="!text-2xl md:!text-3xl !font-[600] font-poppins !mb-4"
          >
            Internal Server Error
          </Typography>
          <Typography
            variant="body1"
            className="!text-base font-poppins !text-slate-200 !mb-8 max-w-lg mx-auto"
          >
            Something went wrong on our end. Please try refreshing the page or
            come back shortly.
          </Typography>
          <Box className="flex flex-wrap gap-4 justify-center">
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="contained"
                className="!bg-ersPrimary hover:!bg-[#1c9ad4] !text-white !font-poppins !capitalize !px-6 !py-2.5 !rounded-full !font-[500]"
              >
                Back to Home
              </Button>
            </Link>
            <Link href="/services#contact" passHref legacyBehavior>
              <Button
                variant="outlined"
                className="!border-white !text-white hover:!bg-white/10 !font-poppins !capitalize !px-6 !py-2.5 !rounded-full !font-[500]"
              >
                Contact Support
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}

