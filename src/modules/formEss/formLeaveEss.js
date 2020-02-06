import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import M from "moment";
import API from "../../Services/Api";
import * as R from "ramda";
import { connect } from "react-redux";
import DropDown from "../../modules/popup/DropDown";
import FileViewer from "react-file-viewer";
import CalendarPicker from "../../modules/popup/Calendar";
import ReactTooltip from "react-tooltip";
import PopUp from "../../components/pages/PopUpAlert";
import LoadingBar from "react-top-loading-bar";
import UploadFile from "../upload/upload";
import Stomp from 'stompjs'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

const defaultPayloadLeave = {
  leaveID: "",
  leaveStartDate: "",
  leaveEndDate: "",
  leaveDocumentURL: "",
  leaveReason: "",
  leaveAddress: "",
  leaveStatus: "INITIATE",
  employeeID: "",
  subtitutePersonID: "",
  leaveType: "",
  leaveCategory: "",
  createdBy: "",
  createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
  updatedBy: "",
  updatedDate: "",
  recordID: "",
};

class FormLeaveEss extends Component {
  constructor(props) {
    super(props);
    let { leaveData, bizparLeaveType } = this.props;
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      formReportVisible: false,
      buttonVisible: false,
      file: "",
      reportURL: "",
      fileType: "",
      typeSave: "",
      isWeb: false,
      defaultData: [],
      leaveData: leaveData
        ? {
          ...leaveData,
          leaveStartDate: M(leaveData.leaveStartDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          leaveEndDate: M(leaveData.leaveEndDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          )
        }
        : {
          ...defaultPayloadLeave,
          leaveDocumentURL:
            this.props.type === "edit"
              ? this.state.leaveData.leaveDocumentURL
              : ""
        },
      bizparLeaveType: bizparLeaveType,
      auth: props.auth,
      message: "",
      notifVisible: false,
      result: "",
      percentage: 0,
      uploadStatus: 'idle',
    };
  }

