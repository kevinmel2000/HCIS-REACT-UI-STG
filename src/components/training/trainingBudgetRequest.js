import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import TrainingBudgetCreateForm from './trainingBudgetCreateForm'
import NumberFormat from 'react-number-format'
import Api from '../../Services/Api'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TrainingBudgetRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            savePopUpVisible: false,
            saveOk: false,
            button: "",
            data: [],
            rawData: [],
            dataTable: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
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

    startFetch = () => {
        this.LoadingBar.continousStart();
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
        this.getData()
    }

    async getData() {
        let response = await Api.create('TRAINING').getTrainingBudget()
        console.log(response)
        let dataTable = []
        dataTable.push([
            "1",
            response.data.trainingBudgetName,
            response.data.trainingBudgetPeriod,
            response.data.trainingBudget,
            response.data.trainingBudgetRemainingBudget,
            response.data.trainingBudgetType,
            response.data.trainingBudgetDescription,
            response.data.trainingBudgetStatus
        ])
        // dataTable.map((value, index) => {
        //     const {
        //         trainingBudgetName,
        //         trainingBudgetPeriod,
        //         trainingBudget,
        //         trainingBudgetRemainingBudget,
        //         trainingBudgetDescription,
        //         trainingBudgetType,
        //         trainingBudgetStatus
        //     } = value
        //     return [
        //         index += 1,
        //         trainingBudgetPeriod,
        //         trainingBudgetName,
        //         trainingBudget,
        //         trainingBudgetRemainingBudget,
        //         trainingBudgetType,
        //         trainingBudgetDescription,
        //         trainingBudgetStatus
        //     ]
        // })
        this.setState({ data: dataTable, rawData: response.data, dataTable }, () => console.log(JSON.stringify(this.state.dataTable)))
    }

    postData = async (body) => {
        let response = await Api.create('TRAINING').postTrainingBudget(body)
        console.log(JSON.stringify(response))
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
            formDetailVisible: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            formDetailVisible: false,
            selectedIndex,
            savePopUpVisible: false,
        })
        this.opResizePane()

        switch (menu) {
            case 'slide-detail':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    button: "detail",
                    // data: {
                    //     "period": this.data[selectedIndex][1],
                    //     "budget": '60000000',
                    //     "desc": 'Training 2017'
                    // }
                })
                break
            case 'slide-edit':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    button: "edit",
                    // data: {
                    //     "period": this.data[selectedIndex][1],
                    //     "budget": '60000000',
                    //     "desc": 'Training 2017'
                    // }
                })
                break

            default:
                break
        }

    }

    // data = [
    //     ["1", "2017", "Rp 120.000.000", "Rp 60.000.000", "Rp 30.000.000", "Training 2017", "APPROVED"],
    //     ["2", "2018", "Rp 120.000.000", "Rp 60.000.000", "Rp 30.000.000", "Training 2018", "APPROVED"],
    //     ["3", "2019", "Rp 120.000.000", "Rp 60.000.000", "Rp 30.000.000", "Training 2019", "APPROVED"],
    //     ["4", "2020", "Rp 120.000.000", "Rp 60.000.000", "Rp 30.000.000", "Training 2020", "APPROVED"]
    // ]

    columns = [
        "No",
        "Training Budget Name",
        "Period",
        "Training Budget",
        "Remaining Budget",
        "Training Budget Type",
        "Description",
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
                            {val === "ACTIVE" ? (
                                <div>
                                    <i
                                        className="fa fa-lw fa-circle"
                                        style={{ color: "green", marginRight: 10, padding: "5px" }}
                                    />
                                    {val}
                                </div>
                            ) : (
                                    <div>
                                        <i
                                            className="fa fa-lw fa-circle"
                                            style={{ color: "red", marginRight: 10, padding: "5px", }}
                                        />
                                        {val}
                                    </div>
                                )}
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
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-edit", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openPopUp("delete")}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-detail", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    openPopUp = (type, button) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, button })
                // this.postData(button)
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                break
            case "ok":
                this.setState({ savePopUpVisible: false, saveOk: !this.state.saveOk })
                this.clResizePane()
                break
            case "create":
                this.clResizePane()
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                break
            case "createRequest":
                this.setState({ formCreateRequest: !this.state.formCreateRequest })
                break
            default:
                break
        }
    }

    renderDetail = (type) => {
        let { data } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-tasks "></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Training Budget  - {type === "detail" ? "Detail Form" : "Edit Form"}
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.clResizePane}
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#">
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Budget ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        onChange={e => e.target.value}
                                        value={this.state.rawData.trainingBudgetID}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Budget Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        readOnly={type === 'detail'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                rawData: {
                                                    ...this.state.rawData,
                                                    trainingBudgetName: e.target.value
                                                }
                                            })
                                        }}
                                        value={this.state.rawData.trainingBudgetName}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Period <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        readOnly={type === 'detail'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={e => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ rawData: { ...this.state.rawData, period: e.target.value } })
                                        }}
                                        value={this.state.rawData.trainingBudgetPeriod}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Total Budget <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        // placeholder={'17,000,000'}
                                        value={this.state.rawData.trainingBudget}
                                        required
                                        onValueChange={(e) => {
                                            this.setState({
                                                rawData: { ...this.state.rawData, No: e.budget }
                                            })
                                        }
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Remaining Budget <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        readOnly={type === 'detail'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ rawData: { ...this.state.rawData, trainingBudgetRemainingBudget: e.target.value } })
                                        }}
                                        value={this.state.rawData.trainingBudgetRemainingBudget}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Budget Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        readOnly={type === 'detail'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ rawData: { ...this.state.rawData, trainingBudgetType: e.target.value } })
                                        }}
                                        value={this.state.rawData.trainingBudgetType}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Description</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        readOnly={type === 'detail'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        rows={4}
                                        onChange={e => this.setState({ rawData: { ...this.state.rawData, desc: e.target.value } })}
                                        value={this.state.rawData.trainingBudgetDescription}
                                    />
                                </div>
                                <div className="padding-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            {type !== 'detail' && (
                                                <button
                                                    className="btn btn-blue"
                                                    type="button"
                                                    onClick={() => this.openPopUp("save")}
                                                >
                                                    <span>SUBMIT</span>
                                                </button>
                                            )}
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.clResizePane}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        )
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formDetailVisible, deletePopUpVisible, savePopUpVisible, saveOk, timeout, minSize, maxSize, allowResize, defaultSize, button, selectedIndex, formCreateVisible } = this.state
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
                                    <div className='padding-10px grid grid-2x'>
                                        <div className='column-1'></div>
                                        <div className='column-2 content-right'>
                                            <button
                                                type="button"
                                                onClick={() => this.openPopUp("create")}
                                                className="btn btn-circle background-blue"
                                            >
                                                <i className="fa fa-lg fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Training Budget'
                                                subtitle={'lorem ipsum dolor'}
                                                data={this.state.data}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {formCreateVisible && (
                                        <TrainingBudgetCreateForm
                                            onClickClose={() => this.openPopUp("create")}
                                            onClickSave={this.postData.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {formDetailVisible && this.renderDetail(this.state.button)}
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"simpan"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("save")}
                                onClickSimpan={button === "decline" ? this.opSidePage("slide-decline", selectedIndex) : button === "change" ? this.opSidePage("slide-reschedule", selectedIndex) : () => this.openPopUp("ok")}
                            />
                        )}

                        {saveOk && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("ok")}
                            />
                        )}
                        {deletePopUpVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("delete")}
                                onClickDelete={() => this.openPopUp("delete")}
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

export default connect(mapStateToProps, mapDispatchToProps)(TrainingBudgetRequest)