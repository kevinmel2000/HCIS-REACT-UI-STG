import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'
import Api from "../../Services/Api"
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadFromEdu = {
  "applicantFormalEducationID": "FE-" + Date.now(),
  "formalEducationCertificationDate": "",
  "formalEducationCertificationNumber": "",
  "formalEducationCity": "",
  "formalEducationDegree": "",
  "formalEducationDegreePosition": "",
  "formalEducationDepartement": "",
  "formalEducationEndDate": "",
  "formalEducationInstitute": "",
  "formalEducationIPK": "",
  "formalEducationNotes": "",
  "formalEducationStartDate": "",
  "formalEducationType": "",
  "formalEducationLevel": ""
}

class formFormalEducation extends Component {
  constructor(props) {
    super(props);
    let {
      applicantDataFormEdu, bizparEduDegree, bizparEduDegreePosition,
      bizparEduDep, bizparEduLevel, institute
    } = this.props;

    this.state = {
      applicantDataFormEdu: applicantDataFormEdu ?
        {
          ...applicantDataFormEdu,
          formalEducationStartDate: M(applicantDataFormEdu.formalEducationStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          formalEducationEndDate: M(applicantDataFormEdu.formalEducationEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          formalEducationIPK: !R.isEmpty(applicantDataFormEdu.formalEducationIPK) || !R.isNil(applicantDataFormEdu.formalEducationIPK) ? String(applicantDataFormEdu.formalEducationIPK).split(".").join("") : applicantDataFormEdu.formalEducationIPK,
          formalEducationCertificationDate: R.isNil(applicantDataFormEdu.formalEducationCertificationDate) || R.isEmpty(applicantDataFormEdu.formalEducationCertificationDate) ? '' : M(applicantDataFormEdu.formalEducationCertificationDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        } : defaultPayloadFromEdu,
      bizparEduDegree, bizparEduDegreePosition,
      bizparEduDep, bizparEduLevel, institute,
      level: this.props.applicantDataFormEdu ? this.props.applicantDataFormEdu.formalEducationLevel.bizparKey : ''
    };
  }

  componentWillMount() {
    let { applicantDataFormEdu } = this.state
    if (this.props.type !== 'create') this.getBizpar(applicantDataFormEdu.formalEducationLevel.bizparKey, applicantDataFormEdu.formalEducationType.bizparKey)
  }

  async getBizpar(level, type) {
    let payload = {
      "limit": 100,
      "offset": 0,
      "params": {
        "educationConfigurationType": type,
        "educationConfigurationLevel": level
      }
    }
    let res = await Api.create('MASTERDATA').getInstituteByTypeAndLevel(payload)
    let resDep = await Api.create('MASTERDATA').getDepartmentByTypeAndLevel(payload)
    this.setState({
      institute: res.data.data,
      bizparEduDep: resDep.data.data
    })
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
                  ? "Applicant Detail - Formal Education - Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Formal Education - Edit Form"
                    : "Applicant Detail - Formal Education - View Form"}
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
              if (this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002') {
                let data = this.state.applicantDataFormEdu
                data = {
                  ...data,
                  formalEducationDepartement: '',
                  formalEducationDegree: '',
                  formalEducationDegreePosition: '',
                  formalEducationIPK: ''
                }
                if (!R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate) && (this.state.applicantDataFormEdu.formalEducationEndDate < this.state.applicantDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationType) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
                return this.props.onClickSave(data)
              }
              if (this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') {
                let data = this.state.applicantDataFormEdu
                data = {
                  ...data,
                  formalEducationDegree: '',
                  formalEducationDegreePosition: '',
                  formalEducationIPK: ''
                }
                if (!R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate) && (this.state.applicantDataFormEdu.formalEducationEndDate < this.state.applicantDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationDepartement) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationDepartement.bizparKey)) return alert('Major is Required.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
                if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationType) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
                return this.props.onClickSave(data)
              }
              if (!R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate) && (this.state.applicantDataFormEdu.formalEducationEndDate < this.state.applicantDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
              if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
              if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationType) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
              if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationLevel) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationLevel.bizparKey)) return alert('Education Level is Required.')
              if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
              if (R.isEmpty(this.state.applicantDataFormEdu.formalEducationDepartement) || R.isEmpty(this.state.applicantDataFormEdu.formalEducationDepartement.bizparKey)) return alert('Major is Required.')
              this.props.onClickSave(this.state.applicantDataFormEdu)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Formal Education Number</h4>
                      </div>
                    </div>
                    <input
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={
                        this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.applicantFormalEducationID
                      }
                    />
                  </div>
                ) : null}

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div className="display-flex-normal">
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationStartDate}
                      onChange={(e) => this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationStartDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationEndDate}
                      onChange={(e) => this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationEndDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                  </div>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Education Type <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education --"
                    onChange={(dt) => {
                      this.getBizpar(this.state.applicantDataFormEdu.formalEducationLevel.bizparKey, dt)
                      this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationType: {
                            ...this.state.applicantDataFormEdu.formalEducationType,
                            bizparKey: dt
                          },
                          formalEducationInstitute: {
                            ...this.state.applicantDataFormEdu.formalEducationInstitute,
                            instituteID: ''
                          },
                          formalEducationDepartement: {
                            ...this.state.applicantDataFormEdu.formalEducationDepartement,
                            bizparKey: ''
                          }
                        }
                      })
                    }
                    }
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparEduType}
                    value={this.state.applicantDataFormEdu.formalEducationType && this.state.applicantDataFormEdu.formalEducationType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Education Level <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education level --"
                    onChange={(dt) => {
                      this.getBizpar(dt, this.state.applicantDataFormEdu.formalEducationType.bizparKey)
                      this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationLevel: {
                            ...this.state.applicantDataFormEdu.formalEducationLevel,
                            bizparKey: dt
                          },
                          formalEducationInstitute: {
                            ...this.state.applicantDataFormEdu.formalEducationInstitute,
                            instituteID: ''
                          },
                          formalEducationDepartement: {
                            ...this.state.applicantDataFormEdu.formalEducationDepartement,
                            bizparKey: ''
                          }
                        },
                        level: dt,
                      })
                    }}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparEduLevel}
                    value={this.state.applicantDataFormEdu.formalEducationLevel && this.state.applicantDataFormEdu.formalEducationLevel.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Institution <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select institution --"
                    onChange={(dt) => this.setState({
                      applicantDataFormEdu: {
                        ...this.state.applicantDataFormEdu,
                        formalEducationInstitute: {
                          ...this.state.applicantDataFormEdu.formalEducationInstitute,
                          instituteID: dt
                        }
                      }
                    })}
                    type="institute"
                    eduType={this.state.applicantDataFormEdu.formalEducationType}
                    eduLevel={this.state.applicantDataFormEdu.formalEducationLevel}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.institute}
                    value={this.state.applicantDataFormEdu &&
                      this.state.applicantDataFormEdu.formalEducationInstitute ?
                      this.state.applicantDataFormEdu.formalEducationInstitute.instituteID :
                      ""} />
                </div>

                {!(this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002') && (
                  <div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Major <span style={{ color: "red" }}>*</span></h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select major --"
                        onChange={(dt) => this.setState({
                          applicantDataFormEdu: {
                            ...this.state.applicantDataFormEdu,
                            formalEducationDepartement: {
                              ...this.state.applicantDataFormEdu.formalEducationDepartement,
                              bizparKey: dt
                            }
                          }
                        })}
                        type="bizpar"
                        eduType={this.state.applicantDataFormEdu.formalEducationType}
                        eduLevel={this.state.applicantDataFormEdu.formalEducationLevel}
                        disabled={this.props.type === "view" ? true : false}
                        data={this.state.bizparEduDep}
                        value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationDepartement.bizparKey} />
                    </div>
                    {!(this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') && (
                      <div>
                        <div className="margin-bottom-20px">
                          <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>Degree</h4>
                            </div>
                          </div>
                          <DropDown
                            title="-- please select degree --"
                            onChange={(dt) => this.setState({
                              applicantDataFormEdu: {
                                ...this.state.applicantDataFormEdu,
                                formalEducationDegree: {
                                  ...this.state.applicantDataFormEdu.formalEducationDegree,
                                  bizparKey: dt
                                }
                              }
                            })}
                            type="bizpar"
                            disabled={this.props.type === "view" ? true : false}
                            data={this.props.bizparEduDegree}
                            value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationDegree.bizparKey} />
                        </div>

                        <div className="margin-bottom-20px">
                          <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>Position of Degree</h4>
                            </div>
                          </div>
                          <DropDown
                            title="-- please select degree position --"
                            onChange={(dt) => this.setState({
                              applicantDataFormEdu: {
                                ...this.state.applicantDataFormEdu,
                                formalEducationDegreePosition: {
                                  ...this.state.applicantDataFormEdu.formalEducationDegreePosition,
                                  bizparKey: dt
                                }
                              }
                            })}
                            type="bizpar"
                            disabled={this.props.type === "view" ? true : false}
                            data={this.props.bizparEduDegreePosition}
                            value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationDegreePosition.bizparKey} />
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="column-2">

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Certificate Number</h4>
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
                    value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationCertificationNumber}
                    onChange={e =>
                      this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationCertificationNumber: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Certificate Date</h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={this.props.type === "view" ? true : false}
                    date={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationCertificationDate}
                    onChange={(e) => this.setState({
                      applicantDataFormEdu: {
                        ...this.state.applicantDataFormEdu,
                        formalEducationCertificationDate: e
                      }
                    })} />
                </div>
                {!(this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002' || this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>GPA <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <NumberFormat
                      required
                      className="txt txt-sekunder-color"
                      style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                      readOnly={this.props.type === "view" ? true : false}
                      decimalSeparator={"."}
                      placeholder={"4.0"}
                      format={"#.##"}
                      decimalScale={2}
                      value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationIPK}
                      onValueChange={(e) => {
                        this.setState({
                          applicantDataFormEdu: {
                            ...this.state.applicantDataFormEdu,
                            formalEducationIPK: e.formattedValue
                          }
                        })
                      }} />
                  </div>
                )}

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
                    value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationCity}
                    onChange={e =>
                      this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationCity: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Information</h4>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    readOnly={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={this.state.applicantDataFormEdu && this.state.applicantDataFormEdu.formalEducationNotes}
                    onChange={e =>
                      this.setState({
                        applicantDataFormEdu: {
                          ...this.state.applicantDataFormEdu,
                          formalEducationNotes: e.target.value
                        }
                      })
                    }
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
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '329px' }}
                      className="btn btn-blue"
                      type='submit'
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
      </div >
    );
  }
}
export default formFormalEducation;
