import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import { connect } from 'react-redux'
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import FormBankAccount from "../../modules/forms/formMasterData/formBankAccount";
import Api from "../../Services/Api";
import PopUp from "../pages/PopUpAlert";
import M from "moment";

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class BankAccount extends Component {
    constructor() {
        super()
        this.state = {
            dataTable: [],
            saveClass: "app-popup",
            rawData: [],
            countryValue: [],
            timeout: 1000 * 100 * 9,
            selectedIndex: null,
            isTimedOut: false,
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            allowResize: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.getAllBank()
        }
    }

    getAllBank = async () => {
        let body = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }
        let response = await Api.create("MASTERDATA").getAllBank(body)
        if (response.ok === true && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { bankID, bankCode, bicode, bankName } = value
                return [
                    index += 1,
                    bankID,
                    bankCode,
                    bicode,
                    bankName
                ]
            })
            this.setState({ dataTable, rawData: response.data.data }, () => console.log(this.state.dataTable))
        }
        console.log(response)
    }

    handleUpdate(data) {
        console.log(data)
        Api.create('MASTERDATA').putBank(data).then((res) => {
            console.log(res)
            this.clResizePane()
            this.openSavePopUp()
        })
    }

    handleCreate(data) {
        console.log(data)
        Api.create('MASTERDATA').postBank(data).then((res) => {
            this.getAllBank()
            this.setState({ createVisible: false })
        })
    }

    handleDelete = async () => {
        let payload = {
            referenceID: this.state.rawData[this.state.selectedIndex].bankID,
            requestBy: "DELETE-TEST",
            requestDate: M().format("DD-MM-YYYY HH:mm:ss")
        }

        let response = await Api.create('MASTERDATA').deleteBank(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({ deletePopUpVisible: false })
            this.getAllBank()
        } else {
            if (response.data && response.data.message) alert("Failed, Please Try Again")
        }
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

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.clResizePane()
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        console.log(menu, selectedIndex)
        this.setState({
            editVisible: false,
            viewVisible: false,
            selectedIndex,
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-edit':
                this.setState({
                    editVisible: true,
                    selectedIndex,
                }) 
                break
            case 'slide-view':
                this.setState({
                    viewVisible: true,
                    selectedIndex,
                })
                break
            default:
                break
        }
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        this.setState({
            editVisible: false,
            viewVisible: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    openPopUp = (type, index) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false })
                this.clResizePane()
                break
            case "delete":
                this.clResizePane()
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, editVisible: false })
        this.getAllBank()
    }

    openDeletePopup = (index) => {
        this.clResizePane()
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };

    columns = [
        "No",
        "Bank ID",
        "Bank Account",
        "BI Code",
        "Bank Name",
        {
            name: "Action",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index}
                        style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-edit", tableMeta.rowIndex)}
                                className="btnAct margin-right-15px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                className="btnAct margin-right-15px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-view", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "BANK-001", "9902", "001002003", "MANDIRI"],
        ["2", "BANK-002", "99872", "009008003", "BNI"],
        ["3", "BANK-003", "99723", "003003005", "BTN"],
        ["4", "BANK-004", "9910", "0034005005", "BCA"],
    ]

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { timeout, allowResize, defaultSize, minSize, maxSize, createVisible, editVisible, viewVisible, savePopUpVisible, deletePopUpVisible } = this.state
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
                        timeout={timeout} />
                    <div>
                        <ResizeSlider
                            allowResize={allowResize}
                            defaultSize={defaultSize}
                            minSize={minSize}
                            maxSize={maxSize}
                            main={(
                                <div className='a-s-p-mid no-header'>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="a-s-p-top">
                                        <div className="col-2 content-right">
                                            <button
                                                type="button"
                                                className="btn btn-circle background-blue"
                                                style={{ marginRight: 10 }}
                                                onClick={this.openCreateForm.bind(this)}
                                            >
                                                <i className="fa fa-1x fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Bank Account'
                                                subtitle={"lorem ipsum dolor"}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {createVisible && (
                                        <FormBankAccount
                                            type={"create"}
                                            onClickSave={this.handleCreate.bind(this)}
                                            onClickClose={this.openCreateForm.bind(this)}
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
                                    {this.state.savePopUpVisible && (
                                        <PopUp
                                            type={"save"}
                                            class={"app-popup app-popup-show"}
                                            onClick={this.state.createVisible ? this.openCreateForm.bind(this) : this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {editVisible && (
                                        <FormBankAccount
                                            type={"edit"}
                                            countryValue={this.props.countryValue}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            onClickSave={this.handleUpdate.bind(this)}
                                            closeSlide={this.clResizePane.bind(this)}
                                        />
                                    )}
                                    {viewVisible && (
                                        <FormBankAccount
                                            type={"view"}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            closeSlide={this.clResizePane.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {/* {savePopUpVisible && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("save")}
                            />
                        )}
                        {deletePopUpVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("delete")}
                                onClickDelete={() => this.deleteDataVendor()}
                            />
                        )} */}
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

export default connect(mapStateToProps, mapDispatchToProps)(BankAccount)