import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import NumberFormat from 'react-number-format'
import CalendarPicker from '../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
  "applicantWorkExperienceID": "WE-" + Date.now(),
  "workExperience": "",
  "workExperienceCity": "",
  "workExperienceCompany": "",
  "workExperienceCompanyTelpNumber": "",
  "workExperienceContactPerson": "",
  "workExperienceDescription": "",
  "workExperienceEndDate": "",
  "workExperiencePosition": "",
  "workExperienceResignationReason": "",
  "workExperienceSalary": "",
  "workExperienceStartDate": "",
  "applicantWorkExperienceContactPersons": {
    "contactPersonName": "",
    "contactPersonPosition": "",
    "contactPersonTelpNumber": ""
  }
}

class formWorkExperience extends Component {
  constructor(props) {
    super(props)
    let { applicantDataWorkExp } = this.props

    this.state = {
      applicantDataWorkExp: applicantDataWorkExp ?
        {
          ...applicantDataWorkExp,
          workExperienceStartDate: M(applicantDataWorkExp.workExperienceStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          workExperienceEndDate: M(applicantDataWorkExp.workExperienceEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        } : defaultPayload
    }
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
                  ? "Applicant Detail – Work Experience – Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail – Work Experience – Edit Form"
                    : "Applicant Detail – Work Experience – View Form"}
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
          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            if (!R.isEmpty(this.state.applicantDataWorkExp.workExperienceStartDate) && !R.isEmpty(this.state.applicantDataWorkExp.workExperienceEndDate) && (this.state.applicantDataWorkExp.workExperienceEndDate < this.state.applicantDataWorkExp.workExperienceStartDate)) return alert('End Date Should be Greater Than Start Date.')
            if (R.isEmpty(this.state.applicantDataWorkExp.workExperienceStartDate) ||
              R.isEmpty(this.state.applicantDataWorkExp.workExperienceEndDate)) return alert('Date is Required')
            this.props.onClickSave(this.state.applicantDataWorkExp)
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
                    value={this.state.applicantDataWorkExp.applicantWorkExperienceID}
                  />
                </div>
              ) : null}
            </div>

            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px" style={{ marginTop: -30 }}>
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div className="display-flex-normal">
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataWorkExp.workExperienceStartDate}
                      onChange={(e) => this.setState({
                        applicantDataWorkExp: {
                          ...this.state.applicantDataWorkExp,
                          workExperienceStartDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataWorkExp.workExperienceEndDate}
                      onChange={(e) => this.setState({
                        applicantDataWorkExp: {
                          ...this.state.applicantDataWorkExp,
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
                    value={this.state.applicantDataWorkExp.workExperiencePosition}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperiencePosition: e.target.value } })}
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
                    value={this.state.applicantDataWorkExp.workExperienceCompany}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceCompany: e.target.value } })}
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
                    value={this.state.applicantDataWorkExp.workExperienceDescription}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceDescription: e.target.value } })}
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
                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                    readOnly={this.props.type === "view" ? true : false}
                    thousandSeparator={true}
                    value={this.state.applicantDataWorkExp.workExperienceSalary}
                    onValueChange={(e) => {
                      this.setState({
                        applicantDataWorkExp: {
                          ...this.state.applicantDataWorkExp,
                          workExperienceSalary: e.formattedValue
                        }
                      })
                    }} />
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
                    value={this.state.applicantDataWorkExp.workExperience}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperience: e.target.value } })}
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
                    value={this.state.applicantDataWorkExp.workExperienceCity}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceCity: e.target.value } })}
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
                    value={this.state.applicantDataWorkExp.workExperienceCompanyTelpNumber}
                    onChange={e => {
                      if (isNaN(e.target.value)) return true
                      this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceCompanyTelpNumber: e.target.value } })
                    }}
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
                    value={this.state.applicantDataWorkExp.workExperienceResignationReason}
                    onChange={e => { this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceResignationReason: e.target.value } }) }}
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
                    value={this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons.contactPersonName}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, applicantWorkExperienceContactPersons: { ...this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons, contactPersonName: e.target.value } } })}
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
                    value={this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons.contactPersonPosition}
                    onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, applicantWorkExperienceContactPersons: { ...this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons, contactPersonPosition: e.target.value } } })}
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
                    value={this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons.contactPersonTelpNumber}
                    onChange={e => {
                      if (isNaN(e.target.value)) return true
                      this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, applicantWorkExperienceContactPersons: { ...this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons, contactPersonTelpNumber: e.target.value } } })
                    }}
                  />
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
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '379px' }}
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
export default formWorkExperience;
