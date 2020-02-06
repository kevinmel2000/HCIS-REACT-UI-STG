import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormDetEdPerformance from './formDetEdPerformance';

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormEditPerformance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formVisible: false
    }
  }

  openDetailForm = (index) => {
    let { formVisible } = this.state
    this.setState({
      formVisible: !formVisible,
      selectedIndex: !formVisible ? index : null,
      activeTab: !formVisible ? "General" : "",
      formGeneralVisible: !formVisible ? true : false
    })
  };

  columnsHistory = [
    "No",
    "Request Number",
    "Type",
    "Subject",
    "Indicator",
    "Bobot (%)",
    "Score",
    "Final Score",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== "view" ?
              <div>
                <button
                type="button"
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openDetailForm()}
              >
                <i className="fa fa-lw fa-ellipsis-h" />
              </button>
              </div> :
              null
          );
        }
      }
    }
  ];

  dataHistory = [
    [
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      ""
    ]
  ];

  render() {
    return (
      <div className="vertical-tab-content active">
        <br />
        <div className="col-2 content-right padding-5px">
        </div>
        <br />
        <form action="#">
          <div className="padding-15px app-main-helped">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataHistory}
                columns={this.columnsHistory}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
            </div>
          </div>
        </form>

        {this.state.formVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="padding-15px background-blue border-bottom grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-12 txt-bold post-center">
                    Performance - Edit Form - Detail
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle background-blue"
                    onClick={this.openDetailForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>
            
                <FormDetEdPerformance
                    type={"create"}
                    onClickClose={this.openDetailForm}
                    onClickSave2={this.props.onClickSave}
                />
              </div>
          </div>
        )}

      </div>

    )
  }
}

export default FormEditPerformance