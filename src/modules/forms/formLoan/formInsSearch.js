import React, { Component } from "react";
import MUIDataTable from "mui-datatables-bitozen";
import FlexView from "react-flexview";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

var ct = require("../../../modules/custom/customTable");

class FormSearchInsurance extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      savePopUpVisible: false,
      rawData: [],
      dataTableIns: [],
      selectedIndex: [],
      fetching: false,
      refreshing: false,
      value: ""
    };

    // this.handleDelete = this.handleDelete.bind(this);
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    {
      name: "Employee",
      options: {
        customBodyRender: val => {
          return (
            <FlexView vAlignContent="center">
              <FlexView>
                <i
                  className="far fa-lw fa-user-circle"
                  style={{ color: "blue", marginRight: 10, fontSize: 44 }}
                />
              </FlexView>
              <div style={{ fontWeight: "bold", fontSize: 15 }}>{val}</div>
            </FlexView>
          );
        }
      }
    },
    "Branch",
    "Position",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-circle background-blue"
                style={{ marginRight: 5 }}
              >
                {val}
                <i className="fa fa-1x fa-plus" />
              </button>
            </div>
          );
        }
      }
    }
  ];
  data = [["Ken", "HO", "Developer"]];

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div
          className="popup-content background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="popup-panelgrid grid-2x">
            <div className="col-1">
              <div className="popup-title">Employee - Search Form</div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle background-blue"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            <div className="padding-15px ">
              <div className="padding-bottom-15px">
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    data={this.data}
                    columns={this.columns}
                    options={this.options}
                  />
                </MuiThemeProvider>
              </div>
              <div>
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
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormSearchInsurance;
