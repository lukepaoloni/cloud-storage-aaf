import "filepond/dist/filepond.min.css";

import axios from "axios";
import filesize from "filesize";
import { inject, observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { FilePond } from "react-filepond";
import Loader from "react-loaders";
import NotificationAlert from "react-notification-alert";
// import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import * as upath from "upath";

import { authHeader } from "@helpers/auth-header";
import { Status } from "@helpers/enums/status";
import { history } from "@helpers/utils/config";
import { FileRO } from "@server/shared/interfaces/file.response";

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

@inject("UserStore", "FilesStore")
@observer
class File extends React.Component<any, any> {
  private params: any;
  private id: string = "";
  private notificationsRef: any;
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isLoading: true,
      tagSuggestions: [],
      title: "",
      name: "",
      original_author: {},
      path: "",
      type: "",
      size: null,
      updated_at: "",
      version: null,
      status: "",
      history: [],
      tags: []
    };
    this.params = this.props.match.params;
    this.id = this.params.id;
    this.notificationsRef = React.createRef();
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
    console.log("ref", this.notificationsRef);
    if (this.notificationsRef.current)
      this.notificationsRef.current.notificationAlert(options);
  };

  async componentDidMount() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REST_API}files/${this.id}`,
        { headers: authHeader() }
      );
      const file = response.data as FileRO;
      if (file.status === "archived" && this.props.UserStore.role !== "admin") {
        history.goBack();
      }
      if (file.path)
        file.path = upath.normalize(
          `${process.env.PUBLIC_URL}/uploads/${file.path
            .split("uploads")
            .pop()}`
        );
      if (file.tags)
        file.tags = file.tags.map(tag => {
          return { id: tag.code, text: tag.title };
        }) as any;

      const tagsResponse = await axios.get(
        `${process.env.REACT_APP_REST_API}tags`,
        { headers: authHeader() }
      );
      const tagSuggestions = tagsResponse.data.map(tag => {
        return { text: tag.title, id: tag.code };
      });
      this.setState({
        ...file,
        isLoading: false,
        tagSuggestions
      });
      console.log(this.state);
    } catch (error) {
      if (error.response.status === 500) {
        history.goBack();
      }
      console.error(error);
    }
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { title, tags } = this.state;
    this.setState({
      isLoading: true
    });
    try {
      if (tags) {
        const formatTags = tags.map(tag => {
          return { title: tag.text };
        });
        await axios.put(
          `${process.env.REACT_APP_REST_API}files/${this.id}`,
          { title, tags: formatTags },
          { headers: authHeader() }
        );
      } else {
        await axios.put(
          `${process.env.REACT_APP_REST_API}files/${this.id}`,
          { title },
          { headers: authHeader() }
        );
      }
      this.notify(
        "tc",
        "success",
        "Successfully saved the file.",
        "tim-icons icon-check-2"
      );
    } catch (err) {
      this.notify(
        "tc",
        "danger",
        "Unable to save the file.",
        "tim-icons icon-alert-circle-exc"
      );
    }

    this.setState({
      isLoading: false
    });
  };

  handleTagDelete = async i => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  };

  handleTagAdd = tag => {
    this.setState(state => ({
      tags: [...state.tags, tag]
    }));
  };

  onChange = e => {
    this.setState({
      title: e.target.value
    });
  };

  onRestore = async e => {
    this.setState({
      isLoading: true
    });
    try {
      const version = parseInt(e.target.getAttribute("data-version"));
      await axios.put(
        `${process.env.REACT_APP_REST_API}files/${this.id}`,
        { version },
        { headers: authHeader() }
      );
      const file = this.state.history.find(
        history => history.version == version
      );
      console.log(file);
      const path = upath.normalize(
        `${process.env.PUBLIC_URL}/uploads/${file.path}`
      );
      this.setState({
        version,
        size: file.size,
        created_at: file.created_at,
        updated_at: file.updated_at,
        path
      });
      this.notify(
        "tc",
        "success",
        "Successfully restored the file.",
        "tim-icons icon-check-2"
      );
    } catch (err) {
      this.notify(
        "tc",
        "danger",
        "Unable to restore the file.",
        "tim-icons icon-alert-circle-exc"
      );
      console.error(err);
    }
    this.setState({
      isLoading: false
    });
    window.location.href = "http://localhost:3000/admin/files/" + this.id;
  };

  processFile = (error, file) => {
    if (!error) {
      const body = JSON.parse(file.serverId);
      const fileReq = body.file;
      const newPath = `${process.env.PUBLIC_URL}/${upath.normalize(
        `uploads/${fileReq.path}`
      )}`;
      this.setState({
        path: newPath,
        version: fileReq.version,
        updated_at: fileReq.updated_at,
        history: fileReq.history,
        size: fileReq.size
      });
    }
  };

  onCheckInOrOutPress = async e => {
    this.setState({
      isLoading: true
    });
    try {
      const { currentUserCheckedIn } = this.state;
      if (
        currentUserCheckedIn &&
        currentUserCheckedIn.email === this.props.UserStore.email
      ) {
        await axios.put(
          `${process.env.REACT_APP_REST_API}files/${this.id}/check-in-or-out`,
          { status: Status.checkOut },
          { headers: authHeader() }
        );
        this.setState({
          currentUserCheckedIn: null
        });
      } else {
        await axios.put(
          `${process.env.REACT_APP_REST_API}files/${this.id}/check-in-or-out`,
          { status: Status.checkIn },
          { headers: authHeader() }
        );
        this.setState({
          currentUserCheckedIn: {
            email: this.props.UserStore.email,
            status: Status.checkIn
          }
        });
      }
    } catch (error) {}
    this.setState({
      isLoading: false
    });
  };

  onRestoreFile = async e => {
    this.setState({
      isLoading: true
    });
    try {
      await axios.put(
        `${process.env.REACT_APP_REST_API}files/${this.id}/archive`,
        { status: "active" },
        { headers: authHeader() }
      );
      this.setState({
        status: "active"
      });
    } catch (error) {}
    this.setState({
      isLoading: false
    });
  };

  onArchivePress = async e => {
    this.setState({
      isLoading: true
    });
    try {
      if (this.state.status === "active") {
        await axios.put(
          `${process.env.REACT_APP_REST_API}files/${this.id}/archive`,
          { status: "archived" },
          { headers: authHeader() }
        );
        if (this.props.UserStore.role !== "admin") {
          history.goBack();
        } else {
          this.setState({
            status: "archived"
          });
        }
      } else if (
        this.props.UserStore.role === "admin" &&
        this.state.status === "archived"
      ) {
        await axios.delete(
          `${process.env.REACT_APP_REST_API}files/${this.id}`,
          { headers: authHeader() }
        );
        history.goBack();
      }
      this.notify(
        "tc",
        "success",
        "Successfully archived the file.",
        "tim-icons icon-check-2"
      );
    } catch (err) {
      console.error(err);
      this.notify(
        "tc",
        "danger",
        "Unable to archive the file.",
        "tim-icons icon-alert-circle-exc"
      );
    }
    this.setState({
      isLoading: false
    });
  };

  onFileUploadError = error => {
    this.notify(
      "tc",
      "danger",
      "Unauthorized: File name must match the one stored.",
      "tim-icons icon-alert-circle-exc"
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className="loader-center">
          <Loader type="ball-beat" active />
        </div>
      );
    }
    const {
      title,
      name,
      original_author,
      size,
      version,
      history,
      created_at,
      updated_at,
      path,
      tags,
      tagSuggestions,
      currentUserCheckedIn,
      status
    } = this.state;
    const { email } = this.props.UserStore;
    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref={this.notificationsRef} />
          </div>
          <Row>
            <Col xs={12}>
              <Card>
                <Row style={{ minHeight: 600 }}>
                  <Col xs={12} md={6}>
                    <Form
                      className="row justify-content-between"
                      style={{ height: "100%" }}
                      onSubmit={this.onSubmit}
                    >
                      <Col xs={12}>
                        <CardBody>
                          <Row>
                            <Col xs={12} className="mb-3">
                              <Row>
                                <Col>
                                  <FormGroup>
                                    <Label>Status</Label>
                                    {currentUserCheckedIn ? (
                                      <p>
                                        Currently checked in by{" "}
                                        {currentUserCheckedIn.email}
                                      </p>
                                    ) : (
                                      <p>Available</p>
                                    )}
                                  </FormGroup>
                                </Col>
                                {currentUserCheckedIn ? (
                                  currentUserCheckedIn.email === email ? (
                                    <Col>
                                      <Button
                                        type="button"
                                        block
                                        onClick={this.onCheckInOrOutPress}
                                        size="md"
                                        color="warning"
                                        disabled={
                                          status === "archived" ? true : false
                                        }
                                      >
                                        {currentUserCheckedIn.status ===
                                        Status.checkIn
                                          ? `Check Out`
                                          : `Check In `}
                                      </Button>
                                    </Col>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  <Col>
                                    <Button
                                      type="button"
                                      block
                                      onClick={this.onCheckInOrOutPress}
                                      size="md"
                                      color="warning"
                                      disabled={
                                        status === "archived" ? true : false
                                      }
                                    >
                                      Check In
                                    </Button>
                                  </Col>
                                )}
                              </Row>
                            </Col>
                            <Col xs={12}>
                              <FormGroup>
                                <Label>Title</Label>
                                {currentUserCheckedIn ? (
                                  currentUserCheckedIn.email === email ? (
                                    <Input
                                      type="text"
                                      value={title ? title : name}
                                      onChange={this.onChange}
                                      disabled={
                                        status === "archived" ? true : false
                                      }
                                    />
                                  ) : (
                                    <Input
                                      type="text"
                                      value={title ? title : name}
                                      onChange={this.onChange}
                                      disabled={true}
                                    />
                                  )
                                ) : (
                                  <Input
                                    type="text"
                                    value={title ? title : name}
                                    onChange={this.onChange}
                                    disabled={true}
                                  />
                                )}
                              </FormGroup>
                            </Col>
                            <Col xs={12}>
                              <FormGroup>
                                <Label>Name</Label>
                                <p>{name}</p>
                              </FormGroup>
                            </Col>
                            <Col xs={12} md={4}>
                              <FormGroup>
                                <Label>Original Author</Label>
                                <p>{original_author.name}</p>
                              </FormGroup>
                            </Col>
                            <Col xs={12} md={4}>
                              <FormGroup>
                                <Label>Size</Label>
                                <p>{filesize(size, { round: 0 })}</p>
                              </FormGroup>
                            </Col>
                            <Col xs={12} md={4}>
                              <FormGroup>
                                <Label>Version</Label>
                                <p>{version}</p>
                              </FormGroup>
                            </Col>
                            <Col xs={12} md={6}>
                              <FormGroup>
                                <Label>Created At</Label>
                                <p>
                                  {moment(created_at).format("DD/MM/YYYY LT")}
                                </p>
                              </FormGroup>
                            </Col>
                            <Col xs={12} md={6}>
                              <FormGroup>
                                <Label>Modified At</Label>
                                <p>
                                  {moment(updated_at).format("DD/MM/YYYY LT")}
                                </p>
                              </FormGroup>
                            </Col>
                            <Col xs={12}>
                              <FormGroup>
                                <Label>Contributions</Label>
                                <p>
                                  {//@ts-ignore
                                  history
                                    ? [
                                        ...new Set(
                                          history.map(item => item.author.name)
                                        )
                                      ].join(", ")
                                    : ""}
                                </p>
                              </FormGroup>
                            </Col>
                            <Col xs={12}>
                              <FormGroup>
                                <Label>Tags</Label>
                                {currentUserCheckedIn &&
                                currentUserCheckedIn.email === email ? (
                                  <ReactTags
                                    tags={tags}
                                    suggestions={tagSuggestions}
                                    delimiters={delimiters}
                                    handleDelete={this.handleTagDelete}
                                    handleAddition={this.handleTagAdd}
                                    allowDragDrop={false}
                                    readOnly={
                                      status === "archived" ? true : false
                                    }
                                  />
                                ) : (
                                  <ReactTags
                                    tags={tags}
                                    suggestions={tagSuggestions}
                                    delimiters={delimiters}
                                    handleDelete={this.handleTagDelete}
                                    handleAddition={this.handleTagAdd}
                                    allowDragDrop={false}
                                    readOnly={true}
                                  />
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                      </Col>
                      <Col xs={12} className="d-flex">
                        <CardBody className="d-flex align-items-end justify-content-center">
                          <Row
                            className="align-items-center"
                            style={{ width: "100%" }}
                          >
                            {status === "archived" ? (
                              <Col xs={12}>
                                <p className="text-danger">
                                  The file is currently in archive. You must
                                  restore the file before editing it.
                                </p>
                              </Col>
                            ) : (
                              ""
                            )}
                            <Col>
                              {status !== "archived" ? (
                                <Button
                                  type="submit"
                                  block
                                  size="md"
                                  color="success"
                                >
                                  Save
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  block
                                  size="md"
                                  color="success"
                                  onClick={this.onRestoreFile}
                                >
                                  Restore
                                </Button>
                              )}
                            </Col>
                            <Col>
                              <Button
                                type="button"
                                block
                                size="md"
                                color="danger"
                                onClick={this.onArchivePress}
                              >
                                {status === "archived" ? `Delete` : `Archive`}
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Col>
                    </Form>
                  </Col>
                  <Col xs={12} md={6} style={{ minHeight: 300 }}>
                    <div
                      className="bg-img rounded"
                      style={{
                        backgroundImage: `url('${path}')`
                      }}
                    />
                    {status !== "archived" ? (
                      currentUserCheckedIn &&
                      currentUserCheckedIn.email ===
                        this.props.UserStore.email ? (
                        <div className={`filepond-upload`}>
                          <FilePond
                            maxFiles={1}
                            onerror={this.onFileUploadError}
                            onprocessfile={this.processFile}
                            server={{
                              url: `${process.env.REACT_APP_REST_API}files/${
                                this.id
                              }/upload`,
                              process: {
                                ...{ headers: authHeader() }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={12}>
              <Row className="mt-3">
                <Col xs={12}>
                  <Button
                    color="info"
                    block
                    size="md"
                    onClick={this.toggle}
                    disabled={status === "archived" ? true : false}
                  >
                    See {history ? history.length : 0} Revisions
                  </Button>
                </Col>
                <div className="col-12">
                  <Collapse isOpen={this.state.collapse}>
                    <Row className="justify-content-around align-items-center">
                      <Col xs={12} md={10}>
                        <Row className="justify-content-around align-items-center">
                          {history
                            ? history.map((item, index) => (
                                <Col
                                  className="mb-4"
                                  xs={12}
                                  sm={6}
                                  md={4}
                                  key={index}
                                >
                                  <div
                                    className={`border border-${
                                      item.version == version
                                        ? `secondary`
                                        : `primary`
                                    } p-2 rounded`}
                                  >
                                    <Row>
                                      <Col xs={12} md={6}>
                                        <FormGroup>
                                          <Label>Author</Label>
                                          <p>{item.author.name}</p>
                                        </FormGroup>
                                      </Col>
                                      <Col xs={12} md={6}>
                                        <FormGroup>
                                          <Label>Size</Label>
                                          <p>
                                            {filesize(item.size, { round: 0 })}
                                          </p>
                                        </FormGroup>
                                      </Col>
                                      <Col xs={12} md={6}>
                                        <FormGroup>
                                          <Label>Version</Label>
                                          <p>{item.version}</p>
                                        </FormGroup>
                                      </Col>
                                      <Col xs={12} md={6}>
                                        <FormGroup>
                                          <Label>Created At</Label>
                                          <p>
                                            {moment(
                                              item.created_at
                                                ? item.created_at
                                                : null
                                            ).format("DD/MM/YYYY LT")}
                                          </p>
                                        </FormGroup>
                                      </Col>
                                      <Col xs={12}>
                                        {currentUserCheckedIn ? (
                                          currentUserCheckedIn.email ===
                                          email ? (
                                            <Button
                                              color={`${
                                                item.version == version
                                                  ? `secondary`
                                                  : `primary`
                                              }`}
                                              block
                                              size="sm"
                                              type="button"
                                              onClick={this.onRestore}
                                              data-version={item.version}
                                              disabled={
                                                version == item.version
                                                  ? true
                                                  : false
                                              }
                                            >
                                              Restore
                                            </Button>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              ))
                            : ""}
                        </Row>
                      </Col>
                    </Row>
                  </Collapse>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default withRouter(File);
