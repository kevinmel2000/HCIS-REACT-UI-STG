import React, { Component } from "react"
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadSocialMedia = {
  "employeeSocialMediaID": "SM-"+Date.now(),
  "emailAddress": "",
  "socialMediaType": "",
  "username": "",
}

class formSocialmediaEm extends Component {
  constructor(props) {
    super(props);
    let { employeeDataSocialMedia,bizparSocialMedia } = this.props;

    this.state = {
        employeeDataSocialMedia: employeeDataSocialMedia ? employeeDataSocialMedia : defaultPayloadSocialMedia,
      bizparSocialMedia
    };
  }

  renderForm = () => (
    <div className="border-bottom padding-15px grid grid-mobile-none gap-15px">
      {this.props.type !== "create" ? (
        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Social Media Number</h4>
            </div>
          </div>
          <input
            readOnly
            style={{ backgroundColor: "#E6E6E6" }}
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
            required
            value={this.state.employeeDataSocialMedia.employeeSocialMediaID}
          />
        </div>
      ) : null}

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Social Media Type <span style={{ color: "red" }}>*</span></h4>
          </div>
        </div>
        <DropDown
          title="-- please select social media type --"
          onChange={e =>
            this.setState({
                employeeDataSocialMedia: {
                ...this.state.employeeDataSocialMedia,
                socialMediaType: {
                  ...this.state.employeeDataSocialMedia.socialMediaType,
                  bizparKey: e
                }
              }
            })
          }
          type="bizpar"
          disabled={this.props.type === "view" ? true : false}
          data={this.props.bizparSocialMedia}
          value={this.state.employeeDataSocialMedia.socialMediaType && this.state.employeeDataSocialMedia.socialMediaType.bizparKey} />
      </div>

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Username <span style={{ color: "red" }}>*</span></h4>
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
          value={this.state.employeeDataSocialMedia.username}
          onChange={e =>
            this.setState({
                employeeDataSocialMedia: {
                ...this.state.employeeDataSocialMedia,
                username: e.target.value
              }
            })
          }
        />
      </div>

      <div className="margin-bottom-20px">
        <div className="margin-5px">
          <div className="txt-site txt-11 txt-main txt-bold">
            <h4>Email Address</h4>
          </div>
        </div>
        <input
          readOnly={this.props.type === "view" ? true : false}
          style={
            this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
          }
          type="email"
          className="txt txt-sekunder-color"
          placeholder=""
          value={this.state.employeeDataSocialMedia.emailAddress}
          onChange={e =>
            this.setState({
                employeeDataSocialMedia: {
                ...this.state.employeeDataSocialMedia,
                emailAddress: e.target.value
              }
            })
          }
        />
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
  );

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Employee Detail – Social Media – Create Form"
                  : this.props.type === "update"
                  ? "Employee Detail – Social Media – Edit Form"
                  : "Employee Detail – Social Media – View Form"}
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
              if (R.isEmpty(this.state.employeeDataSocialMedia.socialMediaType) || R.isEmpty(this.state.employeeDataSocialMedia.socialMediaType.bizparKey)) {
                return alert('Social Media Type is Required.')
              }
              else
                this.props.onClickSave(this.state.employeeDataSocialMedia)
            }}>
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formSocialmediaEm;





