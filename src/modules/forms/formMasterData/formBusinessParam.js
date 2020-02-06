import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'

import DropDown from '../../../modules/popup/DropDown'

const defaultBizpar = {
  bizparKey: '',
  bizparValue: '',
  bizparCategory: '',
  bizparStatus: 'ACTIVE',
  bizparCreationalDTO: {
    createdBy: "SYSTEM",
    createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
    modifiedBy: "Test-Update",
    modifiedDate: null
  }
}

class FormBusinessParam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bizparData: props.bizparData ? props.bizparData : {
        ...defaultBizpar,
        bizparCreationalDTO: {
          ...defaultBizpar.bizparCreationalDTO,
          createdBy: this.props.user.employeeID,
          modifiedBy: this.props.user.employeeID,
        }
      }
    }
  }

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Bussiness Parameter – Create Form"
                  : this.props.type === "update"
                    ? "Bussiness Parameter – Edit Form"
                    : "Bussiness Parameter – View Form"}
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
          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            if (R.isEmpty(this.state.bizparData.bizparCategory)) return alert('Bizpar Category is Required.')
            this.props.onClickSave(this.state.bizparData)

          }}>
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Bizpar Category <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select category --"
                    onChange={(dt) => this.setState({
                      bizparData: {
                        ...this.state.bizparData,
                        bizparCategory: dt
                      }
                    })}
                    disabled={this.props.type !== 'create'}
                    data={this.props.dataBizpar}
                    value={this.state.bizparData.bizparCategory}
                    type="bizpar"
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Key <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type !== "create" ? true : false}
                    style={this.props.type !== "create" ? { backgroundColor: "#E6E6E6" } : null}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={this.state.bizparData.bizparKey}
                    onChange={e =>
                      this.setState({
                        bizparData: {
                          ...this.state.bizparData,
                          bizparKey: e.target.value
                        }
                      })}
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Value <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={this.state.bizparData.bizparValue}
                    onChange={e =>
                      this.setState({
                        bizparData: {
                          ...this.state.bizparData,
                          bizparValue: e.target.value
                        }
                      })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Status</h4>
                    </div>
                  </div>
                  <div className="margin-15px">
                    <label className="radio">
                      <input type="checkbox" checked disabled />
                      <span className="checkmark" />
                      <div className="txt-site txt-11 txt-bold txt-main">
                        <h4>Active</h4>
                      </div>
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
                      type="submit">

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

export default FormBusinessParam;
