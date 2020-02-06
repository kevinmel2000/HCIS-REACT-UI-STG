import React, { Component } from "react"
import M from 'moment'
import { connect } from 'react-redux'
import EmployeeAction from '../../../Redux/EmployeeRedux'
import Api from "../../../Services/Api"
import * as R from 'ramda'
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

class FormEmployeeData extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData: {
        ...employeeData,
        employeeBirthDate: M(employeeData.employeeBirthDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        employeeRegistrationDate: M(employeeData.employeeRegistrationDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        employeeExitDate: M(employeeData.employeeExitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        employeeDateOfDeath: employeeData.employeeDateOfDeath ? M(employeeData.employeeDateOfDeath, 'DD-MM-YYYY').format('YYYY-MM-DD') : "",
        employeePPHEndDate: M(employeeData.employeePPHEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      },
      imageUrl: "",
      headData: []
    }
  }

  componentWillMount() {
    this.getEmployeeHead()
  }

  componentDidUpdate(prevProps) {
    if (this.props.employeeData !== prevProps.employeeData) {
      this.setState({ 
        employeeData: {
          ...this.props.employeeData,
          employeeBirthDate: M(this.props.employeeData.employeeBirthDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          employeeRegistrationDate: M(this.props.employeeData.employeeRegistrationDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          employeeExitDate: M(this.props.employeeData.employeeExitDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          employeeDateOfDeath: this.props.employeeData.employeeDateOfDeath ? M(this.props.employeeData.employeeDateOfDeath, 'DD-MM-YYYY').format('YYYY-MM-DD') : "",
          employeePPHEndDate: M(this.props.employeeData.employeePPHEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        },
      })
    }
  }

  async getEmployeeHead() {
    let { employeeData } = this.state
    let payload = {
      "params": {
        "employeeID": employeeData.employeeID
      },
      "offset": 0,
      "limit": 100
    }
    let response = await Api.create('EMPLOYEE_QUERY').getEmployeeHead(payload)
    if (response.ok && response.data.status === "S") {
      this.setState({
        headData: response.data.data
      })
    }
  }

  handleKTPNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      employeeData: {
        ...this.state.employeeData,
        employeeKTPNumber: e.target.value
      }
    })
  }

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#"
          onSubmit={(e) => {
            e.preventDefault()
            if (R.isEmpty(this.state.employeeData.employeeBirthDate)) return alert('Date of Birth is Required.')
            if (R.isEmpty(this.state.employeeData.employeeGender.bizparKey)) return alert('Gender is Required.')
            if (R.isEmpty(this.state.employeeData.employeeNationality.bizparKey)) return alert('Citizenship is Required.')
            if (isNaN(this.state.employeeData.employeeKTPNumber) === true) return alert("KTP Number Must be Numeric")
            if (this.state.employeeData.employeeKTPNumber.length < 16) return alert("KTP Number Must be 16 Digit")
            if (isNaN(this.state.employeeData.employeeNPWPNumber) === true) return alert("NPWP Number Must be Numeric")
            if (this.state.employeeData.employeeNPWPNumber.length < 15) return alert("NPWP Number Must be 15 Digit")
            this.props.onClickSave(this.state.employeeData)
          }}>
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeeNIP}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeNIP: e.target.value
                    }
                  })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK (old)</h4>
                  </div>
                </div>
                <input
                  defaultValue={this.state.employeeData.employeeNIP}
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Applicant Number</h4>
                  </div>
                </div>
                <input
                  value={!R.isNil(this.state.employeeData.applicant) ? this.state.employeeData.applicant.applicantNumber : ""}
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder="-"
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeeName}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeName: e.target.value
                    }
                  })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Birth Place <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeeBirthPlace}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeBirthPlace: e.target.value
                    }
                  })}
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
                  value={this.state.employeeData.position && this.state.employeeData.position.positionName}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Tax Status</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select tax status --"
                  onChange={(dt) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeePTKPType: {
                        ...this.state.employeeData.employeePTKPType,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparTaxStatus}
                  value={!R.isNil(this.state.employeeData.employeePTKPType) ? this.state.employeeData.employeePTKPType.bizparKey : ""} />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date of Birth <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.employeeData.employeeBirthDate}
                  disabled={this.props.type === 'view' ? true : false}
                  onChange={(e) =>
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeBirthDate: M(e).format("YYYY-MM-DD")
                      }
                    })} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Gender <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select gender --"
                  onChange={(dt) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeGender: {
                        ...this.state.employeeData.employeeGender,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparGender}
                  value={this.state.employeeData.employeeGender && this.state.employeeData.employeeGender.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>KTP Number <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeeKTPNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  maxLength={16}
                  onChange={this.handleKTPNumber.bind(this)}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Passport Number</h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeePassportNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder="-"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeePassportNumber: e.target.value
                    }
                  })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NPWP <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.employeeData.employeeNPWPNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  maxLength={15}
                  onChange={(e) => {
                    if (isNaN(e.target.value)) return true
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeNPWPNumber: e.target.value
                      }
                    })
                  }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Citizenship <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select citizenship --"
                  onChange={(dt) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeNationality: {
                        ...this.state.employeeData.employeeNationality,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparNationality}
                  value={this.state.employeeData.employeeNationality && this.state.employeeData.employeeNationality.bizparKey} />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Expatriat Status</h4>
                  </div>
                </div>
                <div className="margin-15px">
                  <label className="radio">
                    <input type="checkbox"
                      onChange={(e) => {
                        this.setState({
                          employeeData: {
                            ...this.state.employeeData,
                            isEmployeeExpatriat: e.target.checked
                          }
                        })
                      }}
                      disabled={this.props.type === "view"}
                      checked={this.state.employeeData.isEmployeeExpatriat} />
                    <span className="checkmark" />
                    <div className="txt-site txt-11 txt-bold txt-main">
                      <h4>Active</h4>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="column-1 txt-site txt-12 txt-bold txt-main">
              HEAD
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
                  value={!R.isNil(this.state.headData) && this.state.headData.length !== 0 ? this.state.headData[0].employeeID : "-"}
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
                  value={!R.isNil(this.state.headData) && this.state.headData.length !== 0 ? this.state.headData[0].employeeName : "-"}
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
                  value={!R.isNil(this.state.headData) && this.state.headData.length !== 0 && this.state.headData[0].position ? this.state.headData[0].position.positionName : "-"}
                />
              </div>
            </div>

            <div className="column-1 txt-site txt-12 txt-bold txt-main">
              COMPANY DATA
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Company</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  value={this.state.employeeData.company.companyName}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Grade</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  value={this.state.employeeData.position && this.state.employeeData.position.positionGrade ? this.state.employeeData.position.positionGrade.bizparValue : ""}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Join Date <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.employeeData.employeeRegistrationDate}
                  disabled={this.props.type === 'view' ? true : false}
                  onChange={(e) =>
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeRegistrationDate: M(e).format("YYYY-MM-DD")
                      }
                    })} />
                {/* <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  type="date"
                  className="txt txt-sekunder-color"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeRegistrationDate: e.target.value
                    }
                  })}
                  value={this.state.employeeData.employeeRegistrationDate}
                /> */}
              </div>
            </div>
            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>End Date</h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.employeeData.employeeExitDate}
                  disabled={true}
                  onChange={(e) =>
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeExitDate: M(e).format("YYYY-MM-DD")
                      }
                    })} />
                {/* <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  type="date"
                  className="txt txt-sekunder-color"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeExitDate: e.target.value
                    }
                  })}
                  value={this.state.employeeData.employeeExitDate}
                /> */}
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Death Date</h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.employeeData.employeeDateOfDeath}
                  disabled={true}
                  onChange={(e) =>
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeDateOfDeath: M(e).format("YYYY-MM-DD")
                      }
                    })} />
                {/* <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  type="date"
                  className="txt txt-sekunder-color"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeDateOfDeath: e.target.value
                    }
                  })}
                  value={this.state.employeeData.employeeDateOfDeath}
                /> */}
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>PPH End Date</h4>
                  </div>
                </div>
                {/* <input
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  type="date"
                  className="txt txt-sekunder-color"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeePPHEndDate: e.target.value
                    }
                  })}
                  value={this.state.employeeData.employeePPHEndDate}
                /> */}
                <CalendarPicker
                  date={this.state.employeeData.employeePPHEndDate}
                  disabled={true}
                  onChange={(e) =>
                    this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeePPHEndDate: M(e).format("YYYY-MM-DD")
                      }
                    })} />
              </div>
            </div>
            <div className="column-1 txt-site txt-12 txt-bold txt-main">
              RETIREMENT DATA
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Retirement Type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select retirement type --"
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeePension: {
                        ...this.state.employeeData.employeePension,
                        employeePensionType: {
                          ...this.state.employeeData.employeePension.employeePensionType,
                          bizparKey: e
                        }
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparPensionType}
                  value={this.state.employeeData.employeePension.employeePensionType && this.state.employeeData.employeePension.employeePensionType.bizparKey} />
              </div>
            </div>
            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Presentation Lump Sump %</h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeePension: {
                        ...this.state.employeeData.employeePension,
                        employeePensionLumpSumPercentage: e.target.value
                      }
                    }
                  })}
                  type="text"
                  className="txt txt-sekunder-color"
                  value={this.state.employeeData.employeePension.employeePensionLumpSumPercentage}
                />
              </div>
            </div>

          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                {this.props.type !== 'view' ?
                  <Button
                  state={this.props.sendState}
                  style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 320, marginBottom: 20 }}
                    className="btn btn-blue"
                    type="submit"
                  // onClick={() => this.props.onClickSave(this.state.employeeData)}
                  >
                    <span>SAVE</span>
                  </Button> :
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={this.props.onClickClose}
                  >
                    <span>CLOSE</span>
                  </button>}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getEmployee: obj => dispatch(EmployeeAction.getEmployee(obj)),
    getEmployeeName: obj => dispatch(EmployeeAction.getEmployeeName(obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormEmployeeData)