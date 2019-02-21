import { Route } from "./helpers/interfaces/route";
import Dashboard from "@views/Dashboard";
import UserProfile from "@views/UserProfile/UserProfile";
import Storage from "@ui/views/Storage/Storage";
import History from "@views/History";
import File from "@views/File/File";

export const routes: Route[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/storage",
    name: "Storage",
    icon: "tim-icons icon-cloud-upload-94",
    component: Storage,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/history",
    name: "History",
    icon: "tim-icons icon-spaceship",
    component: History,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
    sidebar: true
  },
  {
    path: "/files/:id",
    component: File,
    layout: "/admin",
    sidebar: false
  }
];
export default routes;
