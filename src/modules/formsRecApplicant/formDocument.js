
import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import Api from "../../Services/Api"
import PopUp from "../../components/pages/PopUpAlert"
import M from "moment";
import * as R from 'ramda'
import FileViewer from 'react-file-viewer'
import DropDown from '../../modules/popup/DropDown'
import { connect } from 'react-redux';
// import { FilePond, registerPlugin } from 'react-filepond'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import UploadFile from '../upload/upload'
import AuthAction from '../../Redux/AuthRedux'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'
import { Rabbit as Button } from 'react-button-loaders'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

// registerPlugin(FilePondPluginImagePreview)

const defaultPayloadDocument = {
  "applicantDocumentID": "DOC-" + Date.now(),
  "documentNotes": "",
  "documentURL": "",
  "documentType": "",
}

class formDocument extends Component {
  constructor(props) {
    super(props);
    let { applicantData, applicantDataDocuments, bizparDocument } = this.props;
    let doc = applicantDataDocuments && applicantDataDocuments.documentURL.split('document/applicant_doc/')

    this.state = {
      applicantData,
      dataTableTabs: applicantDataDocuments && applicantDataDocuments.documentURL !== "" ? [[doc]] : [],
      applicantDataDocuments: applicantDataDocuments ? applicantDataDocuments : defaultPayloadDocument,
      bizparDocument,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      formDocVisible: false,
      docUrl: "",
      fileType: "",
      result: '',
      message: '',
      notifVisible: false,
      isWeb: false
    }

  }

  // removeHome(words, docs) {
  //   let reg = new RegExp(words)
  //   return docs.replace(reg, '')
  // }

  openDocument() {
    this.setState({ formDocVisible: !this.state.formDocVisible })
  }

