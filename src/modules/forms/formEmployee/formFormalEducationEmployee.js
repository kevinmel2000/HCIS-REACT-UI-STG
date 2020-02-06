import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from "../../../components/pages/PopUpAlert";
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import FormFormalEdu from '../formEmployee/formFormalEdu'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'

var ct = require("../../../modules/custom/customTable")

class FormFormalEducationEmployee extends Component {
    constructor(props) {
        super(props)
        let { employeeData } = this.props

        this.state = {
            employeeData,
            dataTableFormalEdu: [],
            bizparEduDepartment: [],
            bizparEduDegreePosition: [],
            bizparEduLevel: [],
            bizparEduDegree: [],
            bizparEduType: [],
            institute: [],
            bizparCostSource: [],
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
        this.getDataFormalEdu(employeeData)
    }

    componentDidMount() {
        this.getDataFormalEdu(this.state.employeeData);
        this.getBizparEduDegree();
        this.getBizparEduDegreePos();
        this.getBizparEduType();
        this.getBizparEduLevel();
        this.getInstitute();
        this.getBizparEduDepartment();
        this.getBizparCostSource();
    }

    async getDataFormalEdu(employeeData) {
        let dataTableFormalEdu = employeeData.employeeFormalEducations.map((value) => {
            const { employeeFormalEducationID, formalEducationStartDate, formalEducationEndDate, formalEducationDegree, formalEducationDepartment, formalEducationInstitute, formalEducationCertificationNumber, formalEducationCertificationDate, formalEducationIPK, formalEducationCostSource } = value;

            return [
                employeeFormalEducationID,
                formalEducationStartDate,
                formalEducationEndDate,
                formalEducationDegree.bizparValue,
                formalEducationDepartment.bizparValue,
                formalEducationInstitute === null ? '' : formalEducationInstitute.instituteName,
                formalEducationCertificationNumber,
                formalEducationCertificationDate,
                formalEducationIPK,
                formalEducationCostSource.bizparValue
            ]
        })
        this.setState({ dataTableFormalEdu })
    }

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/employee/put.employee.formal.education/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                setTimeout(() => {
                    this.setState({ sendState: "finished" }, () => {
                        setTimeout(() => {
                            this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                            this.props.onSelect({
                                messages: res.messages,
                                // formEmployeeDataVisible: false,
                                // formFormalEducationVisible: false,
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
        let { employeeFormalEducations, employeeID } = this.state.employeeData
        let data = Object.assign([], employeeFormalEducations)
        data = data.map((value, index) => {
            return {
                ...value,
                formalEducationDegree: value.formalEducationDegree.bizparKey,
                formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                formalEducationDepartment: value.formalEducationDepartment.bizparKey,
                formalEducationInstitute: value.formalEducationInstitute === null ? '' : value.formalEducationInstitute.instituteID,
                formalEducationCostSource: value.formalEducationCostSource.bizparKey,
                formalEducationType: value.formalEducationType.bizparKey,
                formalEducationLevel: value.formalEducationLevel.bizparKey,
                formalEducationCertificationDate: R.isNil(value.formalEducationCertificationDate) || R.isEmpty(value.formalEducationCertificationDate) ? '' : value.formalEducationCertificationDate
            }
        })

        switch (type) {
            case "create":
                value = {
                    ...value,
                    employeeFormalEducationID: "FEDU-" + M(),
                    ormalEducationCertificationDate: R.isNil(value.formalEducationCertificationDate) || R.isEmpty(value.formalEducationCertificationDate) ? '' : M(value.formalEducationCertificationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationEndDate: M(value.formalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationStartDate: M(value.formalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationDegree: value.formalEducationDegree.bizparKey,
                    formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                    formalEducationDepartment: value.formalEducationDepartment.bizparKey,
                    formalEducationInstitute: value.formalEducationInstitute === null ? '' : value.formalEducationInstitute.instituteID,
                    formalEducationCostSource: value.formalEducationCostSource.bizparKey,
                    formalEducationType: value.formalEducationType.bizparKey,
                    formalEducationLevel: value.formalEducationLevel.bizparKey
                }
                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    formalEducationCertificationDate: R.isNil(value.formalEducationCertificationDate) || R.isEmpty(value.formalEducationCertificationDate) || value.formalEducationCertificationDate === 'Invalid date' || R.isEmpty(value.formalEducationCertificationDate) || R.isNil(value.formalEducationCertificationDate) ? '' : M(value.formalEducationCertificationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationEndDate: M(value.formalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationStartDate: M(value.formalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationDegree: value.formalEducationDegree.bizparKey,
                    formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                    formalEducationDepartment: value.formalEducationDepartment.bizparKey,
                    formalEducationInstitute: value.formalEducationInstitute === null ? '' : value.formalEducationInstitute.instituteID,
                    formalEducationCostSource: value.formalEducationCostSource.bizparKey,
                    formalEducationType: value.formalEducationType.bizparKey,
                    formalEducationLevel: value.formalEducationLevel.bizparKey
                }
                let status = R.findIndex(R.propEq('employeeFormalEducationID', value.employeeFormalEducationID))(data)
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

        this.connectWebsocket()

        employeeFormalEducations = data
        let payload = {
            employeeID,
            employeeFormalEducations,
            "updatedBy": this.props.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        console.log(JSON.stringify(payload))
        API.create('EMPLOYEE').updateEmployeeFormalEducation(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.props.openSavePopUp()
                        // setTimeout(
                        //     function () {
                        //         this.setState({ notifVisible: !this.state.notifVisible })
                        //     }.bind(this), 4000
                        // )
                        console.log(res.data)
                        if (type !== "delete") this.setState({
                             createPopUpVisible: true 
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
                        console.log(res);
                        alert("Failed: " + res.data.message)
                    }
                } else {
                    console.log(res)
                }
            })
    }

    closeNotif() {
        this.setState({ notifVisible: false })
    }

    async getInstitute() {
        let payloadIns = {
            limit: 100,
            offset: 0,
            params: {
                instituteStatus: "ACTIVE"
            }
        }
        API.create('MASTERDATA').getInstituteByStatus(payloadIns).then(
            (res) => {
                if (res.status === 200) {
                    console.log('ins', res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            institute: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparEduDegreePos() {
        let payloadEdu = {
            params: {
                bizparCategory: "EDUCATION_DEGREE_POSITION"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEdu).then(
            (res) => {
                console.log('edu post', res.data);
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduDegreePosition: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparEduLevel() {
        let payloadEduLev = {
            params: {
                bizparCategory: "EDUCATION_LEVEL"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduLev).then(
            (res) => {
                if (res.status === 200) {
                    console.log('edu level', res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduLevel: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparEduDepartment() {
        let payloadEduDepartment = {
            params: {
                bizparCategory: "EDUCATION_DEPARTMENT"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduDepartment).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduDepartment: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparEduDegree() {
        let payloadEduDegree = {
            params: {
                bizparCategory: "EDUCATION_DEGREE"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduDegree).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduDegree: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparEduType() {
        let payloadEduType = {
            params: {
                bizparCategory: "EDUCATION_TYPE"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduType).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduType: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparCostSource() {
        let payloadCostSource = {
            params: {
                bizparCategory: "FORMAL_EDUCATION_COST_SOURCE"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadCostSource).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparCostSource: res.data.data
                        })
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

    handlePopUp = () => {
        this.setState({
            createPopUpVisible: false,
            createVisible: false,
            editVisible: false
        })
        this.props.backToPage()
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions()

    columnsFormEdu = [
        "Formal Education Number",
        "Start Date",
        "Finish Date",
        "Degree",
        "Major",
        "Institution",
        "Certificate Num",
        "Certificate Date",
        "GPK",
        "Cost Type",
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
                    <div
                        className="padding-10px  grid-mobile-none gap-20px">
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
                                title='Formal Education'
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableFormalEdu}
                                columns={this.columnsFormEdu}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormFormalEdu
                            type={"create"}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            sendState={this.state.sendState}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDepartment={this.state.bizparEduDepartment}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
                            bizparCostSource={this.state.bizparCostSource}
                            onClickClose={this.openCloseCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}
                    {this.state.editVisible && (
                        <FormFormalEdu
                            type={"update"}
                            employeeDataFormEdu={this.state.employeeData.employeeFormalEducations[this.state.selectedIndex]}
                            sendState={this.state.sendState}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDepartment={this.state.bizparEduDepartment}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
                            bizparCostSource={this.state.bizparCostSource}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormFormalEdu
                            type={"view"}
                            onClickClose={this.openCloseView.bind(this)}
                            employeeDataFormEdu={this.state.employeeData.employeeFormalEducations[this.state.selectedIndex]}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDepartment={this.state.bizparEduDepartment}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
                            bizparCostSource={this.state.bizparCostSource}
                        />
                    )}
                    {this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={this.handlePopUp.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormFormalEducationEmployee)