import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormLanguageSkill from './formLanguageSkill'
import API from '../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import PopUp from '../../components/pages/PopUpAlert'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formLanguageSkillApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableLanguageSkill: [],
            createVisible: false,
            viewVisible: false,
            updateVisible: false,
            createPopUpVisible: false,
            bizparLanguSkill: [],
            bizparCompetencySkill: [],
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
            stompClient.subscribe('/topic/applicant/put.applicant.language.skill/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                if (type !== "delete") {
                    setTimeout(() => {
                        this.setState({ sendState: "finished" }, () => {
                            setTimeout(() => {
                                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, isWeb: false })
                                this.props.onSelect({
                                    message: res.messages,
                                    // formLanguageSkillVisible: false,
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
                        formLanguageSkillVisible: false,
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
        this.getDataLanguageSkill(this.state.applicantData)
        this.getBizparLanguSkill()
        this.getBizparCompetencySkill()
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataLanguageSkill(applicantData)
    }

    getDataLanguageSkill(applicantData) {
        let dataTableLanguageSkill = applicantData.applicantLanguageSkills.map((value) => {
            const { applicantLanguageSkillID, languageSkill, readingLanguageSkillCompetencyType, writingLanguageSkillCompetencyType, listeningLanguageSkillCompetencyType, conversationLanguageSkillCompetencyType, applicantLanguageSkillScore, languagePeriodDate } = value;
            return [
                applicantLanguageSkillID,
                languageSkill && languageSkill.bizparValue,
                readingLanguageSkillCompetencyType && readingLanguageSkillCompetencyType.bizparValue,
                writingLanguageSkillCompetencyType && writingLanguageSkillCompetencyType.bizparValue,
                listeningLanguageSkillCompetencyType && listeningLanguageSkillCompetencyType.bizparValue,
                conversationLanguageSkillCompetencyType && conversationLanguageSkillCompetencyType.bizparValue,
                applicantLanguageSkillScore,
                languagePeriodDate
            ]
        })
        this.setState({ dataTableLanguageSkill })
    }

    openCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
    }

    openView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
    }

    openUpdate(selectedIndex) {
        let createPopUpVisible = this.state.createVisible ? !this.state.createPopUpVisible : false;
        this.setState({ updateVisible: !this.state.updateVisible, selectedIndex, createPopUpVisible })
    }

    openDelete(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    handleSubmit(value, type = "") {
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantLanguageSkills, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantLanguageSkills)
        data = data.map((value, index) => {
            return {
                ...value,
                languageSkill: value.languageSkill.bizparKey,
                readingLanguageSkillCompetencyType: value.readingLanguageSkillCompetencyType.bizparKey,
                writingLanguageSkillCompetencyType: value.writingLanguageSkillCompetencyType.bizparKey,
                listeningLanguageSkillCompetencyType: value.listeningLanguageSkillCompetencyType.bizparKey,
                conversationLanguageSkillCompetencyType: value.conversationLanguageSkillCompetencyType.bizparKey,
            }
        })

        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantLanguageSkillID: "LS-" + M(),
                    languagePeriodDate: M(value.languagePeriodDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    languageSkill: value.languageSkill.bizparKey,
                    readingLanguageSkillCompetencyType: value.readingLanguageSkillCompetencyType.bizparKey,
                    writingLanguageSkillCompetencyType: value.writingLanguageSkillCompetencyType.bizparKey,
                    listeningLanguageSkillCompetencyType: value.listeningLanguageSkillCompetencyType.bizparKey,
                    conversationLanguageSkillCompetencyType: value.conversationLanguageSkillCompetencyType.bizparKey,
                }
                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    languagePeriodDate: M(value.languagePeriodDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    languageSkill: value.languageSkill.bizparKey,
                    readingLanguageSkillCompetencyType: value.readingLanguageSkillCompetencyType.bizparKey,
                    writingLanguageSkillCompetencyType: value.writingLanguageSkillCompetencyType.bizparKey,
                    listeningLanguageSkillCompetencyType: value.listeningLanguageSkillCompetencyType.bizparKey,
                    conversationLanguageSkillCompetencyType: value.conversationLanguageSkillCompetencyType.bizparKey,
                }
                let found = R.findIndex(R.propEq('applicantLanguageSkillID', value.applicantLanguageSkillID))(data)
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

        applicantLanguageSkills = data
        let payload = {
            applicantLanguageSkills,
            applicantNumber,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantLanguageSkill(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.props.openSavePopUp()
                        console.log(res.data)
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

    async getBizparLanguSkill() {
        let payloadLanguSkill = {
            params: {
                bizparCategory: "LANGUAGE_SKILL"
            },
            offset: 0,
            limit: 15
        }
        API.create('BIZPAR').getBizparByCategory(payloadLanguSkill).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparLanguSkill: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparCompetencySkill() {
        let payloadCompetencySkill = {
            params: {
                bizparCategory: "COMPETENCY_SKILL"
            },
            offset: 0,
            limit: 15
        }
        API.create('BIZPAR').getBizparByCategory(payloadCompetencySkill).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparCompetencySkill: res.data.data
                        })
                    }
                }
            }
        )
    }

    columnsLanguageSkill = [
        "Language Skill Number",
        "Language",
        "Reading",
        "Writing",
        "Listening",
        "Speaking",
        "Score",
        "Date Period",
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
                                        onClick={() => this.openUpdate(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDelete(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
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

    dataLanguageSkill = [
        [
            "001",
            "Bahasa Jepang",
            "Bagus",
            "Bagus",
            "Sangat Bagus",
            "Sangat Bagus",
            "89.00",
            "15 Mei 2019"
        ]
    ];

    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-8">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCreate.bind(this)}>
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Language Skill'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableLanguageSkill}
                                columns={this.columnsLanguageSkill}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>

                    {this.state.createVisible && (
                        <FormLanguageSkill
                            sendState={this.state.sendState}
                            type={'create'}
                            onClickClose={this.openCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                            bizparCompetencySkill={this.state.bizparCompetencySkill}
                            bizparLanguSkill={this.state.bizparLanguSkill}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormLanguageSkill
                            type={'view'}
                            onClickClose={this.openView.bind(this)}
                            applicantDataLanguSkill={this.state.applicantData.applicantLanguageSkills[this.state.selectedIndex]}
                            bizparCompetencySkill={this.state.bizparCompetencySkill}
                            bizparLanguSkill={this.state.bizparLanguSkill}
                        />
                    )}

                    {this.state.updateVisible && (
                        <FormLanguageSkill
                            sendState={this.state.sendState}
                            type={'update'}
                            onClickClose={this.openUpdate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataLanguSkill={this.state.applicantData.applicantLanguageSkills[this.state.selectedIndex]}
                            bizparCompetencySkill={this.state.bizparCompetencySkill}
                            bizparLanguSkill={this.state.bizparLanguSkill}
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
                            onClick={this.openDelete.bind(this)}
                            onClickDelete={(value) => this.handleSubmit(value, "delete")} />
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

export default connect(mapStateToProps, mapDispatchToProps)(formLanguageSkillApplicant);