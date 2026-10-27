import React, { useEffect } from "react";
import Head from "../../corelayout/Head/index";
import Careerhero from "../../components/Careerhero";
import Blogsimg from "@/../public/assets/images/blogs-hero.png";
import FeaturedBlogs from "../../components/FeaturedBlogs";
function blogs() {
  return (
    <>
      <Head
        title="ERS TECH Blog - Insights into Software Development and Technology"
        description="Stay updated with the latest trends in Fintech, blockchain, and software development. Explore
expert insights and tips from the ERS TECH blog."
        canonicalUrl={`https://erstech.org/blogs`}
      />
      <div className="w-full max-w-[1920px] mx-auto">
        <Careerhero
          btnText={"Blogs"}
          Mainheading={"Insights & Expertise <br /> from Our Blogs"}
          subHeading={
            "Stay updated with our thought leadership, success stories, and company updates. Dive in and explore a wealth of content aimed at helping you stay ahead in the fast-paced world of tech."
          }
          img={Blogsimg}
          width={""}
        />
        <FeaturedBlogs />
      </div>
    </>
  );
}

export default blogs;
