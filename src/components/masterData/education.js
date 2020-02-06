import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormEducation from "../../modules/forms/formMasterData/formEducation";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api"
import MasterdataAction from '../../Redux/MasterdataRedux';
import { connect } from 'react-redux';
import * as R from 'ramda';
import M from 'moment';
import ResizeSlider from '../../modules/resize/Slider'
import SlideFormEducation from "../../modules/forms/formMasterData/slideFormEducation";
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const clSlidePage = 'a-s-p-main'

const getMuiTheme = () => createMuiTheme(ct.customTable());

const options = ct.customOptions();

class Education extends Component {
    constructor() {
        super()
        this.state = {
            rawData: [],
            dataTable: [],
            bizparEduType: [],
            bizparEduLevel: [],
            selectedIndex: [],
            educationData: this.defaultEducation,
            createVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false,
            editVisible: false,
            viewVisible: false,
            fetching: false,
            refreshing: false,
            value: '',
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            slideEdu: false,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            eduCount: 0,
            table_limit: 5,
            table_page: 0,
            table_query: "",
        }
        this.idleTimer = null
    }

    logout() {
        this.props.authLogout()
        return <Redirect to={{ pathname: "/" }} ></Redirect>
    }

    onAction() {
        this.setState({ isTimedOut: false })
    }

    onActive() {
        this.setState({ isTimedOut: false })
    }

