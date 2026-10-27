import React from "react";
import Head from "../../corelayout/Head/index";
import AboutHero from "../../components/About-Hero ";
import OurStats from "../../components/OurStats";
import HowWeDo from "../../components/HowWeDo";
import Team from "../../components/Team";
import WhyChooseUs from "../../components/WhyChooseUs";
import TrustedBy from "../../components/TrustedBy";
import Faqs from "../../components/Faqs";
function page() {
  return (
    <>
      <Head
        title="About ERS TECH - Your Trusted Software Development Partner"
        description="Learn more about ERS TECH, a dynamic software development company delivering exceptional
Fintech and blockchain solutions. Discover our mission, values, and success stories."
        canonicalUrl={`https://erstech.org/about-us`}
      />
      <div className="w-full max-w-[1920px] mx-auto">
        <AboutHero />
        <OurStats />
        <div className="mx-auto w-[1263px] max-w-full">
          <HowWeDo />
        </div>
        {/* <Team /> */}
        <WhyChooseUs />
        <TrustedBy />
        <Faqs />
      </div>
    </>
  );
}

export default page;
