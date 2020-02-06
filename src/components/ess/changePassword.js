import React, { Component } from "react";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api";
import { connect } from "react-redux";
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import M from "moment";
import LoadingBar from "react-top-loading-bar";
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

class pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopupVisible: false,
      auth: props.auth,
      payloadChangePassword: this.defaultChangePassword,
      typeOldPass: false,
      typeNewPass: false,
      typeRePass: false,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
  }

  defaultChangePassword = {
    oldPassword: "",
    confirmNewPassword: "",
    newPassword: "",
    modifiedAt: "",
    modifiedBy: ""
  };

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.onFinishFetch();
    }
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  changePasswordDataUser() {
    let payload = {
      ...this.state.payloadChangePassword,
      userID: this.state.auth.user.userID,
      oldPassword: this.state.payloadChangePassword.oldPassword,
      newPassword: this.state.payloadChangePassword.newPassword,
      confirmNewPassword: this.state.payloadChangePassword.confirmNewPassword,
      modifiedAt: M().format("DD-MM-YYYY HH:mm:ss"),
      modifiedBy: this.state.auth.user.employeeName
    };
    if (
      payload.newPassword.length < 8 &&
      payload.confirmNewPassword.length < 8
    ) {
      return alert("Password cannot be less than 8 characters");
    }
    API.create("IDP")
      .updateUserPassword(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.openSavePopup();
          } else {
            alert("Failed: " + res.data.message);
          }
        } else if (res.data.status === "F") {
          alert("Failed: " + res.data.message);
        }
      });
  }

  handleSubmit() {
    this.changePasswordDataUser();
  }

  showPassword = type => {
    switch (type) {
      case "old":
        this.setState({ typeOldPass: !this.state.typeOldPass });
        break;
      case "new":
        this.setState({ typeNewPass: !this.state.typeNewPass });
        break;
      case "confirm":
        this.setState({ typeRePass: !this.state.typeRePass });
        break;
      default:
        break;
    }
  };

  openSavePopup = () => {
    if (this.state.savePopupVisible) this.onFinishFetch();
    this.setState({
      savePopupVisible: !this.state.savePopupVisible,
      typeOldPass: false,
      typeNewPass: false,
      typeRePass: false
    });
    document.getElementById("changePassword").reset();
  };

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />
        <div className="padding-10px">
          <div
            className="padding-20px margin-bottom-10px"
            style={{ textAlign: "center" }}
          >
            <h2 className="txt-20 txt-main">
              <i className="fa fa-lg fa-user-circle margin-right-10px margin-top-5px"></i>
              Employee Self Service - Change Password
            </h2>
          </div>

          <div className="display-flex-normal margin-bottom-10px ">
            <div
              style={{ width: "35%", margin: "auto", borderRadius: "5px" }}
              className="background-white shadow-lg p-3 mb-5"
            >
              <div
                className="txt-site txt-13 txt-bold txt-main padding-top-30px"
                style={{
                  textAlign: "center",
                  justifyContent: "center"
                }}
              >
                <h3>
                  <i className="fa fa-lock padding-right-5px" />
                  Change Password
                </h3>
              </div>
              <div className="padding-15px">
                <form id="changePassword">
                  <div className="padding-15px grid grid-mobile-none gap-20px">
                    <div className="column-1">
                      <div className="card-date-picker">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Username <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="double margin-bottom-20px">
                          <input
                            style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                            className="input"
                            required
                            value={this.state.auth.user.userName}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="card-date-picker">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Old Password <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="double margin-bottom-20px">
                          <input
                            style={{ padding: 15 }}
                            type={this.state.typeOldPass ? "text" : "password"}
                            className="input"
                            required
                            placeholder="Old Password"
                            onChange={e =>
                              this.setState({
                                payloadChangePassword: {
                                  ...this.state.payloadChangePassword,
                                  oldPassword: e.target.value
                                }
                              })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-grey border-left btn-no-radius"
                            onClick={this.showPassword.bind(this, "old")}
                          >
                            <i
                              className={
                                this.state.typeOldPass
                                  ? "fa fa-lg fa-eye-slash"
                                  : "fa fa-lg fa-eye"
                              }
                            />
                          </button>
                        </div>
                      </div>
                      <div className="card-date-picker">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              New Password <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="double margin-bottom-20px">
                          <input
                            style={{ padding: 15 }}
                            type={this.state.typeNewPass ? "text" : "password"}
                            className="input"
                            required
                            placeholder="New Password"
                            minLength="8"
                            onChange={e =>
                              this.setState({
                                payloadChangePassword: {
                                  ...this.state.payloadChangePassword,
                                  newPassword: e.target.value
                                }
                              })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-grey border-left btn-no-radius"
                            onClick={this.showPassword.bind(this, "new")}
                          >
                            <i
                              className={
                                this.state.typeNewPass
                                  ? "fa fa-lg fa-eye-slash"
                                  : "fa fa-lg fa-eye"
                              }
                            />
                          </button>
                        </div>
                      </div>
                      <div className="card-date-picker">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Confirm New Password <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="double margin-bottom-20px">
                          <input
                            style={{ padding: 15 }}
                            type={this.state.typeRePass ? "text" : "password"}
                            className="input"
                            required
                            placeholder="New Password"
                            minLength="8"
                            onChange={e =>
                              this.setState({
                                payloadChangePassword: {
                                  ...this.state.payloadChangePassword,
                                  confirmNewPassword: e.target.value
                                }
                              })
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-grey border-left btn-no-radius"
                            onClick={this.showPassword.bind(this, "confirm")}
                          >
                            <i
                              className={
                                this.state.typeRePass
                                  ? "fa fa-lg fa-eye-slash"
                                  : "fa fa-lg fa-eye"
                              }
                            />
                          </button>
                        </div>
                      </div>

                      <div className="content-center">
                        <button
                          className="btn btn-blue btn-width-all"
                          onClick={this.handleSubmit.bind(this)}
                        >
                          SAVE
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {this.state.savePopupVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopup}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(pages);
