import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

class formIdentityEmployee extends Component {
  constructor(props) {
    super(props) 
    let { employeeData } = this.props

    this.state = {
        employeeData,
    }
  }

  componentWillMount() {
    let employeeData = R.clone(this.state.employeeData)
    let employeeEmails = R.clone(employeeData.employeeEmails)
    let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(employeeEmails)
    employeeEmails.splice(indexCompany, 1)
    employeeData = {
      ...employeeData,
      employeeEmailCompany: indexCompany >=0 ? employeeData.employeeEmails[indexCompany].employeeEmail : "",
      employeeEmailPersonal: employeeEmails.length > 0 ? employeeEmails[0].employeeEmail : "",
      employeeEmailPersonal2: employeeEmails.length > 1 ? employeeEmails[1].employeeEmail : ""
    }
    this.setState({
      employeeData
    })
  }

  handleChange(value, type) {
    if (isNaN(value)) return true
    switch (type) {
      case "phone1":
        this.setState({
          employeeData: {
            ...this.state.employeeData,
            employeeHandphoneNumbers: [
              {
            ...this.state.employeeData.employeeHandphoneNumbers[0],
            employeeHandphoneNumber: value
            },
            {
              ...this.state.employeeData.employeeHandphoneNumbers[1]
            }
          ]
        }
      })
    break;
    case "phone2":
        this.setState({
          employeeData: {
            ...this.state.employeeData,
            employeeHandphoneNumbers: [
              {
            ...this.state.employeeData.employeeHandphoneNumbers[0]
            },
            {
              ...this.state.employeeData.employeeHandphoneNumbers[1],
              employeeHandphoneNumber: value
            }
          ]
        }
      })
      break;
    default:
      break;
    }
  }

    handleHomeNumber = (e) => {
      if (isNaN(e.target.value)) return true
      this.setState({
        employeeData: {
          ...this.state.employeeData,
          employeeHousephoneNumber: e.target.value
        }
      })
    }

    handleHomeKK = (e) => {
      if (isNaN(e.target.value)) return true
      this.setState({
        employeeData: {
          ...this.state.employeeData,
          employeeKKNumber: e.target.value
        }
      })
    }

  createEmail = (email, type = "C") => {
    return {
      "employeeEmailID": "EMA-" + M(),
      "employeeEmailType": type === "P" ? "PERSONAL" : "COMPANY",
      "default": true,
      "employeeEmail": email
    }
  }

  handleSubmit() {
    let { employeeData } = this.state
    let { employeeEmailCompany, employeeEmailPersonal, employeeEmailPersonal2 } = employeeData

    let employeeEmails = []
    if (!R.isEmpty(employeeEmailCompany)) employeeEmails.push(this.createEmail(employeeEmailCompany))
    if (!R.isEmpty(employeeEmailPersonal)) employeeEmails.push(this.createEmail(employeeEmailPersonal, "P"))
    if (!R.isEmpty(employeeEmailPersonal2)) employeeEmails.push(this.createEmail(employeeEmailPersonal2, "P"))
    delete employeeData.employeeEmailCompany
    delete employeeData.employeeEmailPersonal
    delete employeeData.employeeEmailPersonal2
    
    employeeData = {
      ...employeeData,
      employeeEmails
    }

    this.props.onClickSave(employeeData)
  }

