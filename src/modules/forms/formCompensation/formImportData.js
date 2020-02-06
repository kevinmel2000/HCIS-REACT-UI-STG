import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import ImportDataDetail from "./formImportDataDetail";
import ImportDataUpload from "./formImportDataUpload";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class ImportData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formDetailVisible: false,
      deletePopUpVisible: false,
      formUploadVisible: false,
      savePopUpVisible: false
    };
  }

  openDetailForm = () => {
    this.setState({ formDetailVisible: !this.state.formDetailVisible });
  };

  openUploadForm = () => {
    this.setState({ formUploadVisible: !this.state.formUploadVisible });
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopUp = () => {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
  };

  columns = [
    "No",
    "Date",
    "Component Name",
    "Period",
    "Amount of Data",
    "Request By",
    {
      name: "Action",
      options: {
        customBodyRender: () => {
          return (
            <div>
              <button
                style={{ marginRight: 5 }}
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openDetailForm()}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
              <button
                className="btn btn-red btn-small-circle"
                onClick={this.openDeletePopUp}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "28/08/2019 - 09:16:53", "", "201908", "0", ""]];

  render() {
    let {
      formDetailVisible,
      deletePopUpVisible,
      formUploadVisible,
      savePopUpVisible
    } = this.state;
    return (
      <div>
        <div className="padding-5px grid grid-2x">
          <div className="col-1"></div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue margin-right-5px"
            >
              <i className="fa fa-1x fa-download"></i>
            </button>
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={this.openUploadForm}
            >
              <i className="fa fa-1x fa-upload"></i>
            </button>
          </div>
        </div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={this.data}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>

        {formDetailVisible && (
          <ImportDataDetail onClickClose={this.openDetailForm.bind(this)} />
        )}

        {formUploadVisible && (
          <ImportDataUpload
            onClickSave={this.openSavePopUp.bind(this)}
            onClickClose={this.openUploadForm.bind(this)}
          />
        )}

        {savePopUpVisible && (
          <PopUp
            type={"save"}
            class="app-popup app-popup-show"
            onClick={this.openSavePopUp.bind(this)}
          />
        )}

        {deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class="app-popup app-popup-show"
            onClick={this.openDeletePopUp.bind(this)}
            onClickDelete={this.openDeletePopUp.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default ImportData;
