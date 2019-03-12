import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Import FilePond styles
import "filepond/dist/filepond.min.css";

import axios from "axios";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import filesize from "filesize";
import { inject, observer } from "mobx-react";
import React from "react";
import { FilePond, registerPlugin } from "react-filepond";
import Loader from "react-loaders";
import NotificationAlert from "react-notification-alert";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";

import { authHeader } from "@helpers/auth-header";
import { FileRO } from "@server/shared/interfaces/file.response";

import { IStorageProps } from "./IStorageProps";
import moment from "moment";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const columns = [
  {
    title: "Title",
    sort: true
  },
  {
    title: "Original Author",
    sort: true
  },
  {
    title: "Modified At",
    sort: true
  },
  {
    title: "Checked In",
    sort: true
  },
  {
    title: "Size",
    sort: true
  },
  {
    title: "Version",
    class: "text-center",
    sort: true
  },
  {
    title: "Action",
    class: "text-center",
    sort: false
  }
];

@inject("FilesStore", "UserStore")
@observer
class Storage extends React.Component<IStorageProps, any> {
  private notificationsRef: any;
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isLoading: false,
      modal: false,
      selectedId: null
    };
  }

  notify = (place, type, message, icon?) => {
    let options = {};
    options = {
      place: place,
      message: <div>{message}</div>,
      type: type,
      icon: icon,
      autoDismiss: 7
    };
    this.notificationsRef = this.refs.notificationAlert as any;
    this.notificationsRef.notificationAlert(options);
  };

  async componentDidMount() {
    await this.loadFiles();
  }

  loadFiles = async () => {
    this.setState({
      isLoading: true
    });
    const filesResponse = await axios.get(
      `${process.env.REACT_APP_REST_API}files`,
      { headers: authHeader() }
    );
    this.props.FilesStore.setFiles(filesResponse.data as FileRO[]);
    this.setState({
      isLoading: false
    });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onArchiveModal = e => {
    const id = e.target.getAttribute("data-id");
    console.log(id);
    this.setState({
      selectedId: id
    });
    this.toggle();
  };

  onDelete = async e => {
    const id = this.state.selectedId;
    console.log(id);
    this.setState({
      isLoading: true
    });
    try {
      await axios.delete(`${process.env.REACT_APP_REST_API}files/${id}`, {
        headers: authHeader()
      });
      await this.loadFiles();
      this.notify(
        "tc",
        "success",
        "Successfully deleted file.",
        "tim-icons icon-check-2"
      );
    } catch (err) {
      console.error(err);
      this.notify(
        "tc",
        "danger",
        "Unable to delete the file.",
        "tim-icons icon-alert-circle-exc"
      );
    }
    this.setState({
      isLoading: false
    });
    this.toggle();
  };

  render() {
    const rows = this.props.FilesStore.files;
    const { role } = this.props.UserStore;
    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>
              {role === "admin" ? "Delete" : "Archive"}
            </ModalHeader>
            <ModalBody>
              Are you sure you want to {role === "admin" ? "delete" : "archive"}{" "}
              this file?
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                color="danger"
                size="md"
                onClick={this.onDelete}
              >
                {role === "admin" ? "delete" : "Archive"}
              </Button>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={this.toggle}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Row>
            <Col md="12">
              <Card>
                {this.state.isLoading ? (
                  <div className="loader-center">
                    <Loader type="ball-beat" active />
                  </div>
                ) : null}
                <CardBody>
                  <div
                    className="table-responsive"
                    style={{ overflow: "hidden" }}
                  >
                    <Table
                      className="tablesorter"
                      style={{ overflow: "hidden" }}
                    >
                      <thead className="text-primary">
                        <tr>
                          {columns.map((item: any, index) => (
                            <th
                              key={index}
                              className={item.class ? item.class : null}
                            >
                              <div className={`${item.sort ? "sort-col" : ""}`}>
                                {item.title}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((item, index) => (
                          <tr key={index}>
                            <th>{item.title ? item.title : item.name}</th>
                            <th>{item.original_author.name}</th>
                            <th>{moment(item.updated_at).fromNow()}</th>
                            <th align="center">
                              {item.currentUserCheckedIn ? (
                                <small className="disable permission">
                                  yes
                                </small>
                              ) : (
                                <small className="allow permission mr-2">
                                  no
                                </small>
                              )}
                            </th>
                            <th>{filesize(item.size, { round: 0 })}</th>
                            <th className="text-center">{item.version}</th>
                            <th className="text-center">
                              <Link
                                to={`/admin/files/${item._id}`}
                                className="btn btn-info btn-sm mr-2"
                              >
                                <div className="sr-only">View</div>
                                <i className="fas fa-eye" />
                              </Link>
                              <Button
                                color="info"
                                size="sm"
                                className="mr-2"
                                onClick={this.onArchiveModal}
                                data-id={item._id}
                              >
                                <div className="sr-only">Archive</div>
                                <i className="fas fa-archive" />
                              </Button>
                              <Button color="info" size="sm" disabled>
                                <div className="sr-only">Share</div>
                                <i className="fas fa-share-square" />
                              </Button>
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button
                color="info"
                block
                size="md"
                onClick={e => this.setState({ collapse: !this.state.collapse })}
              >
                Upload Files
              </Button>
              <Collapse isOpen={this.state.collapse}>
                <FilePond
                  allowMultiple={true}
                  maxFiles={3}
                  onprocessfile={(error, file) => {
                    if (error) {
                      console.error(error);
                    } else {
                      this.loadFiles();
                    }
                  }}
                  server={{
                    url: `${process.env.REACT_APP_REST_API}files/upload`,
                    process: {
                      ...{ headers: authHeader() }
                    }
                  }}
                />
              </Collapse>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Storage;
