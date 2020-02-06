import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import API from "../../../Services/Api"
import PopUp from "../../../components/pages/PopUpAlert"
import * as R from 'ramda'
import FileViewer from 'react-file-viewer'
import DropDown from '../../../modules/popup/DropDown'
// import { FilePond, registerPlugin } from 'react-filepond'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import UploadFile from '../../upload/upload'
import { connect } from "react-redux";
import M from "moment";
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

// registerPlugin(FilePondPluginImagePreview)

const defaultPayloadDocument = {
  "employeeDocumentID": "D-" + Date.now(),
  "documentNotes": "",
  "documentURL": "",
  "documentType": "",
}

class formDocumentEm extends Component {
  constructor(props) {
    super(props);
    let { employeeData, employeeDataDocuments, bizparDocument } = this.props;

    this.state = {
      employeeData,
      dataTableTabs: employeeDataDocuments && !R.isEmpty(employeeDataDocuments.documentURL) & !R.isNil(employeeDataDocuments.documentURL) ? [[employeeDataDocuments.documentURL.split("document/emp_doc/doc/")]] : [],
      employeeDataDocuments: employeeDataDocuments ? employeeDataDocuments : defaultPayloadDocument,
      bizparDocument,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      formReportVisible: false,
      buttonVisible: false,
      reportURL: "",
      fileType: "",
      notifVisible: false,
      message: '',
      isWeb: false
    };
  }

