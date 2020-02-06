import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import M from "moment";
import API from "../../Services/Api";
import { connect } from "react-redux";
import TimePicker from "../../modules/popup/Time";
import PopUp from "../../components/pages/PopUpAlert";
import FileViewer from "react-file-viewer";
import DropDown from "../../modules/popup/DropDown";
import * as R from "ramda";
import LoadingBar from "react-top-loading-bar";
import ReactTooltip from "react-tooltip";
import UploadFile from "../upload/upload";
import Stomp from 'stompjs'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

const defaultPayload = {
  overtimeID: "",
  overtimeDate: M().format("DD-MM-YYYY"),
  overtimeStartDate: "",
  overtimeEndDate: "",
  overtimeNotes: "",
  overtimeStatus: "INITIATE",
  employeeID: "",
  overtimeDocumentURL: "",
  overtimeTaskDescription: "",
  overtimeType: "",
  createdBy: "",
  createdDate: "",
  updatedBy: "",
  updatedDate: "",
  recordID: "",
};

class FormOvertime extends Component {
  constructor(props) {
    super(props);
    let { bizparOvertimeType } = this.props;
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
      auth: props.auth,
      message: "",
      notifVisible: false,
      result: "",
      percentage: 0,
      uploadStatus: 'idle',
      isWeb: false,
      payloadOvertime: props.data
        ? {
          ...props.data,
          overtimeDate: M(props.data.overtimeDate, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          overtimeStartDate: M(
            props.data.overtimeStartDate,
            "DD-MM-YYYY HH:mm:ss"
          ).format("HH:mm"),
          overtimeEndDate: M(
            props.data.overtimeEndDate,
            "DD-MM-YYYY HH:mm:ss"
          ).format("HH:mm")
        }
        : {
          ...defaultPayload,
          overtimeID: "OV-" + M(),
          overtimeStartDate: M().format("HH:mm"),
          overtimeEndDate: M().format("HH:mm"),
          createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
          overtimeDocumentURL:
            this.props.type === "edit"
              ? this.state.payloadOvertime.overtimeDocumentURL
              : ""
        },

      dataTableDocument: [],
      bizparOvertimeType,
    };
  }