  handleSelectDateStart = date => {
    this.setState({
      leaveData: {
        ...this.state.leaveData,
        leaveStartDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  handleSelectDateEnd = date => {
    this.setState({
      leaveData: {
        ...this.state.leaveData,
        leaveEndDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  componentDidMount() {
    this.getDocument(this.state.leaveData);
  }

  connectWebsocket = async () => {
    this.setState({
      isWeb: !this.state.isWeb,
    }, () => this.state.isWeb === true ? this.uploadDocument(this.state.defaultData) : {})
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/leave/post.leave.document/' + employeeID, (message) => {
        console.log('test')
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ message: res.messages, notifVisible: true, isWeb: false })
        setTimeout(() => {
          this.setState({
            notifVisible: false
          })
        }, 2000);
      })
    })
  }

  getDocument(leaveData) {
    let documents = [];
    if (leaveData.leaveDocumentURL != null) {
      documents.push([leaveData.leaveDocumentURL.split("document/leave_doc/")]);
    }
    this.setState({
      documents
    });
  }

  handleFile(event) {
    // alert(JSON.stringify(event))
    let { leaveData } = this.state;
    var url = event;
    var number = leaveData.leaveID;

    const formData = new FormData();
    formData.append("leaveID", number);
    formData.append("file", url);
    formData.append("updatedBy", this.props.auth.user.employeeID)
    formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

    this.setState({ formData, url });
  }

  async uploadDocument(formData) {
    this.setState({ defaultData: formData }, ()=> this.connectWebsocket())
    if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
      this.setState({ uploadStatus: "upload" });
      if (
        this.state.url.type === "application/pdf" ||
        this.state.url.type === "image/jpeg" ||
        this.state.url.type === "image/png"
      ) {
        let response = await API.create("TIME").uploadLeaveDoc(formData, {
          onUploadProgress: progress => {
            if (progress.lengthComputable) {
              if (progress.total >= 1000000) {
                this.setState({
                  result: "error",
                  percentage: "0",
                  uploadStatus: "idle"
                });
              } else {
                var percentCompleted = Math.round(
                  (progress.loaded * 100) / progress.total
                );
                this.setState({ percentage: percentCompleted });
                if (progress.loaded === progress.total) {
                  this.setState({ result: "success" });
                }
              }
            }
          }
        });
        if (!response.ok && response.status === 413) {
          alert("Your Document Too Large, Please Select Another Document");
          this.setState({ result: "error", percentage: "0" });
        }
        if (!response.ok && response.status === 500) {
          alert("Please Select Document");
          this.setState({ result: "error" });
        }
        if (!response.ok && R.isNil(response.status)) {
          alert(response.problem);
          this.setState({ result: "error" });
        }

        if (!R.isNil(response.data)) {
          switch (response.data.status) {
            case "S":
              if (response.data.code === "201") {
                this.setState({
                  leaveData: {
                    ...this.props.leaveData,
                    // leaveDocumentURL: 'document/leave_doc/' + this.state.url.name
                  },
                  result: "success",
                })
                this.openSavePopUp();
                this.props.getData()
                this.getDocument(this.state.leaveData);
              } else alert("Failed: ", response.data.message);
              break;
            default:
              break;
          }
        }
      } else {
        alert("Unsupported File Type");
      }
    }
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  deleteDocument() {
    let documents = [];
    documents = [];
    this.setState({
      documents,
      leaveData: {
        ...this.state.leaveData,
        leaveDocumentURL: ""
      }
    });
    this.openDeletePopup();
  }

  async getReport() {
    let { leaveData } = this.state;
    let leaveID = leaveData.leaveID;
    let length = leaveData.leaveDocumentURL.split(".").length;
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "tmcmd/api/leave.document.get/" + leaveID,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
          "Content-Type": "application/pdf"
        }
      }
    );
    response = await response.blob();
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        reportURL: response,
        fileType: leaveData.leaveDocumentURL.split(".")[length - 1],
        formReportVisible: !this.state.formReportVisible
      });
    } else {
      alert("Failed: Document Not Found");
    }
  }

  openReport() {
    this.setState({ formReportVisible: !this.state.formReportVisible });
  }

  openDeletePopup = selectedIndex => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  columnsDocument = [
    {
      name: "Document",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i className="fa fa-lw fa-file" style={{ marginRight: 5 }} />
              {val}
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.getReport()}
              >
                {val}
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-times" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
              ) : null}
            </div>
          );
        }
      }
    }
  ];

  dataDocument = [];

  componentDidUpdate(prevProps) {
    if (this.props.type !== "create" && this.props.leaveData !== undefined) {
      if (this.props.leaveData !== prevProps.leaveData) {
        // alert(JSON.stringify(this.props.leaveData))
        this.setState({
          leaveData: {
            ...this.props.leaveData,
            leaveStartDate:
              this.props.leaveData.leaveStartDate === "Invalid date"
                ? ""
                : M(this.props.leaveData.leaveStartDate, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
                ),
            leaveEndDate:
              this.props.leaveData.leaveEndDate === "Invalid date"
                ? ""
                : M(this.props.leaveData.leaveEndDate, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
                )
          }
        }, () => this.getDocument(this.props.leaveData));
      }
    }
  }

  renderReport = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">Document Viewer</div>
            </div>
          </div>
          <div style={{ textAlign: "center", margin: 20 }}>
            {
              this.state.fileType === "png" ||
                this.state.fileType === "jpg" ? (
                  <img src={this.state.reportURL} width={"50%"} alt="" />
                ) : (
                  <FileViewer
                    fileType={this.state.fileType}
                    filePath={this.state.reportURL}
                  />
                )}
          </div>
          <div className="padding-15px background-white">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openReport.bind(this)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-20px" />
      </div>
    );
  };

  renderEditLeave = () => {
    let { formReportVisible } = this.state;
    return (
      <div>
        <div className="a-s-p-place active">
          {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />)}
          <div className="a-s-p-top">
            <div className="grid grid-2x">
              <div className="col-1">
                <div className="display-flex-normal margin-top-10px">
                  <i className="fa fa-1x fa-sign-out-alt"></i>
                  <span className="txt-site txt-11 txt-main margin-left-10px">
                    Leave - {this.props.type === "edit" ? "Edit" : "View"} Form
                  </span>
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  onClick={this.props.closeSlide}
                  className="btn btn-circle btn-grey"
                >
                  <i className="fa fa-lg fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              if (R.isEmpty(this.state.leaveData.leaveType))
                return alert("Leave Type is Required.");
              if (R.isEmpty(this.state.leaveData.leaveStartDate))
                return alert("Start Date is Required.");
              if (R.isEmpty(this.state.leaveData.leaveEndDate))
                return alert("End Date is Required.");
              if (
                !R.isEmpty(this.state.leaveData.leaveStartDate) &&
                !R.isEmpty(this.state.leaveData.leaveEndDate) &&
                this.state.leaveData.leaveEndDate <
                this.state.leaveData.leaveStartDate
              )
                return alert("End Date Should be Greater Than Start Date.");
              if (this.props.type === "edit") {
                let typeSave = this.state.typeSave;
                switch (typeSave) {
                  case "final":
                    this.props.onClickProcess(this.state.payload);
                    break;
                  default:
                    let payload = this.state.leaveData;
                    payload = {
                      leaveID: payload.leaveID,
                      leaveType: payload.leaveType.bizparKey,
                      leaveCategory:
                        payload.leaveCategory.bizparKey === null
                          ? ""
                          : payload.leaveCategory.bizparKey,
                      leaveStartDate:
                        payload.leaveStartDate !== "Invalid date"
                          ? M(payload.leaveStartDate, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )
                          : "",
                      leaveEndDate:
                        payload.leaveEndDate !== "Invalid date"
                          ? M(payload.leaveEndDate, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )
                          : "",
                      employeeID: this.state.auth.user.employeeID,
                      updatedBy: this.state.auth.user.employeeID,
                      updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                      createdBy: payload.leaveCreationalDTO.createdBy,
                      createdDate: payload.leaveCreationalDTO.createdDate,
                      leaveStatus: payload.leaveStatus,
                      subtitutePersonID:
                        payload.subtitutePerson &&
                          payload.subtitutePerson.employeeID !== null
                          ? payload.subtitutePerson.employeeID
                          : "",
                      leaveReason: payload.leaveReason,
                      leaveDocumentURL: payload.leaveDocumentURL
                    };
                    this.props.onClickSave(payload);
                    break;
                }
              }
            }}
          >
            <div className="a-s-p-mid a-s-p-pad border-top">
              <div className="display-flex-normals margin-bottom-10px">
                <div className="padding-top-15px padding-bottom-15px border-bottom">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Leave Type <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select leave type --"
                      onChange={dt =>
                        this.setState({
                          leaveData: {
                            ...this.state.leaveData,
                            leaveType: {
                              ...this.state.leaveData.leaveType,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      type="bizpar"
                      bizValue={
                        this.state.leaveData.leaveType
                          ? this.state.leaveData.leaveType.bizparValue
                          : ""
                      }
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      disabled={this.props.type === "view"}
                      data={this.props.bizparLeaveType}
                      value={this.state.leaveData.leaveType.bizparKey}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Start Date <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <CalendarPicker
                      date={this.state.leaveData.leaveStartDate}
                      disabled={this.props.type === "view"}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      onChange={e => {
                        this.handleSelectDateStart(e);
                      }}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          End Date <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <CalendarPicker
                      date={this.state.leaveData.leaveEndDate}
                      disabled={this.props.type === "view"}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      onChange={e => {
                        this.handleSelectDateEnd(e);
                      }}
                    />
                  </div>

                  <div className="margin-bottom-5px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Reason <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <textarea
                      readOnly={this.props.type === "view"}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      value={
                        this.state.leaveData && this.state.leaveData.leaveReason
                      }
                      required
                      onChange={e =>
                        this.setState({
                          leaveData: {
                            ...this.state.leaveData,
                            leaveReason: e.target.value
                          }
                        })
                      }
                      rows={4}
                    />
                  </div>

                  {this.props.type !== "create" ? (
                    <div className="margin-bottom-20px margin-top-20px">
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          data={
                            this.state.leaveData.leaveDocumentURL ===
                              ""
                              ? this.dataDocument
                              : this.state.documents
                          }
                          columns={this.columnsDocument}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </div>
                  ) : null}

                  {this.props.type === "edit" ? (
                    <div className="margin-bottom-20px">
                      <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

                      <div className="padding-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            File
                            <span style={{ color: "red" }}>
                              (Format file: pdf, jpg, png)
                            </span>
                          </h4>
                        </span>
                      </div>

                      <UploadFile
                        type={this.state.uploadStatus}
                        percentage={this.state.percentage}
                        result={this.state.result}
                        acceptedFiles={["pdf", "jpg", "png"]}
                        onHandle={(dt) => {
                          this.handleFile(dt)
                          this.setState({ uploadStatus: 'idle', percentage: '0' })
                        }}
                        onUpload={() => {
                          this.uploadDocument(this.state.formData);
                        }}
                      />

                      {this.state.buttonVisible ? (
                        <button
                          type="button"
                          className="btn btn-blue btn-width-all margin-top-5px"
                          onClick={() =>
                            this.uploadDocument(this.state.formData)
                          }
                        >
                          Upload File
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="padding-15px">
                  <div className="grid">
                    <div className="col-2 content-right">
                      {this.props.type !== "view" ? (
                        <Button
                          state={this.props.sendState}
                          style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90 }}
                          className="btn btn-blue"
                          type="submit"
                        >
                          <span>SAVE</span>
                        </Button>
                      ) : null}
                      {this.props.type === "edit" ? (
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-blue"
                          type="submit"
                          onClick={() => {
                            let payload = this.state.leaveData;
                            payload = {
                              taskID: "",
                              senderUserID: this.state.auth.user.userID,
                              senderEmpID: this.state.auth.user.employeeID,
                              senderNotes: "",
                              senderBPMStatus: "INITIATE",
                              data: {
                                leaveID:
                                  payload.leaveID === ""
                                    ? payload.leaveID + "L-" + M()
                                    : payload.leaveID,
                                leaveStartDate:
                                  payload.leaveStartDate !== "Invalid date"
                                    ? M(
                                      payload.leaveStartDate,
                                      "YYYY-MM-DD"
                                    ).format("DD-MM-YYYY")
                                    : "",
                                leaveEndDate:
                                  payload.leaveEndDate !== "Invalid date"
                                    ? M(
                                      payload.leaveEndDate,
                                      "YYYY-MM-DD"
                                    ).format("DD-MM-YYYY")
                                    : "",
                                leaveDocumentURL: payload.leaveDocumentURL
                                  ? payload.leaveDocumentURL
                                  : "",
                                leaveAddress: payload.leaveAddress
                                  ? payload.leaveAddress
                                  : "",
                                leaveReason: payload.leaveReason,
                                leaveType: payload.leaveType.bizparKey,
                                leaveCategory:
                                  payload.leaveCategory &&
                                    payload.leaveCategory.bizparKey !== null
                                    ? payload.leaveCategory.bizparKey
                                    : "",
                                employeeID:
                                  payload.employee === undefined
                                    ? this.state.auth.user.employeeID
                                    : payload.employee.employeeID,
                                updatedBy:
                                  this.props.type === "edit" ? this.state.auth.user.employeeID : '',
                                updatedDate:
                                  this.props.type === "edit"
                                    ? M().format("DD-MM-YYYY HH:mm:ss")
                                    : "",
                                createdBy:
                                  this.props.type === "edit"
                                    ? ''
                                    : this.state.auth.user.employeeID,
                                createdDate:
                                  this.props.type === "edit"
                                    ? payload.leaveCreationalDTO.createdDate
                                    : M().format("DD-MM-YYYY HH:mm:ss"),
                                leaveStatus: payload.leaveStatus,
                                subtitutePersonID:
                                  payload.subtitutePerson &&
                                    payload.subtitutePerson.employeeID !== null
                                    ? payload.subtitutePerson.employeeID
                                    : "",
                                leaveNotes: payload.leaveNotes
                                  ? payload.leaveNotes
                                  : ""
                              }
                            };
                            this.setState({
                              typeSave: "final",
                              payload
                            });
                          }}
                        >
                          <span>SAVE & SUBMIT</span>
                        </button>
                      ) : null}
                      <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={this.props.closeSlide}
                      >
                        <span>CLOSE</span>
                      </button>
                    </div>
                  </div>

                  {this.state.savePopUpVisible && (
                    <PopUp
                      type={"save"}
                      class={"app-popup app-popup-show"}
                      onClick={this.openSavePopUp}
                    />
                  )}

                  {formReportVisible ? this.renderReport() : null}

                  {this.state.deletePopUpVisible && (
                    <PopUp
                      type={"delete"}
                      class={"app-popup app-popup-show"}
                      onClickDelete={this.deleteDocument.bind(this)}
                      onClick={this.openDeletePopup.bind(this)}
                    />
                  )}

                </div>
              </div>
            </div>
          </form>
          <ReactTooltip />
        </div>
      </div>
    );
  };

  render() {
    return this.props.type !== "create" ? (
      this.renderEditLeave()
    ) : (
        <div className="app-popup app-popup-show">
          <div className="padding-top-20px" />
          <div
            className="popup-content-mikro background-white border-radius"
            style={{ marginBottom: 10 }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  {this.props.type === "create"
                    ? "Leave - Create Form"
                    : "Leave - Edit Form"}
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>
            <form
              action="#"
              onSubmit={e => {
                e.preventDefault();
                if (R.isEmpty(this.state.leaveData.leaveType))
                  return alert("Leave Type is Required.");
                if (R.isEmpty(this.state.leaveData.leaveStartDate))
                  return alert("Start Date is Required.");
                if (R.isEmpty(this.state.leaveData.leaveEndDate))
                  return alert("End Date is Required.");
                if (
                  !R.isEmpty(this.state.leaveData.leaveStartDate) &&
                  !R.isEmpty(this.state.leaveData.leaveEndDate) &&
                  this.state.leaveData.leaveEndDate <
                  this.state.leaveData.leaveStartDate
                )
                  return alert("End Date Should be Greater Than Start Date.");
                if (this.props.type === "create") {
                  let typeSave = this.state.typeSave;
                  switch (typeSave) {
                    case "final":
                      this.props.onClickProcess(this.state.payload);
                      break;
                    default:
                      let payload1 = this.state.leaveData;
                      payload1 = {
                        ...payload1,
                        leaveID: payload1.leaveID + "L-" + M(),
                        leaveType: payload1.leaveType.bizparKey,
                        leaveStartDate: !R.isEmpty(payload1.leaveStartDate)
                          ? M(payload1.leaveStartDate, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )
                          : "",
                        leaveEndDate: !R.isEmpty(payload1.leaveEndDate)
                          ? M(payload1.leaveEndDate, "YYYY-MM-DD").format(
                            "DD-MM-YYYY"
                          )
                          : "",
                        employeeID: this.state.auth.user.employeeID,
                        createdBy: this.state.auth.user.employeeID,
                      };
                      this.props.onClickSave(payload1);
                      break;
                  }
                }
              }}
            >
              <div className="border-bottom padding-15px">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Leave Type <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select leave type --"
                    onChange={dt =>
                      this.setState({
                        leaveData: {
                          ...this.state.leaveData,
                          leaveType: {
                            ...this.state.leaveData.leaveType,
                            bizparKey: dt
                          }
                        }
                      })
                    }
                    type="bizpar"
                    disabled={this.props.type === "edit"}
                    data={this.props.bizparLeaveType}
                    value={this.state.leaveData.leaveType.bizparKey}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Start Date <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={this.props.type === "view" ? true : false}
                    date={this.state.leaveData.leaveStartDate}
                    onChange={e => {
                      this.handleSelectDateStart(e);
                    }}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        End Date <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={this.props.type === "view" ? true : false}
                    date={this.state.leaveData.leaveEndDate}
                    onChange={e => {
                      this.handleSelectDateEnd(e);
                    }}
                  />
                </div>

                <div className="margin-bottom-5px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Reason <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <textarea
                    style={{ marginRight: 10 }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={
                      this.state.leaveData && this.state.leaveData.leaveReason
                    }
                    required
                    onChange={e =>
                      this.setState({
                        leaveData: {
                          ...this.state.leaveData,
                          leaveReason: e.target.value
                        }
                      })
                    }
                    rows={4}
                  />
                </div>
              </div>

              <div className="padding-15px">
                <div className="grid">
                  <div className="col-2 content-right">
                    {this.props.type !== "view" ? (
                      <Button
                        state={this.props.sendState}
                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '250px' }}
                        className="btn btn-blue"
                        type="submit"
                      >
                        <span>SAVE</span>
                      </Button>
                    ) : null}
                    {this.props.type === "edit" ? (
                      <button
                        style={{ marginLeft: "5px" }}
                        className="btn btn-blue"
                        type="submit"
                        onClick={() => {
                          let payload = this.state.leaveData;
                          payload = {
                            taskID: "",
                            senderUserID: this.state.auth.user.userID,
                            senderEmpID: this.state.auth.user.employeeID,
                            senderNotes: "",
                            senderBPMStatus: "INITIATE",
                            data: {
                              leaveID:
                                payload.leaveID === ""
                                  ? payload.leaveID + "L-" + M()
                                  : payload.leaveID,
                              leaveStartDate:
                                payload.leaveStartDate !== "Invalid date"
                                  ? M(
                                    payload.leaveStartDate,
                                    "YYYY-MM-DD"
                                  ).format("DD-MM-YYYY")
                                  : "",
                              leaveEndDate:
                                payload.leaveEndDate !== "Invalid date"
                                  ? M(payload.leaveEndDate, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                  : "",
                              leaveDocumentURL: payload.leaveDocumentURL
                                ? payload.leaveDocumentURL
                                : "",
                              leaveAddress: payload.leaveAddress
                                ? payload.leaveAddress
                                : "",
                              leaveReason: payload.leaveReason,
                              leaveType: payload.leaveType.bizparKey,
                              leaveCategory:
                                payload.leaveCategory &&
                                  payload.leaveCategory.bizparKey !== null
                                  ? payload.leaveCategory.bizparKey
                                  : "",
                              employeeID:
                                payload.employee === undefined
                                  ? this.state.auth.user.employeeID
                                  : payload.employee.employeeID,
                              updatedBy:
                                this.props.type === "edit" ? "SYSTEM" : "",
                              updatedDate:
                                this.props.type === "edit"
                                  ? M().format("DD-MM-YYYY HH:mm:ss")
                                  : "",
                              createdBy:
                                this.props.type === "edit"
                                  ? payload.leaveCreationalDTO.createdBy
                                  : this.state.auth.user.employeeID,
                              createdDate:
                                this.props.type === "edit"
                                  ? payload.leaveCreationalDTO.createdDate
                                  : M().format("DD-MM-YYYY HH:mm:ss"),
                              leaveStatus: payload.leaveStatus,
                              subtitutePersonID:
                                payload.subtitutePerson &&
                                  payload.subtitutePerson.employeeID !== null
                                  ? payload.subtitutePerson.employeeID
                                  : "",
                              leaveNotes: payload.leaveNotes
                                ? payload.leaveNotes
                                : ""
                            }
                          };
                          this.setState({
                            typeSave: "final",
                            payload
                          });
                        }}
                      >
                        <span>SAVE & SUBMIT</span>
                      </button>
                    ) : null}
                    <button
                      style={{ marginLeft: "5px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.props.onClickClose}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(FormLeaveEss);
