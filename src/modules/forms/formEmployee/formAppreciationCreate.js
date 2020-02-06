import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import M from "moment";
import API from "../../../Services/Api";
import * as R from "ramda";
import DropDown from "../../../modules/popup/DropDown";
import FileViewer from "react-file-viewer";
import CalendarPicker from "../../../modules/popup/Calendar";
import { connect } from 'react-redux';
// import { FilePond, registerPlugin } from 'react-filepond'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import UploadFile from '../../upload/upload'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

// registerPlugin(FilePondPluginImagePreview)

const defaultPayload = {
  employeeAppreciationID: "",
  appreciationName: "",
  appreciationNotes: "",
  appreciationDate: "",
  appreciationDocumentURL: "",
  appreciationType: "",
  message:'',
  notifVisible:false
};

class FormAppreciationCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appreciationData: this.props.appreciationData
        ? {
          ...this.props.appreciationData,
          appreciationDate: R.isEmpty(
            this.props.appreciationData.appreciationDate
          )
            ? ""
            : M(
              this.props.appreciationData.appreciationDate,
              "DD-MM-YYYY"
            ).format("YYYY-MM-DD")
        }
        : {
          ...defaultPayload,
          employeeAppreciationID: "EMA" + M()
        },
      savePopUpVisible: false,
      deletePopup: false,
      formDocVisible: false,
      docUrl: "",
      fileType: "",
      documents: []
    };
  }

  componentDidUpdate(nextState) {
    if (this.state.result !== nextState.result) {
      this.setState({ result: nextState.result })
    }
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/post.employee.appreciation.document/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ notifVisible: true, message: res.messages})
        setTimeout(() => {
          this.setState({
            notifVisible:false
          })
        }, 2000);
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  async uploadDocument(formData) {
    this.setState({ uploadStatus: 'upload'})
    this.connectWebsocket()
    if (this.state.url && this.state.url.type !== 'application/pdf') return alert('Format file must be pdf.')
    let response = await API.create("EMPLOYEE").uploadDocumentAppreciation(formData, {
      onUploadProgress: (progress) => {
        if (progress.lengthComputable) {
          if (progress.total >= 1000000) {
            this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
          } else {
            // console.log("out")
            var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
            this.setState({ percentage: percentCompleted })
            if (progress.loaded === progress.total) {
              this.setState({ result: 'success' })
            }
          }
        }
      }
    });
    if (!response.ok && response.status === 413) {
      alert("Your Document Too Large, Please Select Another Document")
      this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
    }
    if (!response.ok && response.status === 500) {
      alert("Please Select Document")
      this.setState({ result: 'error', uploadStatus: 'idle' })
    }
    if (!response.ok && R.isNil(response.status)) {
      alert(response.problem)
      this.setState({ result: 'error', uploadStatus: 'idle' })
    }

    console.log("upload", response.data);

    switch (response.data.status) {
      case "S":
        if (response.data.code === "201") {
          if (this.props.type === 'create') {
            let documents = []
            documents.push([this.state.url.name])
            this.setState({ documents, documentURL: this.state.url.name })
          }
          this.setState({
            // appreciationData: {
            // ...this.state.appreciationData,
            //   appreciationDocumentURL: "document/emp_doc/app/" + this.state.url.name
            // appreciationDocumentURL: this.state.url.name
            // },
            result: 'success'
          });
          // this.openSavePopUp();
          this.getDocument();
        } else alert("Failed: ", response.data.message);
        break;
      default:
        break;
    }
  }

  handleSelectDate = date => {
    this.setState({
      appreciationData: {
        ...this.state.appreciationData,
        appreciationDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  handleChange(event) {
    let { appreciationData } = this.state;
    var url = event;
    var ID = this.props.employeeID;
    var appreciationType = appreciationData.appreciationType.bizparKey;
    var employeeAppreciationID = appreciationData.employeeAppreciationID;
    var appreciationNotes = appreciationData.appreciationNotes;
    var appreciationName = appreciationData.appreciationName;
    var appreciationDate = M(appreciationData.appreciationDate).format("DD-MM-YYYY");

    const formData = new FormData();
    formData.append("file", url);
    formData.append("employeeID", ID);
    formData.append("appreciationType", appreciationType);
    formData.append("employeeAppreciationID", employeeAppreciationID);
    formData.append("appreciationNotes", appreciationNotes);
    formData.append("appreciationName", appreciationName);
    formData.append("appreciationDate", appreciationDate);
    formData.append("updatedBy", this.props.auth.user.employeeID);
    formData.append("updatedDate",M().format("DD-MM-YYYY HH:mm:ss"))
    this.setState({ formData, url });
  }

  openDeletePopup() {
    this.setState({ deletePopup: !this.state.deletePopup });
  }

  openDocument() {
    this.setState({ formDocVisible: !this.state.formDocVisible });
  }

  openSavePopUp() {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      result: null
    });
  }

  componentDidMount() {
    this.getDocument();
  }

  async getDocumentView() {
    let { appreciationData } = this.state;
    let length = appreciationData.appreciationDocumentURL.split(".").length;
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "emcmd/api/appreciation.document.get/" +
      this.props.employeeID +
      "/" +
      appreciationData.appreciationType.bizparKey,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        }
      }
    );
    response = await response.blob();
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        docUrl: response,
        fileType: appreciationData.appreciationDocumentURL.split(".")[
          length - 1
        ],
        formDocVisible: !this.state.formDocVisible
      });
    } else {
      alert("Failed: Document Not Found");
    }
  }

  async getDocument() {
    let payload = {
      "employeeID": this.props.employeeID
    }
    let { appreciationData } = this.state;
    let documents = []
    let documentURL = ''
    let response = await API.create('EMPLOYEE_QUERY').getEmployeeById(payload)
    if (response.ok && response.data.status === 'S') {
      let index = R.findIndex(R.propEq('employeeAppreciationID', appreciationData.employeeAppreciationID))(response.data.data.employeeAppreciations)
      if (index >= 0) {
        documentURL = response.data.data.employeeAppreciations[index] && R.isNil(response.data.data.employeeAppreciations[index].appreciationDocumentURL) ? null : response.data.data.employeeAppreciations[index].appreciationDocumentURL.split("document/emp_doc/app/EMP_APP_DOC_" + this.props.employeeID + "_" + this.state.appreciationData.appreciationType.bizparKey + '_')[1]
        documents.push([response.data.data.employeeAppreciations[index] && R.isNil(response.data.data.employeeAppreciations[index].appreciationDocumentURL) ? null : response.data.data.employeeAppreciations[index].appreciationDocumentURL.split("document/emp_doc/app/")]);
        this.setState({
          documents, documentURL,
          appreciationData: {
            ...this.state.appreciationData,
            appreciationDocumentURL: response.data.data.employeeAppreciations[index].appreciationDocumentURL
          }
        })
      } else this.setState({ documents, documentURL })
      // console.log(response.data.data.employeeAppreciations.appreciationDocumentURL)
    }
    // this.getDataByID()
    // let { appreciationData } = this.state;
    // let documents = [];
    // documents.push([appreciationData && appreciationData.appreciationDocumentURL.split("document/emp_doc/app/")]);
    // this.setState({
    //   documents
    // });
  }

  deleteDocument() {
    let documents = [];
    documents = [];
    this.setState({
      documents,
      appreciationData: {
        ...this.state.appreciationData,
        appreciationDocumentURL: ""
      }
    });
    this.openDeletePopup();
  }

  columns = [
    "Document",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="margin-right">
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.getDocumentView()}
              >
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openDeletePopup()}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
              ) : null}
            </div>
          );
        }
      }
    }
  ];

  data = [];

  renderDocument = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Document Viewer
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.openDocument.bind(this)}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {this.state.fileType === "jpg" ||
              this.state.fileType === "png" ||
              this.state.fileType === "jpeg" ? (
                <img src={this.state.docUrl} width={"50%"} alt='' />
              ) : (
                <FileViewer
                  fileType={this.state.fileType}
                  filePath={this.state.docUrl}
                />
              )}
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openDocument.bind(this)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-20px"></div>
      </div>
    );
  };

  render() {
    let {
      appreciationName,
      appreciationNotes,
      appreciationDate,
      appreciationDocumentURL,
      appreciationType
    } = this.state.appreciationData;
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Employee Detail - Appreciation - Create Form"
                  : this.props.type === "edit"
                    ? "Employee Detail - Appreciation - Edit Form"
                    : "Employee Detail - Aprreciation - View Form"}
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
              if (
                R.isEmpty(this.state.appreciationData.appreciationType) ||
                R.isEmpty(
                  this.state.appreciationData.appreciationType.bizparKey
                )
              ) {
                return alert("Appreciation Type is Required.");
              }
              if (R.isEmpty(this.state.appreciationData.appreciationDate))
                return alert("Period is Required.");
              if (this.state.url && this.state.url !== undefined) {
                if (this.state.url.name !== this.state.documentURL) return alert('Please Upload Document.')
              } else {
                if (R.isEmpty(this.state.appreciationData.appreciationDocumentURL)) return alert('Please Upload Document.')
              }

              this.props.onClickSave(this.state.appreciationData);
            }}
          >
            <div className="border-bottom padding-15px">
              <div className="grid grid-2x grid-mobile-none gap-20px">
                <div className="col-1">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Period <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={appreciationDate}
                      onChange={e => {
                        this.handleSelectDate(e);
                      }}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Appreciation Name <span style={{ color: "red" }}>*</span></h4>
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
                      value={appreciationName}
                      onChange={e =>
                        this.setState({
                          appreciationData: {
                            ...this.state.appreciationData,
                            appreciationName: e.target.value
                          }
                        })
                      }
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Appreciation Type <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select appreciation type --"
                      onChange={e =>
                        this.setState({
                          appreciationData: {
                            ...this.state.appreciationData,
                            appreciationType: {
                              ...this.state.appreciationData.appreciationType,
                              bizparKey: e
                            }
                          }
                        })
                      }
                      type="bizpar"
                      disabled={this.props.type !== "create" ? true : false}
                      data={this.props.bizparAppreciationType}
                      value={appreciationType.bizparKey}
                    />
                  </div>

                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Information</h4>
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
                      value={appreciationNotes}
                      onChange={e =>
                        this.setState({
                          appreciationData: {
                            ...this.state.appreciationData,
                            appreciationNotes: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-2">
                  <div className="margin-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        title={"Document"}
                        data={
                          appreciationDocumentURL === "" || appreciationDocumentURL == null
                            ? this.data
                            : this.state.documents
                        }
                        columns={this.columns}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>

                  {this.props.type !== "view" ? (
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>File <span style={{ color: "red" }}>format file (pdf)</span></h4>
                        </div>
                      </div>
                      <UploadFile
                        type={this.state.uploadStatus}
                        percentage={this.state.percentage}
                        result={this.state.result}
                        acceptedFiles={['pdf']}
                        onHandle={(dt) => {
                          this.handleChange(dt)
                          this.setState({ uploadStatus: 'idle', percentage: '0' })
                        }}
                        onUpload={() => {
                          this.uploadDocument(this.state.formData)
                        }} />
                      {/* 
                      <FilePond
                        allowMultiple={false}
                        onupdatefiles={
                          fileItems => {
                            let file = fileItems.map(fileItem => fileItem.file)
                            this.handleChange(file[0])
                            if (file[0]) {
                              this.setState({
                                buttonVisible: true
                              })
                            } else {
                              this.setState({
                                buttonVisible: false
                              })
                            }
                          }
                        }
                        onremovefile={
                          () => {
                            this.setState({
                              buttonVisible: false
                            })
                          }
                        } />
                      {this.state.buttonVisible
                        ? <button
                          type="button"
                          className="btn btn-blue btn-width-all margin-top-5px"
                          onClick={() => this.uploadDocument(this.state.formData)}>
                          Upload File
                     </button>
                        : null} */}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="margin-15px">
                <div className="grid grid-2x">
                  <div className="col-1"></div>
                  <div className="col-2 content-right">
                    {this.props.type !== "view" ? (
                      <Button
                          state={this.props.sendState}
                          style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '370px' }}
                          className="btn btn-blue"
                          type='submit'
                        >
                      <span>SAVE</span>
                      </Button>
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
            </div>
          </form>
        </div>

        {this.state.formDocVisible ? this.renderDocument() : null}

        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}/>
        )}

        {this.state.deletePopup && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={this.deleteDocument.bind(this)}
          />
        )}

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp.bind(this)}
          />
        )}

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

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormAppreciationCreate);
