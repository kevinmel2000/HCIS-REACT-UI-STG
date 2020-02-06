import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormFormalEdu from "../formsRecApplicant/formFormalEducation";
import PopUp from "../../components/pages/PopUpAlert";
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import API from '../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class FormFormalEducationApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableFormalEdu: [],
            institute: [],
            bizparEduDegreePosition: [],
            bizparEduLevel: [],
            bizparEduDep: [],
            bizparEduDegree: [],
            bizparEduType: [],
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
            defaultValue: []
        };
    }

    connectWebsocket = async (type) => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/applicant/put.applicant.formal.education/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                if (type !== "delete") {
                    setTimeout(() => {
                        this.setState({ sendState: "finished" }, () => {
                            setTimeout(() => {
                                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
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
                    this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
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

    componentDidMount() {
        this.getBizparEduDegree();
        this.getBizparEduDegreePos();
        this.getBizparEduDep();
        this.getBizparEduLevel();
        this.getInstitute();
        this.getDataFormalEdu(this.state.applicantData);
        this.getBizparEduType();
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataFormalEdu(applicantData)
    }

    async getDataFormalEdu(applicantData) {
        let dataTableFormalEdu = applicantData.applicantFormalEducations && applicantData.applicantFormalEducations.map((value) => {
            const { applicantFormalEducationID, formalEducationStartDate, formalEducationEndDate,
                formalEducationDegree, formalEducationDepartement, formalEducationInstitute,
                formalEducationCertificationNumber, formalEducationCertificationDate, formalEducationIPK } = value;
            return [
                applicantFormalEducationID,
                formalEducationStartDate,
                formalEducationEndDate,
                formalEducationDegree.bizparValue,
                formalEducationDepartement.bizparValue,
                formalEducationInstitute && formalEducationInstitute.instituteName,
                formalEducationCertificationNumber,
                formalEducationCertificationDate,
                formalEducationIPK
            ]
        })
        this.setState({ dataTableFormalEdu })
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

    async getBizparEduDep() {
        let payloadEduDep = {
            params: {
                bizparCategory: "EDUCATION_DEPARTMENT"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payloadEduDep).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEduDep: res.data.data
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

    handleSubmit(value, type = "") {
        this.setState({ sendState: "loading", defaultValue: value })
        let { applicantFormalEducations, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantFormalEducations)
        data = data.map((value, index) => {
            return {
                ...value,
                formalEducationDegree: value.formalEducationDegree.bizparKey,
                formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                formalEducationDepartement: value.formalEducationDepartement.bizparKey,
                formalEducationInstitute: value.formalEducationInstitute.instituteID,
                formalEducationType: value.formalEducationType.bizparKey,
                formalEducationLevel: value.formalEducationLevel.bizparKey,
                formalEducationCertificationDate: !R.isNil(value.formalEducationCertificationDate) ? M(value.formalEducationCertificationDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
            }
        })
        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantFormalEducationID: "FE-" + M(),
                    formalEducationCertificationDate: R.isEmpty(value.formalEducationCertificationDate) || R.isNil(value.formalEducationCertificationDate) ? '' : M(value.formalEducationCertificationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationEndDate: M(value.formalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationStartDate: M(value.formalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationDegree: value.formalEducationDegree.bizparKey,
                    formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                    formalEducationDepartement: value.formalEducationDepartement.bizparKey,
                    formalEducationInstitute: value.formalEducationInstitute.instituteID,
                    formalEducationType: value.formalEducationType.bizparKey,
                    formalEducationLevel: value.formalEducationLevel.bizparKey
                }
                data.push(value)
                console.log('isi', JSON.stringify(value))
                break;
            case "edit":
                value = {
                    ...value,
                    formalEducationCertificationDate: R.isEmpty(value.formalEducationCertificationDate) || R.isNil(value.formalEducationCertificationDate) || value.formalEducationCertificationDate === 'Invalid date' ? '' : M(value.formalEducationCertificationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationEndDate: M(value.formalEducationEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationStartDate: M(value.formalEducationStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    formalEducationDegree: value.formalEducationDegree.bizparKey,
                    formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
                    formalEducationDepartement: value.formalEducationDepartement.bizparKey,
                    formalEducationInstitute: value.formalEducationInstitute.instituteID,
                    formalEducationType: value.formalEducationType.bizparKey,
                    formalEducationLevel: value.formalEducationLevel.bizparKey
                }
                let status = R.findIndex(R.propEq('applicantFormalEducationID', value.applicantFormalEducationID))(data)
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

        applicantFormalEducations = data
        let payload = {
            applicantNumber,
            applicantFormalEducations,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        console.log(JSON.stringify(payload))
        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantFormalEducation(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        console.log(res.data)
                        this.props.openSavePopUp()
                        if (type !== "delete") this.setState({
                           // createPopUpVisible: true
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

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columnsFormEdu = [
        "Formal Education Number",
        "Start Date",
        "Finish Date",
        "Level of Education",
        "Major",
        "Institution",
        "Certificate Num",
        "Certificate Date",
        "GPK",
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
            <div className="vertical-tab-content active" id="content-nav-5">
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
                                title='Formal Education'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableFormalEdu}
                                columns={this.columnsFormEdu}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormFormalEdu
                            type={"create"}
                            sendState={this.state.sendState}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDep={this.state.bizparEduDep}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
                            onClickClose={this.openCloseCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}
                    {this.state.editVisible && (
                        <FormFormalEdu
                            type={"update"}
                            sendState={this.state.sendState}
                            applicantDataFormEdu={this.state.applicantData.applicantFormalEducations[this.state.selectedIndex]}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDep={this.state.bizparEduDep}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}

                        />
                    )}
                    {this.state.viewVisible && (
                        <FormFormalEdu
                            type={"view"}
                            applicantDataFormEdu={this.state.applicantData.applicantFormalEducations[this.state.selectedIndex]}
                            bizparEduDegreePosition={this.state.bizparEduDegreePosition}
                            bizparEduDegree={this.state.bizparEduDegree}
                            bizparEduDep={this.state.bizparEduDep}
                            bizparEduLevel={this.state.bizparEduLevel}
                            bizparEduType={this.state.bizparEduType}
                            institute={this.state.institute}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormFormalEducationApplicant)