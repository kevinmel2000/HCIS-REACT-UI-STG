import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import CalendarPicker from '../../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
  "employeeWorkExperienceID": "X-" + Date.now(),
  "workExperienceStartDate": "",
  "workExperienceEndDate": "",
  "workExperiencePosition": "",
  "workExperienceCompany": "",
  "workExperienceDescription": "",
  "workExperienceSalary": "",
  "workExperienceResignationReason": "",
  "workExperience": "",
  "workExperienceCity": "",
  "workExperienceCompanyTelpNumber": "",
  "employeeWorkExperienceContactPerson": {
    "contactPersonName": "",
    "contactPersonTelpNumber": "",
    "contactPersonPosition": ""
  }
}

class formCRUDWorkExpEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeDataWorkExp } = this.props

    this.state = {
      employeeDataWorkExp: employeeDataWorkExp ?
        {
          ...employeeDataWorkExp,
          workExperienceStartDate: M(employeeDataWorkExp.workExperienceStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          workExperienceEndDate: M(employeeDataWorkExp.workExperienceEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        } : defaultPayload
    }
  }

  handleCompanyPhoneNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperienceCompanyTelpNumber: e.target.value } })
  }

  handlePhoneNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, employeeWorkExperienceContactPerson: { ...this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson, contactPersonTelpNumber: e.target.value } } })
  }


  render() {
    return (
      <div className='app-popup app-popup-show'>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Employee Detail - Work Experience - Create Form"
                  : this.props.type === "update"
                    ? "Employee Detail - Work Experience - Edit Form"
                    : "Employee Detail - Work Experience - View Form"}
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
              if (!R.isEmpty(this.state.employeeDataWorkExp.workExperienceStartDate) && !R.isEmpty(this.state.employeeDataWorkExp.workExperienceEndDate) && (this.state.employeeDataWorkExp.workExperienceEndDate < this.state.employeeDataWorkExp.workExperienceStartDate)) return alert('End Date Should be Greater Than Start Date.')
              if (R.isEmpty(this.state.employeeDataWorkExp.workExperienceStartDate) || R.isEmpty(this.state.employeeDataWorkExp.workExperienceEndDate)) return alert('Date is Required.')
              this.props.onClickSave(this.state.employeeDataWorkExp)
            }}
          >
            <div className="padding-15px grid grid-mobile-none">
              {this.props.type !== "create" ? (
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Work Experience Number</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={this.state.employeeDataWorkExp.employeeWorkExperienceID}
                  />
                </div>
              ) : null}
            </div>

            <div className="padding-15px grid grid-2x grid-mobile-none gap-15px" style={{ marginTop: -30 }}>
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div className="display-flex-normal width width-full">
                    <CalendarPicker
                      disabled={this.props.type === 'view' ? true : false}
                      date={this.state.employeeDataWorkExp.workExperienceStartDate}
                      onChange={(e) => this.setState({
                        employeeDataWorkExp: {
                          ...this.state.employeeDataWorkExp,
                          workExperienceStartDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      disabled={this.props.type === 'view' ? true : false}
                      date={this.state.employeeDataWorkExp.workExperienceEndDate}
                      onChange={(e) => this.setState({
                        employeeDataWorkExp: {
                          ...this.state.employeeDataWorkExp,
                          workExperienceEndDate: M(e).format('YYYY-MM-DD')
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
                    value={this.state.employeeDataWorkExp.workExperiencePosition}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperiencePosition: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Company <span style={{ color: "red" }}>*</span></h4>
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
                    value={this.state.employeeDataWorkExp.workExperienceCompany}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperienceCompany: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Job Description</h4>
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
                    value={this.state.employeeDataWorkExp.workExperienceDescription}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperienceDescription: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Basic Salary</h4>
                    </div>
                  </div>
                  <NumberFormat 
                    className="txt txt-sekunder-color" 
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" }: null} 
                    readOnly={this.props.type === "view" ? true : false} 
                    thousandSeparator={true} 
                    value={this.state.employeeDataWorkExp.workExperienceSalary} 
                    onValueChange={(e) => {
                      this.setState({
                        employeeDataWorkExp: {
                            ...this.state.employeeDataWorkExp,
                            workExperienceSalary: e.formattedValue
                        }
                      })
                    }}/>
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Work Experience</h4>
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
                    value={this.state.employeeDataWorkExp.workExperience}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperience: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>City</h4>
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
                    value={this.state.employeeDataWorkExp.workExperienceCity}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperienceCity: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Company Phone</h4>
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
                    value={this.state.employeeDataWorkExp.workExperienceCompanyTelpNumber}
                    onChange={this.handleCompanyPhoneNumber.bind(this)}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Resign Reason</h4>
                    </div>
                  </div>
                  <textarea
                    rows={6}
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={this.state.employeeDataWorkExp.workExperienceResignationReason}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, workExperienceResignationReason: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="margin-5px">
                <span className="txt-site txt-15 txt-main txt-bold">
                  Contact Person Information
                </span>
              </div>
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Name</h4>
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
                    value={this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson.contactPersonName}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, employeeWorkExperienceContactPerson: { ...this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson, contactPersonName: e.target.value } } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Position</h4>
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
                    value={this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson.contactPersonPosition}
                    onChange={e => this.setState({ employeeDataWorkExp: { ...this.state.employeeDataWorkExp, employeeWorkExperienceContactPerson: { ...this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson, contactPersonPosition: e.target.value } } })}
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone</h4>
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
                    value={this.state.employeeDataWorkExp.employeeWorkExperienceContactPerson.contactPersonTelpNumber}
                    onChange={this.handlePhoneNumber.bind(this)} />
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <Button
                      state={this.props.sendState}
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 365 }}
                      className="btn btn-blue"
                      type="submit">
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
export default formCRUDWorkExpEmployee;
