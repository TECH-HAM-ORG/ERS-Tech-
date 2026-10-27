import Head from "next/head";
import OgImg from "../../../public/assets/icons/og.png";
const Default = ({
  title = "",
  description = "",
  keywords = "",
  image = "",
  canonicalUrl = "",
}) => {
  if (title == "") {
    title = "";
  }
  if (description == "") {
    description = "";
  }
  if (keywords == "") {
    keywords = "";
  }
  if (canonicalUrl == "") {
    canonicalUrl = "";
  }

  return (
    <Head>
      <title>
        {title ||
          "ERS TECH - Transforming Ideas into Innovative Software Solutions"}
      </title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="Software Development Company,Software Development Company,Blockchain Development Services,Custom Software Development,
        Top Software Development Firm,Fintech Software Company,Blockchain Solutions Provider"
      />
      <meta name="author" content="ERS TECH" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={"/assets/icons/og.png"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="googlebot" content={"index,follow"} />
      <meta name="robots" content={"index,follow"} />
      <link rel="apple-touch-icon" href={"/assets/icons/og.png"} />
      <meta name="apple-mobile-web-app-title" content="ERS TECH" />
    </Head>
  );
};

export default Default;
