import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormDetailSubmission from "../../modules/forms/formLoan/formDetailSubmission";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Submission extends Component {
  constructor() {
    super();
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,

      submissionDetailVisible: false
    };
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  componentDidMount() {
    this.onFinishFetch();
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openSubmissionDetail = index => {
    this.setState({
      submissionDetailVisible: !this.state.submissionDetailVisible,
      selectedIndex: index
    });
  };

  columns = [
    "No",
    "NIK",
    "Employee Name",
    "Position",
    "Level",
    "Total",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openSubmissionDetail(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataTable = [["1", "02312093829", "Jedis", "HRD", "3", "1091203"]];

  render() {
    return (
      <div className="main-content">
        <div className="vertical-tab-content active">
          <div className="padding-5px">
            {/** Show table */}
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title="Submission"
                subtitle={'lorem ipsum dolor'}
                data={this.dataTable}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          {/** Open formDetailSubmission */}
          {this.state.submissionDetailVisible && (
            <div className={"app-popup app-popup-show"}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">
                      Submission - Detail
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-circle btn-grey"
                      onClick={this.openSubmissionDetail}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                <div className="popup-scroll popup-col-2">
                  {this.state.submissionDetailVisible && (
                    <FormDetailSubmission
                      onClickClose={this.openSubmissionDetail}
                    />
                  )}
                </div>
              </div>
              <div className="padding-bottom-20px" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Submission;