  render() {
    console.log(this.state.employeeData.employeeEducationLevel)
    return (
      <div className="vertical-tab-content active">
          <form action="#"
          onSubmit={(e)=>{
            e.preventDefault()
            if (R.isEmpty(this.state.employeeData.employeeReligion.bizparKey)) return alert('Religion is Required.')
            if (R.isEmpty(this.state.employeeData.employeeMaritalStatus.bizparKey)) return alert('Marital Status is Required.')
            if (R.isEmpty(this.state.employeeData.employeeEducationLevel.bizparKey)) return alert('Education Level is Required.')
            if (!R.isEmpty(this.state.employeeData.employeeKKNumber) && (isNaN(this.state.employeeData.employeeKKNumber) === true)) return alert('Number of Family Card Must be Numeric.')
            if (!R.isEmpty(this.state.employeeData.employeeKKNumber) && this.state.employeeData.employeeKKNumber.length < 16) return alert('Number of Family Card Must be 16 Digit.')
            if (!R.isEmpty(this.state.employeeData.employeeHousephoneNumber) && (isNaN(this.state.employeeData.employeeHousephoneNumber) === true)) return alert('Home Contact Must be Numeric.')
            let { employeeData } = this.state
            let { employeeEmailCompany, employeeEmailPersonal, employeeEmailPersonal2 } = employeeData
        
            let employeeEmails = []
            if (!R.isEmpty(employeeEmailCompany)) employeeEmails.push(this.createEmail(employeeEmailCompany))
            if (!R.isEmpty(employeeEmailPersonal)) employeeEmails.push(this.createEmail(employeeEmailPersonal, "P"))
            if (!R.isEmpty(employeeEmailPersonal2)) employeeEmails.push(this.createEmail(employeeEmailPersonal2, "P"))
            delete employeeData.employeeEmailCompany
            delete employeeData.employeeEmailPersonal
            delete employeeData.employeeEmailPersonal2
            
            employeeData = {
              ...employeeData,
              employeeEmails
            }
        
            this.props.onClickSave(employeeData)
          }}>
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Religion <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                  title="-- please select religion --"
                  onChange={(dt) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeReligion: {
                        ...this.state.employeeData.employeeReligion,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparReligion}
                  value={this.state.employeeData.employeeReligion && this.state.employeeData.employeeReligion.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Marital Status <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                  title="-- please select marital status --"
                  onChange={(dt) => this.setState({
                    employeeData: {
                      ...this.state.employeeData,
                      employeeMaritalStatus: {
                        ...this.state.employeeData.employeeMaritalStatus,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparMarital}
                  value={this.state.employeeData.employeeMaritalStatus && this.state.employeeData.employeeMaritalStatus.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone Contact 1 <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeHandphoneNumbers && this.state.employeeData.employeeHandphoneNumbers[0] ? this.state.employeeData.employeeHandphoneNumbers[0].employeeHandphoneNumber : ""}
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
                    onChange={(e) => this.handleChange(e.target.value, "phone1")}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone Contact 2</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeHandphoneNumbers && this.state.employeeData.employeeHandphoneNumbers[1] ? this.state.employeeData.employeeHandphoneNumbers[1].employeeHandphoneNumber : ""}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={(e) => this.handleChange(e.target.value, "phone2")}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Home Contact</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeHousephoneNumber}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={this.handleHomeNumber.bind(this)}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Company Email</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeEmailCompany}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="email"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={(e) => this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeEmailCompany: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Personal Email 1</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeEmailPersonal}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="email"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={(e) => this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeEmailPersonal: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Personal Email 2</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeEmailPersonal2}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="email"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={(e) => this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeEmailPersonal2: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Level of Education <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education --"
                    onChange={(dt) => this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeEducationLevel: {
                          ...this.state.employeeData.employeeEducationLevel,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparEducation}
                    value={this.state.employeeData.employeeEducationLevel && this.state.employeeData.employeeEducationLevel.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Number of Family Card</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeKKNumber}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    maxLength={16}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={this.handleHomeKK.bind(this)}
                    // onChange={(e) => this.setState({
                    //     employeeData: {
                    //       ...this.state.employeeData,
                    //       employeeKKNumber: e.target.value
                    //     }
                    // })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Name of Mother</h4>
                    </div>
                  </div>
                  <input
                    value={this.state.employeeData.employeeMotherName}
                    readOnly={this.props.type === 'view' ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    onChange={(e) => this.setState({
                        employeeData: {
                          ...this.state.employeeData,
                          employeeMotherName: e.target.value
                        }
                      })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Blood Type</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select blood type --"
                    onChange={(dt) => this.setState({
                      employeeData: {
                        ...this.state.employeeData,
                        employeeBloodType: {
                          ...this.state.employeeData.employeeBloodType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparBlood}
                    value={this.state.employeeData.employeeBloodType && this.state.employeeData.employeeBloodType.bizparKey} />
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
                    style={{ position: 'relative', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '329px' }}
                    className="btn btn-blue"
                    type="submit"
                    // onClick={this.handleSubmit.bind(this)}
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
                  </button> }
                </div>
              </div>
            </div>
          </form>
      </div>
    );
  }
}

export default formIdentityEmployee;
