import React, { Component } from "react";
import DropDown from "../../../modules/popup/DropDown";
import M from "moment";

class FormOutsourceIdentity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  handlePhoneNumber = e => {
    if (isNaN(e.target.value)) return true;
  };

  render() {
    let { data } = this.state
    return (
      <div className="vertical-tab-content active" id={this.props.id}>
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Outsource ID</h4>
                  </div>
                </div>
                <input
                  value={data.outsourceID}
                  style={{ backgroundColor: "#E6E6E6" }}
                  readOnly
                  type="text"
                  className="txt txt-sekunder-color"
                  required
                  placeholder={"Outsource ID"}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      KTP Number<span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"KTP Number"}
                  required
                  value={data.osKTP}
                  onChange={(e) => this.setState({
                    data: { ...data, osKTP: e.target.value }
                  })}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Name<span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"Name"}
                  required
                  value={data.outsourceName}
                  onChange={(e) => this.setState({
                    data: { ...data, outsourceName: e.target.value }
                  })}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Address<span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <textarea
                  type="text"
                  className="txt txt-sekunder-color"
                  rows={4}
                  placeholder={"Address"}
                  value={data.osKtpAddress}
                  onChange={(e) => this.setState({
                    data: { ...data, osKtpAddress: e.target.value }
                  })}
                  required
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Phone Number</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"Phone Number"}
                  onChange={(e) => this.setState({
                    data: { ...data, osPhoneHP: e.target.value }
                  })}
                  value={data.osPhoneHP}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Email</h4>
                  </div>
                </div>
                <input
                  type="email"
                  className="txt txt-sekunder-color"
                  placeholder={"Email"}
                  value={data.osEmail}
                  onChange={(e) => this.setState({
                    data: { ...data, osEmail: e.target.value }
                  })}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Work Experience In Year</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"Work Experience"}
                  required
                  value={data.osNoWorkExperienceYear}
                  onChange={(e) => this.setState({
                    data: { ...data, osNoWorkExperienceYear: e.target.value }
                  })}
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Default Billing Rate
                      <span style={{ color: "red" }}>*(Day/Month)</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"Default Billing"}
                  required
                  value={data.osDefaultBillingRate}
                  onChange={(e) => this.setState({
                    data: { ...data, osDefaultBillingRate: e.target.value }
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
                    onClick={() => this.props.onClickSave('identity', data)}
                  >
                    <span>SAVE</span>
                  </button>
                ) : (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.props.onClickClose}
                    >
                      <span>CLOSE</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormOutsourceIdentity;
