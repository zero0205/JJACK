import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccouunt from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import ResetPassword from "./routes/reset-password";
import Explore from "./routes/explore";
import Search from "./routes/search";
import EditProfile from "./routes/editProfile";
import GiantsInline from "./fonts/Giants-Inline.ttf";
import GiantsRegular from "./fonts/Giants-Regular.ttf";
import GiantsBold from "./fonts/Giants-Bold.ttf";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile/:uid",
        element: <Profile />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "editProfile",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccouunt />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  @font-face {
    font-family: "GiantsRegular";
    src: url(${GiantsRegular}) format("truetype");
  }
  @font-face {
    font-family: "GiantsBold";
    src: url(${GiantsBold}) format("truetype");
  }
  @font-face {
    font-family: 'GiantsInline';
    src: url(${GiantsInline}) format('truetype');
    font-weight: 900;
    font-style: normal;
}
  body{
    background-color: black;
    color:white;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  font-family: GiantsRegular, sans-serif;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
