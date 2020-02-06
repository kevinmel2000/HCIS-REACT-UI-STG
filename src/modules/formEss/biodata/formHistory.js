import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      printClass: "app-popup",
      rawData: [],
      dataTableFamily: []
    };
  }

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  options = ct.customOptions();

  columns = [
    "No",
    "Period",
    "Position",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <button
              className="btnAct"
              onClick={this.openPrint}>
              <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
            </button>
          );
        }
      }
    }
  ];

  dataFamily = [["1", "2019", "Developer"]];

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.dataFamily}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
        <div className={this.state.printClass}>
          <div className="popup-content-mikro background-white border-radius post-center">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  Report Viewer
                </div>
              </div>
              <div className="col-2 content-right" style={{marginTop:10}}>
                  <i 
                    className="fa fa-download"
                    style={{cursor:"pointer"}} 
                  />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid margin-top-15px">
                <div className="content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={this.openPrint}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='margin-bottom-20px' />
        </div>
      </div>
    );
  }
}
export default FormHistory;
