import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import M from "moment";
import API from "../../Services/Api";
import PopUp from "../../components/pages/PopUpAlert";
import * as R from "ramda";
import FileViewer from "react-file-viewer";
import CalendarPicker from "../../modules/popup/Calendar";
import ReactTooltip from "react-tooltip";
import LoadingBar from "react-top-loading-bar";
import UploadFile from "../upload/upload";
import Stomp from 'stompjs'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import { connect } from "react-redux";
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

const defaultPayloadSppd = {
  sppdID: "",
  sppdStartDate: "",
  sppdEndDate: "",
  sppdDeparturePlace: "",
  sppdDestinationPlace: "",
  sppdReason: "",
  sppdStatus: "INITIATE",
  employeeID: "",
  sppdNotes: "",
  sppdDocumentURL: "",
  sppdRequestBy: "",
  sppdTripType: "",
  sppdType: "",
  sppdCategory: "",
  sppdCurrency: "",
  sppdFacilities: [],
  createdBy: "SYSTEM",
  createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
  updatedBy: "",
  updatedDate: "",
  recordID: "",
};

class travelExDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletePopUpVisible: false,
      savePopUpVisible: false,
      formReportVisible: false,
      buttonVisible: false,
      payloadSppd: props.data
        ? props.data
        : {
          ...defaultPayloadSppd,
          sppdID: "SPPD-" + M()
        },
      file: "",
      reportURL: "",
      fileType: "",
      typeSave: "",
      head: props.head,

      uploadStatus: "idle",
      result: "",
      files: [],
      percentage: "0",
      message: "",
      notifVisible: false,
      isWeb: false,
    };
  }

  componentDidMount() {
    this.getDocument(this.state.payloadSppd);
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/sppd/post.sppd.document/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ message: res.messages, notifVisible: true, isWeb: true })
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

  getDocument(payloadSppd) {
    let documents = [];
    documents.push([payloadSppd.sppdDocumentURL.split("document/sppd_doc/")]);
    this.setState({
      documents
    });
  }

  handleFile(event) {
    let { payloadSppd } = this.state;
    var url = event;
    var number = payloadSppd.sppdID;

    const formData = new FormData();
    formData.append("sppdID", number);
    formData.append("file", url);
    formData.append("updatedBy", this.props.auth.user.employeeID)
    formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

    this.setState({ formData, url });
  }

  async uploadDocument(formData) {
    console.log(this.state.isWeb)
    this.connectWebsocket()
    if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
      this.setState({ uploadStatus: "upload" });
      if (this.state.url.type === "application/pdf") {
        let response = await API.create("TIME").uploadSppdDoc(formData, {
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
                  result: "success",
                  isWeb: !this.state.isWeb
                }, () => this.state.isWeb === true ? this.uploadDocument(formData) : this.setState({ isWeb: !this.state.isWeb }));
                this.props.getData()
                this.getDocument(this.props.data);
              } else alert("Failed: " + response.data.message);
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
      payloadSppd: {
        ...this.state.payloadSppd,
        sppdDocumentURL: ""
      }
    });
    this.openDeletePopup();
  }

  async getReport() {
    let { payloadSppd } = this.state;
    let sppdID = payloadSppd.sppdID;
    let length = payloadSppd.sppdDocumentURL.split(".").length;
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "tmcmd/api/sppd.document.get/" + sppdID,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
          "Content-Type": "application/pdf"
        }
      }
    );
    console.log(response)
    console.log(JSON.stringify(payloadSppd.sppdDocumentURL))
    response = await response.blob();
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        reportURL: response,
        fileType: payloadSppd.sppdDocumentURL.split(".")[length - 1],
        formReportVisible: !this.state.formReportVisible
      });
    } else {
      alert("Failed: Document Not Found");
    }
  }

  openReport() {
    this.setState({ formReportVisible: !this.state.formReportVisible });
  }

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = selectedIndex => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  };

  handleSelectDateStart = date => {
    console.log("date start", date);
    this.setState({
      payloadSppd: {
        ...this.state.payloadSppd,
        sppdStartDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  handleSelectDateEnd = date => {
    console.log("date end", date);
    this.setState({
      payloadSppd: {
        ...this.state.payloadSppd,
        sppdEndDate: M(date).format("YYYY-MM-DD")
      }
    });
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
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.getReport()}
              >
                {val}
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
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
          payloadSppd: this.props.data,
          payloadSppd: {
            ...this.state.payloadSppd,
            sppdStartDate:
              this.props.data.sppdStartDate === "Invalid date"
                ? ""
                : M(this.props.data.sppdStartDate).format("YYYY-MM-DD"),
            sppdEndDate:
              this.props.data.sppdEndDate === "Invalid date"
                ? ""
                : M(this.props.data.sppdEndDate).format("YYYY-MM-DD"),
            sppdDocumentURL: this.props.data.sppdDocumentURL,
            sppdDestinationPlace: this.props.data.sppdDestinationPlace,
            sppdNotes: this.props.data.sppdNotes,
            sppdReason: this.props.data.sppdReason,
            sppdRequestBy: this.props.data.sppdRequestBy
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
            <FileViewer
              fileType={this.state.fileType}
              filePath={this.state.reportURL}
            />
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

  renderEditBiztrip = () => {
    let { payloadSppd, formReportVisible } = this.state;
    return (
      <div className="a-s-p-place active">
        {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />)}
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fa fa-1x fa-luggage-cart"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Business Trip - {this.props.type === "edit" ? "Edit" : "View"}{" "}
                  Form
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
            if (R.isEmpty(payloadSppd.sppdStartDate))
              return alert("Start Date is Required.");
            if (R.isEmpty(payloadSppd.sppdEndDate))
              return alert("End Date is Required.");
            if (
              !R.isEmpty(this.state.payloadSppd.sppdStartDate) &&
              !R.isEmpty(this.state.payloadSppd.sppdEndDate) &&
              this.state.payloadSppd.sppdEndDate <
              this.state.payloadSppd.sppdStartDate
            )
              return alert("End Date Should be Greater Than Start Date.");
            let typeSave = this.state.typeSave;
            switch (typeSave) {
              case "final":
                this.props.onClickProcess(this.state.payloadSppd);
                break;
              default:
                this.props.onClickSave(this.state.payloadSppd);
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
                      <h4>
                        Head Employee Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    className="txt txt-sekunder-color"
                    type="text"
                    readOnly
                    placeholder=""
                    value={
                      this.state.payloadSppd.sppdRequestBy.employeeName
                    }
                    required
                  ></input>
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
                    date={payloadSppd.sppdStartDate}
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
                    date={payloadSppd.sppdEndDate}
                    onChange={e => {
                      this.handleSelectDateEnd(e);
                    }}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Location <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={payloadSppd && payloadSppd.sppdDestinationPlace}
                    onChange={e => {
                      this.setState({
                        payloadSppd: {
                          ...this.state.payloadSppd,
                          sppdDestinationPlace: e.target.value
                        }
                      });
                    }}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Task</h4>
                    </div>
                  </div>
                  <textarea
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    value={payloadSppd && payloadSppd.sppdReason}
                    onChange={e => {
                      this.setState({
                        payloadSppd: {
                          ...this.state.payloadSppd,
                          sppdReason: e.target.value
                        }
                      });
                    }}
                    rows={5}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Note</h4>
                    </div>
                  </div>
                  <textarea
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    value={payloadSppd && payloadSppd.sppdNotes}
                    onChange={e => {
                      this.setState({
                        payloadSppd: {
                          ...this.state.payloadSppd,
                          sppdNotes: e.target.value
                        }
                      });
                    }}
                    rows={5}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={
                          this.state.payloadSppd.sppdDocumentURL === ""
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
                            (Format file: pdf)
                          </span>
                        </h4>
                      </span>
                    </div>

                    <UploadFile
                      type={this.state.uploadStatus}
                      percentage={this.state.percentage}
                      result={this.state.result}
                      acceptedFiles={["pdf"]}
                      onHandle={(dt) => {
                        this.handleFile(dt)
                        this.setState({ uploadStatus: 'idle', percentage: '0' })
                      }}
                      onUpload={() => {
                        this.uploadDocument(this.state.formData);
                      }}
                    />
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

              {formReportVisible ? this.renderReport() : null}

              {this.state.savePopUpVisible && (
                <PopUp
                  type={"save"}
                  class={"app-popup app-popup-show"}
                  onClick={this.openSavePopUp}
                />
              )}

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
  };

  render() {
    let { payloadSppd, formReportVisible, head } = this.state;
    return this.props.type !== "create" ? (
      this.renderEditBiztrip()
    ) : (
        <div className={"app-popup app-popup-show"}>
          <div className="padding-top-20px" />
          <div
            className="popup-content background-white border-radius"
            style={{ marginBottom: 10 }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">Business Trip - Create Form</div>
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
                if (R.isEmpty(payloadSppd.sppdStartDate))
                  return alert("Start Date is Required.");
                if (R.isEmpty(payloadSppd.sppdEndDate))
                  return alert("End Date is Required.");
                if (
                  !R.isEmpty(this.state.payloadSppd.sppdStartDate) &&
                  !R.isEmpty(this.state.payloadSppd.sppdEndDate) &&
                  this.state.payloadSppd.sppdEndDate <
                  this.state.payloadSppd.sppdStartDate
                )
                  return alert("End Date Should be Greater Than Start Date.");
                let typeSave = this.state.typeSave;
                switch (typeSave) {
                  case "final":
                    this.props.onClickProcess(this.state.payloadSppd);
                    break;
                  default:
                    this.props.onClickSave(this.state.payloadSppd);
                    break;
                }
              }}
            >
              <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                <div className="column-1">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Head Employee Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      style={{ backgroundColor: "#E6E6E6" }}
                      className="txt txt-sekunder-color"
                      type="text"
                      readOnly
                      placeholder=""
                      value={
                        head
                          ? head.employeeName
                          : payloadSppd.sppdRequestBy === null
                            ? ""
                            : payloadSppd.sppdRequestBy.employeeName
                      }
                      required
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
                      date={payloadSppd.sppdStartDate}
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
                      date={payloadSppd.sppdEndDate}
                      onChange={e => {
                        this.handleSelectDateEnd(e);
                      }}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Location <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      readOnly={this.props.type === "view" ? true : false}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={payloadSppd && payloadSppd.sppdDestinationPlace}
                      onChange={e => {
                        this.setState({
                          payloadSppd: {
                            ...this.state.payloadSppd,
                            sppdDestinationPlace: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="column-2">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Task</h4>
                      </div>
                    </div>
                    <textarea
                      readOnly={this.props.type === "view" ? true : false}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      value={payloadSppd && payloadSppd.sppdReason}
                      onChange={e => {
                        this.setState({
                          payloadSppd: {
                            ...this.state.payloadSppd,
                            sppdReason: e.target.value
                          }
                        });
                      }}
                      rows={5}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Note</h4>
                      </div>
                    </div>
                    <textarea
                      readOnly={this.props.type === "view" ? true : false}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      value={payloadSppd && payloadSppd.sppdNotes}
                      onChange={e => {
                        this.setState({
                          payloadSppd: {
                            ...this.state.payloadSppd,
                            sppdNotes: e.target.value
                          }
                        });
                      }}
                      rows={5}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                    />
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
                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '355px' }}
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

              {formReportVisible ? this.renderReport() : null}

              {this.state.savePopUpVisible && (
                <PopUp
                  type={"save"}
                  class={"app-popup app-popup-show"}
                  onClick={this.openSavePopUp}
                />
              )}

              {this.state.deletePopUpVisible && (
                <PopUp
                  type={"delete"}
                  class={"app-popup app-popup-show"}
                  onClickDelete={this.deleteDocument.bind(this)}
                  onClick={this.openDeletePopup.bind(this)}
                />
              )}
            </form>
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

export default connect(mapStateToProps)(travelExDetail)