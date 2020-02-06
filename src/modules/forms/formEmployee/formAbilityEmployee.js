import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormAbility from './formAbility'
import API from '../../../Services/Api'
import { connect } from 'react-redux'
import EmployeeAction from '../../../Redux/EmployeeRedux'
import PopUp from '../../../components/pages/PopUpAlert'
import M from 'moment'
import * as R from 'ramda'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'

var ct = require("../../custom/customTable");

class FormAbilityEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData,
      type: 'create',
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      dataTableAbility: [],
      bizparCompetency: [],
      notifVisible: false,
      message: '',
      sendState: ""
    }
  }

  openCreateFormAbility() {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
  }

  openEditFormAbility(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, createPopUpVisible })
  }

  openViewFormAbility(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  componentDidMount() {
    // this.getDataAbility()
    this.getBizparCompetency()
    this.getDataAbility(this.state.employeeData)
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataAbility(employeeData)
  }

  getDataAbility(employeeData) {
    let dataTableAbility = employeeData.employeeSpecialAbilities.map((value) => {
      const {
        employeeSpecialAbilityID,
        specialAbilityDescription,
        specialAbilityCompetencyType
      } = value;
      return [
        employeeSpecialAbilityID,
        specialAbilityDescription,
        specialAbilityCompetencyType.bizparValue
      ]
    })
    this.setState({ dataTableAbility })
  }

  async getBizparCompetency() {
    let payloadCompetency = {
      params: {
        bizparCategory: "COMPETENCY_SKILL"
      },
      offset: 0,
      limit: 5
    }
    API.create('BIZPAR').getBizparByCategory(payloadCompetency).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparCompetency: res.data.data
            })
          }
        }
      }
    )
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.special.ability/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formAbilityVisible: false,
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
    let { employeeSpecialAbilities, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeSpecialAbilities)

    data = data.map((value, index) => {
      return {
        ...value,
        specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeSpecialAbilityID: "SA-" + M(),
          specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
        }
        data.push(value)
        break

      case "edit":
        value = {
          ...value,
          specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
        }
        let status = R.findIndex(
          R.propEq(
            'employeeSpecialAbilityID',
            value.employeeSpecialAbilityID
          )
        )(data)
        if (status >= 0) {
          data[status] = value
        }
        break

      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break

      default:
        break;

    }

    this.connectWebsocket()
    employeeSpecialAbilities = data
    let payload = {
      employeeID,
      employeeSpecialAbilities,
      "updatedBy": this.props.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    console.log('props', this.props)

    API.create("EMPLOYEE").putEmployeeAbility(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            console.log(res.data)
            // setTimeout(
            //   function () {
            //     this.setState({ notifVisible: !this.state.notifVisible })
            //   }.bind(this), 4000
            // )
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
            console.log(res)
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      }
    )
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();

  columnsAbility = [
    "Ability Number",
    "Ability",
    "Competence",
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
                  onClick={() => this.openEditFormAbility(tableMeta.rowIndex)}
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
                  onClick={() => this.openViewFormAbility(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openViewFormAbility(tableMeta.rowIndex)}
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
                  onClick={() => this.openCreateFormAbility()}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Ability'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableAbility}
                columns={this.columnsAbility}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          {/* Create */}
          {this.state.createVisible && (
            <FormAbility
              className={this.props.className}
              type={'create'}
              sendState={this.state.sendState}
              onClickClose={this.openCreateFormAbility.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "create")}
              bizparCompetency={this.state.bizparCompetency}
            />
          )}

          {/* Edit */}
          {this.state.editVisible && (
            <FormAbility
              type={"edit"}
              sendState={this.state.sendState}
              onClickClose={this.openEditFormAbility.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "edit")}
              bizparCompetency={this.state.bizparCompetency}
              employeeDataAbility={this.state.employeeData.employeeSpecialAbilities[this.state.selectedIndex]}
            />
          )}

          {/* View */}
          {this.state.viewVisible && (
            <FormAbility
              type={"view"}
              onClickClose={this.openViewFormAbility.bind(this)}
              bizparCompetency={this.state.bizparCompetency}
              employeeDataAbility={this.state.employeeData.employeeSpecialAbilities[this.state.selectedIndex]}
            />
          )}

          {this.state.createPopUpVisible && (
            <PopUp
              type={'save'}
              class={"app-popup app-popup-show"}
              onClick={() => {
                this.setState({
                  createVisible: false,
                  editVisible: false,
                  createPopUpVisible: false
                })
                //this.props.backToPage()
              }} />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={'delete'}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={(value) => this.handleSubmit(value, "delete")} />
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

export default connect(mapStateToProps, mapDispatchToProps)(FormAbilityEmployee);