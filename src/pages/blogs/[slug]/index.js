import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../../../redux/features/blogs/blogSlice";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
import Head from "@/corelayout/Head/index";
import { IoMdArrowBack } from "react-icons/io";
import Loader from "@/utils/Loader";

function SingleBlog() {
  const { AllBlogs, loading } = useSelector((state) => state.blogs);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [singleBlog, setSingleBlog] = useState(null);
  const Limit = 10;
  const segments = pathname ? pathname?.replace("/blogs/", "") : "";
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/slug.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [pathname]);

  useEffect(() => {
    if (Array.isArray(AllBlogs) && AllBlogs.length > 0) {
      const blog = AllBlogs.find((data) => data?.slug === segments);
      if (blog) {
        setSingleBlog(blog);
      } else {
        router.push(`/blogs`);
      }
    } else {
      dispatch(getBlogs(Limit));
    }
  }, [AllBlogs, pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <>
      <Head
        title={singleBlog?.title}
        description={singleBlog?.meta_description}
        canonicalUrl={`https://erstech.org/blogs/${singleBlog?.slug}`}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            className="4xl:!container xxxl:!container xxl:!container xl:!container lg:!container md:!container sm:max-w-full xsm:max-w-full xxs:max-w-full xxxs:max-w-full blog-hero-bg relative"
            style={{ background: `url(${singleBlog?.image})` }}
          >
            <div className="flex items-center justify-center h-full">
              <h1 className="md:text-[45px] text-[36px] text-center font-inter font-[600] leading-normal tracking-[-0.18px] text-white inline-block">
                {singleBlog && singleBlog?.title}
              </h1>
            </div>
          </div>
          <div className="container relative lg:px-0 px-4">
            <div className="grid place-content-center gap-6 md:px-12">
              <div
                className="w-full text-start single-blog-content"
                dangerouslySetInnerHTML={{ __html: singleBlog?.description }}
              ></div>
              <div className="flex items-start justify-start">
                <button
                  onClick={() => router.back()}
                  type="button"
                  className="flex items-center text-base font-[500] font-inter leading-[120%] text-black"
                >
                  <IoMdArrowBack size={25} color="#000" />
                  &nbsp;Back
                </button>
              </div>
              <div className="border-b-[1px] border-solid border-[#606060] w-full"></div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-inter font-[400] leading-normal tracking-[-0.16px] mb-0">
                  {singleBlog?.date
                    ? moment(singleBlog?.date).format("MMMM D, YYYY")
                    : ""}
                </span>
                <div className="flex justify-end items-center share-buttons">
                  <div className="flex items-center gap-3">
                    <div>
                      <FacebookShareButton
                        url={shareUrl}
                        quote={singleBlog?.title}
                        hashtag={
                          "#Blockchain,#ERS,#ERSTECH,#Fintech Development Solutions, #Software Development Company,#Blockchain Solutions Provider,#Top Software Development Firm"
                        }
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                    </div>
                    <div>
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                    </div>
                    <div>
                      <TelegramShareButton
                        url={shareUrl}
                        title={singleBlog?.title}
                      >
                        <TelegramIcon size={32} round />
                      </TelegramShareButton>
                    </div>
                    <div>
                      <TwitterShareButton
                        url={shareUrl}
                        title={singleBlog?.title}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                    </div>
                    <div>
                      <WhatsappShareButton
                        url={shareUrl}
                        title={singleBlog?.title}
                        separator=":: "
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SingleBlog;
