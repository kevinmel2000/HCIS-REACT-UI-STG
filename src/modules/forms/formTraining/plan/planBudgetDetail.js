import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../custom/customTable");

class formBudDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletePopUpVisible: false,
      savePopUpVisible: false,
      searchClass: "app-popup"
    };
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "Budget Name",
    "Type",
    "Category",
    "Type 1",
    "Type 2",
    "Type 3",
    "Type 4",
    "Type 5",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "dummy", "dummy", "dummy", "dummy", "dummy", "dummy"]];
  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openSearch = () => {
    if (this.state.searchClass === "app-popup app-popup-show") {
      this.setState({ searchClass: "app-popup" });
    } else {
      this.setState({ searchClass: "app-popup app-popup-show" });
    }
  };

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Training Plan - Budget - Create Form"
                  : "Training Plan - Budget - Edit Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                style={{ marginLeft: "15px" }}
                className="btn btn-grey"
                type="button"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times"></i>
              </button>
            </div>
          </div>

          <div className={this.state.searchClass}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Item Name - Search Form
                  </div>
                </div>
              </div>
              <form action="#">
                <div className="padding-5px">
                  <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                      data={this.data}
                      columns={this.columns}
                      options={this.options}
                    />
                  </MuiThemeProvider>
                </div>
              </form>
              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.openSearch}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px">
              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Budget Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="double">
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    readOnly
                    className='input'
                    type="text"
                    placeholder=""
                  />
                  <button
                    disabled={this.props.type === "edit"}
                    className="btn btn-grey border-left btn-no-radius"
                    type="button"
                    onClick={() => this.openSearch()}
                  >
                    <i className="fa fa-lg fa-search" />
                  </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Day Total <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Cost per Unit <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => this.props.onClickSave()}
                  >
                    <span>SAVE</span>
                  </button>
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

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClick={this.openDeletePopup}
              />
            )}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formBudDetail;
