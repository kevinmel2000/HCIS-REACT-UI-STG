import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormReference from './formReference'
import PopUp from '../../components/pages/PopUpAlert'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import API from '../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formReferenceApplicant extends Component {
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
            dataTableReference: [],
            bizparReference: [],
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
            stompClient.subscribe('/topic/applicant/put.applicant.reference/' + employeeID, (message) => {
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
                        formReferenceVisible: false,
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
        this.getBizparReference()
        this.getDataReference(this.state.applicantData)
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataReference(applicantData)
    }

    getBizparReference() {
        let payloadReference = {
            params: {
                bizparCategory: "REFERENCE_TYPE"
            },
            offset: 0,
            limit: 10
        }
        API.create('BIZPAR').getBizparByCategory(payloadReference).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparReference: res.data.data
                        })
                    }
                }
            }
        )
    }

    getDataReference(applicantData) {
        let dataTableReference = applicantData.applicantReferences.map((value) => {
            const { applicantReferenceID, referenceType, referencePersonName, referencePersonAddress, referencePersonTelpNumber, referencePersonOccupation, referencePersonRelationship, referenceNotes } = value;
            return [
                applicantReferenceID,
                referenceType.bizparValue,
                referencePersonName,
                referencePersonAddress,
                referencePersonTelpNumber,
                referencePersonOccupation,
                referencePersonRelationship,
                referenceNotes
            ]
        })
        this.setState({ dataTableReference })
    }

    openCloseCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible });
    }

    openCloseEdit(selectedIndex) {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
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
        let { applicantReferences, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantReferences)
        data = data.map((value, index) => {
            return {
                ...value,
                referenceType: value.referenceType.bizparKey
            }
        })

        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantReferenceID: "R-" + M(),
                    referenceType: value.referenceType.bizparKey
                }
                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    referenceType: value.referenceType.bizparKey
                }
                let status = R.findIndex(R.propEq('applicantReferenceID', value.applicantReferenceID))(data)
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

        applicantReferences = data
        let payload = {
            applicantNumber,
            applicantReferences,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantReference(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        console.log(res.data)
                        this.props.openSavePopUp()
                        if (type !== "delete") this.setState({
                            // createPopUpVisible: true,
                            // createVisible: false,
                            // editVisible: false,
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

    columnsReference = [
        "Reference Number",
        "Reference Type",
        "Name",
        "Address",
        "Phone",
        "Job/Position",
        "Relationship",
        "Information",
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
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                    </button>
                                </div>
                            </div> :
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button>
                    );
                }
            }
        }
    ];

    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-12">
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
                                title='Reference'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableReference}
                                columns={this.columnsReference}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormReference
                            type={"create"}
                            sendState={this.state.sendState}
                            onClickClose={this.openCloseCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                            bizparReference={this.state.bizparReference}
                        />
                    )}
                    {this.state.editVisible && (
                        <FormReference
                            type={"update"}
                            sendState={this.state.sendState}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataReference={this.state.applicantData.applicantReferences[this.state.selectedIndex]}
                            bizparReference={this.state.bizparReference}
                        />
                    )}
                    {this.state.viewVisible && (
                        <FormReference
                            type={"view"}
                            onClickClose={this.openCloseView.bind(this)}
                            applicantDataReference={this.state.applicantData.applicantReferences[this.state.selectedIndex]}
                            bizparReference={this.state.bizparReference}
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

export default connect(mapStateToProps, mapDispatchToProps)(formReferenceApplicant);