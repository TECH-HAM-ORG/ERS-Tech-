import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | ERS TECH</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Box className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-gradient-to-b from-[#0E51CD] to-[#0A3892] text-white text-center">
        <Box className="max-w-2xl mx-auto">
          <Typography
            variant="h1"
            component="h1"
            className="!text-7xl md:!text-9xl !font-[700] font-poppins !text-ersPrimary !mb-4"
          >
            404
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            className="!text-2xl md:!text-3xl !font-[600] font-poppins !mb-4"
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            className="!text-base font-poppins !text-slate-200 !mb-8 max-w-lg mx-auto"
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          <Box className="flex flex-wrap gap-4 justify-center !mb-10">
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="contained"
                className="!bg-ersPrimary hover:!bg-[#1c9ad4] !text-white !font-poppins !capitalize !px-6 !py-2.5 !rounded-full !font-[500]"
              >
                Go to Homepage
              </Button>
            </Link>
            <Link href="/services" passHref legacyBehavior>
              <Button
                variant="outlined"
                className="!border-white !text-white hover:!bg-white/10 !font-poppins !capitalize !px-6 !py-2.5 !rounded-full !font-[500]"
              >
                Our Services
              </Button>
            </Link>
          </Box>
          <Box className="flex flex-wrap justify-center gap-6 text-sm font-poppins text-slate-300">
            <Link href="/about-us" className="hover:text-white hover:underline">
              About Us
            </Link>
            <Link href="/portfolio" className="hover:text-white hover:underline">
              Portfolio
            </Link>
            <Link href="/careers" className="hover:text-white hover:underline">
              Careers
            </Link>
            <Link href="/blogs" className="hover:text-white hover:underline">
              Blogs
            </Link>
            <Link href="/services#contact" className="hover:text-white hover:underline">
              Contact
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}

