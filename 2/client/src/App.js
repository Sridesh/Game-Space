import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Typography } from "@mui/material";
import Splash from "./components/Splash";
import User from "./components/User/User";
import Root from "./components/Root";
import LeaderBoard from "./components/LeaderBoard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Splash />,
    },
    {
      path: "/user",
      element: <User />,
    },
    {
      path: "/game-home",
      element: <Root />,
    },
    {
      path: "/leaderboard",
      element: <LeaderBoard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
