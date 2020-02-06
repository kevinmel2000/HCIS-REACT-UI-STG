import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormOrgExp from '../../forms/formEmployee/formOrgExp'
import PopUp from '../../../components/pages/PopUpAlert'
import API from '../../../Services/Api'
import { connect } from 'react-redux'
import EmployeeAction from '../../../Redux/EmployeeRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");

class FormOrgExpEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData,
      dataTableOrgExp: [],
      createVisible: false,
      createPopUpVisible: false,
      editVisible: false,
      notifVisible: false,
      message: "",
      auth: props.auth,
      sendState: ""
    }
  }

  componentDidMount() {
    this.getDataOrgExp(this.state.employeeData)
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataOrgExp(employeeData)
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.organization.experience/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formOrgExperienceVisible: false,
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


  getDataOrgExp(employeeData) {
    let dataTableOrgExp = employeeData.employeeOrganizationExperiences.map((value) => {
      const { employeeOrgExperienceID, orgExperienceName, orgExperienceStartDate, orgExperienceEndDate, orgExperiencePosition, orgExperienceNotes } = value;
      return [
        employeeOrgExperienceID,
        orgExperienceName,
        orgExperienceStartDate,
        orgExperienceEndDate,
        orgExperiencePosition,
        orgExperienceNotes
      ]
    })
    this.setState({ dataTableOrgExp })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();

  columnsOrgExp = [
    "Organization Number",
    "Organization Name",
    "Start Date",
    "Finish Date",
    "Position",
    "Information",
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
                  onClick={() => this.openCreateFormOrgExp("edit", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openCreateFormOrgExp("delete", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCreateFormOrgExp("view", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
                 <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCreateFormOrgExp("view", tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
          );
        }
      }
    }
  ];

  openCreateFormOrgExp(type, selectedIndex = null) {
    let { createVisible, editVisible, viewVisible, deletePopUpVisible } = this.state
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    switch (type) {
      case "create":
        this.setState({ createVisible: !createVisible, createPopUpVisible })
        break;
      case "edit":
        this.setState({ editVisible: !editVisible, selectedIndex, createPopUpVisible })
        break;
      case "view":
        this.setState({ viewVisible: !viewVisible, selectedIndex })
        break;
      case "delete":
        this.setState({ deletePopUpVisible: !deletePopUpVisible, selectedIndex })
        break;
      default:
        break;
    }
  }


  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    this.connectWebsocket()
    let { employeeOrganizationExperiences, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeOrganizationExperiences)
    let { orgExperienceEndDate, orgExperienceStartDate } = value

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeOrgExperienceID: "ORGE-" + M(),
          orgExperienceStartDate: M(orgExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          orgExperienceEndDate: M(orgExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          orgExperienceStartDate: M(orgExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          orgExperienceEndDate: M(orgExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
        }
        let found = R.findIndex(R.propEq('employeeOrgExperienceID', value.employeeOrgExperienceID))(data)
        if (found >= 0) {
          data[found] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break;
    }

    employeeOrganizationExperiences = data
    let payload = {
      employeeOrganizationExperiences,
      employeeID,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('EMPLOYEE').updateEmployeeOrgExp(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            console.log(res.data)
            if(type !== "delete") {
              //this.setState({createPopUpVisible: true})
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
        } else {
          console.log(res)
        }
      })
  }

  render() {
    let { employeeData, selectedIndex } = this.state
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="padding-10px grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={() => this.openCreateFormOrgExp("create")}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Organization Experience'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableOrgExp}
                columns={this.columnsOrgExp}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>


          {this.state.createVisible && (
            <FormOrgExp
              type={"create"}
              onClickClose={() => this.openCreateFormOrgExp("create")}
              onClickSave={(value) => this.handleSubmit(value, "create")}
            />
          )}

          {this.state.editVisible && (
            <FormOrgExp
              employeeData={employeeData.employeeOrganizationExperiences[selectedIndex]}
              type={"update"}
              sendState={this.state.sendState}
              onClickClose={() => this.openCreateFormOrgExp("edit")}
              onClickSave={(value) => this.handleSubmit(value, "edit")}
            />
          )}

          {this.state.viewVisible && (
            <FormOrgExp
              employeeData={employeeData.employeeOrganizationExperiences[selectedIndex]}
              type={"view"}
              sendState={this.state.sendState}
              onClickClose={() => this.openCreateFormOrgExp("view")}
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
            <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={() => this.openCreateFormOrgExp("delete")} onClickDelete={(value) => this.handleSubmit(value, "delete")} />
          )}

        </form>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(FormOrgExpEmployee)