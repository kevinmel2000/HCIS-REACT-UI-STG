import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'

import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'

const defaultPayloadInfromEdu = {
  "applicantInformalEducationID": "IE-" + Date.now(),
  "informalEducationCity": "",
  "informalEducationContactPerson": "",
  "informalEducationCostSource": "",
  "informalEducationEndDate": "",
  "informalEducationGeneration": "",
  "informalEducationInstituteName": "",
  "informalEducationName": "",
  "informalEducationNotes": "",
  "informalEducationStartDate": "",
  "informalEducationTelpNumber": "",
  "informalEducationTrainingType": "",
  "informalEducationCertificateNumber": "",
  "informalEducationCertificateDate": ""
}

class FormOutsourceInformalEduDetail extends Component {
  constructor(props) {
    super(props);
    let { applicantDataInformEdu, bizparTrainingType, bizparCostType } = this.props;

    this.state = {
      applicantDataInformEdu: applicantDataInformEdu ? {
        ...applicantDataInformEdu,
        informalEducationStartDate: M(applicantDataInformEdu.informalEducationStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        informalEducationEndDate: M(applicantDataInformEdu.informalEducationEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        informalEducationCertificateDate: R.isEmpty(applicantDataInformEdu.informalEducationCertificateDate) || R.isNil(applicantDataInformEdu.informalEducationCertificateDate) ? '' : M(applicantDataInformEdu.informalEducationCertificateDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      } : defaultPayloadInfromEdu,
      bizparTrainingType, bizparCostType,
      certificateStateVisible: false,
      dataGeneration: [
        { id: '1', bizparKey: '1', bizparValue: '1' },
        { id: '2', bizparKey: '2', bizparValue: '2' },
        { id: '3', bizparKey: '3', bizparValue: '3' },
        { id: '4', bizparKey: '4', bizparValue: '4' }
      ]
    };
  }

  handleChange(e) {
    this.setState({
      applicantDataInformEdu: {
        ...this.state.applicantDataInformEdu,
        informalEducationTrainingType: {
          ...this.state.applicantDataInformEdu.informalEducationTrainingType,
          bizparKey: e.target.value
        }
      }
    }
    );
    if (e.target.value === "TRATYP-002") {
      this.setState({
        certificateStateVisible: true
      })
    }
    else {
      this.setState({
        certificateStateVisible: false
      })
    }
  }

  handlePhoneNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      applicantDataInformEdu: {
        ...this.state.applicantDataInformEdu,
        informalEducationTelpNumber: e.target.value
      }
    })
  }

  render() {
    const trainingType = this.state.applicantDataInformEdu.informalEducationTrainingType.bizparKey;
    if (trainingType === "TRATYP-002") {
      this.state.certificateStateVisible = true
    }
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Profile - Informal Education - Create Form"
                  : this.props.type === "update"
                    ? "Profile - Informal Education - Edit Form"
                    : "Profile - Informal Education - View Form"}
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
          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Informal Education Number</h4>
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
                        this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.applicantInformalEducationID
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
                      date={this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationStartDate}
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationStartDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationEndDate}
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationEndDate: M(e).format('YYYY-MM-DD')
                        }
                      })} />
                  </div>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Training Type <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select training type --"
                    onChange={(dt) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationTrainingType: {
                          ...this.state.applicantDataInformEdu.informalEducationTrainingType,
                          bizparKey: dt
                        }
                      },
                      certificateStateVisible: dt === "TRATYP-002" ? true : false
                    })
                    }
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparTrainingType}
                    value={this.state.applicantDataInformEdu.informalEducationTrainingType && this.state.applicantDataInformEdu.informalEducationTrainingType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Training Name <span style={{ color: "red" }}>*</span></h4>
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
                    value={
                      this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationName
                    }
                    onChange={(e) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationName: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Generation</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education generation --"
                    onChange={(dt) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationGeneration: dt
                      }
                    })}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.dataGeneration}
                    type="bizpar"
                    value={this.state.applicantDataInformEdu && String(this.state.applicantDataInformEdu.informalEducationGeneration)} />
                </div>

                {this.state.certificateStateVisible && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Certificate Number <span style={{ color: "red" }}>*</span></h4>
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
                      value={
                        this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationCertificateNumber
                      }
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationCertificateNumber: e.target.value
                        }
                      })}
                    />
                  </div>
                )}

                {this.state.certificateStateVisible && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Date of Certificate <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      date={this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationCertificateDate}
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationCertificateDate: e
                        }
                      })} />
                  </div>
                )}

                {this.state.certificateStateVisible && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Cost of Education <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select cost type --"
                      onChange={(dt) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationCostSource: {
                            ...this.state.applicantDataInformEdu.informalEducationCostSource,
                            bizparKey: dt
                          }
                        }
                      })
                      }
                      type="bizpar"
                      disabled={this.props.type === "view" ? true : false}
                      data={this.props.bizparCostType}
                      value={this.state.applicantDataInformEdu.informalEducationCostSource && this.state.applicantDataInformEdu.informalEducationCostSource.bizparKey} />
                  </div>
                )}
                {!this.state.certificateStateVisible && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Institution Name</h4>
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
                      value={
                        this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationInstituteName
                      }
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationInstituteName: e.target.value
                        }
                      })}
                    />
                  </div>
                )}
              </div>

              <div className="column-2">
                {this.state.certificateStateVisible && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Institution Name</h4>
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
                      value={
                        this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationInstituteName
                      }
                      onChange={(e) => this.setState({
                        applicantDataInformEdu: {
                          ...this.state.applicantDataInformEdu,
                          informalEducationInstituteName: e.target.value
                        }
                      })}
                    />
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
                    value={
                      this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationCity
                    }
                    onChange={(e) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationCity: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Contact Person</h4>
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
                    value={
                      this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationContactPerson
                    }
                    onChange={(e) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationContactPerson: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone Number</h4>
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
                    value={
                      this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationTelpNumber
                    }
                    onChange={this.handlePhoneNumber.bind(this)}
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
                    value={
                      this.state.applicantDataInformEdu && this.state.applicantDataInformEdu.informalEducationNotes
                    }
                    onChange={(e) => this.setState({
                      applicantDataInformEdu: {
                        ...this.state.applicantDataInformEdu,
                        informalEducationNotes: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.props.onClickSave.bind(this)}
                    >
                      <span>SAVE</span>
                    </button>
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
export default FormOutsourceInformalEduDetail;
