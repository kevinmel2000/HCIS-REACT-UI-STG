import React, { Component } from "react";
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadEmergency = {
  "applicantEmergencyContactID": "EC-" + Date.now(),
  "emergencyContactNotes": "",
  "emergencyContactPersonName": "",
  "emergencyContactPersonPosition": "",
  "emergencyContactPersonRelationship": "",
  "emergencyContactPersonTelpNumber": "",
  "emergencyContactPersonAddress": "",
}

class formEmergencyContact extends Component {
  constructor(props) {
    super(props);
    let { applicantDataEmergency } = this.props;

    this.state = {
      applicantDataEmergency: applicantDataEmergency ? applicantDataEmergency : defaultPayloadEmergency
    };
  }

  renderForm = () => (
    <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
      <div className="column-1">
        {this.props.type !== "create" ? (
          <div className="margin-bottom-20px">
            <div className="margin-5px">
              <div className="txt-site txt-11 txt-main txt-bold">
                <h4>Emergency Number</h4>
              </div>
            </div>
            <input
              readOnly
              style={{ backgroundColor: "#E6E6E6" }}
              type="text"
              className="txt txt-sekunder-color"
              placeholder=""
              value={
                this.state.applicantDataEmergency.applicantEmergencyContactID
              }
            />
          </div>
        ) : null}

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Name <span style={{ color: "red" }}>*</span></h4>
            </div>
          </div>
          <input
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={this.state.applicantDataEmergency.emergencyContactPersonName}
            onChange={e =>
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactPersonName: e.target.value
                }
              })
            }
          />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Address</h4>
            </div>
          </div>
          <textarea
            rows={5}
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={
              this.state.applicantDataEmergency.emergencyContactPersonAddress
            }
            onChange={e =>
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactPersonAddress: e.target.value
                }
              })
            }
          />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Phone <span style={{ color: "red" }}>*</span></h4>
            </div>
          </div>
          <input
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={
              this.state.applicantDataEmergency.emergencyContactPersonTelpNumber
            }
            onChange={e => {
              if (isNaN(e.target.value)) return true
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactPersonTelpNumber: e.target.value
                }
              })
            }}
          />
        </div>
      </div>

      <div className="column-2">
        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Job / Position</h4>
            </div>
          </div>
          <input
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={
              this.state.applicantDataEmergency.emergencyContactPersonPosition
            }
            onChange={e =>
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactPersonPosition: e.target.value
                }
              })
            }
          />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Relationship</h4>
            </div>
          </div>
          <input
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={
              this.state.applicantDataEmergency
                .emergencyContactPersonRelationship
            }
            onChange={e =>
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactPersonRelationship: e.target.value
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
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={this.state.applicantDataEmergency.emergencyContactNotes}
            onChange={e =>
              this.setState({
                applicantDataEmergency: {
                  ...this.state.applicantDataEmergency,
                  emergencyContactNotes: e.target.value
                }
              })
            }
          />
        </div>
      </div>
    </div>
  );

  renderFooter = () => (
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
  );
  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Applicant Detail - Emergency Contact - Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Emergency Contact - Edit Form"
                    : "Applicant Detail - Emergency Contact - View Form"}
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
            this.props.onClickSave(this.state.applicantDataEmergency)
          }}
          >
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formEmergencyContact;



