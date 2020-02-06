import React, { Component } from "react"
import M from "moment"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FileViewer from 'react-file-viewer'
import CalendarPicker from '../../../modules/popup/Calendar'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions4()

class FormSppdDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sppdData: props.sppdData,
      formDocVisible: false,
      fileType: "",
      docUrl: ""
    }
  }

  openDocument() {
    this.setState({ formDocVisible: !this.state.formDocVisible })
  }

  componentDidUpdate(prevProps) {
    if (this.props.sppdData !== prevProps.sppdData) return this.setState({ sppdData: this.props.sppdData })
  }

  async getDocument() {
    let { sppdData } = this.state
    let length = sppdData.sppdDocumentURL.split(".").length
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'tmcmd/api/sppd.document.get/' + sppdData.sppdID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response)
      this.setState({
        docUrl: response,
        fileType: sppdData.sppdDocumentURL.split(".")[length - 1],
        formDocVisible: !this.state.formDocVisible
      });
    } else {
      alert("Failed: Document Not Found")
    }
  }

  columns = [
    "Document",
    {
      name: "Action",
      options: {
        customBodyRender: () => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                onClick={() => this.getDocument()}
              >
                <i className="fas fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ]

  data = []

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
                <img src={this.state.docUrl} width={"50%"} alt="" />
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

  render() {
    let { sppdData } = this.state
    let dataTable = []
    dataTable.push([sppdData.sppdDocumentURL && sppdData.sppdDocumentURL.split("document/sppd_doc/")])

    return (
      <div className="a-s-p-mid a-s-p-pad">
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4>Employee Name</h4>
            </span>
          </div>
          <input
            value={sppdData && sppdData.employee ? sppdData.employee.employeeName : ""}
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4>NIK</h4>
            </span>
          </div>
          <input
            value={sppdData && sppdData.employee ? sppdData.employee.employeeID : ""}
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> Head Employee Name </h4>
            </span>
          </div>
          <input
            value={sppdData && sppdData.sppdRequestBy ? sppdData.sppdRequestBy.employeeName : ""}
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> Start Date </h4>
            </span>
          </div>
          <CalendarPicker
            disabled
            date={sppdData ? M(sppdData.sppdStartDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "DD-MM-YYYY"}
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> End Date </h4>
            </span>
          </div>
          <CalendarPicker
            disabled
            date={sppdData ? M(sppdData.sppdEndDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "DD-MM-YYYY"}
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> Destination </h4>
            </span>
          </div>
          <input
            value={sppdData ? sppdData.sppdDestinationPlace : ""}
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> Task </h4>
            </span>
          </div>
          <textarea
            className="txt txt-sekunder-color"
            rows={5}
            style={{ backgroundColor: "#E6E6E6" }}
            value={sppdData ? sppdData.sppdReason : ""}
            readOnly>
          </textarea>
        </div>
        <div className="margin-bottom-15px">
          <div className="margin-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              <h4> Note </h4>
            </span>
          </div>
          <textarea
            className="txt txt-sekunder-color"
            rows={5}
            style={{ backgroundColor: "#E6E6E6" }}
            value={sppdData ? sppdData.sppdNotes : ""}
            readOnly>
          </textarea>
        </div>
        <div className="margin-bottom-15px">
          <div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Document'
                subtitle={"lorem ipsum dolor"}
                data={sppdData.sppdDocumentURL === "" ? this.data : dataTable}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </div>
        {this.state.formDocVisible && this.renderDocument()}
      </div>
    );
  }
}
export default FormSppdDetail;
