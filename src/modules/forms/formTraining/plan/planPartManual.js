import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from '../../../../modules/popup/DropDown';

var ct = require("../../../custom/customTable");

class PartManual extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "NIK",
    "Employee Name",
    "Position",
    "Level",
    "Information",
    {
      name: "All",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="margin-center content-center">
              <label className="Checkbox">
                <input type="Checkbox" checked={val} />
              </label>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "200003", "Messi", "Pesepakbola", "1", "Professional"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="padding-15px border-bottom">
            <div className="column-1">
              <div className="margin-bottom-20px">
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

              <div className="margin-bottom-20px">
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
              <div className="margin-bottom-5px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Trip Type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select trip type --"
                  onChange={(dt) => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[
                    {id: '1', title: 'jakarta', value: 'jakarta'}, 
                    {id: '1', title: 'bogor', value: 'bogor'}]} />
              </div>
            </div>
          </div>

          <div className="padding-15px border-bottom">
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
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>ADD NEW PARTICIPANT</span>
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
      </div>
    );
  }
}

export default PartManual;
