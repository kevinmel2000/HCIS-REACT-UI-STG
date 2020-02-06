import React, { Component } from "react";
import FormSearchEmployee from "../formEmployee/formSearchEmployee"
import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";

class FormInsGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false
    };
  }

  openSearchForm = () => {
    this.setState({ searchVisible: !this.state.searchVisible });
  };

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="margin-5px">
              <span className="txt-site txt-15 txt-main txt-bold">
                REQUESTOR
              </span>
            </div>
            <div className="column-1">
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
            </div>

            <div className="column-2">
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
              <span className="txt-site txt-15 txt-main txt-bold">HEAD</span>
            </div>
            <div className="column-1">
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
            </div>

            <div className="column-2">
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
              <span className="txt-site txt-15 txt-main txt-bold">HEADER</span>
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
                  data={[{ id: "1", title: "1", value: "bs-1" }]}
                />

                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type !== "create" ? true : false}
                                    style={
                                        this.props.type === "create"
                                            ? null
                                            : { backgroundColor: "#E6E6E6" }
                                    }
                                    required
                                >
                                    <option value="1">-- please select loan type --</option>
                                    <option value="1">1</option>
                                </select>*/}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Reference Number</h4>
                  </div>
                </div>
                <input
                  readOnly={
                    this.props.type === "view"
                      ? true
                      : this.props.type === "update"
                      ? true
                      : false
                  }
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : this.props.type === "update"
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
                    <h4>Subsidion Component</h4>
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
                    <h4>Subsidion (%)</h4>
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
                    <h4>Repayment Amount</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type !== "update" ? true : false}
                  style={
                    this.props.type !== "update"
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
                    <h4>Component type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select component type --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[{ id: "1", title: "1", value: "bs-1" }]}
                />
                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: '#E6E6E6' } : null}
                                    required
                                >
                                    <option value="1">-- please select loan type --</option>
                                    <option value="1">1</option>
                                </select>*/}
              </div>
            </div>

            <div className="column-2">
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

              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
                  </div>
                </div>
                <div className='double'>
                <input
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="input"
                  type="text"
                  readOnly
                  placeholder=""
                ></input>
                <button
                  disabled={this.props.type === "create" ? false : true}
                  className="btn btn-grey border-left btn-no-radius"
                  type="button"
                  onClick={this.openSearchForm}
                >
                  <i className="fa fa-lg fa-search"></i>
                </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Plafon</h4>
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
                    <h4>Subsidion</h4>
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
                    <h4>Employee Expense</h4>
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
                    <h4>Due Date</h4>
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
                    <h4>Payment Date</h4>
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
                    onClick={() => {
                      this.props.onClickSave();
                    }}
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
          {this.state.searchVisible && (
            <FormSearchEmployee onClickClose={this.openSearchForm} />
          )}
        </form>
      </div>
    );
  }
}

export default FormInsGeneral;
