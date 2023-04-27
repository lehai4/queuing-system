import { ToastContainer } from "react-toastify";
import GlobalStyle from "./GlobalStyle/GlobalStyle";
import { Navbar, Sidebar } from "./components";
import { Router } from "./pages";
import { useAppSelector } from "./hooks/hooks";

const App = () => {
  const user = useAppSelector((state) => state.auth.login.currentUser);
  return (
    <div>
      <GlobalStyle>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {user ? (
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="w-50-override fixed dark:bg-secondary-dark-bg bg-main-light">
              <Sidebar />
            </div>
            <div className="dark:bg-main-dark-bg  bg-main-grey min-h-screen md:ml-50 w-full">
              <div className="fixed md:static bg-main-grey dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
              <div>
                <Router />
              </div>
            </div>
          </div>
        ) : (
          <Router />
        )}
      </GlobalStyle>
    </div>
  );
};

export default App;