  componentDidMount() {
    this.getDocument(this.state.payloadOvertime);
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/overtime/post.overtime.document/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ message: res.messages, notifVisible: true })
        setTimeout(() => {
          this.setState({
            notifVisible: false
          })
        }, 2000);
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  getDocument(payloadOvertime) {
    let documents = [];
    documents.push([payloadOvertime.overtimeDocumentURL.split("document/overtime_doc/")]);
    this.setState({
      documents,
      result: null
    });
  }

  handleFile(event) {
    let { payloadOvertime } = this.state;
    var url = event;
    var number = payloadOvertime.overtimeID;

    const formData = new FormData();
    formData.append("overtimeID", number);
    formData.append("file", url);
    formData.append("updatedBy", this.state.auth.user.employeeID)
    formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

    this.setState({ formData, url });
  }

  async uploadDocument(formData) {
    if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
      this.setState({ uploadStatus: "upload" });
      if (
        this.state.url.type === "application/pdf" ||
        this.state.url.type === "image/jpeg" ||
        this.state.url.type === "image/png"
      ) {
        this.connectWebsocket()
        let response = await API.create("TIME").uploadOvertimeDoc(formData, {
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
                  payloadOvertime: {
                    ...this.props.data,
                    // overtimeDocumentURL: 'document/overtime_doc/' + this.state.url.name
                  },
                  result: "success",
                  isWeb: !this.state.isWeb
                }, () => this.state.isWeb === true ? this.uploadDocument(this.state.formData) : this.setState({ isWeb: false }));
                this.props.getData()
                this.getDocument(this.state.payloadOvertime);
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

  deleteDocument() {
    let documents = [];
    documents = [];
    this.setState({
      documents,
      payloadOvertime: {
        ...this.state.payloadOvertime,
        overtimeDocumentURL: ""
      }
    });
    this.openDeletePopup();
  }

  async getReport() {
    let { payloadOvertime } = this.state;
    let overtimeID = payloadOvertime.overtimeID;
    let length = payloadOvertime.overtimeDocumentURL.split(".").length;
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "tmcmd/api/overtime.document.get/" + overtimeID,
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
        fileType: payloadOvertime.overtimeDocumentURL.split(".")[length - 1],
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
    if (this.props.type !== "create" && this.props.data !== undefined) {
      if (this.props.data !== prevProps.data) {
        this.setState({
          payloadOvertime: this.props.data,
          sendState: "",
          payloadOvertime: {
            ...this.state.payloadOvertime,
            overtimeDate: M(this.props.data.overtimeDate, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            overtimeStartDate:
              this.props.data.overtimeStartDate === "Invalid date"
                ? ""
                : M(
                  this.props.data.overtimeStartDate,
                  "DD-MM-YYYY HH:mm:ss"
                ).format("HH:mm"),
            overtimeEndDate:
              this.props.data.overtimeEndDate === "Invalid date"
                ? ""
                : M(
                  this.props.data.overtimeEndDate,
                  "DD-MM-YYYY HH:mm:ss"
                ).format("HH:mm"),
            overtimeNotes: this.props.data.overtimeNotes,
            overtimeType: this.props.data.overtimeType,
            overtimeDocumentURL: this.props.data.overtimeDocumentURL
          }
        });
        this.getDocument(this.props.data);
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

  renderEditOvertime() {
    let { payloadOvertime, formReportVisible } = this.state;
    let currentDate =
      this.props.type === "create"
        ? M(payloadOvertime.overtimeDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : M(payloadOvertime.overtimeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    let { dataEmp, dataHead } = this.props;
    return (
      <div className="a-s-p-place active">
        {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />)}
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-clock"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Overtime - {this.props.type === "edit" ? "Edit" : "View"} Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.closeSlide}
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
            if (R.isEmpty(this.state.payloadOvertime.overtimeType.bizparKey)) {
              return alert("Overtime Type is Required.")
            }
            if (R.isEmpty(this.state.payloadOvertime.overtimeType))
              return alert("Overtime Type is Required.");
            if (
              !R.isEmpty(this.state.payloadOvertime.overtimeStartDate) &&
              !R.isEmpty(this.state.payloadOvertime.overtimeEndDate) &&
              this.state.payloadOvertime.overtimeEndDate <
              this.state.payloadOvertime.overtimeStartDate
            )
              return alert("End Time Should be Greater Than Start Time.");
            let typeSave = this.state.typeSave;
            switch (typeSave) {
              case "final":
                this.props.onClickSubmit(this.state.payloadOvertime);
                break;
              default:
                this.props.onClickSave(this.state.payloadOvertime);
                break;
            }
          }}
        >
          <div className="a-s-p-mid a-s-p-pad border-top">
            <div className="display-flex-normals margin-bottom-10px">
              <div className="padding-top-15px padding-bottom-15px border-bottom">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Current Date</h4>
                    </div>
                  </div>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    type="date"
                    readOnly
                    placeholder=""
                    value={currentDate}
                  ></input>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Employee Name</h4>
                    </div>
                  </div>
                  <input
                    style={{
                      backgroundColor: "#E6E6E6",
                      marginRight: 10
                    }}
                    className="txt txt-sekunder-color"
                    type="text"
                    readOnly
                    placeholder=""
                    value={this.state.auth.user.employeeName}
                  ></input>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>NIK</h4>
                    </div>
                  </div>
                  <input
                    style={{
                      backgroundColor: "#E6E6E6"
                    }}
                    className="txt txt-sekunder-color"
                    type="text"
                    readOnly
                    placeholder=""
                    value={dataEmp.employeeNIP}
                  ></input>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Head Employee Name <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    type="text"
                    disabled={this.props.type === "view" ? true : false}
                    readOnly
                    placeholder=""
                    value={dataHead ? dataHead.employeeName : ""}
                  ></input>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Overtime Type <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select overtime type --"
                    onChange={dt =>
                      this.setState({
                        payloadOvertime: {
                          ...payloadOvertime,
                          overtimeType: {
                            ...payloadOvertime.overtimeType,
                            bizparKey: dt
                          }
                        }
                      })
                    }
                    type="bizpar"
                    bizValue={payloadOvertime.overtimeType ? payloadOvertime.overtimeType.corporateOvertimeName : ''}
                    disabled={this.props.type !== "create"}
                    data={this.props.bizparOvertimeType}
                    value={
                      payloadOvertime.overtimeType === null
                        ? ""
                        : payloadOvertime.overtimeType.corporateOvertimeID
                    }
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Start Time <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <TimePicker
                    time={payloadOvertime.overtimeStartDate}
                    onChange={e => {
                      this.setState({
                        payloadOvertime: {
                          ...this.state.payloadOvertime,
                          overtimeStartDate: e
                        }
                      });
                    }}
                    disabled={this.props.type === "view" ? true : false}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        End Time <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <TimePicker
                    time={payloadOvertime.overtimeEndDate}
                    onChange={e => {
                      this.setState({
                        payloadOvertime: {
                          ...this.state.payloadOvertime,
                          overtimeEndDate: e
                        }
                      });
                    }}
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Reason <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="txt txt-sekunder-color"
                      style={
                        this.props.type === "view"
                          ? {
                            backgroundColor: "#E6E6E6"
                          }
                          : null
                      }
                      rows={5}
                      readOnly={this.props.type === "view" ? true : false}
                      placeholder=""
                      required
                      value={payloadOvertime.overtimeNotes}
                      onChange={e => {
                        this.setState({
                          payloadOvertime: {
                            ...this.state.payloadOvertime,
                            overtimeNotes: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                </div>

                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px margin-top-20px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={
                          this.state.payloadOvertime.overtimeDocumentURL ===
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
                <div className="content-right">
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
                        this.setState({
                          typeSave: "final"
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
                  onClick={() => this.openSavePopUp}
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
        </form>
        <ReactTooltip />
      </div>
    );
  }

  render() {
    let { payloadOvertime, formReportVisible } = this.state;
    let currentDate =
      this.props.type === "create"
        ? M(payloadOvertime.overtimeDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : M(payloadOvertime.overtimeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    let { dataEmp, dataHead } = this.props;
    return this.props.type !== "create" ? (
      this.renderEditOvertime()
    ) : (
        <div className="app-popup app-popup-show">
          <div className="padding-top-20px" />
          <div
            className="popup-content-small background-white border-radius"
            style={{ marginBottom: 10 }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  {this.props.type === "create"
                    ? "Overtime - Create Form"
                    : this.props.type === "edit"
                      ? "Overtime - Edit Form"
                      : "Overtime - View Form"}
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
                if (R.isEmpty(this.state.payloadOvertime.overtimeType))
                  return alert("Overtime Type is Required.");
                if (
                  !R.isEmpty(this.state.payloadOvertime.overtimeStartDate) &&
                  !R.isEmpty(this.state.payloadOvertime.overtimeEndDate) &&
                  this.state.payloadOvertime.overtimeEndDate <
                  this.state.payloadOvertime.overtimeStartDate
                )
                  return alert("End Time Should be Greater Than Start Time.");
                let typeSave = this.state.typeSave;
                switch (typeSave) {
                  case "final":
                    this.props.onClickSubmit(this.state.payloadOvertime);
                    break;
                  default:
                    this.props.onClickSave(this.state.payloadOvertime);
                    break;
                }
              }}
            >
              <div className="padding-15px border-bottom">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Current Date</h4>
                    </div>
                  </div>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    type="date"
                    readOnly
                    placeholder=""
                    value={currentDate}
                  ></input>
                </div>

                <div>
                  <div className="grid grid-2x grid-mobile-none gap-15px margin-bottom-20px">
                    <div className="column-1">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Employee Name</h4>
                        </div>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6",
                          marginRight: 10
                        }}
                        className="txt txt-sekunder-color"
                        type="text"
                        readOnly
                        placeholder=""
                        value={this.state.auth.user.employeeName}
                      ></input>
                    </div>
                    <div className="column-2">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>NIK</h4>
                        </div>
                      </div>
                      <input
                        style={{
                          backgroundColor: "#E6E6E6"
                        }}
                        className="txt txt-sekunder-color"
                        type="text"
                        readOnly
                        placeholder=""
                        value={dataEmp.employeeNIP}
                      ></input>
                    </div>
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Head Employee Name <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      type="text"
                      disabled={this.props.type === "view" ? true : false}
                      readOnly
                      placeholder=""
                      value={dataHead ? dataHead.employeeName : ""}
                    ></input>
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Overtime Type <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select overtime type --"
                      onChange={dt =>
                        this.setState({
                          payloadOvertime: {
                            ...payloadOvertime,
                            overtimeType: {
                              ...payloadOvertime.overtimeType,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      type="bizpar"
                      disabled={this.props.type !== "create"}
                      data={this.props.bizparOvertimeType}
                      value={
                        payloadOvertime.overtimeType === null
                          ? ""
                          : payloadOvertime.overtimeType.corporateOvertimeID
                      }
                    />
                  </div>

                  <div>
                    <div className="grid grid-2x grid-mobile-none gap-15px margin-bottom-20px">
                      <div className="column-1">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Start Time <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <TimePicker
                          time={payloadOvertime.overtimeStartDate}
                          onChange={e => {
                            this.setState({
                              payloadOvertime: {
                                ...this.state.payloadOvertime,
                                overtimeStartDate: e
                              }
                            });
                          }}
                          disabled={this.props.type === "view" ? true : false}
                        />
                      </div>
                      <div className="column-2">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              End Time <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <TimePicker
                          time={payloadOvertime.overtimeEndDate}
                          onChange={e => {
                            this.setState({
                              payloadOvertime: {
                                ...this.state.payloadOvertime,
                                overtimeEndDate: e
                              }
                            });
                          }}
                          disabled={this.props.type === "view" ? true : false}
                          style={
                            this.props.type === "view"
                              ? { backgroundColor: "#E6E6E6" }
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="margin-bottom-5px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Reason <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <div>
                        <textarea
                          className="txt txt-sekunder-color"
                          style={
                            this.props.type === "view"
                              ? {
                                backgroundColor: "#E6E6E6"
                              }
                              : null
                          }
                          rows={5}
                          readOnly={this.props.type === "view" ? true : false}
                          placeholder=""
                          required
                          value={payloadOvertime.overtimeNotes}
                          onChange={e => {
                            this.setState({
                              payloadOvertime: {
                                ...this.state.payloadOvertime,
                                overtimeNotes: e.target.value
                              }
                            });
                          }}
                        />
                      </div>
                    </div>

                    {this.props.type !== "create" ? (
                      <div className="margin-bottom-20px margin-top-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            data={
                              this.state.payloadOvertime.overtimeDocumentURL ===
                                ""
                                ? this.dataDocument
                                : this.state.dataTableDocument
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
                </div>
              </div>

              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
                    {this.props.type !== "view" ? (
                      <Button
                        state={this.props.sendState}
                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '150px' }}
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
                          this.setState({
                            typeSave: "final"
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
                      onClick={this.props.onClickClose}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>



            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={() => this.openSavePopUp}
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
          <div className="padding-bottom-20px" />
        </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(FormOvertime);
