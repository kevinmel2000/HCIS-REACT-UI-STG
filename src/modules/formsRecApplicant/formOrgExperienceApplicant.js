import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormOrgExp from './formOrgExperience'
import M from 'moment'
import API from '../../Services/Api';
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import PopUp from '../../components/pages/PopUpAlert'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'
var ct = require("../../modules/custom/customTable");


class formOrgExpApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableOrgExp: [],
            createVisible: false,
            createPopUpVisible: false,
            editVisible: false,
            notifVisible: false,
            message: "",
            auth: props.auth,
            sendState: "",
            isWeb: false,
            defaultValue: []
        }
    }

    connectWebsocket = async (type) => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/applicant/put.applicant.organization.experience/' + employeeID, (message) => {
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
                        formOrgExperienceVisible: false,
                        formApplicantDetailUpdateVisible: false,
                        formApplicantDataVisible: false
                    })
                }
            })
        })
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    componentDidMount() {
        this.getDataOrgExp(this.state.applicantData)
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataOrgExp(applicantData)
    }

    getDataOrgExp(applicantData) {
        let dataTableOrgExp = applicantData.applicantOrganizationExperiences.map((value) => {
            const {
                applicantOrgExperienceID,
                orgExperienceName,
                orgExperienceStartDate,
                orgExperienceEndDate,
                orgExperiencePosition,
                orgExperienceNotes
            } = value;

            return [
                applicantOrgExperienceID,
                orgExperienceName,
                orgExperienceStartDate,
                orgExperienceEndDate,
                orgExperiencePosition,
                orgExperienceNotes
            ]
        })
        this.setState({ dataTableOrgExp })
    }

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
                            <div className='grid grid-3x'>
                                <div className='column-1'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCreateFormOrgExp("edit", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-2'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCreateFormOrgExp("delete", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-3'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCreateFormOrgExp("view", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCreateFormOrgExp("view", tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
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
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantOrganizationExperiences, applicantNumber } = this.state.applicantData
        let uhuy = Object.assign([], applicantOrganizationExperiences)
        let { orgExperienceEndDate, orgExperienceStartDate } = value

        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantOrgExperienceID: "OE-" + M(),
                    orgExperienceStartDate: M(orgExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    orgExperienceEndDate: M(orgExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
                }

                uhuy.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    orgExperienceStartDate: M(orgExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    orgExperienceEndDate: M(orgExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
                }
                let status = R.findIndex(R.propEq('applicantOrgExperienceID', value.applicantOrgExperienceID))(uhuy)
                if (status >= 0) {
                    uhuy[status] = value
                }
                break;
            case "delete":
                uhuy.splice(this.state.selectedIndex, 1)
                break;
            default:
                break;
        }

        applicantOrganizationExperiences = uhuy
        let payload = {
            applicantOrganizationExperiences,
            applicantNumber,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantOrgExp(payload).then(
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

    render() {
        let { applicantData, selectedIndex } = this.state
        return (
            <div className="vertical-tab-content active" id="content-nav-9">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
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
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Organization Experience'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableOrgExp}
                                columns={this.columnsOrgExp}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormOrgExp
                            sendState={this.state.sendState}
                            type={"create"}
                            onClickClose={() => this.openCreateFormOrgExp("create")}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}

                    {this.state.editVisible && (
                        <FormOrgExp
                            sendState={this.state.sendState}
                            applicantData={applicantData.applicantOrganizationExperiences[selectedIndex]}
                            type={"update"}
                            onClickClose={() => this.openCreateFormOrgExp("edit")}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormOrgExp
                            applicantData={applicantData.applicantOrganizationExperiences[selectedIndex]}
                            type={"view"}
                            onClickClose={() => this.openCreateFormOrgExp("view")}
                            onClickSave={(value) => console.log(value)}
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
            </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(formOrgExpApplicant);