    onIdle() {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            alert("Your session has timed out. Please log in again")
            this.logout()
        } else {
            this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    componentDidMount() {
        this.getDataEdu(this.state.table_page, this.state.table_limit)
    }

    getDataEdu = (page, limit ) => {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch();
            this.props.getEducation({
                "limit": limit,
                "offset": page,
                "params": {
                    "educationConfigurationStatus": "ACTIVE"

                }
            });
            this.getBizparEduType();
            this.getBizparEduLevel();
            this.getCountPage()
        }
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.masterdata.fetching && !R.isNil(newProps.masterdata.education)) {
            this.onFinishFetch()
            if (newProps.masterdata.education === null) {
                this.setState({ dataTable: [] })
            }
            let dataTable = newProps.masterdata.education.map((value) => {
                const { educationConfigurationID, educationConfigurationType, educationConfigurationLevel } = value;
                return [
                    educationConfigurationID,
                    educationConfigurationType.bizparValue,
                    educationConfigurationLevel.bizparValue
                ]
            })
            this.setState({
                rawData: newProps.masterdata.education,
                dataTable
            })
        }
        this.setState({
            fetching: newProps.masterdata.fetching,
            refreshing: newProps.masterdata.fetching
        });
    }

    getCountPage = async () => {
        let res = await API.create('MASTERDATA').getCountEducationByStatus('ACTIVE')
        let countActive = res.data.data
        if (!R.isEmpty(this.state.table_query)) {
            let response = await API.create('MASTERDATA').getCountEducationByLevel(this.state.table_query)
            if (response.ok) {
                this.setState({ eduCount: response.data.data })
            }
            let body = {
                limit: this.state.table_limit,
                offset: this.state.table_page,
                params: {
                    educationConfigurationLevelName: this.state.table_query
                }
            }
            let res = await API.create('MASTERDATA').getAllEducationByLevel(body)
            if (res.ok) {
                if (res.data.data === null) {
                    this.setState({ dataTable: [] })
                } else {
                    let dataTable = res.data.data.map((value) => {
                        const { educationConfigurationID, educationConfigurationType, educationConfigurationLevel } = value;
                        return [
                            educationConfigurationID,
                            educationConfigurationType.bizparValue,
                            educationConfigurationLevel.bizparValue
                        ]
                    })
                    this.setState({
                        rawData: res.data.data,
                        dataTable
                    })
                }
            }
        } else {
            this.setState({ eduCount: countActive })
        }
    }

    async getBizparEduLevel() {
        let payloadEduLev = {
            params: {
                bizparCategory: "EDUCATION_LEVEL"
            },
            offset: 0,
            limit: 20
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

    async getBizparEduType() {
        let payloadEduType = {
            params: {
                bizparCategory: "EDUCATION_TYPE"
            },
            offset: 0,
            limit: 20
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

    handleSubmit = async (data) => {
        // return console.log('data', JSON.stringify(data))

        let payload = {
            ...data,
            // educationConfigurationDepartements: ["EDUDEP-001", "EDUDEP-002"],
            educationConfigurationType: data.educationConfigurationType.bizparKey,
            educationConfigurationLevel: data.educationConfigurationLevel.bizparKey,
            educationConfigurationStatus: 'ACTIVE',
            educationConfigurationCreationalSpecificationDTO: {
                createdDate: M().format("DD-MM-YYYY HH:mm:ss")
            }
        }
        console.log('payload', JSON.stringify(payload))
        let response = await API.create('MASTERDATA').postEducation(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({
                savePopUpVisible: true
            });
        } else {
            if (response.data && response.data.message) alert("Data Education Type / Education Level is Already Exist.")
        }
    }

    handleUpdate = async (data) => {
        // return console.log('Ins ID', JSON.stringify(data))
        // console.log('data', JSON.stringify(data))
        // let {instituteID, departmentBizparKey} =[]
        // instituteID = data.educationConfigurationInstitutes.map((value) => {
        //     return value.instituteID
        // })
        // departmentBizparKey = data.educationConfigurationDepartements.map((value) =>{
        //     return value.bizparKey
        // })
        // return console.log('Ins ID', JSON.stringify(instituteID))
        let payload = {
            ...data,
            // educationConfigurationInstitutes: instituteID,
            // educationConfigurationDepartements: departmentBizparKey,
            educationConfigurationType: data.educationConfigurationType.bizparKey,
            educationConfigurationLevel: data.educationConfigurationLevel.bizparKey,
            educationConfigurationStatus: 'ACTIVE',
            educationConfigurationCreationalSpecificationDTO: {
                createdDate: M().format("DD-MM-YYYY HH:mm:ss")
            }
        }
        console.log('data', JSON.stringify(payload))
        let response = await API.create('MASTERDATA').updateEducation(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({
                savePopUpVisible: true
            });
        } else {
            if (response.data && response.data.message) alert(response.data.message)
        }
    }

    handleDelete = async () => {
        let payload = {
            referenceID: this.state.rawData[this.state.selectedIndex].educationConfigurationID,
            requestBy: "DELETE-TEST",
            requestDate: M().format("DD-MM-YYYY HH:mm:ss")
        }
        // return console.log(payload)
        let response = await API.create('MASTERDATA').deleteEducation(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({ deletePopUpVisible: false })
            this.props.getEducation({
                "params": {
                    "educationConfigurationStatus": "ACTIVE"
                },
                "offset": 0,
                "limit": 100
            });
        } else {
            if (response.data && response.data.message) alert(response.data.message)
        }
    }

    handlePopUp = () => {
        this.clResizePane()
        this.props.getEducation({
            "limit": 100,
            "offset": 0,
            "params": {
                "educationConfigurationStatus": "ACTIVE"

            }
        });
        this.setState({
            savePopUpVisible: false,
            createVisible: false,
            editVisible: false
        })
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    openCreateForm = () => {
        this.clResizePane()
        this.setState({ createVisible: !this.state.createVisible })
    };

    openEditForm = (index = null) => {
        this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
    };

    openDetailForm = (index) => {
        this.clResizePane()
        this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
    };

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    };

    openDeletePopup = (index) => {
        this.clResizePane()
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };

    columns = [
        "Education-Config ID",
        "Education Type",
        "Education Level",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div style={{ width: '115px' }}>
                            <button
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={this.opSidePage('slide-menu-view', tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    clSidePage = () => {
        this.setState({ classAppSlidePage: 'app-side-page' })
    }

    opSidePage = (menu, data) => (e) => {
        e.preventDefault()
        let selectedIndex = data
        console.log(selectedIndex)
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            slideEdu: false,

        })

        this.opResizePane()

        switch (menu) {
            case 'slide-menu-1':
                this.setState({
                    slideEdu: true,
                    selectedIndex,
                    slideType: "update"
                })
                break
            case 'slide-menu-view':
                this.setState({
                    slideEdu: true,
                    selectedIndex,
                    slideType: "view"
                })
                break
            default:
                break
        }

    }

    opResizePane = () => {
        console.log('open', this.state.defaultSize)
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        console.log('close', this.state.defaultSize)
        this.setState({
            slideEdu: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { eduCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: eduCount,
            searchText: table_query,
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.setState({ table_page: tableState.page })
                        this.getDataEdu(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'changeRowsPerPage':
                        this.setState({ table_limit: tableState.rowsPerPage })
                        this.getDataEdu(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'search':
                        let searchText = tableState.searchText ? tableState.searchText : ""
                        this.setState({ table_query: searchText }, () => {
                            this.getDataEdu(tableState.page, tableState.rowsPerPage)
                        })
                        break;
                    default:
                        break;
                }
            }
        }
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: 'calc(100vh - 50px)' }}>
                <div className='col-1'></div>
                <div className='col-2'>
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={this.onActive.bind(this)}
                        onIdle={this.onIdle.bind(this)}
                        onAction={this.onAction.bind(this)}
                        debounce={250}
                        timeout={this.state.timeout} />
                    <div >
                        <ResizeSlider
                            allowResize={this.state.allowResize}
                            defaultSize={this.state.defaultSize}
                            minSize={this.state.minSize}
                            maxSize={this.state.maxSize}
                            main={(
                                <div className='a-s-p-mid no-header'>
                                    <div>
                                        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                        <div className="padding-10px">
                                            <div className="margin-bottom-10px grid grid-2x">
                                                <div className="col-1">
                                                    <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                                                        {/* EDUCATION CONFIGURATION */}
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <button
                                                        type="button"
                                                        className="btn btn-circle background-blue"
                                                        onClick={this.openCreateForm.bind(this)}
                                                    >
                                                        <i className="fa fa-1x fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        key={eduCount}
                                                        title={'Education'}
                                                        subtitle={"lorem ipsum dolor"}
                                                        data={this.state.dataTable}
                                                        columns={this.columns}
                                                        options={tableOptions}
                                                    />
                                                </MuiThemeProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {/* edit */}
                                    {this.state.slideEdu && (
                                        <SlideFormEducation
                                            type={this.state.slideType}
                                            user={this.props.auth.user}
                                            educationData={this.state.rawData[this.state.selectedIndex]}
                                            bizparEduLevel={this.state.bizparEduLevel}
                                            bizparEduType={this.state.bizparEduType}
                                            closeSlide={this.clResizePane}
                                            onClickSave={this.handleUpdate.bind(this)}
                                        />
                                    )}
                                </div>
                            )}>

                        </ResizeSlider>
                        {this.state.detailVisible && (
                            <FormEducation
                                type={"view"}
                                user={this.props.auth.user}
                                educationData={this.state.rawData[this.state.selectedIndex]}
                                bizparEduLevel={this.state.bizparEduLevel}
                                bizparEduType={this.state.bizparEduType}
                                onClickClose={this.openDetailForm.bind(this)}
                            />
                        )}
                        {/* {this.state.editVisible && (
                    <FormEducation
                        type={"update"}
                        educationData={this.state.rawData[this.state.selectedIndex]}
                        bizparEduLevel={this.state.bizparEduLevel}
                        bizparEduType={this.state.bizparEduType}
                        onClickClose={this.openEditForm.bind(this)}
                        onClickSave={this.handleUpdate.bind(this)}
                    />
                )} */}
                        {this.state.createVisible && (
                            <FormEducation
                                type={"create"}
                                // educationData={this.state.rawData[this.state.selectedIndex]}
                                user={this.props.auth.user}
                                bizparEduLevel={this.state.bizparEduLevel}
                                bizparEduType={this.state.bizparEduType}
                                onClickClose={this.openCreateForm.bind(this)}
                                onClickSave={this.handleSubmit.bind(this)}
                            />
                        )}
                        {this.state.savePopUpVisible && (
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
                                onClickDelete={this.handleDelete}
                                onClick={this.openDeletePopup}
                            />
                        )}
                    </div>

                </div>
            </SplitPaneSecond>
        )
    }
}

const mapStateToProps = state => {
    return {
        masterdata: state.masterdata,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getEducation: obj => dispatch(MasterdataAction.getEducation(obj)),
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Education);