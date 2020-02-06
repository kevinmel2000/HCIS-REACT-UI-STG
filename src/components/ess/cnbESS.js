import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import LoadingBar from "react-top-loading-bar";
import MUIDataTable from "mui-datatables-bitozen";
import FormCNBDetail from "../../modules/formEss/formCnbDetail";
import API from "../../Services/Api";
import { connect } from "react-redux";
import M from "moment";
import * as R from "ramda";
import { Redirect } from "react-router-dom";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class travelEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      deletePopUpVisible: false,
      rawData: [],
      selectedIndex: [],
      dataTableCNB:[],
      createVisible: false,
      detailVisible: false,
      auth: props.auth,

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

  getCNB() {
    let payload = {
      params: {
        employeeID: this.state.auth.user.employeeID,
        companyID: this.state.auth.user.companyID,
        positionID: this.state.auth.user.positionID
      },
      limit: 100,
      offset: 0
    };
    API.create("CNB_QUERY")
      .getComponentClaimByEmpCompPosition(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            let dataTableCNB = res.data.data.map(value => {
              const { claimCNBType, claimCNBBudget, claimCNBRemainingBudget } = value;
              return [
                claimCNBType.bizparValue,
                new Intl.NumberFormat("ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(claimCNBBudget),
                new Intl.NumberFormat("ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(claimCNBRemainingBudget)
              ];
            });
            this.onFinishFetch();
            this.setState({
              rawData: res.data.data,
              dataTableCNB
            });
          } else {
            alert("Failed: " + res.data.message);
            this.onFinishFetch();
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

  openCreateForm = index => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      savePopUpVisible,
      selectedIndex: index
    });
  };

  openDetailForm = index => {
    this.setState({
      detailVisible: !this.state.detailVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    if (this.state.savePopUpVisible) this.getCNB();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false,
      createVisible: false
    });
  };

  openConfirmPopUp = data => {
    if (this.state.confirmPopUpVisible) this.getCNB();
    this.setState({
      dataPayload: data,
      confirmPopUpVisible: !this.state.confirmPopUpVisible
    });
  };

  async submitCNB(value) {
    let remainingBudget =
      !R.isEmpty(value.claimCNBRemainingBudget) ||
      !R.isNil(value.claimCNBRemainingBudget)
        ? String(value.claimCNBRemainingBudget)
            .split(",")
            .join("")
        : value.claimCNBRemainingBudget;
    value = {
      taskID: "",
      senderUserID: this.state.auth.user.userID,
      senderEmpID: this.state.auth.user.employeeID,
      senderNotes: "",
      senderBPMStatus: "INITIATE",
      data: {
        claimID: value.claimID,
        claimDescription: value.claimDescription,
        claimBudget: value.claimCNBBudget ? value.claimCNBBudget : 0,
        claimValue: Number(remainingBudget),
        claimURL: value.claimURL,
        claimStatus: "INITIATE",
        claimType: value.claimCNBType ? value.claimCNBType.bizparKey : "",
        employee: this.state.auth.user ? this.state.auth.user.employeeID : "",
        claimDate: M().format("DD-MM-YYYY HH:mm:ss"),
        invoiceDate: M().format("DD-MM-YYYY HH:mm:ss"),
        cnbTPLID: value.cnbtplid ? value.cnbtplid : "",
        createdBy: "SYSTEM",
        createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
        updatedBy: "",
        updatedDate: ""
      }
    };
    let response = await API.create("BPM").submitClaim(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
    } else {
      alert("Failed" + response.message);
    }
  }

  handleSubmit = value => {
    this.submitCNB(value);
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getCNB();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "C&B Type",
    "Budget",
    "Remaining Budget",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openCreateForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-1x fa-plus" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} ></i>
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
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
    let { rawData, selectedIndex } = this.state;
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
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px grid grid-2x">
          <div className="col-1">
            {/* <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              Employee Self Service - C&B
            </div> */}
          </div>
        </div>
        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Employee Self Service - C&B"
              subtitle={'lorem ipsum dolor'}
              data={this.state.dataTableCNB}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <FormCNBDetail
            type={"create"}
            data={rawData[selectedIndex]}
            onClickClose={this.openCreateForm.bind(this)}
            onClickProcess={this.openConfirmPopUp.bind(this)}
          />
        )}
        {this.state.detailVisible && (
          <FormCNBDetail
            type={"view"}
            dataView={rawData[selectedIndex]}
            onClickClose={this.openDetailForm.bind(this)}
          />
        )}

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp.bind(this)}
          />
        )}

        {this.state.confirmPopUpVisible && (
          <PopUp
            type={"simpan"}
            class={"app-popup app-popup-show"}
            onClick={this.openConfirmPopUp.bind(this)}
            onClickSimpan={() => this.handleSubmit(this.state.dataPayload)}
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

export default connect(mapStateToProps, mapDispatchToProps)(travelEx);
