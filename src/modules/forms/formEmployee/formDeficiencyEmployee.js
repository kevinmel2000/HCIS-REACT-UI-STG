import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormDeficiency from './formDeficiency';
import API from '../../../Services/Api';
import PopUp from '../../../components/pages/PopUpAlert'
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import M from 'moment';
import * as R from 'ramda';
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../custom/customTable");

class FormDeficiencyEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      dataTableDeficiency: [],
      bizparDeficiencyCategory: [],
      bizparDeficiencyType: [],
      notifVisible: false,
      message: '',
      auth:props.auth,
      sendState: ""
    }
  }

  componentDidMount() {
    this.getBizparDeficiency()
    this.getDataDeficiency(this.state.employeeData)
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataDeficiency(employeeData)
  }

  getDataDeficiency(employeeData) {
    let dataTableDeficiency = employeeData.employeeWeaknesses.map((value) => {
      const {
        employeeWeaknessID,
        weaknessDate,
        weaknessType,
        weaknessCategory,
        weaknessName,
        weaknessNotes
      } = value;
      return [
        employeeWeaknessID,
        weaknessDate,
        weaknessType.bizparValue,
        weaknessCategory.bizparValue,
        weaknessName,
        weaknessNotes
      ]
    })
    this.setState({ dataTableDeficiency })
  }

  getBizparDeficiency() {
    let payloadDeficiencyType = {
      params: {
        bizparCategory: "WEAKNESS_TYPE"
      },
      offset: 0,
      limit: 20
    }

    let payloadDeficiencyCategory = {
      params: {
        bizparCategory: "WEAKNESS_CATEGORY"
      },
      offset: 0,
      limit: 20
    }

    API.create('BIZPAR').getBizparByCategory(payloadDeficiencyType).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparDeficiencyType: res.data.data
            })
          }
        }
      }
    )

    API.create('BIZPAR').getBizparByCategory(payloadDeficiencyCategory).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparDeficiencyCategory: res.data.data
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
      stompClient.subscribe('/topic/employee/put.employee.weakness/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formDeficiencyVisible: false,
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
    let { employeeWeaknesses, employeeID } = this.state.employeeData
    let { weaknessDate } = value
    let data = Object.assign([], employeeWeaknesses)

    data = data.map((value, index) => {
      return {
        ...value,
        weaknessCategory: value.weaknessCategory.bizparKey,
        weaknessType: value.weaknessType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeWeaknessID: "W-" + M(),
          weaknessDate: M(weaknessDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          weaknessCategory: value.weaknessCategory.bizparKey,
          weaknessType: value.weaknessType.bizparKey
        }
        data.push(value)
        break;

      case "edit":
        value = {
          ...value,
          weaknessDate: M(weaknessDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          weaknessCategory: value.weaknessCategory.bizparKey,
          weaknessType: value.weaknessType.bizparKey
        }
        let status = R.findIndex(
          R.propEq(
            'employeeWeaknessID',
            value.employeeWeaknessID
          )
        )(data)
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

    employeeWeaknesses = data
    let payload = {
      employeeID,
      employeeWeaknesses,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
    }
    this.connectWebsocket()
    API.create('EMPLOYEE').putEmployeWeakness(payload).then(
      (res) => {
        if (res.status === 200) {
            if (res.data.status === 'S') {
              this.props.openSavePopUp()
                if (type !== "delete") {
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
                alert("Failed: " + res.data.message)
            }
        }
    }
      );
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    })
  }

  openCloseEdit(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false
    this.setState({
      editVisible: !this.state.editVisible,
      createPopUpVisible,
      selectedIndex
    })
  }

  openCloseView(selectedIndex) {
    this.setState({
      viewVisible: !this.state.viewVisible,
      selectedIndex
    })
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();

  columnsDeficiency = [
    "Deficiency Number",
    "Period",
    "Type",
    "Category",
    "Name",
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
                  onClick={this.openCloseCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Deficiency'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableDeficiency}
                columns={this.columnsDeficiency}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          {/* Create */}
          {this.state.createVisible && (
            <FormDeficiency
              type={"create"}
              sendState={this.state.sendState}
              onClickClose={this.openCloseCreate.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "create")}
              bizparDeficiencyType={this.state.bizparDeficiencyType}
              bizparDeficiencyCategory={this.state.bizparDeficiencyCategory}
            />
          )}

          {/* Edit */}
          {this.state.editVisible && (
            <FormDeficiency
              type={"update"}
              sendState={this.state.sendState}
              onClickClose={this.openCloseEdit.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "edit")}
              employeeDataDeficiency={this.state.employeeData.employeeWeaknesses[this.state.selectedIndex]}
              bizparDeficiencyType={this.state.bizparDeficiencyType}
              bizparDeficiencyCategory={this.state.bizparDeficiencyCategory}
            />
          )}

          {/* View */}
          {this.state.viewVisible && (
            <FormDeficiency
              type={"view"}
              onClickClose={this.openCloseView.bind(this)}
              employeeDataDeficiency={this.state.employeeData.employeeWeaknesses[this.state.selectedIndex]}
              bizparDeficiencyType={this.state.bizparDeficiencyType}
              bizparDeficiencyCategory={this.state.bizparDeficiencyCategory}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormDeficiencyEmployee)