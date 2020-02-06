import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormWorkExp from './formWorkExperience'
import PopUp from "../../components/pages/PopUpAlert";
import API from '../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formWorkExperienceApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableWorkExp: [],
            createVisible: false,
            viewVisible: false,
            updateVisible: false,
            createPopUpVisible: false,
            notifVisible: false,
            message: "",
            auth: props.auth,
            defaultValue: [],
            sendState: "",
            isWeb: false
        }
    }

    connectWebsocket = async (type) => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/applicant/put.applicant.work.experience/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                if (type !== "delete") {
                    setTimeout(() => {
                        this.setState({ sendState: "finished" }, () => {
                            setTimeout(() => {
                                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false,})
                                this.props.onSelect({
                                    message: res.messages,
                                    // formWorkExperienceVisible: false,
                                    formApplicantDetailUpdateVisible: false,
                                    // formApplicantDataVisible: false
                                })
                                this.props.onFinishFetch()
                            }, 500);
                        })
                    }, 500);
                } else {
                    this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
                    this.props.onSelect({
                        message: res.messages,
                        formWorkExperienceVisible: false,
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
        this.getDataWorkExp(this.state.applicantData)
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataWorkExp(applicantData)
    }

    getDataWorkExp(applicantData) {
        let dataTableWorkExp = applicantData.applicantWorkExperiences.map((value) => {
            const { applicantWorkExperienceID, workExperienceStartDate, workExperienceEndDate, workExperiencePosition, workExperienceCompany, workExperienceCity } = value;
            return [
                applicantWorkExperienceID,
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

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    handleSubmit(value, type = "") {
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantWorkExperiences, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantWorkExperiences)
        let { workExperienceStartDate, workExperienceEndDate } = value

        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantWorkExperienceID: "WE-" + M(),
                    workExperienceStartDate: M(workExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceEndDate: M(workExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
                }

                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    workExperienceStartDate: M(workExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceEndDate: M(workExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
                }
                let status = R.findIndex(R.propEq('applicantWorkExperienceID', value.applicantWorkExperienceID))(data)
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

        applicantWorkExperiences = data
        let payload = {
            applicantWorkExperiences,
            applicantNumber,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantWorkExperience(payload).then(
            (res) => {
                console.log(JSON.stringify(res.data))
                if (res.status === 200) {
                    if (res.data.status === 'S') {
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
                            // this.props.backToPage()
                        }
                    } else {
                        alert("Failed: " + res.data.message)
                    }
                }
            }
        )

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
                            <div className='grid grid-3x'>
                                <div className='column-1'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openUpdate(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
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
                                        onClick={() => this.openView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openView(tableMeta.rowIndex)}
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
            <div className="vertical-tab-content active" id="content-nav-7">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
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
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Work Experience'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableWorkExp}
                                columns={this.columnsWorkExp}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormWorkExp
                            sendState={this.state.sendState}
                            type={'create'}
                            onClickClose={this.openCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormWorkExp
                            type={'view'}
                            onClickClose={this.openView.bind(this)}
                            applicantDataWorkExp={this.state.applicantData.applicantWorkExperiences[this.state.selectedIndex]}
                        />
                    )}

                    {this.state.updateVisible && (
                        <FormWorkExp
                            sendState={this.state.sendState}
                            type={'update'}
                            onClickClose={this.openUpdate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataWorkExp={this.state.applicantData.applicantWorkExperiences[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(formWorkExperienceApplicant);