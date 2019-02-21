import { inject, observer } from "mobx-react";
import PerfectScrollbar from "perfect-scrollbar";
import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import Footer from "@components/Footer/Footer";
import AdminNavbar from "@components/Navbars/AdminNavbar";
import Sidebar from "@components/Sidebar/Sidebar";
import Login from "@views/Login";

import routes from "../../../routes";

let ps: PerfectScrollbar;

@inject("AuthStore", "UserStore")
@observer
class Admin extends React.Component<any, any> {
  private mainPanel: React.RefObject<HTMLDivElement> | any;
  constructor(props: any) {
    super(props);
    this.state = {
      backgroundColor: "blue",
      sidebarOpened:
        document.documentElement.className.indexOf("nav-open") !== -1
    };
    this.mainPanel = React.createRef();
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(".main-panel", { suppressScrollX: true });
      let tables = document.querySelectorAll(".table-responsive") as NodeListOf<
        HTMLElement
      >;
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e: any) {
    if (e.history.action === "PUSH") {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(
          ".table-responsive"
        ) as NodeListOf<HTMLElement>;
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
      // this.refs.mainPanel.scrollTop = 0;
    }
  }
  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };
  getRoutes = (routes: any) => {
    return routes.map((prop: any, key: any) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() =>
              this.props.AuthStore.isLoggedIn ? (
                <prop.component {...this.props} />
              ) : (
                <Redirect to="/login" />
              )
            }
            key={key}
          />
        );
      } else {
        return <Route path="/login" component={Login} />;
      }
    });
  };
  handleBgClick = (color: string) => {
    this.setState({ backgroundColor: color });
  };
  getBrandText = (path: any) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].sidebar) {
        if (
          this.props.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return "Cloud Storage";
  };
  render() {
    return (
      <>
        <div className="wrapper">
          {/* <ToastContainer /> */}
          <Sidebar
            {...this.props}
            routes={routes}
            bgColor={this.state.backgroundColor}
            toggleSidebar={this.toggleSidebar}
          />
          <div
            className="main-panel"
            ref={this.mainPanel}
            data-bg-color={this.state.backgroundColor}
          >
            <AdminNavbar
              {...this.props}
              brandText={this.getBrandText(this.props.location.pathname)}
              toggleSidebar={this.toggleSidebar}
              sidebarOpened={this.state.sidebarOpened}
            />
            <Switch>{this.getRoutes(routes)}</Switch>
            {// we don't want the Footer to be rendered on map page
            this.props.location.pathname.indexOf("maps") !== -1 ? null : (
              <Footer fluid />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Admin);
