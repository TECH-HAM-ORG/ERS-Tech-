import React from "react";
import Head from "../../corelayout/Head/index";
import ServicesHero from "../../components/Careerhero";
import ServicesGraphic from "../../../public/assets/images/services.png";
import OurServices from "@/components/OurServices";
import OurStack from "@/components/OurStack";
import Projects from "@/components/Projects";
import RequestQueryForm from "@/components/RequestQueryForm";
function index() {
  return (
    <>
      <Head
        title="Software Development Services | ERS TECH"
        description="Explore ERS TECH software development services. We deliver custom web, mobile, blockchain, and fintech solutions tailored to accelerate your business growth."
        canonicalUrl="https://erstech.org/services"
      />
      <div className="w-full max-w-[1920px] mx-auto">
        <ServicesHero
          btnText={"Services"}
          Mainheading={"Our Expertise in  <br /> Software Development"}
          subHeading={
            "At ERS TECH, we specialize in delivering cutting-edge software solutions tailored to meet your business needs. From Fintech systems and blockchain development to educational platforms and beyond, our team of experts is committed to innovation, quality, and excellence. Let us transform your ideas into powerful digital solutions."
          }
          img={ServicesGraphic}
          width={"90%"}
        />
        <OurServices
          title={{ titleOne: "Services", titleTwo: "We Offer" }}
          page={"services"}
        />
        <OurStack />
        <div className="mb-20">
        <Projects
          title={{ titleOne: "featured", titleTwo: "Projects" }}
          page={"Services"}
        />
        </div>
        <div className="mb-10">
          <RequestQueryForm />
        </div>
      </div>
    </>
  );
}

export default index;
