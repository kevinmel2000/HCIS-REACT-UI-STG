import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormDeficiency from './formDeficiency'
import API from '../../Services/Api';
import PopUp from '../../components/pages/PopUpAlert'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import M from 'moment';
import * as R from 'ramda';
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'
var ct = require("../../modules/custom/customTable");

class formDeficiencyApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            dataTableDeficiency: [],
            bizparDeficiencyCategory: [],
            bizparDeficiencyType: [],
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
            stompClient.subscribe('/topic/applicant/put.applicant.weakness/' + employeeID, (message) => {
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
                        formFormalEducationVisible: false,
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
        this.getBizparDeficiency()
        this.getDataDeficiency(this.state.applicantData)
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataDeficiency(applicantData)
    }

    getDataDeficiency(applicantData) {
        let dataTableDeficiency = applicantData.applicantWeaknesss.map((value) => {
            const { applicantWeaknessID, weaknessDate, weaknessType, weaknessCategory, weaknessName, weaknessNotes } = value;
            return [
                applicantWeaknessID,
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
        this.setState({ editVisible: !this.state.editVisible, createPopUpVisible, selectedIndex });
    }

    openCloseView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    handleSubmit(value, type = "") {
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantWeaknesss, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantWeaknesss)
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
                    applicantWeaknessID: "W-" + M(),
                    weaknessCategory: value.weaknessCategory.bizparKey,
                    weaknessType: value.weaknessType.bizparKey
                }
                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    weaknessCategory: value.weaknessCategory.bizparKey,
                    weaknessType: value.weaknessType.bizparKey
                }
                let status = R.findIndex(R.propEq('applicantWeaknessID', value.applicantWeaknessID))(data)
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

        applicantWeaknesss = data
        let payload = {
            applicantNumber,
            applicantWeaknesss,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantWeekness(payload).then(
            (res) => {
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
                            //this.props.backToPage()
                        }
                    } else {
                        alert("Failed: " + res.data.message)
                    }
                }
            }
        )
    }

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
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
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
            <div className="vertical-tab-content active" id="content-nav-11">
                <form action="#">
                    <div className="padding-10px">
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
                                title='Deficiency'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableDeficiency}
                                columns={this.columnsDeficiency}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
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
                    {this.state.editVisible && (
                        <FormDeficiency
                            type={"update"}
                            sendState={this.state.sendState}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataDeficiency={this.state.applicantData.applicantWeaknesss[this.state.selectedIndex]}
                            bizparDeficiencyType={this.state.bizparDeficiencyType}
                            bizparDeficiencyCategory={this.state.bizparDeficiencyCategory}
                        />
                    )}
                    {this.state.viewVisible && (
                        <FormDeficiency
                            type={"view"}
                            onClickClose={this.openCloseView.bind(this)}
                            applicantDataDeficiency={this.state.applicantData.applicantWeaknesss[this.state.selectedIndex]}
                            bizparDeficiencyType={this.state.bizparDeficiencyType}
                            bizparDeficiencyCategory={this.state.bizparDeficiencyCategory}
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

export default connect(mapStateToProps, mapDispatchToProps)(formDeficiencyApplicant);