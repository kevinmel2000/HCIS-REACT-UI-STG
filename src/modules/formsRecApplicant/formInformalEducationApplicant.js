import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormInformalEdu from "../formsRecApplicant/formInformalEducation";
import PopUp from "../../components/pages/PopUpAlert";
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import API from '../../Services/Api';
import M from 'moment';
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class FormInformalEducationApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
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
            message: "",
            auth: props.auth,
            sendState: "",
            value: []
        }
    }

    componentDidMount() {
        this.getDataInformalEdu(this.state.applicantData);
        this.getBizparTrainingType();
        this.getBizparCostType();
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataInformalEdu(applicantData)
    }

    connectWebsocket = async (type) => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/applicant/put.applicant.informal.education/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                if (type !== "delete") {
                    setTimeout(() => {
                        this.setState({ sendState: "finished" }, () => {
                            setTimeout(() => {
                                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, isWeb: true })
                                this.props.onSelect({
                                    message: res.messages,
                                    // formFamilyVisible: false,
                                    formApplicantDetailUpdateVisible: false,
                                    // formApplicantDataVisible: false
                                })
                                this.props.onFinishFetch()
                            }, 500);
                        })
                    }, 500);
                } else {
                    this.props.onSelect({
                        message: res.messages,
                        formFamilyVisible: false,
                        formApplicantDetailUpdateVisible: false,
                        formApplicantDataVisible: false
                    })
                }
            })
        })
    }

    closeNotif() {
        this.setState({ notifVisible: false })
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

    async getDataInformalEdu(applicantData) {
        let dataTableInformalEdu = applicantData.applicantInformalEducations.map((value) => {
            const { applicantInformalEducationID, informalEducationStartDate, informalEducationEndDate,
                informalEducationTrainingType, informalEducationName, informalEducationCostSource,
                informalEducationInstituteName, informalEducationCertificateNumber, informalEducationCertificateDate } = value;
            return [
                applicantInformalEducationID,
                informalEducationStartDate,
                informalEducationEndDate,
                informalEducationTrainingType.bizparValue,
                informalEducationName,
                informalEducationCertificateNumber,
                informalEducationCertificateDate,
                informalEducationCostSource.bizparValue,
                informalEducationInstituteName
            ]
        })
        this.setState({ dataTableInformalEdu })
    }

    handleSubmit(value, type = "") {
        this.setState({ sendState: "loading", defaultValue: value })
        let { applicantInformalEducations, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantInformalEducations)
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
                    applicantInformalEducationID: "IE-" + M(),
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
                let status = R.findIndex(R.propEq('applicantInformalEducationID', value.applicantInformalEducationID))(data)
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

        applicantInformalEducations = data
        let payload = {
            applicantNumber,
            applicantInformalEducations,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantInformalEducation(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        console.log(res.data)
                        this.props.openSavePopUp()
                        if (type !== "delete") this.setState({
                            //createPopUpVisible: true 
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

    options = ct.customOptions();

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
                                        <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
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
            <div className="vertical-tab-content active" id="content-nav-6">
                <form action="#">
                    <div
                        className="padding-10px">
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
                                title='Informal Education'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableInformalEdu}
                                columns={this.columnsInformEdu}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.notifVisible && (
                        <WebsocketNotif message={this.state.message} timeout={5000} type={"float"}
                            onClickClose={this.closeNotif.bind(this)} />
                    )}
                    {this.state.createVisible && (
                        <FormInformalEdu
                            sendState={this.state.sendState}
                            type={"create"}
                            bizparTrainingType={this.state.bizparTrainingType}
                            onClickClose={this.openCloseCreate.bind(this)}
                            bizparCostType={this.state.bizparCostType}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}
                    {this.state.editVisible && (
                        <FormInformalEdu
                            sendState={this.state.sendState}
                            type={"update"}
                            applicantDataInformEdu={this.state.applicantData.applicantInformalEducations[this.state.selectedIndex]}
                            bizparTrainingType={this.state.bizparTrainingType}
                            bizparCostType={this.state.bizparCostType}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}

                        />
                    )}
                    {this.state.viewVisible && (
                        <FormInformalEdu
                            type={"view"}
                            applicantDataInformEdu={this.state.applicantData.applicantInformalEducations[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormInformalEducationApplicant)