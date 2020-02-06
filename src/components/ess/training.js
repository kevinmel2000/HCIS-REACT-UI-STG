import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api";
import M from "moment";
import { connect } from "react-redux";
import FormTraining from "../../modules/formEss/formTraining";
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from "react-split-pane";
import { Redirect } from "react-router-dom";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import * as R from "ramda";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Training extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoVisible: false,
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      dataTableTraining: [],
      rawData: [],
      selectedIndex: [],
      auth: props.auth,

      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    };
    this.idleTimer = null;
    this.handleSubmit = this.handleSubmit.bind(this);
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

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 870
    });
  };

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    });
  };

  opSidePage = (menu, index) => e => {
    this.setState({
      infoVisible: false,
      selectedIndex: index
    });

    this.opResizePane();

    switch (menu) {
      case "slide-training":
        this.setState({
          infoVisible: true,
          selectedIndex: index
        });
        break;
      default:
        break;
    }
  };

  getDataTraining() {
    let payload = {
      offset: 0,
      limit: 100,
      params: {
        // status: "APPROVED"
      }
    };
    API.create("TRAINING_QUERY")
      .getAllTrainingRegis(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            let dataTableTraining = res.data.data.map((value, index) => {
              const {
                trainingRegistrationID,
                trainingRegistrationDate,
                trainingRegistrationStatus,
                trainingRegistrationType
              } = value;

              return [
                (index += 1),
                trainingRegistrationID,
                trainingRegistrationDate,
                trainingRegistrationStatus,
                trainingRegistrationType
              ];
            });
            this.setState({
              rawData: res.data.data,
              dataTableTraining
            });
          } else {
            this.onFinishFetch();
            alert("Failed: " + res.data.message);
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.message);
          this.onFinishFetch();
        }
      });
  }

  async handleSave(value) {
    value = {
      taskID: "",
      senderUserID: this.state.auth.user.userID,
      senderEmpID: this.state.auth.user.employeeID,
      senderNotes: "",
      senderBPMStatus: "INITIATE",
      data: {
        employeeID: this.state.auth.user.employeeID,
        esID: this.state.auth.user.companyID,
        trainingID: this.state.rawData[this.state.selectedIndex].trainingID
      }
    };
    if (this.state.rawData[this.state.selectedIndex].availableCapacity <= 0) {
      alert("Training is out of quota");
      this.openConfirmPopUp();
      this.clResizePane();
      this.getDataTraining();
    } else {
      let response = await API.create("BPM").submitTraining(value);
      console.log(response);
      if (response.ok && response.data.status === "S") {
        this.openSavePopUp();
      } else {
        alert("You have already registered for this training");
        this.openConfirmPopUp();
        this.clResizePane();
        this.getDataTraining();
      }
    }
  }

  handleSubmit = () => {
    this.handleSave();
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataTraining();
    }
  }

  openSavePopUp = () => {
    if (this.state.savePopUpVisible) this.getDataTraining();
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false
    });
  };

  openConfirmPopUp = index => {
    this.setState({
      confirmPopUpVisible: !this.state.confirmPopUpVisible,
      selectedIndex: index
    });
  };

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No",
    "Registration ID",
    "Registration Date",
    "Status",
    "Type",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {/* <button
                className="btn btn-blue"
                style={{ marginRight: 5 }}
                onClick={() => this.openConfirmPopUp(tableMeta.rowIndex)}
              >
                Register
              </button> */}
              <button
                className="btnAct"
                onClick={this.opSidePage("slide-training", tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <div className="col-1 backgorund-white"></div>
        <div className="col-2 background-white">
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
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={
                <div>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="a-s-p-place a-s-p-content active">
                    <div className="a-s-p-mid">
                      <div className="padding-10px">
                        <div className="app-open-close margin-bottom-20px">
                          <div className="app-open-close-content">
                            <MuiThemeProvider theme={getMuiTheme()}>
                              <MUIDataTable
                                title={"Employee Self Service - Training"}
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableTraining}
                                columns={this.columns}
                                options={options}
                              />
                            </MuiThemeProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              side={
                <div className="a-s-p-side">
                  {this.state.infoVisible && (
                    <FormTraining
                      tData={this.state.rawData[this.state.selectedIndex]}
                      closeSlide={this.clResizePane}
                    />
                  )}
                </div>
              }
            />
            {this.state.confirmPopUpVisible && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUp.bind(this)}
                onClickSimpan={this.handleSubmit}
              />
            )}
            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}
          </div>
        </div>
      </SplitPaneSecond>
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

export default connect(mapStateToProps, mapDispatchToProps)(Training);
