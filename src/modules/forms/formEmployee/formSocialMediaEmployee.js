import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormSocialMedia from "./formSocialMediaEm";
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");

class formSocialMediaEmployee extends Component {
  constructor(props) {
    super(props);
    let { employeeData, bizparSocialMedia } = this.props;

    this.state = {
      employeeData,
      dataTableSocialMedia: [],
      createPopUpVisible: false,
      deletePopUpVisible: false,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      notifVisible: false,
      message: "",
      auth: props.auth,
      bizparSocialMedia,
      sendState: ""
    };
  }

  componentDidMount() {
    this.getAllSocialMedia(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllSocialMedia(employeeData)
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.social.media/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formSocialMediaVisible: false,
                      formEmployeeDetailUpdateVisible: false
                  })
                  this.props.onFinishFetch()
              }, 500);
          })
      }, 500)
      })
    })
  }
  
  closeNotif() {
    this.setState({ notifVisible: false })
  }

  getAllSocialMedia(employeeData) {
    let dataTableSocialMedia = employeeData.employeeSocialMedias.map(
      value => {
        const {
          employeeSocialMediaID,
          socialMediaType,
          username,
          emailAddress
        } = value;
        return [
          employeeSocialMediaID,
          socialMediaType.bizparValue,
          username,
          emailAddress
        ];
      }
    );
    this.setState({ dataTableSocialMedia });
  }

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    this.connectWebsocket()
    let { employeeSocialMedias, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeSocialMedias)
    data = data.map((value, index) => {
      return {
        ...value,
        socialMediaType: value.socialMediaType.bizparKey,
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeSocialMediaID: "SM-" + M(),
          socialMediaType: value.socialMediaType.bizparKey,
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          socialMediaType: value.socialMediaType.bizparKey
        }
        let status = R.findIndex(R.propEq('employeeSocialMediaID', value.employeeSocialMediaID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break;
    }

    employeeSocialMedias = data
    let payload = {
      employeeSocialMedias,
      employeeID,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('EMPLOYEE').updateEmployeeSocialMedia(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            if (type !== "delete"){
              //this.setState({ createPopUpVisible: true })
              }
            else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getEmployeeName({
              "params": {
                employeeName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              // this.props.backToPage()
            }
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        }
      }
    )
  }

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  openCloseEdit(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, createPopUpVisible });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  //social media
  columnsSocialMedia = [
    "Social Media Number",
    "Social Media",
    "Username",
    "Email Address",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
          );
        }
      }
    }
  ];

  dataSocialMedia = [
    ["001", "Friendster", "Lucinta Ulala Beybeh", "masfattah@gantenx.com"]
  ];

  render() {
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCloseCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Social Media'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableSocialMedia}
                columns={this.columnsSocialMedia}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>

        {this.state.createVisible && (
          <FormSocialMedia
            type={"create"}
            sendState={this.state.sendState}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}
            bizparSocialMedia={this.state.bizparSocialMedia}
          />
        )}
        {this.state.editVisible && (
          <FormSocialMedia
            type={"update"}
            sendState={this.state.sendState}
            onClickSave={(value) => this.handleSubmit(value, "edit")}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparSocialMedia={this.state.bizparSocialMedia}
            employeeDataSocialMedia={this.state.employeeData.employeeSocialMedias[this.state.selectedIndex]}
          />
        )}

        {this.state.viewVisible && (
          <FormSocialMedia
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            bizparSocialMedia={this.state.bizparSocialMedia}
            employeeDataSocialMedia={this.state.employeeData.employeeSocialMedias[this.state.selectedIndex]}
          />
        )}

        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createVisible: false,
                editVisible: false,
                createPopUpVisible: false
              })
              //this.props.backToPage()
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={(value) => this.handleSubmit(value, "delete")}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getEmployee: obj => dispatch(EmployeeAction.getEmployee(obj)),
    getEmployeeName: obj => dispatch(EmployeeAction.getEmployeeName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(formSocialMediaEmployee);

