import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormManual from "./planPartManual";
import FormRequest from "./planPartRequest";

var ct = require("../../../custom/customTable");

class participant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,

      formManualVisible: false,
      formRequestVisible: false,
      activeTab: "",
      tabMenu: ["Manual", "Request"]
    };
  }

  openCreateForm = index => {
    let { createVisible } = this.state;
    this.setState({
      createVisible: !createVisible,
      selectedIndex: !createVisible ? index : null,
      activeTab: !createVisible ? "Manual" : "",
      formManualVisible: !createVisible ? true : false,
      formRequestVisible: false
    });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
  };

  // important
  // vertical tab function
  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formManualVisible: false,
      formRequestVisible: false,
      activeTab: title
    };
    switch (title) {
      case "Manual":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formManualVisible: true
        };
        break;
      case "Request":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formRequestVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "NIK",
    "Employee Name",
    "Branch",
    "Positon",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "223132", "Ronaldo", "Jakarta Selatan", "WH Jakarta Selatan"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Remain Quota Per Activity</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Remain Annual Quota</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-bottom padding-15px">
            <div className="col-1 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.openCreateForm}
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

          {this.state.createVisible && (
            <div className="app-popup app-popup-show">
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">
                      Training Plan - Participant - Create Form
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-circle btn-grey"
                      onClick={this.openCreateForm}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                <div className="display-flex-normal">
                  <div className="width width-300px">
                    <ul className="vertical-tab">
                      {this.state.tabMenu.map((data, index) => {
                        return this.opNavigator(data, index);
                      })}
                    </ul>
                  </div>
                  <div className="width width-full popup-scroll">
                    {this.state.formManualVisible && (
                      <FormManual
                        type={"create"}
                        onClickClose={this.openCreateForm}
                        onClickSave={this.openSavePopUp}
                      />
                    )}

                    {this.state.formRequestVisible && (
                      <FormRequest
                        type={"create"}
                        onClickClose={this.openCreateForm}
                        onClickSave={this.openSavePopUp}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>PROCESS</span>
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
        </form>

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.handleDelete}
            onClick={this.openDeletePopup}
          />
        )}
      </div>
    );
  }
}

export default participant;
