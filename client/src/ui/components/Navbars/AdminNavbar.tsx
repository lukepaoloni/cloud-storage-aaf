import algoliasearch from "algoliasearch/lite";
import classNames from "classnames";
import React from "react";
import {
  connectHits,
  Highlight,
  InstantSearch,
  SearchBox
} from "react-instantsearch-dom";
import { Link, withRouter } from "react-router-dom";
import {
  Button,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroup,
  Modal,
  ModalBody,
  Nav,
  Navbar,
  NavbarBrand,
  NavLink,
  UncontrolledDropdown
} from "reactstrap";
import * as upath from "upath";

import { State } from "./state";

const searchClient = algoliasearch(
  "R7OCY5RB3N",
  "9f4dda9708e9eee086e47e4dc180f37e"
);

class AdminNavbar extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent"
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };

  onLogout = e => {
    sessionStorage.clear();
    window.location.href = `${process.env.PUBLIC_URL}/login`;
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };
  render() {
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                    <i className="tim-icons icon-zoom-split" />
                    <span className="d-lg-none d-md-block">Search</span>
                  </Button>
                </InputGroup>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <div className="notification d-none d-lg-block d-xl-block" />
                    <i className="tim-icons icon-bell-55" />
                    <p className="d-lg-none">Notifications</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Mike John responded to your email
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        You have 5 more tasks
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Your friend Michael is in town
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Another notification
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Another one
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={(e: any) => e.preventDefault()}
                  >
                    <div className="photo">
                      <img
                        alt="..."
                        src={require("../../assets/img/anime3.png")}
                      />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        href="/admin/user-profile"
                      >
                        Profile
                      </DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={this.onLogout}
                      >
                        Log out
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <InstantSearch indexName="files" searchClient={searchClient}>
            <div className="modal-header">
              <SearchBox />
            </div>
            <ModalBody>
              <Hits onClick={this.toggleModalSearch} />
            </ModalBody>
          </InstantSearch>
        </Modal>
      </>
    );
  }
}

function Hit(props) {
  return (
    <a
      href={`${process.env.PUBLIC_URL}/admin/files/${props._id}`}
      className="hit-item"
      style={{
        backgroundImage: `url('/${upath.normalize(`uploads/${props.path}`)}')`
      }}
      onClick={props.onClick}
    >
      <div className="hit-metadata-container">
        <div className="hit-metadata">
          <div className="hit-title">
            <span>Title: </span>
            <Highlight attribute="title" hit={props} />
          </div>
          <div className="hit-name">
            <span>Name: </span>
            <Highlight attribute="name" hit={props} />
          </div>
          {props.original_author.name ? (
            <div className="hit-originalAuthor">
              <span>Author: </span>
              <span>{props.original_author.name}</span>
            </div>
          ) : (
            ""
          )}
          {props.type ? (
            <div className="hit-type">
              <span>Type: </span>
              <span>{props.type}</span>
            </div>
          ) : (
            ""
          )}
          <div className="hit-type">
            <span>Version: </span>
            <Highlight attribute="version" hit={props} />
          </div>
        </div>
      </div>
    </a>
  );
}

const Hits = connectHits(props => {
  const masonry = [
    [2, 1],
    [1, 1],
    [2, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 2],
    [1, 1],
    [1, 1]
  ];
  let count = 0;
  const max = 8;
  return (
    <div className="grid-layout">
      {props.hits.map((hit, index) => {
        count = max === count ? 0 : index;
        return (
          <div
            className={`grid-item grid-item-${index} row-span-${
              masonry[count][0]
            } col-span-${masonry[count][1]}`}
            key={hit.objectID}
          >
            <Hit {...hit} {...props} />
          </div>
        );
      })}
    </div>
  );
});
export default withRouter(AdminNavbar);
