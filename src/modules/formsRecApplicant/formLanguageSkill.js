import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import { Rabbit as Button } from 'react-button-loaders'

import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'

const defaultPayload = {
  "applicantLanguageSkillID": "LS-" + Date.now(),
  "applicantLanguageSkillScore": "",
  "conversationLanguageSkillCompetencyType": "",
  "languageNotes": "",
  "languagePeriodDate": "",
  "languageSkill": "",
  "listeningLanguageSkillCompetencyType": "",
  "readingLanguageSkillCompetencyType": "",
  "writingLanguageSkillCompetencyType": ""
}

class formLanguageSkill extends Component {
  constructor(props) {
    super(props)
    let { applicantDataLanguSkill, bizparLanguSkill, bizparCompetencySkill } = this.props

    this.state = {
      applicantDataLanguSkill: applicantDataLanguSkill ?
        {
          ...applicantDataLanguSkill,
          languagePeriodDate: M(applicantDataLanguSkill.languagePeriodDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
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
                  ? "Applicant Detail - Language Skill - Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Language Skill - Edit Form"
                    : "Applicant Detail - Language Skill - View Form"}
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
              if (R.isEmpty(this.state.applicantDataLanguSkill.languagePeriodDate)) return alert('Date of Peroid is Required.')
              if (R.isEmpty(this.state.applicantDataLanguSkill.languageSkill) || R.isEmpty(this.state.applicantDataLanguSkill.languageSkill.bizparKey)) {
                return alert('Languange is Required.')
              }
              if (R.isEmpty(this.state.applicantDataLanguSkill.languagePeriodDate)) {
                return alert('Date of Period is Required.')
              }
              else
                this.props.onClickSave(this.state.applicantDataLanguSkill)
            }}
          >
            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
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
                      value={this.state.applicantDataLanguSkill.applicantLanguageSkillID}
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
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
                        languageSkill: {
                          ...this.state.applicantDataLanguSkill.languageSkill,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparLanguSkill}
                    value={this.state.applicantDataLanguSkill.languageSkill.bizparKey} />
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
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
                        readingLanguageSkillCompetencyType: {
                          ...this.state.applicantDataLanguSkill.readingLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.applicantDataLanguSkill.readingLanguageSkillCompetencyType.bizparKey} />
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
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
                        writingLanguageSkillCompetencyType: {
                          ...this.state.applicantDataLanguSkill.writingLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.applicantDataLanguSkill.writingLanguageSkillCompetencyType && this.state.applicantDataLanguSkill.writingLanguageSkillCompetencyType.bizparKey} />
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
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
                        listeningLanguageSkillCompetencyType: {
                          ...this.state.applicantDataLanguSkill.listeningLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.applicantDataLanguSkill.listeningLanguageSkillCompetencyType.bizparKey} />
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
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
                        conversationLanguageSkillCompetencyType: {
                          ...this.state.applicantDataLanguSkill.conversationLanguageSkillCompetencyType,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparCompetencySkill}
                    value={this.state.applicantDataLanguSkill.conversationLanguageSkillCompetencyType.bizparKey} />
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
                    value={this.state.applicantDataLanguSkill.applicantLanguageSkillScore}
                    onChange={e => this.setState({ applicantDataLanguSkill: { ...this.state.applicantDataLanguSkill, applicantLanguageSkillScore: e.target.value } })}
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
                    date={this.state.applicantDataLanguSkill.languagePeriodDate}
                    onChange={(e) => this.setState({
                      applicantDataLanguSkill: {
                        ...this.state.applicantDataLanguSkill,
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
                    value={this.state.applicantDataLanguSkill.languageNotes}
                    onChange={e => this.setState({ applicantDataLanguSkill: { ...this.state.applicantDataLanguSkill, languageNotes: e.target.value } })}
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
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '170px' }}
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

export default formLanguageSkill;
