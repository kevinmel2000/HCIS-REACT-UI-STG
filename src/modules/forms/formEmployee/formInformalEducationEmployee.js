import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormInformalEdu from '../formEmployee/formInformalEdu'
import PopUp from "../../../components/pages/PopUpAlert";
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'

var ct = require("../../../modules/custom/customTable")

class FormInformalEducationEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      employeeData,
      dataTableInformalEdu: [],
      bizparTrainingType: [],
      bizparCostType: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      notifVisible: false,
      message: '',
      sendState: ""
    }
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataInformalEdu(employeeData)
  }

  componentDidMount() {
    this.getDataInformalEdu(this.state.employeeData);
    this.getBizparTrainingType();
    this.getBizparCostType();
  }

  async getBizparCostType() {
    let payloadCostType = {
      params: {
        bizparCategory: "TRAINING_COST_SOURCE"
      },
      offset: 0,
      limit: 100
    }
    API.create('BIZPAR').getBizparByCategory(payloadCostType).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparCostType: res.data.data
            })
          }
        }
      }
    )
  }


  async getBizparTrainingType() {
    let payloadTrainingType = {
      params: {
        bizparCategory: "TRAINING_TYPE"
      },
      offset: 0,
      limit: 100
    }
    API.create('BIZPAR').getBizparByCategory(payloadTrainingType).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparTrainingType: res.data.data
            })
          }
        }
      }
    )
  }

  getDataInformalEdu(employeeData) {
    let dataTableInformalEdu = employeeData.employeeInformalEducations.map((value) => {
      const { employeeInformalEducationID, informalEducationStartDate, informalEducationEndDate, informalEducationName, informalEducationTrainingType, informalEducationCostSource, informalEducationInstituteName, informalEducationCertificateDate, informalEducationCertificateNumber } = value;
      return [
        employeeInformalEducationID,
        informalEducationStartDate,
        informalEducationEndDate,
        informalEducationTrainingType.bizparValue,
        informalEducationName,
        informalEducationCertificateNumber,
        informalEducationCertificateDate,
        informalEducationCostSource.bizparValue,
        informalEducationInstituteName,
      ]
    })
    this.setState({ dataTableInformalEdu })
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.informal.education/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formInformalEducationVisible: false,
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
    let { employeeInformalEducations, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeInformalEducations)
    data = data.map((value, index) => {
      return {
        ...value,
        informalEducationCostSource: value.informalEducationCostSource.bizparKey,
        informalEducationTrainingType: value.informalEducationTrainingType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeInformalEducationID: "INFEDU-" + M(),
          informalEducationEndDate: M(value.informalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          informalEducationStartDate: M(value.informalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          informalEducationCertificateDate: value.informalEducationTrainingType.bizparKey === "TRATYP-002" ? M(value.informalEducationCertificateDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
          informalEducationTrainingType: value.informalEducationTrainingType.bizparKey,
          informalEducationCostSource: value.informalEducationCostSource.bizparKey
        }
        data.push(value)
        console.log('isi', JSON.stringify(value))
        break;
      case "edit":
        value = {
          ...value,
          informalEducationEndDate: M(value.informalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          informalEducationStartDate: M(value.informalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          informalEducationCertificateDate: value.informalEducationTrainingType.bizparKey === "TRATYP-002" ? M(value.informalEducationCertificateDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
          informalEducationTrainingType: value.informalEducationTrainingType.bizparKey,
          informalEducationCostSource: value.informalEducationTrainingType.bizparKey === "TRATYP-002" ? value.informalEducationCostSource.bizparKey : "",
          informalEducationCertificateNumber: value.informalEducationTrainingType.bizparKey === "TRATYP-002" ? value.informalEducationCertificateNumber : ""
        }
        let status = R.findIndex(R.propEq('employeeInformalEducationID', value.employeeInformalEducationID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break
    }

    this.connectWebsocket()

    employeeInformalEducations = data
    let payload = {
      employeeID,
      employeeInformalEducations,
      "updatedBy": this.props.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('EMPLOYEE').updateEmployeeInformalEducation(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
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
            alert("Failed: " + res.data.message)
          }
        }
      }
    )
  }


  closeNotif() {
    this.setState({ notifVisible: false })
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
    this.setState({ editVisible: !this.state.editVisible, createPopUpVisible, selectedIndex, });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions()

  columnsInformEdu = [
    "Informal Education Number",
    "Start Date",
    "Finish Date",
    "Training Type",
    "Training Name",
    "Certificate Number",
    "Date of Certificate",
    "Cost of Education",
    "Name of Institution",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className="grid grid-3x">
                <div className="col-1">
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
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
                title='Informal Education'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableInformalEdu}
                columns={this.columnsInformEdu}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
          {this.state.createVisible && (
            <FormInformalEdu
              type={"create"}
              bizparTrainingType={this.state.bizparTrainingType}
              bizparCostType={this.state.bizparCostType}
              sendState={this.state.sendState}
              onClickClose={this.openCloseCreate.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "create")}
            />
          )}
          {this.state.editVisible && (
            <FormInformalEdu
              type={"update"}
              employeeDataInformEdu={this.state.employeeData.employeeInformalEducations[this.state.selectedIndex]}
              bizparTrainingType={this.state.bizparTrainingType}
              sendState={this.state.sendState}
              bizparCostType={this.state.bizparCostType}
              onClickClose={this.openCloseEdit.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "edit")}

            />
          )}
          {this.state.viewVisible && (
            <FormInformalEdu
              type={"view"}
              employeeDataInformEdu={this.state.employeeData.employeeInformalEducations[this.state.selectedIndex]}
              bizparTrainingType={this.state.bizparTrainingType}
              bizparCostType={this.state.bizparCostType}
              onClickClose={this.openCloseView.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormInformalEducationEmployee)