import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCRUDWorkExpEmp from './formCRUDWorkExpEmployee'
import PopUp from '../../../components/pages/PopUpAlert'
import API from '../../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux'
import * as R from 'ramda'
import EmployeeAction from '../../../Redux/EmployeeRedux'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'
var ct = require("../../../modules/custom/customTable");

class FormWorkExpEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData,
      dataTableWorkExp: [],
      viewVisible: false,
      updateVisible: false,
      createPopUpVisible: false,
      notifVisible: false,
      message: '',
      sendState: ""
    }
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();

  componentDidMount() {
    this.getDataWorkExp(this.state.employeeData)
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataWorkExp(employeeData)
  }

  getDataWorkExp(employeeData) {
    let dataTableWorkExp = employeeData.employeeWorkExperiences.map((value) => {
      const { employeeWorkExperienceID, workExperienceStartDate, workExperienceEndDate, workExperiencePosition, workExperienceCompany, workExperienceCity } = value;
      return [
        employeeWorkExperienceID,
        workExperienceStartDate,
        workExperienceEndDate,
        workExperiencePosition,
        workExperienceCompany,
        workExperienceCity
      ]
    })
    this.setState({ dataTableWorkExp })
  }

  openCreate() {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
  }

  openView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
  }

  openUpdate(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ updateVisible: !this.state.updateVisible, selectedIndex, createPopUpVisible })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.work.experience/' + employeeID, (message) => { 
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formWorkExperienceVisible: false,
                      formEmployeeDetailUpdateVisible: false
                  })
                  this.props.onFinishFetch()
              }, 500);
          })
      }, 500)
      })
    })
  }

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    let { employeeWorkExperiences, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeWorkExperiences)

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeWorkExperienceID: "WEX-" + M(),
          workExperienceStartDate: M(value.workExperienceStartDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          workExperienceEndDate: M(value.workExperienceEndDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          workExperienceStartDate: M(value.workExperienceStartDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          workExperienceEndDate: M(value.workExperienceEndDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
          workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
        }
        let found = R.findIndex(R.propEq('employeeWorkExperienceID', value.employeeWorkExperienceID))(data)
        if (found >= 0) {
          data[found] = value
        }
        break;
      case "delete":
        // this.updateEmployee(value)
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break;
    }

    employeeWorkExperiences = data
    let payload = {
      employeeWorkExperiences,
      employeeID,
      "updatedBy": this.props.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    console.log(payload)
    this.connectWebsocket()
    API.create('EMPLOYEE').updateEmployeeWorkExperience(payload).then(
      (res) => {
        // alert(JSON.stringify(res.data))
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            if (type !== "delete") this.setState({
              //createPopUpVisible: true
            })
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
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  columnsWorkExp = [
    "Work Experience Number",
    "Start Date",
    "Finish Date",
    "Position",
    "Company Name",
    "Place",
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
                  onClick={() => this.openUpdate(tableMeta.rowIndex)}
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
                  onClick={() => this.openView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openView(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Work Experience'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableWorkExp}
                columns={this.columnsWorkExp}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.createVisible && (
            <FormCRUDWorkExpEmp
              type={'create'}
              sendState={this.state.sendState}
              onClickClose={this.openCreate.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "create")}
            />
          )}

          {this.state.viewVisible && (
            <FormCRUDWorkExpEmp
              type={'view'}
              onClickClose={this.openView.bind(this)}
              employeeDataWorkExp={this.state.employeeData.employeeWorkExperiences[this.state.selectedIndex]}
            />
          )}

          {this.state.updateVisible && (
            <FormCRUDWorkExpEmp
              type={'update'}
              sendState={this.state.sendState}
              onClickClose={this.openUpdate.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "edit")}
              employeeDataWorkExp={this.state.employeeData.employeeWorkExperiences[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormWorkExpEmployee);