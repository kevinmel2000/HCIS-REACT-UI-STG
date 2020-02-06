import React, { Component } from "react";
import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

class FormOTDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="app-popup app-popup-show ">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
        <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Outsource - Official Outsource - Create Form"
                  : this.props.type === "edit"
                  ? "Outsource - Official Outsource - Edit Form"
                  : "Outsource - Official Outsource - View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Periode</h4>
                    </div>
                  </div>
                  <DropDown
                      title="-- please select periode --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      disabled={this.props.type === "view"}
                      data={[
                        {id: '1', title: '2019', value: '2019'}
                      ]} />
                  {/*<div class="input-grey input-border">
                    <select
                      disabled={this.props.type !== "create"}
                      style={
                        this.props.type !== "create"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      className="cf-select slc slc-sekunder"
                    >
                      <option>2019</option>
                    </select>
                  </div>*/}
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Fee</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    class="txt txt-sekunder-color text-no-radius text-no-shadow"
                    type="text"
                    required
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Sub Total</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    class="txt txt-sekunder-color text-no-radius text-no-shadow"
                    type="text"
                    required
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PPN</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Total</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    class="txt txt-sekunder-color text-no-radius text-no-shadow"
                    type="text"
                    required
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>PPH</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Total Income</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    class="txt txt-sekunder-color text-no-radius text-no-shadow"
                    type="text"
                    required
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Departure and Return</h4>
                    </div>
                  </div>
                  <div className="display-flex-normal width width-full">
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                  </div>
                  {/* <div className="grid grid-3x grid-mobile-none gap-20px">
                    <div className="column-1">
                      <input
                        readOnly={this.props.type === "view"}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="column-2">
                      <p align="center" className="padding-5px">
                        To
                      </p>
                    </div>
                    <div className="column-3">
                      <input
                        readOnly={this.props.type === "view"}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                      />
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Destination</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Transportation Type{" "}</h4>
                    </div>
                  </div>
                  <DropDown
                      title="-- please select transportation type --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      disabled={this.props.type === "view"}
                      data={[
                        {id: '1', title: 'COP', value: 'COP'}
                      ]} />
                  {/*<select
                    disabled={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    className="cf-select slc slc-sekunder"
                  >
                    <option>P</option>
                  </select>*/}
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Transportation Cost</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Lodging Cost</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Pocket Money</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Local Transportation</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
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
                    readOnly={this.props.type === "view"}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
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
                      onClick={() => this.props.onSave()}
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

export default FormOTDetail;
