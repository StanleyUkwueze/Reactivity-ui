import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/dashboard/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/Activityform";
import App from "../layout/App";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import RequireAuth from "./RequireAuth";
import ProfilePage from "../../features/profiles/ProfilePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [

      {element:<RequireAuth/>, children:[
        { path: "activities", element: <ActivityDashboard /> },
        { path: "activities/:id", element: <ActivityDetails /> },
        { path: "createActivity", element: <ActivityForm key={"create"} /> },
        { path: "manage/:id", element: <ActivityForm key={"manage"} /> },
        {path: 'profiles/:username', element: <ProfilePage />},
        { path: "errors", element: <TestErrors /> },
      ]},
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerError /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];
export const router = createBrowserRouter(routes);
