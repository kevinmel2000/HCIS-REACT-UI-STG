import React, { Component } from "react";

import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";

class FormRbiGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                <span className="txt-site txt-15 txt-main txt-bold">
                  REQUESTOR
                </span>
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
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
                    <h4>NIK</h4>
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
                    <h4>Division</h4>
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
                    <h4>Position</h4>
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
              <div className="margin-bottom-20px">
                <span className="txt-site txt-15 txt-main txt-bold">Head</span>
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
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
                    <h4>Division</h4>
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
                    <h4>Position</h4>
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

          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="margin-5px">
              <span className="txt-site txt-15 txt-main txt-bold">Detail</span>
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Number</h4>
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
                    <h4>Loan type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select loan type --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[{ id: "1", title: "All", value: "bs-1" }]}
                />
                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    required
                                >
                                    <option value="1">-- please select type --</option>
                                    <option value="1">1</option>
                                </select>*/}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>SK Reference</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select sk reference --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[{ id: "1", title: "All", value: "bs-1" }]}
                />
                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    required
                                > 
                                    <option value="1">-- please select type --</option>
                                    <option value="1">1</option>
                                </select>*/}
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>New Bank Interest</h4>
                  </div>
                </div>
                <input
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

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Effective Date </h4>
                  </div>
                </div>
                <CalendarPicker
                  // date={this.state.applicantDataDeficiency.weaknessDate}
                  disabled={this.props.type === "view" ? true : false}
                  onChange={e => {
                    console.log(e);
                  }}
                />
                {/* <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: '#E6E6E6' } : null}
                                        type="date"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                    /> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Description</h4>
                  </div>
                </div>
                <textarea
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6", height: 95 }
                      : { height: 95 }
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>

          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                {this.props.type === "create" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      this.props.onClickSave();
                    }}
                  >
                    <span>SAVE</span>
                  </button>
                ) : this.props.type === "update" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      this.props.onClickSave();
                    }}
                  >
                    <span>PROCESS</span>
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
    );
  }
}

export default FormRbiGeneral;
