import React, { Component } from "react";
import M from "moment";

class FormHoliday extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                {this.props.type === "create"
                  ? "Add New Form - Holiday Setting"
                  : this.props.type === "update"
                  ? "Edit Form - Holiday Setting"
                  : "View Form - Holiday Setting"}
              </div>
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
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Holiday ID
                    </span>
                  </div>
                  <input
                    value={this.props.valueHolidayID}
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Holiday Date
                    </span>
                  </div>
                  <input
                    // value={M(this.props.valueHolidayDate, "DD/MM/YYYY").format(
                    //   "YYYY-MM-DD"
                    // )}
                    value={this.props.valueHolidayDate}
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="date"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    onChange={this.props.onChangeHolidayDate}
                  />
                </div>
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Holiday Status
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    value={this.props.selectedHoliday}
                    required
                    onChange={this.props.onChange}
                  >
                    <option value="">-- please select holiday status --</option>
                    {this.props.dataHolidayStatus.map((data, index) => {
                      return (
                        <option key={index} value={data.bizparKey}>
                          {data.bizparValue}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Holiday Description
                    </span>
                  </div>
                  <input
                    value={this.props.valueDescription}
                    onChange={this.props.onChangeDescription}
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Holiday Setting Status
                    </span>
                  </div>
                  <div className="cf-field">
                    <label className="switch green">
                      <input
                        type="checkbox"
                        checked={this.props.valueStatus}
                        disabled
                      />
                      <span className="slider round" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.props.onClickSave}
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

export default FormHoliday;