  async getDocument() {
    let { applicantData, applicantDataDocuments } = this.state
    let length = applicantDataDocuments.documentURL.split(".").length
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'recruitmentcmd/api/applicant.document.get/' + applicantData.applicantNumber + '/' + applicantDataDocuments.documentType.bizparKey, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response)
      this.setState({
        docUrl: response,
        fileType: applicantDataDocuments.documentURL.split(".")[length - 1],
        formDocVisible: !this.state.formDocVisible
      });
    } else {
      alert("Failed: Document Not Found")
    }
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
      stompClient.subscribe('/topic/applicant/post.applicant.document/' + employeeID,
        (message) => {
          let res = JSON.parse(message.body)
          console.log('messages: ' + res.messages)
          this.setState({
            notifVisible: true, message: res.messages,
          })
          setTimeout(() => {
            this.setState({
              notifVisible: false,
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
    let { applicantData, applicantDataDocuments } = this.state
    var number = applicantData.applicantNumber
    var type = applicantDataDocuments.documentType.bizparKey
    var doc = applicantDataDocuments.applicantDocumentID
    var note = applicantDataDocuments.documentNotes
    let dataDocument = this.state.applicantData.applicantDocuments.map((value) => {
      return {
        "documentType": value.documentType.bizparKey
      }
    })
    let isExist = R.findIndex(R.propEq("documentType", this.state.applicantDataDocuments.documentType.bizparKey))(dataDocument)
    if (type === '' || type === undefined) {
      this.setState({ result: 'error', uploadStatus: 'idle' })
      return alert('Document Type Is Empty')
    } else
      if (isExist >= 0) {
        if (this.props.type === "create") {
          this.setState({ result: 'error', uploadStatus: 'idle' })
          return alert("Document Type is Exist")
        } else {
          let isIdExist = R.findIndex(R.propEq("applicantDocumentID", doc))([this.state.applicantData.applicantDocuments[isExist]])
          if (isIdExist < 0) {
            this.setState({ result: 'error', uploadStatus: 'idle' })
            return alert("Document Type is Exist")
          } else {
            const formData = new FormData()
            formData.append('file', this.state.url)
            formData.append('applicantNumber', number)
            formData.append('documentType', type)
            formData.append('applicantDocumentID', doc)
            formData.append('documentNotes', note)
            formData.append("updatedBy", this.props.auth.user.employeeID);
            formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

            let response = await Api.create('RECRUITMENT').updateApplicantFileDocument(formData, {
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

            console.log('upload', response.data)

            if (!R.isNil(response.data)) {
              switch (response.data.status) {
                case "S":
                  if (response.data.code === "201") {
                    let payload = applicantData.applicantNumber
                    let res = await Api.create('RECRUITMENT_QUERY').getApplicantById(payload)
                    if (res.ok && res.data.status === 'S') {
                      let index = R.findIndex(R.propEq('applicantDocumentID', applicantDataDocuments.applicantDocumentID))(res.data.data.applicantDocuments)
                      if (index >= 0) {
                        this.setState({
                          applicantDataDocuments: {
                            ...this.state.applicantDataDocuments,
                            documentURL: res.data.data.applicantDocuments[index].documentURL,
                          },
                          dataTableTabs: [[res.data.data.applicantDocuments[index] && res.data.data.applicantDocuments[index].documentURL.split("document/applicant_doc/")]],
                          // createPopUpVisible: !this.state.createPopUpVisible,
                          result: 'success'
                        })
                      }
                    }
                  }
                  else alert("Failed: " + response.data.message)
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
        formData.append('applicantNumber', number)
        formData.append('documentType', type)
        formData.append('applicantDocumentID', doc)
        formData.append('documentNotes', note)
        formData.append("updatedBy", this.props.auth.user.employeeID);
        formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

        let response = await Api.create('RECRUITMENT').updateApplicantFileDocument(formData, {
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
        if (!response.ok && R.isNil(response.status)) alert(response.problem)

        console.log('upload', response.data)

        if (!R.isNil(response.data)) {
          switch (response.data.status) {
            case "S":
              if (response.data.code === "201") {
                let payload = applicantData.applicantNumber
                let res = await Api.create('RECRUITMENT_QUERY').getApplicantById(payload)
                if (res.ok && res.data.status === 'S') {
                  let index = R.findIndex(R.propEq('applicantDocumentID', applicantDataDocuments.applicantDocumentID))(res.data.data.applicantDocuments)
                  if (index >= 0) {
                    this.setState({
                      applicantDataDocuments: {
                        ...this.state.applicantDataDocuments,
                        documentURL: res.data.data.applicantDocuments[index].documentURL,
                      },
                      dataTableTabs: [[res.data.data.applicantDocuments[index] && res.data.data.applicantDocuments[index].documentURL.split("document/applicant_doc/")]],
                      result: 'success'
                    }, () => console.log(JSON.stringify(this.state.applicantDataDocuments)))
                  }
                }
              }
              else alert("Failed: " + response.data.message)
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
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  handleDelete() {
    this.setState({
      applicantDataDocuments: {
        ...this.state.applicantDataDocuments,
        documentURL: ""
      },
      dataTableTabs: [],
      deletePopUpVisible: false
    })
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
                onClick={() => this.getDocument()}>
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

  renderForm = () => (
    <div className="padding-15px grid-mobile-none gap-20px">
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
            value={this.state.applicantDataDocuments.applicantDocumentID}
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
          title="-- please select document type --"
          onChange={(dt) => this.setState({
            applicantDataDocuments: {
              ...this.state.applicantDataDocuments,
              documentType: {
                ...this.state.applicantDataDocuments.documentType,
                bizparKey: dt
              }
            }
          })}
          type="bizpar"
          disabled={this.props.type === "view" ? true : false}
          data={this.props.bizparDocument}
          value={this.state.applicantDataDocuments.documentType && this.state.applicantDataDocuments.documentType.bizparKey} />
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
          value={this.state.applicantDataDocuments.documentNotes}
          onChange={e =>
            this.setState({
              applicantDataDocuments: {
                ...this.state.applicantDataDocuments,
                documentNotes: e.target.value
              }
            })
          }
        />
      </div>
    </div>
  );

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
                  filePath={this.state.docUrl} />
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
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Applicant Detail – Document – Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail – Document – Edit Form"
                    : "Applicant Detail – Document – View Form"}
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
            if (R.isEmpty(this.state.applicantDataDocuments.documentType) || R.isEmpty(this.state.applicantDataDocuments.documentType.bizparKey)) {
              return alert('Document Type is Required.')
            }
            if (!R.isEmpty(this.state.applicantDataDocuments.documentType) || !R.isEmpty(this.state.applicantDataDocuments.documentType.bizparKey)) {
              let dataDocument = this.state.applicantData.applicantDocuments.map((value) => {
                return {
                  "documentType": value.documentType.bizparKey
                }
              })
              if (this.props.type === "create") {
                let isExist = R.findIndex(R.propEq("documentType", this.state.applicantDataDocuments.documentType.bizparKey))(dataDocument)
                if (isExist >= 0) return alert("Document Type is Exist")
                if (R.isEmpty(this.state.applicantDataDocuments.documentURL)) {
                  return alert('Please Upload a Document.')
                }
              } else {
                let isExist = R.findIndex(R.propEq('documentType', this.state.applicantDataDocuments.documentType.bizparKey))(dataDocument)
                if (isExist >= 0) {
                  let isIdExist = R.findIndex(R.propEq("applicantDocumentID", this.state.applicantDataDocuments.applicantDocumentID))([this.state.applicantData.applicantDocuments[isExist]])
                  if (isIdExist < 0) return alert("Document Type is Exist")
                } else {
                  if (R.isEmpty(this.state.applicantDataDocuments.documentURL) && isExist < 0) {
                    return alert('Please upload a document.')
                  }
                }
              }
            }
            this.props.onClickSave(this.state.applicantDataDocuments)
          }}>
            {this.renderForm()}
            {this.state.formDocVisible ? this.renderDocument() : null}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />


        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />
        )}

        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createPopUpVisible: false,
                result: null
              })
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
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

export default connect(mapStateToProps, mapDispatchToProps)(formDocument);