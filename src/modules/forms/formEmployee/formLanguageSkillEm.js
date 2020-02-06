import React, { Component } from "react";
import M from 'moment'
import * as R from 'ramda'

import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
  "employeeLanguageSkillID": "LS-" + Date.now(),
  "LanguageSkillScore": "",
  "conversationLanguageSkillCompetencyType": "",
  "languageNotes": "",
  "languagePeriodDate": "",
  "languageSkill": "",
  "listeningLanguageSkillCompetencyType": "",
  "readingLanguageSkillCompetencyType": "",
  "writingLanguageSkillCompetencyType": ""
}

class formLanguageSkillEm extends Component {
  constructor(props) {
    super(props)
    let { employeeDataLanguSkill, bizparLanguSkill, bizparCompetencySkill } = this.props

    this.state = {
      employeeDataLanguSkill: employeeDataLanguSkill ?
        {
          ...employeeDataLanguSkill,
          languagePeriodDate: M(employeeDataLanguSkill.languagePeriodDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        } : defaultPayload,
      bizparLanguSkill, bizparCompetencySkill
    }
  }

  render() {
    return (
      <div className='app-popup app-popup-show'>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="popup-title">
              {this.props.type === "create"
                  ? "Employee Detail – Language Skill –  Create Form"
                  : this.props.type === "update"
                    ? "Employee Detail – Language Skill –  Edit Form"
                    : "Employee Detail – Language Skill –  View Form"}
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
              if (R.isEmpty(this.state.employeeDataLanguSkill.languageSkill) || R.isEmpty(this.state.employeeDataLanguSkill.languageSkill.bizparKey)) {
                return alert('Language is Required.')
              }
              if (R.isEmpty(this.state.employeeDataLanguSkill.languagePeriodDate)) {
                return alert('Date of Period is Required.')
              }
              else
                this.props.onClickSave(this.state.employeeDataLanguSkill)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Language Skill Number</h4>
                      </div>
                    </div>
                    <input
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={this.state.employeeDataLanguSkill.employeeLanguageSkillID}
                    />
                  </div>
                ) : null}

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Language <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select language --"
                    onChange={(dt) => this.setState({
                      employeeDataLanguSkill: {
                        ...this.state.employeeDataLanguSkill,
                        languageSkill: {
                          ...this.state.employeeDataLanguSkill.languageSkill,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparLanguSkill}
                    value={this.state.employeeDataLanguSkill.languageSkill.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Reading Skill</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select reading competency Type --"
                    onChange={(dt) => this.setState({
                      employeeDataLanguSkill: {
                        ...this.state.employeeDataLanguSkill,
                        readingLanguageSkillCompetencyType: {
                          ...this.state.employeeDataLanguSkill.readingLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.employeeDataLanguSkill.readingLanguageSkillCompetencyType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Writing Skill</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select writing competency Type --"
                    onChange={(dt) => this.setState({
                      employeeDataLanguSkill: {
                        ...this.state.employeeDataLanguSkill,
                        writingLanguageSkillCompetencyType: {
                          ...this.state.employeeDataLanguSkill.writingLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.employeeDataLanguSkill.writingLanguageSkillCompetencyType && this.state.employeeDataLanguSkill.writingLanguageSkillCompetencyType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Listening Skill</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select listening competency Type --"
                    onChange={(dt) => this.setState({
                      employeeDataLanguSkill: {
                        ...this.state.employeeDataLanguSkill,
                        listeningLanguageSkillCompetencyType: {
                          ...this.state.employeeDataLanguSkill.listeningLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.employeeDataLanguSkill.listeningLanguageSkillCompetencyType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Speaking Skill</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select speaking competency Type --"
                    onChange={(dt) => this.setState({
                      employeeDataLanguSkill: {
                        ...this.state.employeeDataLanguSkill,
                        conversationLanguageSkillCompetencyType: {
                          ...this.state.employeeDataLanguSkill.conversationLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.employeeDataLanguSkill.conversationLanguageSkillCompetencyType.bizparKey} />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Score</h4>
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
                    value={this.state.employeeDataLanguSkill.languageSkillScore}
                    onChange={e => this.setState({ employeeDataLanguSkill: { ...this.state.employeeDataLanguSkill, languageSkillScore: e.target.value } })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Period <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <CalendarPicker 
                    disabled={this.props.type === "view" ? true : false}
                    date={this.state.employeeDataLanguSkill.languagePeriodDate}
                    onChange={(e) => this.setState({ 
                      employeeDataLanguSkill: { 
                        ...this.state.employeeDataLanguSkill, 
                        languagePeriodDate: e 
                      } 
                    })} />
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
                    value={this.state.employeeDataLanguSkill.languageNotes}
                    onChange={e => this.setState({ employeeDataLanguSkill: { ...this.state.employeeDataLanguSkill, languageNotes: e.target.value } })}
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

export default formLanguageSkillEm;
