import React, { Component } from "react";
import PopUp from "../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,

      formGeneralAttMonitoringVisible: false,
      formHistoryAttMonitoringVisible: false,
      activeTab: "",
      tabMenu: ["General", "Detail", "Document"],
      tabMenuEdit: ["General", "Detail", "Document", "History"]
    };
  }

  handleUpdate = () => {
    this.openSavePopUp();
  };

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
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

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  handleUpdate() {
    this.openSavePopUp();
  }
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
      formGeneralAttMonitoringVisible: false,
      formHistoryAttMonitoringVisible: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formGeneralAttMonitoringVisible: true
        };
        break;
      
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formHistoryAttMonitoringVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  columnsAttMonitoring = [
    "Request Number",
    "Request By",
    "Period",
    "Monitoring",
    {
      name: "Document Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <label
                style={{
                  backgroundColor: "brown",
                  color: "white",
                  padding: "2px",
                  borderRadius: 2,
                  border: "4px solid brown"
                }}
              >
                {val}
              </label>
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
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openMonitoringDetailEdit(tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
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

  dataMonitoring = [
    ["02312093829", "10002132", "23098123", "32312", "Rencana"]
  ];

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {console.log(this.props.type)}
          {this.props.type === "edit" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() =>
                this.setState({
                  createPopUpVisible: !this.state.createPopUpVisible
                })
              }
            >
              <span>PROCESS</span>
            </button>
          ) : null}
          {this.props.type === "create" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() =>
                this.setState({
                  createPopUpVisible: !this.state.createPopUpVisible
                })
              }
            >
              <span>SAVE</span>
            </button>
          ) : null}
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
            <div className="col-1 content-right">
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  style={{ marginRight: 5 }}
                  onClick={() => this.openMonitoringDetailCreate()}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              ) : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataMonitoring}
                columns={this.columnsAttMonitoring}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.savePopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.openSavePopUp}
            />
          )}
          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClickDelete={this.handleDelete}
              onClick={this.openDeletePopup}
            />
          )}
        </form>
        {this.renderFooter()}
      </div>
    );
  }
}

export default FormAdjustment;
