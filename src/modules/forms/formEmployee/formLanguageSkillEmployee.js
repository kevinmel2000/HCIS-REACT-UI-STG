import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormLanguageSkill from './formLanguageSkillEm'
import API from '../../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import PopUp from '../../../components/pages/PopUpAlert'
import * as R from 'ramda'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'

var ct = require("../../../modules/custom/customTable");

class formLanguageSkillEmployee extends Component {
    constructor(props) {
        super(props)
        let { employeeData } = this.props

        this.state = {
            employeeData,
            dataTableLanguageSkill: [],
            createVisible: false,
            viewVisible: false,
            updateVisible: false,
            createPopUpVisible: false,
            bizparLanguSkill: [],
            bizparCompetencySkill: [],
            notifVisible: false,
            message: '',
            sendState: ""
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    componentDidMount() {
        this.getDataLanguageSkill(this.state.employeeData)
        this.getBizparLanguSkill()
        this.getBizparCompetencySkill()
    }

    componentWillReceiveProps(newProps) {
        let { employeeData } = newProps
        this.setState({ employeeData })
        this.getDataLanguageSkill(employeeData)
    }

    getDataLanguageSkill(employeeData) {
        let dataTableLanguageSkill = employeeData.employeeLanguageSkills.map((value) => {
            const { employeeLanguageSkillID, languageSkill, readingLanguageSkillCompetencyType, writingLanguageSkillCompetencyType, listeningLanguageSkillCompetencyType, conversationLanguageSkillCompetencyType, languageSkillScore, languagePeriodDate } = value;
            return [
                employeeLanguageSkillID,
                languageSkill && languageSkill.bizparValue,
                readingLanguageSkillCompetencyType && readingLanguageSkillCompetencyType.bizparValue,
                writingLanguageSkillCompetencyType && writingLanguageSkillCompetencyType.bizparValue,
                listeningLanguageSkillCompetencyType && listeningLanguageSkillCompetencyType.bizparValue,
                conversationLanguageSkillCompetencyType && conversationLanguageSkillCompetencyType.bizparValue,
                languageSkillScore,
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

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/employee/put.employee.language.skill/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                setTimeout(() => {
                    this.setState({ sendState: "finished" }, () => {
                        setTimeout(() => {
                            this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                            this.props.onSelect({
                                messages: res.messages,
                                // formEmployeeDataVisible: false,
                                // formLanguageSkillVisible: false,
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
        let { employeeLanguageSkills, employeeID } = this.state.employeeData
        let data = Object.assign([], employeeLanguageSkills)
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
                    employeeLanguageSkillID: "LS-" + M(),
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
                let found = R.findIndex(R.propEq('employeeLanguageSkillID', value.employeeLanguageSkillID))(data)
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

        this.connectWebsocket()
        employeeLanguageSkills = data
        let payload = {
            employeeLanguageSkills,
            employeeID,
            "updatedBy": this.props.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        console.log(JSON.stringify(payload))
        API.create('EMPLOYEE').updateEmployeeLanguSkill(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.props.openSavePopUp()
                        console.log(res.data)
                        // setTimeout(
                        //     function () {
                        //         this.setState({ notifVisible: !this.state.notifVisible })
                        //     }.bind(this), 4000
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
                                        <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
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
                    <div className="padding-10px  grid-mobile-none gap-20px">
                        <div className="col-1 content-right">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCreate.bind(this)}>
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <div className="padding-5px" />
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Language Skill'
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableLanguageSkill}
                                columns={this.columnsLanguageSkill}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>

                    {this.state.createVisible && (
                        <FormLanguageSkill
                            type={'create'}
                            sendState={this.state.sendState}
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
                            employeeDataLanguSkill={this.state.employeeData.employeeLanguageSkills[this.state.selectedIndex]}
                            bizparCompetencySkill={this.state.bizparCompetencySkill}
                            bizparLanguSkill={this.state.bizparLanguSkill}
                        />
                    )}

                    {this.state.updateVisible && (
                        <FormLanguageSkill
                            type={'update'}
                            sendState={this.state.sendState}
                            onClickClose={this.openUpdate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            employeeDataLanguSkill={this.state.employeeData.employeeLanguageSkills[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(formLanguageSkillEmployee);