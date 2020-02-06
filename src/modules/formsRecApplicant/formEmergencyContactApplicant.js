import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../components/pages/PopUpAlert";
import FormEmergencyContact from "./formEmergencyContact";
import API from '../../Services/Api';
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formEmergencyContactAplicant extends Component {
  constructor(props) {
    super(props);
    let { applicantData } = this.props;

    this.state = {
      applicantData,
      dataTableEmergencyContact: [],
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
      defaultValue: [],
      sendState: "",
      isWeb: false
    };
  }

  connectWebsocket = async (type) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/applicant/put.applicant.emergency.contact/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        if (type !== "delete") {
          setTimeout(() => {
            this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, isWeb: false })
                this.props.onSelect({
                  message: res.messages,
                  formLanguageSkillVisible: false,
                  formApplicantDetailUpdateVisible: false,
                  formApplicantDataVisible: false
                })
                this.props.onFinishFetch()
              }, 500);
            })
          }, 500);
        } else {
          this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
          this.props.onSelect({
            message: res.messages,
            formFormalEducationVisible: false,
            formApplicantDetailUpdateVisible: false,
            formApplicantDataVisible: false
          })
        }
      })
    })
  }

  componentDidMount() {
    this.getAllEmergencyContact(this.state.applicantData);
  }

  componentWillReceiveProps(newProps) {
    let { applicantData } = newProps
    this.setState({ applicantData })
    this.getAllEmergencyContact(applicantData)
  }

  getAllEmergencyContact(applicantData) {
    let dataTableEmergencyContact = applicantData.applicantEmergencyContacts.map(
      value => {
        const {
          applicantEmergencyContactID,
          emergencyContactPersonName,
          emergencyContactPersonAddress,
          emergencyContactPersonTelpNumber,
          emergencyContactPersonPosition,
          emergencyContactPersonRelationship
        } = value;
        return [
          applicantEmergencyContactID,
          emergencyContactPersonName,
          emergencyContactPersonAddress,
          emergencyContactPersonTelpNumber,
          emergencyContactPersonPosition,
          emergencyContactPersonRelationship
        ];
      }
    );
    this.setState({ dataTableEmergencyContact });
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
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
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

  handleSubmit(value, type = "") {
    this.setState({ defaultValue: value, sendState: "loading" })
    let { applicantEmergencyContacts, applicantNumber } = this.state.applicantData
    let data = Object.assign([], applicantEmergencyContacts)

    switch (type) {
      case "create":
        value = {
          ...value,
          applicantEmergencyContactID: "EC-" + M(),
        }
        data.push(value)
        break;
      case "edit":
        let status = R.findIndex(R.propEq('applicantEmergencyContactID', value.applicantEmergencyContactID))(data)
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

    applicantEmergencyContacts = data
    let payload = {
      applicantEmergencyContacts,
      applicantNumber,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    this.connectWebsocket(type)
    API.create('RECRUITMENT').updateApplicantEmergencyContact(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            console.log(res.data)
            if (type !== "delete") this.setState({
              // createPopUpVisible: true,
              // createVisible: false,
              // editVisible: false,
            })
            else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getApplicantName({
              "params": {
                applicantName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              //this.props.backToPage()
            }
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  //emergency contact
  columnsEmergencyContact = [
    "Emergency Number",
    "Name",
    "Address",
    "Phone",
    "Position",
    "Relationship",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className='grid grid-3x'>
                <div className='column-1'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-2'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-3'>
                  <button
                    type="button"
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCloseView(tableMeta.rowIndex)}
              >
                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  render() {
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="padding-10px">
            <div className="col-1 content-right margin-bottom-10px">
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
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Emergency Contact'
                subtitle={'lorem ipsum dolor'}
                data={this.state.dataTableEmergencyContact}
                columns={this.columnsEmergencyContact}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormEmergencyContact
            onClickSave={(value) => this.handleSubmit(value, "create")}
            type={"create"}
            sendState={this.state.sendState}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormEmergencyContact
            onClickSave={(value) => this.handleSubmit(value, "edit")}
            type={"update"}
            sendState={this.state.sendState}
            onClickClose={this.openCloseEdit.bind(this)}
            applicantDataEmergency={this.state.applicantData.applicantEmergencyContacts[this.state.selectedIndex]}
          />
        )}

        {this.state.viewVisible && (
          <FormEmergencyContact
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            applicantDataEmergency={this.state.applicantData.applicantEmergencyContacts[this.state.selectedIndex]}
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
    recruitment: state.recruitment,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getApplicant: obj => dispatch(RecruitmentAction.getApplicant(obj)),
    getApplicantName: obj => dispatch(RecruitmentAction.getApplicantName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(formEmergencyContactAplicant);



