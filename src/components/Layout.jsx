// Layout.jsx
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

import Messenger from "./Messenger";
import ChatLauncher from "./ChatLauncher";

export default function Layout({ children }) {
  const location = useLocation();

  // Routes where navbar should be hidden
  const hiddenRoutes = ["/login", "/register", "/verify-code", "/fill-profile"];
  const shouldShowNavbar = !hiddenRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <>
          <Navbar />
          <ChatLauncher />
        </>
      )}
      <main>{children}</main>
    </>
  );
}
