import React from "react";
import Head from "../../corelayout/Head/index";
import Careerhero from "../../components/Careerhero";
import PortfoiloGraphic from "@/../public/assets/images/portfolio-grapjics2.png";
import FeaturedProjects from "../../components/FeaturedProjects";
function index() {
  return (
    <>
      <Head
        title="ERS TECH Portfolio - Showcasing Our Expertise"
        description="Browse our portfolio of successful projects in Fintech and blockchain development. Discover
how ERS TECH transforms ideas into impactful software solutions."
        canonicalUrl={`https://erstech.org/portfolio`}
      />
      <div className="w-full max-w-[1920px] mx-auto">
        <Careerhero
          btnText={"Portfolio"}
          Mainheading={
            "A Showcase of Innovative <br /> Solutions and Successful <br /> projects"
          }
          subHeading={
            "Dive into our portfolio to explore the wide array of projects. We transform complex ideas into intuitive, high-performance solutions that not only meet but exceed client expectations."
          }
          img={PortfoiloGraphic}
          width={""}
        />
        <FeaturedProjects />
      </div>
    </>
  );
}

export default index;
