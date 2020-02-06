import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormAbility from './formAbility'
import API from '../../Services/Api'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import PopUp from '../../components/pages/PopUpAlert'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formAbilityApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            type: 'create',
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            dataTableAbility: [],
            bizparCompetency: [],
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
            stompClient.subscribe('/topic/applicant/put.applicant.special.ability/' + employeeID, (message) => {
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
                        formAbilityVisible: false,
                        formApplicantDetailUpdateVisible: false,
                        formApplicantDataVisible: false
                    })
                }
            })
        })
    } 

    // ui
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

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataAbility(applicantData)
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    // data man

    getDataAbility(applicantData) {
        let dataTableAbility = applicantData.applicantSpecialAbilities.map((value) => {
            const {
                applicantSpecialAbilityID,
                specialAbilityDescription,
                specialAbilityCompetencyType
            } = value;

            return [
                applicantSpecialAbilityID,
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

    handleSubmit(value, type = "") {
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantSpecialAbilities, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantSpecialAbilities)
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
                    applicantSpecialAbilityID: "SA-" + M(),
                    specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
                }
                data.push(value)
                console.log('isi', JSON.stringify(value))
                break;
            case "edit":
                value = {
                    ...value,
                    specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
                }
                let status = R.findIndex(R.propEq('applicantSpecialAbilityID', value.applicantSpecialAbilityID))(data)
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

        applicantSpecialAbilities = data
        let payload = {
            applicantNumber,
            applicantSpecialAbilities,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantAbility(payload).then(
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

    // table
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
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openViewFormAbility(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button>
                            </div> :
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openViewFormAbility(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button>
                    );
                }
            }
        }
    ];

    // main
    componentDidMount() {
        this.getBizparCompetency()
        this.getDataAbility(this.state.applicantData)
    }

    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-10">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
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
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Ability'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableAbility}
                                columns={this.columnsAbility}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>

                    {this.state.createVisible && (
                        <FormAbility
                            type={this.state.type}
                            sendState={this.state.sendState}
                            onClickClose={this.openCreateFormAbility.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                            bizparCompetency={this.state.bizparCompetency}
                        />
                    )}

                    {this.state.editVisible && (
                        <FormAbility
                            type={"edit"}
                            onClickClose={this.openEditFormAbility.bind(this)}
                            sendState={this.state.sendState}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataAbility={this.state.applicantData.applicantSpecialAbilities[this.state.selectedIndex]}
                            bizparCompetency={this.state.bizparCompetency}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormAbility
                            type={"view"}
                            onClickClose={this.openViewFormAbility.bind(this)}
                            bizparCompetency={this.state.bizparCompetency}
                            applicantDataAbility={this.state.applicantData.applicantSpecialAbilities[this.state.selectedIndex]}
                        />
                    )}

                    {this.state.createPopUpVisible && (
                        <PopUp type={'save'} class={"app-popup app-popup-show"}
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
                        <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup.bind(this)} onClickDelete={(value) => this.handleSubmit(value, "delete")} />
                    )}

                </form>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(formAbilityApplicant);