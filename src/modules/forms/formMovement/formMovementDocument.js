import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import * as R from "ramda";
import API from "../../../Services/Api";
import PopUp from "../../../components/pages/PopUpAlert";
import M from "moment"
import FileViewer from 'react-file-viewer'
import { connect } from 'react-redux';
import LoadingBar from "react-top-loading-bar"
import UploadFile from '../../upload/upload'
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

let ct = require("../../custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

class FormMovementDocument extends Component {
  constructor(props) {
    super(props);
    let { movementData } = this.props;
    this.state = {
      movementData: movementData,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      savePopUpVisible: false,
      file: "",
      refreshing: false,
      fetching: false,
      fileUrl: "",
      fileType: "",
      formFileVisible: false,
      auth: props.auth,
      buttonVisible: false,
      result: '',
      percentage: '0',
      files: [],
      uploadStatus: 'idle',
      notifVisible:false,
      message:'',
    };
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.state.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/movement/post.movement.document/' + employeeID, (message) => {
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

  componentDidUpdate(prevProps) {
    if (this.props.movementData !== prevProps.movementData) {
      this.getAllDocument(this.props.movementData);
      this.getDocument(this.props.movementData)
      this.setState({
        movementData: this.props.movementData
      })
    }
  }

  componentDidMount() {
    this.getAllDocument(this.state.movementData);
    this.getDocument(this.state.movementData)
  }

  getAllDocument(movementData) {
    let dataTableDocument =
      movementData.movementDocumentURL &&
        !R.isNil(movementData.movementDocumentURL) &&
        !R.isEmpty(movementData.movementDocumentURL)
        ? [[movementData.movementDocumentURL]]
        : [];
    this.setState({ dataTableDocument });
  }

  async getFile() {
    let { movementData } = this.state
    let movementID = movementData.movementID
    let length = movementData.movementDocumentURL.split(".").length
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "mvcmd/api/movement.document.get/" + movementID, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
        "Content-Type": "application/pdf"
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        fileUrl: response,
        fileType: movementData.movementDocumentURL.split(".")[length - 1],
        formFileVisible: !this.state.formFileVisible
      });
    } else {
      alert("Failed: Document Not Found")
    }
  }

  openDeletePopup = (selectedIndex) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  };

  handleFile(event) {
    let { movementData } = this.state
    var url = event
    var number = movementData.movementID

    const formData = new FormData()
    formData.append("movementID", number)
    formData.append("file", url)
    formData.append("updatedBy",this.state.auth.user.employeeID)
    formData.append("updatedDate",M().format("DD-MM-YYYY HH:mm:ss"))

    this.setState({ formData, url })
    console.log(JSON.stringify(formData))
  }

  openSavePopUp() {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible
    })
  }

  openFileView() {
    this.setState({ formFileVisible: !this.state.formFileVisible })
  }

  getDocument(movementData) {
    let documents = []
    documents.push([
      movementData.movementDocumentURL.split("document/mv_doc/")
    ])
    this.setState({
      documents
    })
  }

  deleteDocument() {
    let documents = []
    documents = []
    this.setState({
      documents,
      deletePopUpVisible: false,
      movementData: {
        ...this.state.movementData,
        movementDocumentURL: ''
      },
    })
  }

  async uploadDocument(formData) {
    this.connectWebsocket()
    if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
      this.setState({ uploadStatus: 'upload' })
      if ((this.state.url.type === "application/pdf") || (this.state.url.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        let response = await API.create("MOVEMENT").uploadMovementDoc(formData, {
          onUploadProgress: (progress) => {
            if (progress.lengthComputable) {
              if (progress.total >= 1000000) {
                this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
              } else {
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
          this.setState({ result: 'error', percentage: '0' })
        }
        if (!response.ok && response.status === 500) {
          alert("Please Select Document")
          this.setState({ result: 'error' })
        }
        if (!response.ok && R.isNil(response.status)) {
          alert(response.problem)
          this.setState({ result: 'error' })
        }
        if (!R.isNil(response.data)) {
          switch (response.data.status) {
            case "S":
              if (response.data.code === "201") {
                this.setState({
                  // movementData: {
                  //   ...this.state.movementData,
                  //   movementDocumentURL: '/home/' + this.state.url.name
                  // },
                  result: 'success',
                })
                // this.openSavePopUp()
                this.props.getData(this.state.movementData.movementID)
              }
              else {
                alert("Failed: " + response.data.message)
                this.setState({ result: 'error' })
              }

              break
            default:
              this.setState({ result: '', percentage: '0' })
              break
          }
        }
      } else {
        alert("Unsupported File Type")
        this.setState({ result: 'error' })
      }
    }
  }

  columns = [
    "Document",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct margin-right-15px"
                onClick={() => this.getFile()}>
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  className="btnAct"
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

  data = []

  renderFile = () => {
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
                onClick={this.openFileView.bind(this)}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {
              this.state.fileType === "jpg" ||
                this.state.fileType === "png" ||
                this.state.fileType === "jpeg" ?
                (
                  <img src={this.state.fileUrl} width={"50%"} alt="" />
                ) : (
                  <FileViewer
                    fileType={this.state.fileType}
                    filePath={this.state.fileUrl} />
                )}
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openFileView.bind(this)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-20px"></div>
      </div>
    )
  }

  render() {
    return (
      <div className="vertical-tab-content active">

        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

        <form action="#" className="padding-15px">
          <div className="margin-bottom-15px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.state.movementData.movementDocumentURL === '' ? this.data : this.state.documents}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.props.type !== "view" ? (
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  <h4>File <span style={{ color: "red" }}>*format file (docx & pdf)</span></h4>
                </span>
              </div>

              <UploadFile
                percentage={this.state.percentage}
                result={this.state.result}
                acceptedFiles={['pdf', 'docx']}
                onHandle={(dt) => {
                  this.handleFile(dt)
                  this.setState({ uploadStatus: 'idle', percentage: '0' })
                }}
                onUpload={() => {
                  this.uploadDocument(this.state.formData)
                }}
                type={this.state.uploadStatus}
              />

              {this.state.buttonVisible ?
                <button
                  type="button"
                  className="btn btn-blue btn-width-all margin-top-5px"
                  onClick={() => this.uploadDocument(this.state.formData)}>
                  Upload File
              </button> : null}
            </div>
          ) : null}
          <div className="margin-bottom-15px">
            <div className="grid">
              <div className="col-2 content-right">
                {this.props.type === "edit" ? (
                   <Button
                   type='button'
                   state={this.props.sendState}
                   style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 70 }}
                   className="btn btn-blue"
                   onClick={() => {
                    let payload = this.state.movementData
                    if (R.isEmpty(payload.movementDocumentURL) || R.isNil(payload.movementDocumentURL)) return alert('Please Upload Document.')
                    payload = {
                      movementID: payload.movementID,
                      movementSPKNumber: payload.movementSPKNumber,
                      movementSPKDate: payload.movementSPKDate,
                      movementNotes: payload.movementNotes,
                      movementEffectiveDate: payload.movementEffectiveDate,
                      movementDocumentURL: payload.movementDocumentURL,
                      movementCategory: payload.movementCategory.bizparKey,
                      movementType: payload.movementType.bizparKey,
                      movementPayroll: {
                        basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                        effectiveStartDate: payload.movementEffectiveDate,
                        effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                      },
                      movementPosition: {
                        positionAfterEffectiveStartDate: !R.isNil(payload.movementPosition.positionAfterEffectiveStartDate) ? payload.movementPosition.positionAfterEffectiveStartDate : "",
                        positionAfterEffectiveEndDate: !R.isNil(payload.movementPosition.positionAfterEffectiveEndDate) ? payload.movementPosition.positionAfterEffectiveEndDate : "",
                        companyIDAfter: !R.isNil(payload.movementPosition.companyIDAfter) && !R.isNil(payload.movementPosition.companyIDAfter.esid) ? payload.movementPosition.companyIDAfter.esid : "",
                        companyIDBefore: !R.isNil(payload.movementPosition.companyIDBefore) && !R.isNil(payload.movementPosition.companyIDBefore.esid) ? payload.movementPosition.companyIDBefore.esid : "",
                        positionIDAfter: !R.isNil(payload.movementPosition.positionIDAfter) && !R.isNil(payload.movementPosition.positionIDAfter.ouid) ? payload.movementPosition.positionIDAfter.ouid : "",
                        positionIDBefore: !R.isNil(payload.movementPosition.positionIDBefore) && !R.isNil(payload.movementPosition.positionIDBefore.ouid) ? payload.movementPosition.positionIDBefore.ouid : "",
                      },
                      movementStatus: payload.movementStatus,
                      employeeID: payload.employee.employeeID,
                      requestBy: payload.requestBy.employeeID,
                      esid: payload.esid.esid,
                      createdBy: payload.movementCreationalDTO.createdBy,
                      createdDate: payload.movementCreationalDTO.createdDate,
                      updatedBy: "SYSTEM",
                      updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                    }
                    this.props.onClickDelete(payload)
                  }}>
                    <span>SAVE</span>
                   </Button>
                  // <button
                  //   style={{ marginLeft: "15px" }}
                  //   onClick={() => {
                  //     let payload = this.state.movementData
                  //     if (R.isEmpty(payload.movementDocumentURL) || R.isNil(payload.movementDocumentURL)) return alert('Please Upload Document.')
                  //     payload = {
                  //       movementID: payload.movementID,
                  //       movementSPKNumber: payload.movementSPKNumber,
                  //       movementSPKDate: payload.movementSPKDate,
                  //       movementNotes: payload.movementNotes,
                  //       movementEffectiveDate: payload.movementEffectiveDate,
                  //       movementDocumentURL: payload.movementDocumentURL,
                  //       movementCategory: payload.movementCategory.bizparKey,
                  //       movementType: payload.movementType.bizparKey,
                  //       movementPayroll: {
                  //         basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                  //         effectiveStartDate: payload.movementEffectiveDate,
                  //         effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                  //       },
                  //       movementPosition: {
                  //         positionAfterEffectiveStartDate: !R.isNil(payload.movementPosition.positionAfterEffectiveStartDate) ? payload.movementPosition.positionAfterEffectiveStartDate : "",
                  //         positionAfterEffectiveEndDate: !R.isNil(payload.movementPosition.positionAfterEffectiveEndDate) ? payload.movementPosition.positionAfterEffectiveEndDate : "",
                  //         companyIDAfter: !R.isNil(payload.movementPosition.companyIDAfter) && !R.isNil(payload.movementPosition.companyIDAfter.esid) ? payload.movementPosition.companyIDAfter.esid : "",
                  //         companyIDBefore: !R.isNil(payload.movementPosition.companyIDBefore) && !R.isNil(payload.movementPosition.companyIDBefore.esid) ? payload.movementPosition.companyIDBefore.esid : "",
                  //         positionIDAfter: !R.isNil(payload.movementPosition.positionIDAfter) && !R.isNil(payload.movementPosition.positionIDAfter.ouid) ? payload.movementPosition.positionIDAfter.ouid : "",
                  //         positionIDBefore: !R.isNil(payload.movementPosition.positionIDBefore) && !R.isNil(payload.movementPosition.positionIDBefore.ouid) ? payload.movementPosition.positionIDBefore.ouid : "",
                  //       },
                  //       movementStatus: payload.movementStatus,
                  //       employeeID: payload.employee.employeeID,
                  //       requestBy: payload.requestBy.employeeID,
                  //       esid: payload.esid.esid,
                  //       createdBy: payload.movementCreationalDTO.createdBy,
                  //       createdDate: payload.movementCreationalDTO.createdDate,
                  //       updatedBy: "SYSTEM",
                  //       updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                  //     }
                  //     this.props.onClickDelete(payload)
                  //   }}
                  //   className="btn btn-blue"
                  //   type="button"
                  // >
                  //   <span>SAVE</span>
                  // </button>
                ) : null}
                {this.props.type === "edit" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    onClick={() => {
                      let payload = this.state.movementData
                      if (R.isEmpty(payload.movementDocumentURL) || R.isNil(payload.movementDocumentURL)) return alert('Please Upload Document.')
                      payload = {
                        "taskID": "",
                        "senderUserID": this.state.auth.user.userID,
                        "senderEmpID": this.state.auth.user.employeeID,
                        "senderNotes": "",
                        "senderBPMStatus": "INITIATE",
                        "data": {
                          movementID: payload.movementID,
                          movementSPKNumber: payload.movementSPKNumber,
                          movementSPKDate: payload.movementSPKDate,
                          movementNotes: payload.movementNotes,
                          movementEffectiveDate: payload.movementEffectiveDate,
                          movementDocumentURL: payload.movementDocumentURL,
                          movementCategory: payload.movementCategory.bizparKey,
                          movementType: payload.movementType.bizparKey,
                          employeeID: payload.employee.employeeID,
                          movementPosition: {
                            positionAfterEffectiveStartDate: M().format("DD-MM-YYYY"),
                            positionAfterEffectiveEndDate: M().format("DD-MM-YYYY"),
                            companyIDAfter: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                            companyIDBefore: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                            positionIDAfter: payload.movementPosition.positionIDAfter.ouid,
                            positionIDBefore: payload.employee && payload.employee.positionID ? payload.employee.positionID : ""
                          },
                          movementPayroll: {
                            basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                            effectiveStartDate: payload.movementEffectiveDate,
                            effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                          },
                          movementStatus: payload.movementStatus,
                          requestBy: payload.requestBy.employeeID,
                          esid: payload.esid.esid,
                          createdBy: payload.movementCreationalDTO.createdBy,
                          createdDate: payload.movementCreationalDTO.createdDate,
                          updatedBy: "SYSTEM",
                          updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        }
                      }
                      // return console.log(JSON.stringify(payload))
                      if (R.isNil(payload.data.movementPosition) || R.isNil(payload.data.movementPosition.positionIDAfter) || R.isEmpty(payload.data.movementPosition.positionIDAfter)) return alert("Position After is Required.")
                      this.props.onClickSubmit(payload)
                    }}
                    className="btn btn-blue"
                    type="button"

                  >
                    <span>SAVE & SUBMIT</span>
                  </button>
                ) : null}
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  onClick={this.props.onClickClose}
                  type="button"
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>

          {this.state.formFileVisible && this.renderFile()}
          {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}/>)}
          {this.state.createPopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.props.onClickSave}
            />
          )}

          {this.state.savePopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.openSavePopUp.bind(this)}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={
                this.deleteDocument.bind(this)
              }
            />
          )}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(FormMovementDocument)