  //coloumn in detail form
  columnsDocumentEdit = [
    {
      name: "Document",
      options: {
        customBodyRender: (val) => {
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
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {this.props.type === "update" ?
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button> : null}
            </div>
          );
        }
      }
    }
  ];

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
      stompClient.subscribe('/topic/employee/post.employee.document/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ notifVisible: true, message: res.messages })
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

  uploadDocument = async () => {
    this.connectWebsocket()
    this.setState({
      isWeb: !this.state.isWeb,
    }, () => this.state.isWeb === true ? setTimeout(() => {
      this.uploadDocument()
    }, 200) : {})
    this.setState({ uploadStatus: 'upload' })
    if (this.state.url && this.state.url.type !== 'application/pdf') return alert('Format file must be pdf.')
    let { employeeData, employeeDataDocuments } = this.state
    var number = employeeData.employeeID
    var type = employeeDataDocuments.documentType.bizparKey
    var doc = employeeDataDocuments.employeeDocumentID
    var note = employeeDataDocuments.documentNotes
    let dataDocument = this.state.employeeData.employeeDocuments.map((value) => {
      return {
        "documentType": value.documentType.bizparKey
      }
    })
    let isExist = R.findIndex(R.propEq('documentType', type))(dataDocument)
    if (type === '' || type === undefined) {
      this.setState({ result: 'error', uploadStatus: 'idle' })
      return alert('Document Type Is Empty')
    } else if (isExist >= 0) {
      if (this.props.type === "create") {
        this.setState({ result: 'error', uploadStatus: 'idle' })
        return alert("Document Type is Exist")
      } else {
        let isIdExist = R.findIndex(R.propEq("employeeDocumentID", doc))([this.state.employeeData.employeeDocuments[isExist]])
        if (isIdExist < 0) {
          this.setState({ result: 'error', uploadStatus: 'idle' })
          return alert("Document Type is Exist")
        } else {
          const formData = new FormData()
          formData.append('file', this.state.url)
          formData.append('employeeID', number)
          formData.append('documentType', type)
          formData.append('employeeDocumentID', doc)
          formData.append('documentNotes', note)
          formData.append('updatedBy', this.props.auth.user.employeeID)
          formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss"))

          let response = await API.create('EMPLOYEE').uploadDocument(formData, {
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
          })
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

          console.log('upload', response, response.data)

          if (!R.isNil(response.data)) {
            switch (response.data.status) {
              case "S":
                if (response.data.code === "201") {
                  let payload = {
                    "employeeID": employeeData.employeeID
                  }
                  let res = await API.create('EMPLOYEE_QUERY').getEmployeeById(payload)
                  if (res.ok && res.data.status === 'S') {
                    let index = R.findIndex(R.propEq('employeeDocumentID', employeeDataDocuments.employeeDocumentID))(res.data.data.employeeDocuments)
                    if (index >= 0) {
                      this.setState({
                        employeeDataDocuments: {
                          ...this.state.employeeDataDocuments,
                          documentURL: res.data.data.employeeDocuments[index].documentURL,
                        },
                        dataTableTabs: [[res.data.data.employeeDocuments[index] && res.data.data.employeeDocuments[index].documentURL.split("document/emp_doc/doc/")]],
                        // createPopUpVisible: !this.state.createPopUpVisible,
                        result: 'success'
                      })
                    }
                  }
                  // this.setState({
                  //   employeeDataDocuments: {
                  //     ...this.state.employeeDataDocuments,
                  //     documentURL: this.state.url.name,
                  //   },
                  //   dataTableTabs: [[this.state.url.name]],
                  //   createPopUpVisible: !this.state.createPopUpVisible,
                  //   result: 'success'
                  // })
                } else alert("Failed: " + response.data.message)
                break;
              default:
                break;
            }
          }
        }
      }
    } else {
      const formData = new FormData()
      formData.append('file', this.state.url)
      formData.append('employeeID', number)
      formData.append('documentType', type)
      formData.append('employeeDocumentID', doc)
      formData.append('documentNotes', note)
      formData.append('updatedBy', this.props.auth.user.employeeID)
      formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss"))

      let response = await API.create('EMPLOYEE').uploadDocument(formData, {
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
      })
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

      console.log('upload', response, response.data)

      if (!R.isNil(response.data)) {
        switch (response.data.status) {
          case "S":
            if (response.data.code === "201") {
              let payload = {
                "employeeID": employeeData.employeeID
              }
              let res = await API.create('EMPLOYEE_QUERY').getEmployeeById(payload)
              if (res.ok && res.data.status === 'S') {
                let index = R.findIndex(R.propEq('employeeDocumentID', employeeDataDocuments.employeeDocumentID))(res.data.data.employeeDocuments)
                if (index >= 0) {
                  this.setState({
                    employeeDataDocuments: {
                      ...this.state.employeeDataDocuments,
                      documentURL: res.data.data.employeeDocuments[index].documentURL,
                    },
                    dataTableTabs: [[res.data.data.employeeDocuments[index] && res.data.data.employeeDocuments[index].documentURL.split("document/emp_doc/doc/")]],
                    // createPopUpVisible: !this.state.createPopUpVisible,
                    result: 'success'
                  }, () => console.log(JSON.stringify(this.state.employeeDataDocuments)))
                }
              }
              // this.setState({
              //   employeeDataDocuments: {
              //     ...this.state.employeeDataDocuments,
              //     documentURL: 'document/emp_doc/doc/' + this.state.url.name,
              //   },
              //   dataTableTabs: [[this.state.url.name]],
              //   createPopUpVisible: !this.state.createPopUpVisible,
              //   result: 'success'
              // })
            } else alert("Failed: " + response.data.message)
            break;
          default:
            break;
        }
      }
    }
  }

  handleChange(event) {
    var url = event;
    this.setState({ url })
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex });
  }

  openReport() {
    this.setState({ formReportVisible: !this.state.formReportVisible })
  }

  async getReport() {
    let { employeeData, employeeDataDocuments } = this.state
    let employeeID = employeeData.employeeID
    let documentType = employeeDataDocuments.documentType.bizparKey
    let length = employeeDataDocuments.documentURL.split(".").length
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.document.get/" + employeeID + "/" + documentType, {
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
        reportURL: response,
        fileType: employeeDataDocuments.documentURL.split(".")[length - 1],
        formReportVisible: !this.state.formReportVisible
      });
    } else {
      alert("Failed: Document Not Found")
    }
  }

  handleDelete() {
    this.setState({
      employeeDataDocuments: {
        ...this.state.employeeDataDocuments,
        documentURL: ""
      },
      dataTableTabs: [],
      deletePopUpVisible: false
    })
  }

  renderForm = () => (
    <div className="border-bottom padding-15px grid-mobile-none gap-15px">
      {this.props.type !== "create" ? (
        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Document Number</h4>
            </div>
          </div>
          <input
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={this.state.employeeDataDocuments.employeeDocumentID}
          />
        </div>
      ) : null}

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Document Type <span style={{ color: "red" }}>*</span></h4>
          </div>
        </div>
        <DropDown
          title="-- please select document Type --"
          onChange={(e) =>
            this.setState({
              employeeDataDocuments: {
                ...this.state.employeeDataDocuments,
                documentType: {
                  ...this.state.employeeDataDocuments.documentType,
                  bizparKey: e
                }
              }
            })}
          type="bizpar"
          disabled={this.props.type === "view" ? true : false}
          data={this.props.bizparDocument}
          value={this.state.employeeDataDocuments.documentType && this.state.employeeDataDocuments.documentType.bizparKey} />
      </div>

      {this.props.type !== "create" ? (
        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={this.state.dataTableTabs}
              columns={this.columnsDocumentEdit}
              options={options}
            />
          </MuiThemeProvider>
        </div>
      ) : null}

      {this.props.type !== "view" ? (
        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>File <span style={{ color: "red" }}>*format file (pdf)</span></h4>
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
              this.uploadDocument()
            }} />

          {/* <FilePond
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
              onClick={() => this.uploadDocument()}>
              Upload File
             </button>
            : null} */}
        </div>
      ) : null}

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Information <span style={{ color: "red" }}>*</span></h4>
          </div>
        </div>
        <textarea
          rows={5}
          readOnly={this.props.type === "view" ? true : false}
          style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
          type="text"
          className="txt txt-sekunder-color"
          placeholder=""
          required
          value={this.state.employeeDataDocuments.documentNotes}
          onChange={e =>
            this.setState({
              employeeDataDocuments: {
                ...this.state.employeeDataDocuments,
                documentNotes: e.target.value
              }
            })
          }
        />
      </div>
    </div>
  );

  renderReport = () => {
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
                onClick={this.openReport.bind(this)}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {this.state.fileType === "jpg" ||
              this.state.fileType === "png" ||
              this.state.fileType === "jpeg" ? (
                <img src={this.state.reportURL} width={"50%"} alt='' />
              ) : (
                <FileViewer
                  fileType={this.state.fileType}
                  filePath={this.state.reportURL}
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
                  onClick={this.openReport.bind(this)}
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

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
            <Button
              state={this.props.sendState}
              style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '170px' }}
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
  );

  render() {
    let { type } = this.props
    let { createPopUpVisible, deletePopUpVisible, formReportVisible } = this.state
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {type === "create" ? "Employee Detail – Document – Create Form"
                  : type === "update" ? "Employee Detail – Document – Edit Form"
                    : "Employee Detail – Document – View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            if (R.isEmpty(this.state.employeeDataDocuments.documentType) || R.isEmpty(this.state.employeeDataDocuments.documentType.bizparKey)) {
              return alert('Document Type is Required.')
            }
            if (!R.isEmpty(this.state.employeeDataDocuments.documentType) || !R.isEmpty(this.state.employeeDataDocuments.documentType.bizparKey)) {
              let dataDocument = this.state.employeeData.employeeDocuments.map((value) => {
                return {
                  "documentType": value.documentType.bizparKey
                }
              })
              if (this.props.type === "create") {
                let isExist = R.findIndex(R.propEq('documentType', this.state.employeeDataDocuments.documentType.bizparKey))(dataDocument)
                if (isExist >= 0) return alert("Document Type is Exist")
                if (R.isEmpty(this.state.employeeDataDocuments.documentURL) && isExist < 0) {
                  return alert('Please upload a document.')
                }
              } else {
                let isExist = R.findIndex(R.propEq('documentType', this.state.employeeDataDocuments.documentType.bizparKey))(dataDocument)
                if (isExist >= 0) {
                  let isIdExist = R.findIndex(R.propEq("employeeDocumentID", this.state.employeeDataDocuments.employeeDocumentID))([this.state.employeeData.employeeDocuments[isExist]])
                  if (isIdExist < 0) return alert("Document Type is Exist")
                } else {
                  if (this.state.url.name !== this.state.employeeDataDocuments.documentURL.split("document/emp_doc/app/EMP_DOC_" + this.state.employeeData.employeeDocumentID + "_")[1]) return alert('Please Upload Document.')
                  if (R.isEmpty(this.state.employeeDataDocuments.documentURL) && isExist < 0) {
                    return alert('Please upload a document.')
                  }
                }
              }
            }
            this.props.onClickSave(this.state.employeeDataDocuments)
          }}>
            {this.renderForm()}
            {formReportVisible ? this.renderReport() : null}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />

        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />
        )}

        {createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.setState({ createPopUpVisible: false, result: null })}
          />
        )}

        {deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={this.handleDelete.bind(this)}
          />
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(formDocumentEm);