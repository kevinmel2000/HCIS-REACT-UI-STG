import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PositionSearchForm from "./positionSearchForm";

const ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

const payloadPositionDefault = {
  "positionNotes": "",
  "positionQuota": "",
  "recruitmentRequestPositionID": ""
}

class positionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPositionVisible: false,
      data: payloadPositionDefault
    };
  }

  //MPP Budget
  columnsMPP = [
    "Period",
    "Plafond",
    "Taken",
    "Leftovers",
    "Plan",
    "Expired Date"
  ];

  dataMPP = [["2019", "10", "0", "0", "4", "31/12/2019"]];

  handleChoose(payload) {
    let { ouid, ouname } = payload
    let data = {
      ...this.state.data,
      positionNotes: ouname,
      recruitmentRequestPositionID: ouid
    }
    this.setState({
      data,
      searchPositionVisible: false
    })
  }

  openSearchPosition = () => this.setState({ searchPositionVisible: !this.state.searchPositionVisible })

  render() {
    return (
      <div className={this.props.className}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                {this.props.type === "create"
                  ? "Position - Create Form"
                  : this.props.type === "update"
                  ? "Position - Edit Form"
                  : "Position - View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            <div className="padding-15px grid-mobile-none">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Position Number
                  </span>
                </div>
                <input
                  readOnly
                  value={this.state.data.recruitmentRequestPositionID}
                  style={{ 
                    // backgroundColor: "#E6E6E6",
                    width: "42%"
                  }}
                  type="text"
                  className="txt txt-sekunder-color"
                  required
                />

                <div className="grid grid-2x grid-mobile-none gap-20px">
                  <div className="column-1">
                    <div className="margin-5px">
                      <span className="txt-site txt-11 txt-main txt-bold">
                        Position
                      </span>
                    </div>
                    <div>
                      <input
                        readOnly
                        value={this.state.data.positionNotes}
                        className="txt txt-sekunder-color"
                        type="text"
                        readOnly
                        style={{ width: "85%" }}
                        placeholder=""
                      />
                      &nbsp;
                      <button
                        className="btn btn-circle"
                        type="button"
                        onClick={this.openSearchPosition.bind(this)}
                      >
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                  <div className="column-2">
                    <div className="margin-5px">
                      <span className="txt-site txt-11 txt-main txt-bold">
                        Kuota
                      </span>
                    </div>
                    <input
                      value={this.state.data.positionQuota}
                      onChange={(e) => this.setState({
                        data: {
                          ...this.state.data,
                          positionQuota: e.target.value
                        }
                      })}
                      readOnly={this.props.type === "view" ? true : false}
                      style={{ backgroundColor: this.props.type === "view" ? "#E6E6E6" : null }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  MPP Budget
                </span>
              </div>

              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={this.dataMPP}
                  columns={this.columnsMPP}
                  options={options}
                />
              </MuiThemeProvider>
            </div>

            {this.state.searchPositionVisible && (
              <PositionSearchForm
                type={this.state.type}
                onChoose={this.handleChoose.bind(this)}
                onClickClose={this.openSearchPosition.bind(this)}
              />
            )}

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={() => this.props.onClickSave(this.state.data)}
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
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}
export default positionForm;
