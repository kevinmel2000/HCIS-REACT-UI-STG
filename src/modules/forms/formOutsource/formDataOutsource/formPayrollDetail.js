import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import DropDown from '../../../../modules/popup/DropDown';

class formPayrollDetail extends Component {
  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
        <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Outsource - Payroll - Create Form"
                  : this.props.type === "edit"
                  ? "Outsource - Payroll - Edit Form"
                  : "Outsource - Payroll - View Form"}
              </div>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Period</h4>
                    </div>
                  </div>
                  <DropDown
                      title="-- please select period --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      disabled={this.props.type === "view"}
                      data={[
                        {id: '1', title: '2019', value: '2019'}
                      ]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    required
                    style={
                      this.props.type !== "create"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type !== "create"}
                  >
                    <option value="1">-- please select period --</option>
                    <option value="1">2019</option>
                  </select>*/}
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Basic Salary <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Basic Benefit</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Meal & Transport Allowances</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Overtime</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Incentive</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Commission</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Childbirth Benefit</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Gasoline Allowance</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel Basic Salary</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel Benefit</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel Overtime</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel Incentive</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel Commission</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Rapel UMT</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Amount of Income</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>BPJS Benefit</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Jamsostek</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Pension Contributions</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Total Income</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Management Fee</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Sub Total</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PPN</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Total</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PPH</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Net Total</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    readOnly={this.props.type === "view"}
                  />
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
                      onClick={() => this.props.onClickSave()}
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
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
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formPayrollDetail;
