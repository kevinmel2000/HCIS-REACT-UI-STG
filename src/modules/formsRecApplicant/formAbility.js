import React, { Component } from "react";
import * as R from 'ramda'
import DropDown from '../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

const defaultApplicantAbilityRole = {
  "applicantSpecialAbilityID": "SA-" + Date.now(),
  "specialAbilityCompetencyType": "",
  "specialAbilityDescription": ""
}

class formAbility extends Component {

  constructor(props) {
    super(props)
    let { applicantDataAbility, bizparCompetency } = this.props

    this.state = {
      applicantDataAbility: applicantDataAbility ? applicantDataAbility : defaultApplicantAbilityRole,
      bizparCompetency
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
                  ? "Applicant Detail – Ability – Create Form"
                  : this.props.type === "edit"
                    ? "Applicant Detail – Ability – Edit Form"
                    : "Applicant Detail – Ability – View Form"}
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
            if (R.isEmpty(this.state.applicantDataAbility.specialAbilityCompetencyType) || R.isEmpty(this.state.applicantDataAbility.specialAbilityCompetencyType.bizparKey)) {
              return alert('Competence is Required.')
            }
            else
              this.props.onClickSave(this.state.applicantDataAbility)
          }}>
            <div className="padding-15px grid-mobile-none">
              {this.props.type !== "create" ? (
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Ability Number</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    value={this.state.applicantDataAbility.applicantSpecialAbilityID}
                    required
                  />
                </div>
              ) : null}

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Competence <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select competence --"
                  onChange={(dt) => this.setState({
                    applicantDataAbility: {
                      ...this.state.applicantDataAbility,
                      specialAbilityCompetencyType: {
                        ...this.state.applicantDataAbility.specialAbilityCompetencyType,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={this.props.bizparCompetency}
                  value={this.state.applicantDataAbility.specialAbilityCompetencyType.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Ability <span style={{ color: "red" }}>*</span></h4>
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
                  value={this.state.applicantDataAbility.specialAbilityDescription}
                  required
                  onChange={e =>
                    this.setState({
                      applicantDataAbility: {
                        ...this.state.applicantDataAbility,
                        specialAbilityDescription: e.target.value
                      }
                    })
                  }
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <Button
                      state={this.props.sendState}
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '175px' }}
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
export default formAbility;
