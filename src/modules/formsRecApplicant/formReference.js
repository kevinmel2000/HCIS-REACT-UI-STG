import React, { Component } from "react";
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadReference = {
  "applicantReferenceID": "R-" + M(),
  "referenceNotes": "",
  "referencePersonAddress": "",
  "referencePersonName": "",
  "referencePersonRelationship": "",
  "referencePersonTelpNumber": "",
  "referenceType": "",
  "referencePersonOccupation": "",
}

class formReference extends Component {
  constructor(props) {
    super(props);
    let { applicantDataReference, bizparReference } = this.props;

    this.state = {
      applicantDataReference: applicantDataReference ? applicantDataReference : defaultPayloadReference,
      bizparReference
    };
  }

  renderForm = () => (
    <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
      <div className="column-1">
        {this.props.type !== "create" ? (
          <div className="margin-bottom-20px">
            <div className="margin-5px">
              <div className="txt-site txt-11 txt-main txt-bold">
                <h4>Reference Number</h4>
              </div>
            </div>
            <input
              readOnly
              style={{ backgroundColor: "#E6E6E6" }}
              type="text"
              className="txt txt-sekunder-color"
              placeholder=""
              required
              value={this.state.applicantDataReference.applicantReferenceID}
            />
          </div>
        ) : null}

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Reference Type <span style={{ color: "red" }}>*</span></h4>
            </div>
          </div>
          <DropDown
            title="-- please select reference type --"
            onChange={(dt) => this.setState({
              applicantDataReference: {
                ...this.state.applicantDataReference,
                referenceType: {
                  ...this.state.applicantDataReference.referenceType,
                  bizparKey: dt
                }
              }
            })}
            type="bizpar"
            disabled={this.props.type === "view" ? true : false}
            data={this.props.bizparReference}
            value={this.state.applicantDataReference.referenceType.bizparKey} />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Name <span style={{ color: "red" }}>*</span></h4>
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
            value={this.state.applicantDataReference.referencePersonName}
            onChange={e =>
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referencePersonName: e.target.value
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
              this.props.type === "view"
                ? { backgroundColor: "#E6E6E6" }
                : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={this.state.applicantDataReference.referencePersonAddress}
            onChange={e =>
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referencePersonAddress: e.target.value
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
              this.props.type === "view"
                ? { backgroundColor: "#E6E6E6" }
                : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={this.state.applicantDataReference.referencePersonTelpNumber}
            onChange={e => {
              if (isNaN(e.target.value)) return true
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referencePersonTelpNumber: e.target.value
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
              this.props.type === "view"
                ? { backgroundColor: "#E6E6E6" }
                : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={this.state.applicantDataReference.referencePersonOccupation}
            onChange={e =>
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referencePersonOccupation: e.target.value
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
              this.props.type === "view"
                ? { backgroundColor: "#E6E6E6" }
                : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            value={this.state.applicantDataReference.referencePersonRelationship}
            onChange={e =>
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referencePersonRelationship: e.target.value
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
            value={this.state.applicantDataReference.referenceNotes}
            onChange={e =>
              this.setState({
                applicantDataReference: {
                  ...this.state.applicantDataReference,
                  referenceNotes: e.target.value
                }
              })
            }
          />
        </div>
      </div>
    </div>
  )

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
  )

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Applicant Detail - Reference- Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Reference - Edit Form"
                    : "Applicant Detail - Reference - View Form"}
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
            if (R.isEmpty(this.state.applicantDataReference.referenceType) || R.isEmpty(this.state.applicantDataReference.referenceType.bizparKey)) {
              return alert('Reference Type is Required.')
            }
            else
              this.props.onClickSave(this.state.applicantDataReference)
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

export default formReference;
