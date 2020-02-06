import React, { Component } from "react";

import M from 'moment'
import API from '../../../Services/Api'
import * as R from 'ramda';

import DropDown from '../../../modules/popup/DropDown';

class formPaymentCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompute: false,
      isBank: false
    }
  }

  componentWillMount() {
  }

  componentDidUpdate() {


  }

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Payment Method - Create Form"
                  : this.props.type === "update"
                    ? "Payment Method - Edit Form"
                    : "Payment Method - View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
            }}>
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Payment ID</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={'test'}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Bank Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select Bank--"
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    disabled={this.props.type === "view" ? true : false}
                    type="bizpar" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Account Number</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={'test'}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Account Name</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={'test'}
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Currency <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select Bank--"
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    disabled={this.props.type === "view" ? true : false}
                    // data={this.props.bizparAddressType}
                    type="bizpar" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Share Method <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select Bank--"
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    disabled={this.props.type === "view" ? true : false}
                    type="bizpar" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Percentage <span style={{ color: "red" }}>* (%)</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={'test'}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Total</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={'test'}
                  />
                </div>
                <div className="padding-top-30px grid grid-2x grid-mobile-none gap-15px">
                  <div className="column-1">
                    <div className="margin-bottom-20px">
                      <label className="radio">
                        <input type="checkbox"
                          onChange={(e) => this.setState({
                            isCompute: e.target.checked,
                            isBank: false
                          })}
                        />
                        <span className="checkmark" />
                        <span className="txt-site txt-11 txt-bold txt-main">
                          Is Compute
                      </span>
                      </label>
                    </div>
                  </div>
                  <div className="column-2">
                    <div className="margin-bottom-20px">
                      <label className="radio">
                        <input type="checkbox"
                          onChange={(e) => this.setState({
                            isBank: e.target.checked,
                            isCompute: false
                          })}
                        />
                        <span className="checkmark" />
                        <span className="txt-site txt-11 txt-bold txt-main">
                          Is Bank Seal
                      </span>
                      </label>
                    </div>
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
                      type="submit"
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
export default formPaymentCreate;
