import React, { Component } from "react"
import M from 'moment'
import { connect } from "react-redux"
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'
import * as R from 'ramda'
import { Rabbit as Button } from 'react-button-loaders'

class formApplicantData extends Component {
  constructor(props) {
    super(props)
    let { applicantData } = this.props

    this.state = {
      applicantData: {
        ...applicantData,
        applicantBirthDate: M(applicantData.applicantBirthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      },
    }
  }

  render() {
    return (
      <div className="vertical-tab-content active" id={this.props.id}>
        <form action="#" onSubmit={(e) => {
          e.preventDefault()
          if (R.isEmpty(this.state.applicantData.applicantGender.bizparKey)) return alert("Gender is Required.")
          if (isNaN(this.state.applicantData.applicantKTPNumber) === true) return alert("KTP Number Must be Numeric.")
          if (this.state.applicantData.applicantKTPNumber.length < 16) return alert("KTP Number Must be 16 Digit.")
          if (isNaN(this.state.applicantData.applicantNPWPNumber) === true) return alert("NPWP Number Must be Numeric.")
          if (this.state.applicantData.applicantNPWPNumber.length < 15) return alert("NPWP Number Must be 15 Digit.")
          if (R.isEmpty(this.state.applicantData.applicantNationality.bizparKey)) return alert("Citizenship is Required.")
          this.props.onClickSave(this.state.applicantData)
        }}>
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Applicant Number</h4>
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={this.state.applicantData.applicantNumber}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Applicant Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={this.state.applicantData.applicantName}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantName: e.target.value
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
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={this.state.applicantData.applicantBirthPlace}
                  readOnly={this.props.type === 'view' ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  onChange={(e) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantBirthPlace: e.target.value
                    }
                  })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date of Birth <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <CalendarPicker
                  date={this.state.applicantData.applicantBirthDate}
                  disabled={this.props.type === 'view' ? true : false}
                  onChange={(e) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantBirthDate: M(e).format("YYYY-MM-DD")
                    }
                  })} />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Gender <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select gender --"
                  onChange={(dt) => this.setState({
                    applicantData: {
                      ...this.state.applicantData,
                      applicantGender: {
                        ...this.state.applicantData.applicantGender,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparGender}
                  value={this.state.applicantData.applicantGender.bizparKey} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>KTP Number <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.applicantData.applicantKTPNumber}
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
                        applicantKTPNumber: e.target.value
                      }
                    })
                  }}
                  maxLength={16}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NPWP <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  value={this.state.applicantData.applicantNPWPNumber}
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
                        applicantNPWPNumber: e.target.value
                      }
                    })
                  }}
                  maxLength={15}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
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
                    applicantData: {
                      ...this.state.applicantData,
                      applicantNationality: {
                        ...this.state.applicantData.applicantNationality,
                        bizparKey: dt
                      }
                    }
                  })}
                  type="bizpar"
                  disabled={this.props.type === 'view'}
                  data={this.props.bizparNationality}
                  value={this.state.applicantData.applicantNationality.bizparKey} />
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

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getApplicant: obj => dispatch(RecruitmentAction.getApplicant(obj)),
    getApplicantName: obj => dispatch(RecruitmentAction.getApplicantName(obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(formApplicantData);
