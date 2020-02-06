import React, { Component } from "react";

import CalendarPicker from '../../../modules/popup/Calendar';

class FormLoanDetailSub extends Component {
  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Submission to-</h4>
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
                    <h4>Plafon Nominal</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === 'view' ?
                    { backgroundColor: "#E6E6E6" } : { backgroundColor: "#fff" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Rrequest Nominal</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === 'view' ?
                    { backgroundColor: "#E6E6E6" } : { backgroundColor: "#fff" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Time Period (Month)</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === 'view' ?
                    { backgroundColor: "#E6E6E6" } : { backgroundColor: "#fff" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Interest (%)</h4>
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
                    <h4>Basic Subsidies (%)</h4>
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
                    <h4>Interest Subsidies (%)</h4>
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
                    <h4>Efective Date</h4>
                  </div>
                </div>
                <CalendarPicker 
                    // date={this.state.applicantDataDeficiency.weaknessDate}
                    disabled={this.props.type === "view" ? true : false}
                    onChange={(e) => {
                        console.log(e)
                    }} />
                {/* <div class="input-group input-grey input-border">
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={this.props.type === "view" ?
                      { backgroundColor: "#E6E6E6" }
                      : { backgroundColor: "#fff" }}
                    type="date"
                    className="txt txt-sekunder-color col-1"
                    placeholder=""
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-blue fa fa-calendar">
                  </button>
                </div> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Requirement</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === 'view' ?
                    { backgroundColor: "#E6E6E6" } : { backgroundColor: "#fff" }}
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
    );
  }
}

export default FormLoanDetailSub;
