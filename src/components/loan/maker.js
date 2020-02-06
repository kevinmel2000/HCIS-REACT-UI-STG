import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormMakerDetail from "../../modules/forms/formLoan/formMakerDetail";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Maker extends Component {
  constructor() {
    super();
    this.state = {
      makerDetailVisible: false
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

  openMakerDetail = index => {
    this.setState({
      makerDetailVisible: !this.state.makerDetailVisible,
      selectedIndex: index
    });
  };

  columns = [
    "ID Journal",
    "Approval Date",
    "Journal Name",
    "Lender",
    "Employee Name",
    "Journal Status",
    "Amount Total",
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
                onClick={() => this.openMakerDetail(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataTable = [
    [
      "223131",
      "7 Mei 2019",
      "Droping",
      "COP-090800",
      "Tjoang Munara",
      "Created",
      "50.0000"
    ]
  ];

  render() {
    return (
      <div className="main-content">
        <div>
          <form action="#">
            <div className="padding-5px">
              {/** Show Table */}
              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  title="Maker"
                  subtitle={'lorem ipsum dolor'}
                  data={this.dataTable}
                  columns={this.columns}
                  options={options}
                />
              </MuiThemeProvider>
            </div>
          </form>
          {/** Open formMakerDetail */}
          {this.state.makerDetailVisible && (
            <div className={"app-popup app-popup-show"}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Maker - Detail</div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-circle btn-grey"
                      onClick={this.openMakerDetail}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                <div className="popup-scroll popup-col-2">
                  {this.state.makerDetailVisible && (
                    <FormMakerDetail onClickClose={this.openMakerDetail} />
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

export default Maker;
