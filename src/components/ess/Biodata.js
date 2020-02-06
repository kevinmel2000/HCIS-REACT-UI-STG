import React, { Component } from "react";
import FormFamily from "../../modules/formEss/biodata/formFamily";
import FormEmployee from "../../modules/formEss/biodata/formEmployee";
import FormInformalEdu from "../../modules/formEss/biodata/formInformalEdu";
import FormFormalEdu from "../../modules/formEss/biodata/formFormalEdu";
import FormWorkExp from "../../modules/formEss/biodata/formWorkExp";
import FormOrganizationExp from "../../modules/formEss/biodata/formOrganizationExp";
import FormAbility from "../../modules/formEss/biodata/formAbility";
import FormLanguageSkill from "../../modules/formEss/biodata/formLanguageSkill";
import FormWorkingHistory from "../../modules/formEss/biodata/formWorkingHistory";
import FormSocialMedia from "../../modules/formEss/biodata/formSocialMedia";
import API from "../../Services/Api";
import { connect } from "react-redux";
import * as R from "ramda";
import FormHistory from "../../modules/formEss/biodata/formHistory";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import { Redirect } from "react-router-dom";

class Biodata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      formEmployeeVisible: true,
      formFamilyVisible: false,
      formHistoryVisible: false,
      formInformalEduVisible: false,
      formFormalEduVisible: false,
      formWorkExpVisible: false,
      formOrganizationExpVisible: false,
      formAbilityVisible: false,
      formLanguageSkillVisible: false,
      formWorkingHistoryVisible: false,
      formSocialMediaVisible: false,
      selectedIndex: null,
      printClass: "app-popup",
      rawData: [],
      addressData: [],
      dataTablePph: [],
      loading:false,
      activeTab: "Employee Data",
      tabMenu: ["Employee Data", "History"],
      auth: props.auth,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    };
    this.idleTimer = null;
  }

  logout() {
    this.props.authLogout();
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  }

  onAction() {
    this.setState({ isTimedOut: false });
  }

  onActive() {
    this.setState({ isTimedOut: false });
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again");
      this.logout();
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };
  opContent = title => e => {
    let allStateVisibleFalse = {
      ...this.state,
      formEmployeeVisible: false,
      formHistoryVisible: false,
      formFamilyVisible: false,
      formInformalEduVisible: false,
      formFormalEduVisible: false,
      formWorkExpVisible: false,
      formOrganizationExpVisible: false,
      formAbilityVisible: false,
      formLanguageSkillVisible: false,
      formWorkingHistoryVisible: false,
      formSocialMediaVisible: false,
      activeTab: title
    };

    switch (title) {
      case "Employee Data":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmployeeVisible: true
        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formHistoryVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  async getEmployee() {
    let payloadBiodata = {
      employeeID: this.state.auth.user.employeeID
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeById(payloadBiodata)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              rawData: res.data.data
            });
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  async getAddressByRefObjectID() {
    let payloadAddreess = {
      params: {
        refObjectID: this.state.auth.user.employeeID
      },
      offset: 0,
      limit: 100
    };
    API.create("MASTERDATA")
      .getAddressByRefObjectID(payloadAddreess)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S" && !R.isNil(res.data.data)) {
            this.setState({ addressData: res.data.data });
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  async getImage() {
    let { auth } = this.state;
    this.setState({ loading: true, imageUrl: '' })
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.photo.get/" +
        auth.user.employeeID,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        }
      }
    );
    response = await response.blob();
    if (response.size > 0) {
      setTimeout(() => {
        response = URL.createObjectURL(response);
        this.setState({ imageUrl: response, loading: false })
      }, 500)
    } else {
      setTimeout(() => {
        this.setState({ imageUrl: '', loading: false })
      }, 500)
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.onFinishFetch();
      this.getEmployee();
      this.getAddressByRefObjectID();
      this.getImage();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false
    });
  };

  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
    return (
      <div className="main-content">
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout}
        />
        <div className="card-navigator">
          <div className="c-n-top">
            <div className="grid grid-2x padding-bottom-15px">
              <div className="col-1">
                <div className="txt-site txt-20 txt-bold txt-main padding-top-5px">
                  Employee Self Service - Biodata
                </div>
              </div>
            </div>
            <div className="display-flex-normal">
              <div className="width width-300px">
                <ul className="vertical-tab">
                  {this.state.tabMenu.map((data, index) => {
                    return this.opNavigator(data);
                  })}
                </ul>
              </div>

              <div className="width width-all">
                <div>
                  {this.state.formEmployeeVisible && (
                    <FormEmployee
                      biodata={this.state.rawData}
                      address={this.state.addressData}
                      photo={this.state.imageUrl}
                      loading={this.state.loading}
                    />
                  )}

                  {this.state.formHistoryVisible && <FormHistory />}

                  {this.state.formFamilyVisible && (
                    <FormFamily biodata={this.state.rawData.employeeFamilies} />
                  )}

                  {this.state.formInformalEduVisible && (
                    <FormInformalEdu
                      biodata={this.state.rawData.employeeInformalEducations}
                    />
                  )}

                  {this.state.formFormalEduVisible && (
                    <FormFormalEdu
                      biodata={this.state.rawData.employeeFormalEducations}
                    />
                  )}

                  {this.state.formWorkExpVisible && (
                    <FormWorkExp
                      biodata={this.state.rawData.employeeWorkExperiences}
                    />
                  )}

                  {this.state.formOrganizationExpVisible && (
                    <FormOrganizationExp
                      biodata={
                        this.state.rawData.employeeOrganizationExperiences
                      }
                    />
                  )}

                  {this.state.formAbilityVisible && (
                    <FormAbility
                      biodata={this.state.rawData.employeeSpecialAbilities}
                    />
                  )}

                  {this.state.formLanguageSkillVisible && (
                    <FormLanguageSkill
                      biodata={this.state.rawData.employeeLanguageSkills}
                    />
                  )}

                  {this.state.formWorkingHistoryVisible && (
                    <FormWorkingHistory
                      biodata={this.state.rawData.employeeWorkExperiences}
                    />
                  )}

                  {this.state.formSocialMediaVisible && (
                    <FormSocialMedia
                      biodata={this.state.rawData.employeeSocialMedias}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Biodata);
