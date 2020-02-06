import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../../../components/pages/PopUpAlert";
import DropDown from "../../popup/DropDown";

var ct = require("../../../modules/custom/customTable");

class formQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletePopUpVisible: false,
      savePopUpVisible: false,
      createClass: "app-popup"
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

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openCreate = () => {
    if (this.state.createClass === "app-popup app-popup-show") {
      this.setState({ createClass: "app-popup" });
    } else {
      this.setState({ createClass: "app-popup app-popup-show" });
    }
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "Question",
    "Response",
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

  data = [
    ["1", "Bagaimana penjelasan dari training", "1 pilihan jawaban"],
    ["2", "Apakah training sudah mantap", "1 pilihan jawaban"]
  ];
  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius" style={{marginBottom:10}}>
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Facilitator Evaluation - Qestion Detail
              </div>
            </div>
          </div>

          <div className={this.state.createClass}>
            <div className="padding-top-20px" />
            <div className="popup-content-mikro background-white border-radius" style={{marginBottom:10}}>
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Data Module - Create Form
                  </div>
                </div>
              </div>
              <form action="#">
                <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Question <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select Question --"
                    type="bizpar"
                    data={""}
                    value={""}
                  />
                </div>
                </div>
              </form>
              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.openSavePopUp}
                    >
                      <span>Save</span>
                    </button>
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.openCreate}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px grid-mobile-none gap-20px">
              <div className="col-1 content-right">
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  style={{ marginRight: 5 }}
                  onClick={() => this.openCreate()}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              </div>
              <div className="padding-5px" />
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  data={this.data}
                  columns={this.columns}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
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

export default formQuestion;
