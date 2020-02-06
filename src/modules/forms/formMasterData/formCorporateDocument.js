import React, { Component } from "react"
import PopUp from "../../../components/pages/PopUpAlert"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import Api from "../../../Services/Api"
import M from 'moment'
import * as R from 'ramda'
import FileViewer from 'react-file-viewer'
// import { FilePond, registerPlugin } from 'react-filepond'
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import UploadFile from '../../upload/upload'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();
const dateNow = M().format('DD-MM-YYYY HH:mm:ss')

// registerPlugin(FilePondPluginImagePreview)

class FormCorporateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      fileUrl: "",
      fileType: "",
      formFileVisible: false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data) {
      if (this.props.data !== prevProps.data) {
        this.setState({
          data: this.props.data,
        })
        this.getDocumentUpdate(this.props.data)
      }
    }
  }

  openDeletePopup(index) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  }

  openFileView() {
    this.setState({ formFileVisible: !this.state.formFileVisible })
  }

  async deleteDocument(data) {
    let { dataCompany } = ''
    dataCompany = this.state.data
    data = {
      orgLegalDocument: { ...data.orgLegalDocument, orgLegalDocumentURL: '' }
    }
    let existingData = Object.assign([], dataCompany.orgStructureTPL)
    existingData = existingData.map((value) => {
      return {
        "isOrgStructureDefault": value.isOrgStructureDefault,
        "orgStructureEndDate": value.orgStructureEndDate,
        "orgStructureSKNumber": value.orgStructureSKNumber,
        "orgStructureStartDate": value.orgStructureStartDate,
        "orgStructureTPLID": value.orgStructureTPLID,
        "orgStructureTPLName": value.orgStructureTPLName,
        "orgStructureTPLStatus": 'ACTIVE',
        "orgStructureTag": value.orgStructureTag,
        "referenceOrgStructureTPLID": value.referenceOrgStructureTPLID !== null ? value.referenceOrgStructureTPLID.orgStructureTPLId : ''
      }
    })
    let payload = {
      ...dataCompany,
      "orgLegalDocument": data,
      "estype": dataCompany.estype.bizparKey ? dataCompany.estype.bizparKey : '',
      "esCreational": {
        "createdBy": dataCompany.esCreational.createdBy,
        "createdDate": dataCompany.esCreational.createdDate,
        "modifiedBy": this.props.user.employeeID,
        "modifiedDate": dateNow
      },
      "esStatus": 'ACTIVE',
      "orgStructureTPL": existingData,
      "pic": dataCompany.pic.employeeID,
      "parent": dataCompany.parent.esid ? dataCompany.parent.esid : ''
    }
    console.log('payload', JSON.stringify(payload))
    let res = await Api.create('ES').updateCompGeneral(payload)
    console.log('update company', res)
    if (res.data.code === '201' && res.data.status === 'S') {
      this.props.getCompanyAll()
      this.setState({
        deletePopUpVisible: !this.state.deletePopUpVisible,
        documents: []
      })
    }
  }

  close() {
    this.setState({
      savePopUpVisible: false,

    })
  }

  componentDidMount() {
    this.getDocument()
  }

  getDocument() {
    let { orgLegalDocument } = this.state.data
    console.log(orgLegalDocument)
    let documents = []
    documents.push([
      orgLegalDocument.orgLegalDocumentURL && orgLegalDocument.orgLegalDocumentURL.split("document/document_es/")
    ])
    this.setState({
      documents,
      result: null
    })
  }

  getDocumentUpdate(value) {
    let { orgLegalDocument } = value
    console.log(orgLegalDocument)
    let documents = []
    documents.push([
      orgLegalDocument.orgLegalDocumentURL && orgLegalDocument.orgLegalDocumentURL.split("document/document_es/")
    ])
    this.setState({
      documents
    })
  }

  async uploadDocument(formData) {
    this.setState({ uploadStatus: 'upload' })
    if (this.state.url && this.state.url.type !== 'application/pdf') return alert('Format file must be pdf.')
    let response = await Api.create('ES').uploadCompanyDoc(formData, {
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

    switch (response.data.status) {
      case "S":
        if (response.data.code === "201") {
          this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            // data: {
            //   ...this.state.data,
            //   orgLegalDocument: {
            //     ...this.state.data.orgLegalDocument,
            //     orgLegalDocumentURL: 'document/document_es/' + this.state.url.name
            //   }
            // },
            result: 'success'
          })
          this.getDocument()
          this.props.getCompanyAll()
        }
        else alert("Failed: ", response.data.message)
        break;
      default:
        break;
    }
  }

  async getFile() {
    let { data } = this.state
    let esID = data.esid
    let length = data.orgLegalDocument.orgLegalDocumentURL.split(".").length
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "es/api/orgLegalDocument.document.get/" + esID, {
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
        fileType: data.orgLegalDocument.orgLegalDocumentURL.split(".")[length - 1],
        formFileVisible: !this.state.formFileVisible
      });
    } else {
      alert("Failed: Document Not Found")
    }
  }

  handleChange(event) {
    var url = event
    var ID = this.state.data.esid
    console.log(url)
    console.log(ID)

    const formData = new FormData()
    formData.append('file', url)
    formData.append('eSID', ID)
    this.setState({ formData, url })
  }

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
                onClick={() => this.getFile()}
              >
                {val}
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
              {this.props.type !== 'detail' ?
              <button type="button"
                className="btnAct"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                </button>
                : null}
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
          <div style={{ textAlign: "center", height: this.state.fileType === 'xlsx' ? '1000px' : null }}>
            <FileViewer
              fileType={this.state.fileType}
              filePath={this.state.fileUrl} />
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-grey"
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

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type === "update" ?
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={this.props.onClickSave}
            >
              <span>SAVE</span>
            </button> : null}
          <button
            style={{ marginLeft: "15px" }}
            className="btn btn-blue"
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
    let doc = this.state.data.orgLegalDocument
    let dataTable = doc.orgLegalDocumentURL

    return (
      <div className="vertical-tab-content active">
        <form action="#"  >
          <div className="padding-15px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={dataTable === '' || dataTable === null ? this.data : this.state.documents}
                columns={this.columnsDocument}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          {this.props.type !== "detail" ?
            <div className="padding-15px">
              <div className="padding-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  <h4>File <span style={{ color: "red" }}>*format file (pdf)</span></h4>
                </span>
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
                  onClick={() => this.uploadDocument(this.state.formData)}>
                  Upload File
               </button>
                : null} */}
            </div>
            : null}

          {this.state.formFileVisible && this.renderFile()}

          {this.state.savePopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.close.bind(this)}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={this.deleteDocument.bind(this)}
            />
          )}
        </form>
      </div >
    );
  }
}

export default FormCorporateDocument