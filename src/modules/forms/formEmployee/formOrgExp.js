import React, { Component } from "react";
import M from 'moment'
import CalendarPicker from '../../../modules/popup/Calendar'
import * as R from 'ramda'
import { Rabbit as Button } from 'react-button-loaders'

const payloadOrgExpDefault = {
  "employeeOrgExperienceID": 'OE-' + M(),
  "orgExperienceEndDate": "",
  "orgExperienceName": "",
  "orgExperienceNotes": "",
  "orgExperiencePosition": "",
  "orgExperienceStartDate": ""
}

class FormOrgExp extends Component {
  constructor(props) {
    super(props)

    let employeeData = Object.assign({}, props.employeeData)
    employeeData = {
      ...employeeData,
      orgExperienceEndDate: M(employeeData.orgExperienceEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      orgExperienceStartDate: M(employeeData.orgExperienceStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }

    this.state = {
      payloadOrgExp: props.employeeData ? employeeData : payloadOrgExpDefault,
      placeDate: false,
      placeDateEx: false
    }
  }

  render() {
    let { payloadOrgExp } = this.state
    let label = ""
    let isReadOnly = false
    switch (this.props.type) {
      case "create":
        label = "Employee Detail – Organization Experience – Create Form"
        break;
      case "update":
        label = "Employee Detail – Organization Experience – Edit Form"
        break;
      case "view":
        label = "Employee Detail – Organization Experience – View Form"
        isReadOnly = true
        break;
      default:
        break;

    }
    return (
      <div className={'app-popup app-popup-show'}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="popup-title">
                {label}
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
              if (!R.isEmpty(this.state.payloadOrgExp.orgExperienceStartDate) && !R.isEmpty(this.state.payloadOrgExp.orgExperienceEndDate) && (this.state.payloadOrgExp.orgExperienceEndDate < this.state.payloadOrgExp.orgExperienceStartDate)) return alert('End Date Should be Greater Than Start Date.')
              if (R.isEmpty(this.state.payloadOrgExp.orgExperienceStartDate)) return alert("Date is Required.")
              if (R.isEmpty(this.state.payloadOrgExp.orgExperienceEndDate)) return alert("Date is Required.")
              this.props.onClickSave(this.state.payloadOrgExp)
            }}
          >
            <div className="padding-15px grid-mobile-none">
              {this.props.type !== "create" ? (
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Organization Number</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={payloadOrgExp.employeeOrgExperienceID}
                  />
                </div>
              ) : null}

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Organization Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  readOnly={isReadOnly}
                  style={{ backgroundColor: isReadOnly ? "#E6E6E6" : null }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={payloadOrgExp.orgExperienceName}
                  onChange={(e) => this.setState({ payloadOrgExp: { ...payloadOrgExp, orgExperienceName: e.target.value } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="display-flex-normal width width-full">
                  <CalendarPicker
                    disabled={isReadOnly}
                    date={payloadOrgExp.orgExperienceStartDate}
                    onChange={(e) => this.setState({
                      payloadOrgExp: {
                        ...payloadOrgExp,
                        orgExperienceStartDate: M(e).format('YYYY-MM-DD')
                      }
                    })} />
                  <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                    To
										</div>
                  <CalendarPicker
                    disabled={isReadOnly}
                    date={payloadOrgExp.orgExperienceEndDate}
                    onChange={(e) => this.setState({
                      payloadOrgExp: {
                        ...payloadOrgExp,
                        orgExperienceEndDate: M(e).format('YYYY-MM-DD')
                      }
                    })} />
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Position <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  readOnly={isReadOnly}
                  style={{ backgroundColor: isReadOnly ? "#E6E6E6" : null }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={payloadOrgExp.orgExperiencePosition}
                  onChange={(e) => this.setState({ payloadOrgExp: { ...payloadOrgExp, orgExperiencePosition: e.target.value } })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Information</h4>
                  </div>
                </div>
                <textarea
                  rows={6}
                  readOnly={isReadOnly}
                  style={{ backgroundColor: isReadOnly ? "#E6E6E6" : null }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={payloadOrgExp.orgExperienceNotes}
                  onChange={(e) => this.setState({ payloadOrgExp: { ...payloadOrgExp, orgExperienceNotes: e.target.value } })}
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {!isReadOnly ? (
                    <Button
                      state={this.props.sendState}
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 165 }}
                      className="btn btn-blue"
                      type="submit"
                    >
                      <span>SAVE</span>
                    </Button>
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
export default FormOrgExp;