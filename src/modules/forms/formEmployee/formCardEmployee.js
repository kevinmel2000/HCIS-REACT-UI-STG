import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormCard from "./formCard"
import { connect } from 'react-redux'
import API from '../../../Services/Api'
import PopUp from '../../../components/pages/PopUpAlert'
import EmployeeAction from '../../../Redux/EmployeeRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../custom/customTable");

class FormCardEmployee extends Component {
    constructor(props) {
        super(props)
        let { employeeData } = this.props

        this.state = {
            employeeData,
            dataTableCard: [],
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            createFormAddressVisible: false,
            notifVisible:false,
            message:'',
            bizparLicense: [],
            auth:props.auth,
            sendState: ""
        }
    }

    componentDidMount() {
        this.getDataCard(this.state.employeeData)
        this.getBizparLicenseType()
        // console.log(this.state.bizparLicense)
    }

    componentWillReceiveProps(newProps) {
        let { employeeData } = newProps
        this.setState({ employeeData })
        this.getDataCard(employeeData)
    }

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
          console.log('Connected: ' + frame)
          stompClient.subscribe('/topic/employee/put.employee.license/' + employeeID, (message) => {
            let res = JSON.parse(message.body)
            console.log('messages: ' + res.messages)
            setTimeout(() => {
                this.setState({ sendState: "finished" }, () => {
                    setTimeout(() => {
                        this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                        this.props.onSelect({
                            messages: res.messages,
                            // formEmployeeDataVisible: false,
                            // formCardVisible: false,
                            formEmployeeDetailUpdateVisible: false
                        })
                        this.props.onFinishFetch()
                    }, 500);
                })
            }, 500)
          })
        })
      }

    async getBizparLicenseType() {
        let payload = {
            params: {
                bizparCategory: "EMPLOYEE_LICENSE_TYPE"
            },
            offset: 0,
            limit: 10
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    // console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparLicense: res.data.data
                        })
                    }
                }
            })
    }

    getDataCard(employeeData) {
        let dataTableCard = employeeData.employeeLicenses.map((value) => {
            const { employeeLicenseID, employeeLicenseType, employeeLicenseNumber, employeeLicenseStartDate, employeeLicenseEndDate, employeeLicenseNotes } = value;
            return [
                employeeLicenseID,
                employeeLicenseType.bizparValue,
                employeeLicenseNumber,
                employeeLicenseStartDate,
                employeeLicenseEndDate,
                employeeLicenseNotes
            ]
        })
        this.setState({ dataTableCard })
    }

    handleSubmit(value, type = "") {
        this.setState({ sendState: "loading" })

        let {
            employeeLicenses,
            employeeID,

        } = this.state.employeeData
        let {
            employeeLicenseStartDate,
            employeeLicenseEndDate

        } = value
        let data = Object.assign([], employeeLicenses)

        data = data.map((value, index) => {
            return {
                ...value,
                employeeLicenseType: value.employeeLicenseType.bizparKey
            }
        })

        switch (type) {
            case "create":
                value = {
                    ...value,
                    employeeLicenseID: "LCS-" + M(),
                    employeeLicenseStartDate: M(employeeLicenseStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    employeeLicenseEndDate: M(employeeLicenseEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    employeeLicenseType: value.employeeLicenseType.bizparKey
                }
                data.push(value)
                break

            case "edit":
                value = {
                    ...value,
                    employeeLicenseStartDate: M(employeeLicenseStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    employeeLicenseEndDate: M(employeeLicenseEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    employeeLicenseType: value.employeeLicenseType.bizparKey
                }
                let status = R.findIndex(
                    R.propEq(
                        'employeeLicenseID',
                        value.employeeLicenseID
                    )
                )(data)
                if (status >= 0) {
                    data[status] = value
                }
                console.log('pay 1', status)
                break

            case "delete":
                data.splice(this.state.selectedIndex, 1)
                break
            default:
                break

        }

        employeeLicenses = data

        let payload = {
            employeeID,
            employeeLicenses,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
        }
        this.connectWebsocket()
        API.create('EMPLOYEE').updateEmployeeLicense(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.props.openSavePopUp()
                        if (type !== "delete") {
                           // this.setState({ createPopUpVisible: true })
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
        )
    }

    openCreateFormCard(type, selectedIndex = null) {

        let { createVisible, editVisible, viewVisible, openDeletePopup } = this.state
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        switch (type) {
            case "create":
                this.setState({ createVisible: !createVisible, createPopUpVisible })
                break;
            case "edit":
                this.setState({ editVisible: !editVisible, createPopUpVisible, selectedIndex })
                break;
            case "view":
                this.setState({ viewVisible: !viewVisible, selectedIndex })
                break;
            case "delete":
                this.setState({ openDeletePopup: !openDeletePopup, selectedIndex })
                break;
            default:
                break;
        }

        // console.log('index', this.state.employeeData.employeeLicenses[selectedIndex])
    }

    openDeletePopup = (selectedIndex) => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex
        })
    }

    closeNotif() {
        this.setState({ notifVisible: false })
      }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columnsCard = [
        "Number",
        "Card Name",
        "Card Number",
        "Renewal Date",
        "Expired Date",
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
                                    onClick={() => this.openCreateFormCard("edit", tableMeta.rowIndex)}
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
                                    onClick={() => this.openCreateFormCard("view", tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div> : 
                               <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openCreateFormCard("view", tableMeta.rowIndex)}
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
                                    onClick={() => this.openCreateFormCard("create")}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <div className="padding-5px" />
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Card'
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableCard}
                                columns={this.columnsCard}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>

                    {this.state.createVisible && (
                        <FormCard
                            type={"create"}
                            sendState={this.state.sendState}
                            bizparLicense={this.state.bizparLicense}
                            onClickSave={(data) => this.handleSubmit(data, "create")}
                            onClickClose={() => this.openCreateFormCard("create")}
                        />
                    )}

                    {this.state.editVisible && (
                        <FormCard
                            type={"edit"}
                            sendState={this.state.sendState}
                            bizparLicense={this.state.bizparLicense}
                            payloadLincense={this.state.employeeData.employeeLicenses[this.state.selectedIndex]}
                            onClickSave={(data) => this.handleSubmit(data, "edit")}
                            onClickClose={() => this.openCreateFormCard("edit")}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormCard
                            type={"view"}
                            bizparLicense={this.state.bizparLicense}
                            payloadLincense={this.state.employeeData.employeeLicenses[this.state.selectedIndex]}
                            onClickSave={(data) => this.handleSubmit(data, "view")}
                            onClickClose={() => this.openCreateFormCard("view")}
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
                            }}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(FormCardEmployee);