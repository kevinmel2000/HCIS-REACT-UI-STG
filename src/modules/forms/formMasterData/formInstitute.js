import React, { Component } from "react";
import M from 'moment'

const payloadInstituteDefault = {
  "instituteID": '',
  "instituteName": '',
  "instituteAddress": '',
  "instituteStatus": 'ACTIVE',
  "instituteCreationalDTO": {}
}

class FormInstitute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data ? props.data :
        {
          ...payloadInstituteDefault,
          instituteID: 'Institute-' + M(),
          instituteCreationalDTO: {
            createdBy: this.props.user.employeeID,
            createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
            modifiedBy: this.props.user.employeeID,
            modifiedDate: null
          }
        }
    }
    console.log(this.state.data)
  }
  render() {
    let { instituteID, instituteName, instituteAddress, instituteStatus } = this.state.data
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">

          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Institute – Create Form"
                  : this.props.type === "update"
                    ? "Institute – Update Form"
                    : "Institute – View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>

          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            this.props.onClickSave(this.state.data)
          }}>
            <div className="border-bottom padding-15px grid-mobile-none gap-20px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Institute ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={instituteID}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Institute Name <span style={{ color: "red" }}>*</span></h4>
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
                  value={instituteName}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        instituteName: e.target.value
                      }
                    })
                  }}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Address <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <textarea
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  rows={5}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={instituteAddress}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        instituteAddress: e.target.value
                      }
                    })
                  }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Status</h4>
                  </div>
                </div>
                <div className="margin-15px">
                  <label className="radio">
                    <input type="checkbox" checked={instituteStatus} disabled />
                    <span className="checkmark" />
                    <div className="txt-site txt-11 txt-bold txt-main">
                      <h4>Active</h4>
                    </div>
                  </label>
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
                      type="submit"
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

export default FormInstitute;
