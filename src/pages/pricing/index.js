import React from "react";
import Head from "../../corelayout/Head/index";
import { Box } from "@mui/material";
import Careerhero from "../../components/Careerhero";
import PricingHero from "@/../public/assets/images/pricing-hero.png";
import PriceTable from "../../components/priceTable";
import RequestQueryForm from "../../components/RequestQueryForm";
function pricing() {
  return (
    <>
      <Head
        title="ERS TECH Pricing - Affordable Software Development Solutions"
        description="Get transparent and competitive pricing for software development services at ERS TECH.
Delivering top-quality solutions tailored to your business needs."
        canonicalUrl={`https://erstech.org/pricing`}
      />
      <div className="w-full max-w-[1920px] mx-auto">
        <Careerhero
          btnText={"Pricing"}
          Mainheading={"Your Plan-Your Way"}
          subHeading={
            "Choose a plan that suits well to your requirements and specifications."
          }
          subHeading2={"Want a customized plan? Get a Quote."}
          img={PricingHero}
          top={"75%"}
        />
        <PriceTable />
        <Box className="mb-16">
          <RequestQueryForm />
        </Box>
      </div>
    </>
  );
}

export default pricing;
