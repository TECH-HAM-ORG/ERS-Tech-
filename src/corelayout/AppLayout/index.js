import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../../components/Footer/index"));
const Header = dynamic(() => import("../../components/Header/index"));
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  
  subsets: ["latin"],
  display: "swap",
});
const AppLayout = ({ children }) => {
  const router = useRouter();

  const isUnRestrictedRoute = (pathname) => {
    return (
      pathname === "/sitemap.xml" ||
      pathname === "/sitmap.xml" ||
      pathname === "/rss.xml"
    );
  };
  return isUnRestrictedRoute(router.pathname) ? (
    children
  ) : (
    <>
      {/* <CircularProgress className={!isLoaded ? "visible" : "hidden"} /> */}
      <div className={poppins.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default AppLayout;
