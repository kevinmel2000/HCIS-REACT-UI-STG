import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FileViewer from "react-file-viewer";
import DropDown from "../../../modules/popup/DropDown";
import UploadFile from "../../upload/upload";
import M from "moment";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

const defaultPayloadDocument = {
  docID: "DOC-" + Date.now(),
  docDesc: "",
  docMinioPath: "",
  docType: ""
};

class FormOutsourceDocumentDetail extends Component {
  constructor(props) {
    super(props);
    let { data } = this.props;
    this.state = {
      data,
      dataTableTabs:
        data && data.docMinioPath !== ""
          ? [[this.props.data.docMinioPath]]
          : [],
      data: data
        ? data
        : defaultPayloadDocument,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      formDocVisible: false,
      docUrl: "",
      fileType: "",
      result: ""
    };
  }

  openDocument() {
    this.setState({ formDocVisible: !this.state.formDocVisible });
  }

  async uploadDocument() {
    console.log(this.state.url.name)
    this.setState({
      dataTableTabs: [[this.state.url.name]],
      data: { ...this.state.data, docMinioPath: this.state.url.name },
      uploadStatus: "upload",
      result: 'success',
      createPopUpVisible: !this.state.createPopUpVisible,
      percentage: "100"
    });
  }

  handleChange(event) {
    var url = event;
    this.setState({ url });
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  //coloumn in detail form
  columnsDocumentEdit = [
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
              >
                <i
                  className="fa fa-lw fa-print"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
              {this.props.type === "update" ? (
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i
                    className="fa fa-lw fa-trash-alt"
                    style={{
                      backgroundColor: "transparent",
                      color: "red",
                      fontSize: 20
                    }}
                  />
                </button>
              ) : null}
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
              <h4>Document ID</h4>
            </div>
          </div>
          <input
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={this.state.data.docID}
          />
        </div>
      ) : null}

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>
              Document Type <span style={{ color: "red" }}>*</span>
            </h4>
          </div>
        </div>
        <DropDown
          title="-- please select document type --"
          onChange={dt =>
            this.setState({
              data: {
                ...this.state.data,
                docType: dt
              }
            })
          }
          type="bizpar"
          disabled={this.props.type === "view" ? true : false}
          data={this.props.bizparDocType}
          value={
            this.state.data.docType
          }
        />
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
              <h4>
                File <span style={{ color: "red" }}>*format file (pdf)</span>
              </h4>
            </div>
          </div>

          <UploadFile
            type={this.state.uploadStatus}
            percentage={this.state.percentage}
            result={this.state.result}
            acceptedFiles={["pdf"]}
            onHandle={dt => {
              this.handleChange(dt);
              this.setState({ uploadStatus: "idle", percentage: "0" });
            }}
            onUpload={() => {
              this.uploadDocument();
            }}
          />
        </div>
      ) : null}

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>
              Description <span style={{ color: "red" }}>*</span>
            </h4>
          </div>
        </div>
        <textarea
          rows={5}
          readOnly={this.props.type === "view" ? true : false}
          style={
            this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
          }
          type="text"
          className="txt txt-sekunder-color"
          placeholder=""
          required
          value={this.state.data.docDesc}
          onChange={e =>
            this.setState({
              data: {
                ...this.state.data,
                docDesc: e.target.value
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
              <div className="popup-title">Document Viewer</div>
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

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() => this.props.onClickSave(this.props.type, this.state.data)}
            >
              <span>SAVE</span>
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
                  ? "Document – Create Form"
                  : this.props.type === "update"
                    ? "Document – Edit Form"
                    : "Document – View Form"}
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
          <form action="#">
            {this.renderForm()}
            {this.state.formDocVisible ? this.renderDocument() : null}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />

        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createPopUpVisible: false,
                result: null
              });
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={this.openDeletePopup.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default FormOutsourceDocumentDetail;
