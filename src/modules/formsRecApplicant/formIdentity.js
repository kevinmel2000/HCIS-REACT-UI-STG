import React, { Component } from "react"
import DropDown from '../../modules/popup/DropDown'
import * as R from 'ramda'
import { Rabbit as Button } from 'react-button-loaders'

class formIdentity extends Component {
  constructor(props) {
    super(props)
    let { applicantData } = this.props

    this.state = {
      applicantData: {
        ...applicantData,
        applicantHousePhoneNumber: R.isNil(applicantData.applicantHousePhoneNumber) ? "" : applicantData.applicantHousePhoneNumber
      }
    }
  }

  handlePhoneNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      applicantData: {
        ...this.state.applicantData,
        applicantHandphoneNumber: e.target.value
      }
    })
  }

  render() {
    return (
      <div className="vertical-tab-content active" id={this.props.id}>
        <form action="#"
          onSubmit={(e) => {
            e.preventDefault()
            if (
              R.isEmpty(this.state.applicantData.applicantReligion) || R.isEmpty(this.state.applicantData.applicantReligion.bizparKey) ||
              R.isNil(this.state.applicantData.applicantReligion) || R.isNil(this.state.applicantData.applicantReligion.bizparKey)) {
              return alert('Religion is Required.')
            }
            if (
              R.isEmpty(this.state.applicantData.applicantMaritalStatus) || R.isEmpty(this.state.applicantData.applicantMaritalStatus.bizparKey) ||
              R.isNil(this.state.applicantData.applicantMaritalStatus) || R.isNil(this.state.applicantData.applicantMaritalStatus.bizparKey)) {
              return alert('Marital Status is Required.')
            }
            if (
              R.isEmpty(this.state.applicantData.applicantEducationLevel) || R.isEmpty(this.state.applicantData.applicantEducationLevel.bizparKey) ||
              R.isNil(this.state.applicantData.applicantEducationLevel) || R.isNil(this.state.applicantData.applicantEducationLevel.bizparKey)) {
              return alert('Education Level is Required.')
            }
            if (!R.isEmpty(this.state.applicantData.applicantKKNumber) && (isNaN(this.state.applicantData.applicantKKNumber) === true)) return alert("Number of Family Card Must be Numeric.")
            if (!R.isEmpty(this.state.applicantData.applicantKKNumber) && this.state.applicantData.applicantKKNumber.length < 16) return alert("Number of Family Card Must be 16 Digit.")
            else this.props.onClickSave(this.state.applicantData)
          }}
        >
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
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
                    applicantData: {
                      ...this.state.applicantData,
                      applicantReligion: {
                        ...this.state.applicantData.applicantReligion,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparReligion}
                  value={this.state.applicantData.applicantReligion.bizparKey} />
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
                    applicantData: {
                      ...this.state.applicantData,
                      applicantMaritalStatus: {
                        ...this.state.applicantData.applicantMaritalStatus,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparMaritalStatus}
                  value={this.state.applicantData.applicantMaritalStatus.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Phone Contact <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={this.state.applicantData.applicantHandphoneNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                  onChange={this.handlePhoneNumber.bind(this)}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Home Contact</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={this.state.applicantData.applicantHousePhoneNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => {
                    if (isNaN(e.target.value)) return true
                    this.setState({
                      applicantData: {
                        ...this.state.applicantData,
                        applicantHousePhoneNumber: e.target.value
                      }
                    })
                  }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Email Address <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="email"
                  required
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={this.state.applicantData.applicantEmail}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantEmail: e.target.value
                    }
                  })}
                />
              </div>

            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Level of Education <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select education level --"
                  onChange={(dt) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantEducationLevel: {
                        ...this.state.applicantData.applicantEducationLevel,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparEduLvl}
                  value={this.state.applicantData.applicantEducationLevel.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Number of Family Card</h4>
                  </div>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={this.state.applicantData.applicantKKNumber}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => {
                    if (isNaN(e.target.value)) return true
                    this.setState({
                      applicantData: {
                        ...this.state.applicantData,
                        applicantKKNumber: e.target.value
                      }
                    })
                  }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Name of Mother</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={this.state.applicantData.applicantMotherName}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantMotherName: e.target.value
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
                    applicantData: {
                      ...this.state.applicantData,
                      applicantBloodType: {
                        ...this.state.applicantData.applicantBloodType,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparBloodType}
                  value={this.state.applicantData.applicantBloodType.bizparKey} />
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

export default formIdentity;
