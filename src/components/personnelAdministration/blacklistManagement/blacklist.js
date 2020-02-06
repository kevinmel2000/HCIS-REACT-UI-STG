import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormBlacklist from "../../../modules/forms/formPersonel/formBlacklist"
import PopUp from "../../../components/pages/PopUpAlert"
import API from "../../../Services/Api"
import * as R from 'ramda'
import M from 'moment'
import { connect } from 'react-redux'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import LoadingBar from "react-top-loading-bar"
import { Redirect } from 'react-router-dom'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Blacklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savePopUpVisible: false,
            deletePopUpVisible: false,
            DetailVisible: false,
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            rawData: [],
            selectedIndex: [],
            bizparBlacklistType: [],
            bizparBlacklistCategory: [],
            bizparEmployeeType: [],
            auth: props.auth,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            dataTable: []
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

    getDataBlacklist() {
        let payload = {
            offset: 0,
            limit: 100
        }
        API.create('BLACKLIST').getAllBlacklist(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        console.log(res.data);
                        this.onFinishFetch()
                        let rawData = res.data.data.map((data, index) => {
                            return {
                                ...data,
                                category: data.blacklistCategory.bizparValue,
                                type: data.blacklistType.bizparValue,
                                blacklistCategory: data.blacklistCategory.bizparKey,
                                blacklistType: data.blacklistType.bizparKey,
                                employeeID: data.employee && data.employee.employeeID,
                                employeeName: data.employee && data.employee.employeeName,
                                employeeType: data.employee && data.employee.employeeType.bizparKey,
                                isPermanent: data.isPermanent,
                                blacklistStartDate: M(data.blacklistStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                                blacklistEndDate: M(data.blacklistEndDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                            }
                        })
                        let dataTable = res.data.data.map((value, index) => {
                            const { employee, blacklistType, blacklistStatus } = value
                            return [
                                index += 1,
                                employee && employee.employeeID,
                                employee && employee.employeeName,
                                blacklistType ? blacklistType.bizparValue : "-",
                                blacklistStatus.replace(/_/g, " "),
                                blacklistStatus
                            ]
                        })
                        this.setState({ rawData, dataTable })
                    }
                }
            }
        )
    }

    getBizparBlacklistType() {
        let payload = {
            params: {
                bizparCategory: "BLACKLIST_TYPE"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparBlacklistType: res.data.data
                        })
                    }
                }
            }
        )
    }

    getBizparEmployeeType() {
        let payload = {
            params: {
                bizparCategory: "EMPLOYEE_TYPE"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparEmployeeType: res.data.data
                        })
                    }
                }
            }
        )
    }

    getBizparBlacklistCategory() {
        let payload = {
            params: {
                bizparCategory: "BLACKLIST_CATEGORY"
            },
            offset: 0,
            limit: 100
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparBlacklistCategory: res.data.data
                        })
                    }
                }
            }
        )
    }


    openCloseCreate() {
        this.clResizePane()
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    openCloseEdit(selectedIndex) {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ editVisible: !this.state.editVisible, savePopUpVisible, selectedIndex })
    }

    openCloseView(selectedIndex) {
        this.clResizePane()
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 870
        })
    }

    opSidePage = (menu, index) => (e) => {
        e.preventDefault()
        this.setState({
            editVisible: false,
            viewVisible: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-blacklist':
                this.setState({
                    editVisible: true,
                    selectedIndex: index
                })
                break
            case 'slide-blacklist-view':
                this.setState({
                    viewVisible: true,
                    selectedIndex: index
                })
                break
            default:
                break
        }

    }

    clResizePane = () => {
        this.setState({
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }


    handleDelete = async () => {
        let payload = {
            "referenceID": this.state.rawData[this.state.selectedIndex].blacklistID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        let response = await API.create('BLACKLIST').deleteBlacklist(payload)
        if (response.ok && response.data.status === "S") {
            this.clResizePane()
            this.getDataBlacklist()
            this.setState({ deletePopUpVisible: false, selectedIndex: null });
        }
    };

    openSavePopUp = () => {
        if (this.state.savePopUpVisible) this.getDataBlacklist()
        this.clResizePane()
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            createVisible: this.state.savePopUpVisible ? false : this.state.createVisible,
            editVisible: this.state.savePopUpVisible ? false : this.state.editVisible
        });
    };

    openDeletePopup = index => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index
        });
    };

    async handleSave(value) {
        value = {
            ...value,
            blacklistStartDate: !R.isEmpty(value.blacklistStartDate) ? M(value.blacklistStartDate).format("DD-MM-YYYY") : "",
            blacklistEndDate: !R.isEmpty(value.blacklistEndDate) ? M(value.blacklistEndDate).format("DD-MM-YYYY") : ""
        }

        let response = await API.create('BLACKLIST').postBlacklist(value)
        if (response.ok && response.data.status === "S") {
            this.openSavePopUp()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleSubmit(value) {
        if (value.employee !== undefined) {
            delete value.employee
            delete value.employeeName
            delete value.employeeType
            delete value.category
            delete value.type
        }

        value = {
            "taskID": "",
            "senderUserID": this.state.auth.user.userID,
            "senderEmpID": this.state.auth.user.employeeID,
            "senderNotes": "",
            "senderBPMStatus": "INITIATE",
            "data": {
                ...value,
                blacklistStartDate: !R.isEmpty(value.blacklistStartDate) ? M(value.blacklistStartDate).format("DD-MM-YYYY") : "",
                blacklistEndDate: !R.isEmpty(value.blacklistEndDate) ? M(value.blacklistEndDate).format("DD-MM-YYYY") : ""
            }
        }

        let response = await API.create('BPM').submitBlacklist(value)
        if (response.ok && response.data.status === "S") {
            this.openSavePopUp()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(value) {
        if (value.employee !== undefined) {
            delete value.employee
            delete value.employeeName
            delete value.employeeType
            delete value.category
            delete value.type
        }

        value = {
            ...value,
            blacklistStartDate: value.isPermanent === false ? M(value.blacklistStartDate).format("DD-MM-YYYY") : "",
            blacklistEndDate: value.isPermanent === false ? M(value.blacklistEndDate).format("DD-MM-YYYY") : "",
            blacklistCreationalDTO: {
                ...value,
                modifiedBy: "SYSTEM",
                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
            }
        }
        let response = await API.create('BLACKLIST').putBlacklist(value)
        if (response.ok && response.data.status === "S") {
            this.openSavePopUp()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch();
            this.getDataBlacklist();
            this.getBizparBlacklistCategory();
            this.getBizparBlacklistType();
            this.getBizparEmployeeType()
        }
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    openApprovalDetail = index => {
        this.setState({
            DetailVisible: !this.state.DetailVisible,
            selectedIndex: index
        });
    };

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Blacklist Type",
        {
            name: "Status",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: val => {
                    return (
                        <div>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color:
                    val === "INITIATE"
                      ? "orange"
                      : val === "APPROVED"
                      ? "brown"
                      : val === "" || val === null
                      ? null
                      : val === "REJECTED"
                      ? "#424242"
                      : "gray",
                  marginRight: 10,
                  padding: "5px"
                }}
              />
              {val}
            </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {val === "INITIATE" ?
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={this.opSidePage("slide-blacklist", tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button> : null}
                            {val === "INITIATE" ?
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button> : null}
                            <button
                                type="button"
                                className="btnAct"
                                onClick={this.opSidePage("slide-blacklist-view", tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: 'calc(100vh - 50px)' }}>
                <div className="col-1 backgorund-white"></div>
                <div className="col-2 background-white">
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={this.onActive.bind(this)}
                        onIdle={this.onIdle.bind(this)}
                        onAction={this.onAction.bind(this)}
                        debounce={250}
                        timeout={this.state.timeout} />
                    <div>
                        <ResizeSlider
                            allowResize={this.state.allowResize}
                            defaultSize={this.state.defaultSize}
                            minSize={this.state.minSize}
                            maxSize={this.state.maxSize}
                            main={(
                                <div>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="a-s-p-place a-s-p-content active">
                                        <div className="a-s-p-top">
                                            <div className="col-2 content-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-circle background-blue"
                                                    style={{ marginRight: 10 }}
                                                    onClick={this.openCloseCreate.bind(this)}
                                                >
                                                    <i className="fa fa-1x fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="a-s-p-mid">
                                            <div className="padding-10px">
                                                <div className="app-open-close margin-bottom-20px">
                                                    <div className="app-open-close-content">
                                                        <MuiThemeProvider theme={getMuiTheme()}>
                                                            <MUIDataTable
                                                                title={"Blacklist"}
                                                                subtitle={"lorem ipsum dolor"}
                                                                data={this.state.dataTable}
                                                                columns={this.columns}
                                                                options={options} />
                                                        </MuiThemeProvider>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.createVisible && (
                                                <FormBlacklist
                                                    type={"create"}
                                                    bizparBlacklistType={this.state.bizparBlacklistType}
                                                    bizparBlacklistCategory={this.state.bizparBlacklistCategory}
                                                    bizparEmployeeType={this.state.bizparEmployeeType}
                                                    onClickSave={this.handleSave.bind(this)}
                                                    onClickSubmit={this.handleSubmit.bind(this)}
                                                    onClickClose={this.openCloseCreate.bind(this)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {this.state.editVisible && (
                                        <FormBlacklist
                                            type={"edit"}
                                            bizparBlacklistType={this.state.bizparBlacklistType}
                                            bizparBlacklistCategory={this.state.bizparBlacklistCategory}
                                            bizparEmployeeType={this.state.bizparEmployeeType}
                                            data={this.state.rawData[this.state.selectedIndex]}
                                            onClickSave={this.handleUpdate.bind(this)}
                                            onClickSubmit={this.handleSubmit.bind(this)}
                                            closeSlide={this.clResizePane}
                                        />
                                    )}

                                    {this.state.viewVisible && (
                                        <FormBlacklist
                                            type={"view"}
                                            bizparBlacklistType={this.state.bizparBlacklistType}
                                            bizparBlacklistCategory={this.state.bizparBlacklistCategory}
                                            bizparEmployeeType={this.state.bizparEmployeeType}
                                            data={this.state.rawData[this.state.selectedIndex]}
                                            closeSlide={this.clResizePane}
                                        />
                                    )}
                                </div>
                            )}
                        />
                        {this.state.savePopUpVisible && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={this.openSavePopUp}
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
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Blacklist)