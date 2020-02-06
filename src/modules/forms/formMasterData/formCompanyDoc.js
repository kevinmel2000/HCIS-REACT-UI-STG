import React, { Component } from "react";
import PopUp from "../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import API from '../../../Services/Api'
import * as R from 'ramda'

const defaultPayloadDocument = {
  "orgLegalDocumentID": "",
  "orgLegalDocumentURL": "",
}

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormCompany extends Component {
  constructor(props) {
    super(props);
    let { companyData } = this.props

    this.state = {
      companyData : companyData ? companyData : defaultPayloadDocument,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      file: "",
      refreshing: false,
      fetching: false,
    };
  }
 
  componentDidMount() {
    this.getAllDocument(this.state.companyData);
  }

  componentWillReceiveProps(newProps) {
    let { companyData } = newProps
    this.setState({ companyData })
    this.getAllDocument(companyData)
  }

  getAllDocument(companyData) {
    let dataTableDocument = 
    companyData.orgLegalDocument && !R.isNil(companyData.orgLegalDocument.orgLegalDocumentURL) && !R.isEmpty(companyData.orgLegalDocument.orgLegalDocumentURL) ? [
      [companyData.orgLegalDocument.orgLegalDocumentURL]
    ] : []
    this.setState({ dataTableDocument });
  }
  
  openDeletePopup = selectedIndex => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
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
        customBodyRender: (val,tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
              >
                {val}
                <i className="fa fa-lw fa-print" />
              </button>
              {this.props.type !== 'view' ? 
              <button type="button" className="btn btn-red btn-small-circle">
                <i className="fa fa-lw fa-times"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                />
              </button>
              : null }
            </div>
          );
        }
      }
    }
  ];

  handleChange(event) {
    let {companyData} = this.state
    var url = event.target.files[0]
    var number = companyData.esid

    const formData = new FormData()
    formData.append('file', url)
    formData.append('eSID', number)

    this.setState({ formData, url })
  }

  async uploadDocument(formData) {
    let response = await API.create('ES').uploadCompanyDoc(formData)
    if (!response.ok) alert(typeof response.data == "string" ? response.data : JSON.stringify(response.data))

    console.log('upload', response.data)

    switch(response.data.status) {
      case "S":
        if(response.data.code === "201") this.setState({ createPopUpVisible: !this.state.createPopUpVisible })
        else alert("Failed: ", response.data.message)
        break;
      default:
        break;
    }
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
            onClick={() => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
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
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-10px grid-mobile-none gap-20px">
            <div className="padding-5px" />
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.state.dataTableDocument}
                columns={this.columnsDocument}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          {this.props.type !== "view" ?
          <div className="margin-bottom-15px">
          <div className="padding-5px">
            <span className="txt-site txt-11 txt-main txt-bold">
              File <span style={{ color: "red" }}>*</span>
            </span>
          </div>
          <input
            type="file"
            id="upload-image-company-document"
            onChange={this.handleChange.bind(this)}
            required
          />
          <button
           type="button"
           className="btn btn-blue"
           onClick={() => this.uploadDocument(this.state.formData)}> Upload </button>
           </div> : null}

          {this.state.createPopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.props.onClickSave}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={() => {
                let payload = this.state.companyData
                payload = {
                  ...payload,
                  orgLegalDocument: {
                    ...payload.orgLegalDocument,
                    orgLegalDocumentURL: ""
                  }
                }
                this.props.onClickDelete(payload)}}
            />
          )}
        </form>
        {this.renderFooter()}
      </div>
    );
  }
}

export default FormCompany;
