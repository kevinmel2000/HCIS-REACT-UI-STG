import React, { Component } from 'react'
import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'
// import TimePicker from '../../modules/popup/Time'
// import NumberFormat from 'react-number-format'
// import Api from '../../Services/Api'
// import * as R from 'ramda'
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const options5 = ct.customOptions5()

const testPayload = {
    "trainingID": "",
    "trainingName": "",
    "trainingMaxAttendance": "",
    "trainingProvider": "",
    "trainingBudgetAttendance": "",
    "trainingCostAmount": "",
    "trainingStartDate": "",
    "trainingEndDate": "",
    "trainingBudgetID": "",
    "trainingDescription": "",
    "trainingOrgLevels": [],
    "trainingStatus": "",
    "trainingCategory": "",
    "trainingType": "",
    "recordID": "b8accfa2-bd69-4f99-9a2f-d5b780741854",
    "trainingPlanCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": "SYSTEM",
        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss"),
    }
}

class TrainingPlanCreateForm extends Component {
    bizparType = [
        { bizparKey: 'HARDSKILL', bizparValue: 'HARDSKILL' }
    ]
    bizparStatus = [
        { bizparKey: 'APPROVED', bizparValue: 'APPROVED' },
        { bizparKey: 'REJECTED', bizparValue: 'REJECTED' },
        { bizparKey: 'WAITING_APPROVAL', bizparValue: 'WAITING APPROVAL' },
        { bizparKey: 'REVISED', bizparValue: 'REVISED' },
        { bizparKey: 'INITIATE', bizparValue: 'INITIATE' }
    ]
    bizparCategory = [
        { bizparKey: 'REGULAR', bizparValue: 'REGULAR' }
    ]
    // dataOrgLevels = [
    //     ["1", "OUID-001", "Org Levels Name", "This is description", "Jakarta"],
    //     ["2", "OUID-002", "Org Levels Name", "This is description", "Jakarta"],
    //     ["3", "OUID-003", "Org Levels Name", "This is description", "Jakarta"],
    //     ["4", "OUID-004", "Org Levels Name", "This is description", "Jakarta"]
    // ]
    columnsOrgLevels = [
        "OUID",
        // "Description",
        // "Salary Start From",
        // "Salary Start To",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type='button'
                                onClick={this.handleDeleteTrainingOrg(tableMeta)}
                                className="btn btn-small-circle btn-grey">
                                <i className="fa fa-1x fa-trash-alt color-red" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]
    columnsOrgLevelsCreate = [
        "No",
        "OUID",
        "Description",
        "Salary Start From",
        "Salary Start To",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type='button'
                                onClick={this.handleSubmitTrainingOrg(tableMeta)}
                                className="btn btn-small-circle btn-grey">
                                <i className="fa fa-1x fa-plus color-blue" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    constructor(props) {
        super(props)
        this.state = {
            dataDetail: props.payload ? {
                ...props.payload,
                trainingStartDate: M(props.payload.trainingStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                trainingEndDate: M(props.payload.trainingEndDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
            } : {
                ...testPayload,
                recordID: 'b8accfa2-bd69-4f99-9a2f-d5b780741854-' + M(), //"57959200"
                // trainingBudgetID: 'TRNBDG-' + M(),
                trainingID: 'TRN-' + M()
            },
            dataOrgLevelsCreate: props.payloadOrgLevel ? props.payloadOrgLevel : [],
            dataOrgLevels: [],
            dataTableOrgLevelsNew: props.payload ? props.payload.trainingOrgLevels : [],
            viewTrainingBudgetID: '',
            visiblePopupOrgLevels: false,
            visiblePopupSearch: false,
            navigator: [
                {
                    status: 'active',
                    title: 'Training Plan',
                    content: ''
                },
                {
                    status: '',
                    title: 'Training Organization Levels',
                    content: 'app-hide'
                },
            ]
        }
    }

    componentDidMount() {
        if (this.props.type !== "create") {
            this.getDataOrgLevels()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.type !== "create") {
            if (this.props.payload !== prevProps.payload) {
                this.setState({
                    dataDetail: {
                        ...this.props.payload,
                        trainingStartDate: M(this.props.payload.trainingStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                        trainingEndDate: M(this.props.payload.trainingEndDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    },
                })
                this.getDataOrgLevels()
            }
        }
    }

    getDataOrgLevels() {
        let trainingOrgLevels = this.props.payload && this.props.payload.trainingOrgLevels.map((value) => {
            return value.ouID
        })
        let dataTableOrgLevelsNew = this.props.payload && this.props.payload.trainingOrgLevels.map((value) => {
            let {ouID} = value
            return [
                ouID
            ]
        })
        this.setState({
            dataDetail: {
                ...this.state.dataDetail,
                trainingOrgLevels
            },
            dataTableOrgLevelsNew
        })
    }

    handleDeleteTrainingOrg = (data) => (e) => {
        let {dataDetail, dataTableOrgLevelsNew} = this.state
        let newTraining = dataDetail.trainingOrgLevels.filter(
            item => item !== data.rowData[0]
        )
        let newPayload = dataTableOrgLevelsNew.filter(
            item => item[0] !== data.rowData[0]
        )
        this.setState({
            dataDetail: {
                ...dataDetail,
                trainingOrgLevels: newTraining
            },
            dataTableOrgLevelsNew: newPayload,
        })
    }

    handleSubmitTrainingOrg = (data) => (e) => {
        let {dataDetail, dataTableOrgLevelsNew} = this.state
        let newPayload = [data.rowData[1]]
        this.setState({
            dataDetail: {
                ...dataDetail,
                trainingOrgLevels: [
                    ...dataDetail.trainingOrgLevels,
                    data.rowData[1]
                ]
            },
            dataTableOrgLevelsNew: [
                ...dataTableOrgLevelsNew,
                newPayload
            ],
        })
        this.openPopupOrgLevels()
    }

    hanldeChangeBudgetID = (data) => (e) => {
        this.setState({
            dataDetail: {
                ...this.state.dataDetail,
                trainingBudgetID: data.rowData[1]
            }
        })
        this.openPopupSearch()
    }

    openPopupSearch = () => {
        this.setState({
            visiblePopupSearch: !this.state.visiblePopupSearch
        })
    }

    openPopupOrgLevels = () => {
        this.setState({
            visiblePopupOrgLevels: !this.state.visiblePopupOrgLevels
        })
    }

    opNavigator = (e) => {
        var id = Number(e.currentTarget.dataset.id)
        this.setState(state => {
            const list = state.navigator.map((item, i) => {
                if (i === id) {
                    item.status = 'active'
                    item.content = ''
                } else {
                    item.status = ''
                    item.content = 'app-hide'
                }
                return item
            });
            return list
        });
    }

    renderOrgLevels = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Training Org Levels - Form Create'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openPopupOrgLevels}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={'Training Org Levels'}
                                // subtitle={'lorem ipsum dolor'}
                                data={this.state.dataOrgLevelsCreate}
                                columns={this.columnsOrgLevelsCreate}
                                options={options5}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px margin-bottom-15px">
                        <div className="grid">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.openPopupOrgLevels}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }

    renderBudget = () => {
        let datatable = [
            ["1", "TRNBDG-001", "2017", "Rp 120.000.000", "Training 2017"],
            ["2", "TRNBDG-002", "2018", "Rp 120.000.000", "Training 2018"],
            ["3", "TRNBDG-003", "2019", "Rp 120.000.000", "Training 2019"],
            ["4", "TRNBDG-004", "2020", "Rp 120.000.000", "Training 2020"]
        ]
        let columns = [
            "No",
            "Budget ID",
            "Period",
            "Total Budget",
            "Description",
            {
                name: "Action",
                options: {
                    customBodyRender: (val, tableMeta) => {
                        return (
                            <div>
                                <button
                                    type='button'
                                    onClick={this.hanldeChangeBudgetID(tableMeta)}
                                    className="btnAct margin-right-10px">
                                    <i 
                                        className="fa fa-plus" 
                                        style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                        )
                    }
                }
            }
        ]
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Training Budget Search Form'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openPopupSearch}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <form action="#">
                            <div className="display-flex-normals">
                                <div className="padding-10px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title='Training Budget List'
                                            // subtitle={'lorem ipsum dolor'}
                                            data={datatable}
                                            columns={columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div className="padding-top-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.openPopupSearch}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }

    renderForm = (type) => {
        let { dataDetail } = this.state
        return (
            <div className={type === "create" ? "display-flex-normal" : ""}>
                {/* first */}
                <div className="width width-full">
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Record ID <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: "#E6E6E6" }}
                            readOnly
                            className="txt txt-sekunder-color"
                            type="text"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    recordID: e.target.value
                                }
                            })}
                            value={dataDetail.recordID}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training ID <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: "#E6E6E6" }}
                            readOnly
                            className="txt txt-sekunder-color"
                            type="text"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingID: e.target.value
                                }
                            })}
                            value={dataDetail.trainingID}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Name <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="text"
                            required
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingName: e.target.value
                                }
                            })}
                            value={dataDetail.trainingName}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Max Attendance</h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="number"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingMaxAttendance: e.target.value
                                }
                            })}
                            value={dataDetail.trainingMaxAttendance}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Provider</h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="text"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingProvider: e.target.value
                                }
                            })}
                            value={dataDetail.trainingProvider}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Budget Attendance</h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="number"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingBudgetAttendance: e.target.value
                                }
                            })}
                            value={dataDetail.trainingBudgetAttendance}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Cost Ammount</h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="number"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingCostAmount: e.target.value
                                }
                            })}
                            value={dataDetail.trainingCostAmount}
                        ></input>
                    </div>
                </div>

                {type === "create" && (<div style={{width: '30px'}}></div>) }

                {/* second */}
                <div className="width width-full">
                    <div className="margin-bottom-15px">
                        <div className={type === "create" ? "display-flex-normal" : ""}>
                            <div className="width width-full">
                                <div className="txt-site txt-11 txt-main txt-bold margin-5px">
                                    <h4>Training Start Date <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <CalendarPicker
                                    date={dataDetail.trainingStartDate}
                                    disabled={type === 'detail' ? true : false}
                                    onChange={e => this.setState({
                                        dataDetail: {
                                            ...this.state.dataDetail,
                                            trainingStartDate: e
                                        }
                                    })} />
                            </div>
                            <div className={type === "create" ? "width width-50px margin-top-25px" : "width width-full margin-top-25px"} style={{textAlign: 'center'}}>
                                <div className="txt-site txt-11 txt-main txt-thin txt-middle">
                                    To
                                </div>
                            </div>
                            <div className="width width-full">
                                <div className="txt-site txt-11 txt-main txt-bold margin-5px">
                                    <h4>Training End Date <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <CalendarPicker
                                    date={dataDetail.trainingEndDate}
                                    disabled={type === 'detail' ? true : false}
                                    onChange={e => this.setState({
                                        dataDetail: {
                                            ...this.state.dataDetail,
                                            trainingEndDate: e
                                        }
                                    })} />
                            </div>
                        </div>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Budget ID</h4>
                            </div>
                        </div>
                        { type !== 'detail' ? <div className="card-date-picker">
                            <div className="double">
                                <div className="input">
                                    <input
                                        type="text"
                                        className="ip"
                                        readOnly
                                        value={ dataDetail.trainingBudgetID } />
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-grey border-left btn-no-radius" 
                                    onClick={this.openPopupSearch}>
                                    <i className="fa fa-lg fa-search" />
                                </button>
                            </div>
                        </div>
                        : 
                        <input
                            style={{ backgroundColor: "#E6E6E6" }}
                            readOnly
                            className="txt txt-sekunder-color"
                            type="text"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingBudgetID: e.target.value
                                }
                            })}
                            value={dataDetail.trainingBudgetID}
                        ></input>
                        }
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Description</h4>
                            </div>
                        </div>
                        <input
                            style={{ backgroundColor: type === 'detail' ? "#E6E6E6" : "#fff"}}
                            readOnly={type === 'detail' ? true : false}
                            className="txt txt-sekunder-color"
                            type="text"
                            onChange={e => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingDescription: e.target.value
                                }
                            })}
                            value={dataDetail.trainingDescription}
                        ></input>
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Status <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <DropDown
                            title={"-- please select status --"}
                            disabled={type === 'detail' ? true : false}
                            value={dataDetail.trainingStatus}
                            onChange={(dt) => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingStatus: dt
                                }
                            })}
                            type='bizpar'
                            data={this.bizparStatus} />
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Category <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <DropDown
                            title={"-- please select category --"}
                            disabled={type === 'detail' ? true : false}
                            value={dataDetail.trainingCategory}
                            onChange={(dt) => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingStatus: dt
                                }
                            })}
                            type='bizpar'
                            data={this.bizparCategory} />
                    </div>
                    <div className="margin-bottom-15px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Training Type <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <DropDown
                            title={"-- please select type --"}
                            disabled={type === 'detail' ? true : false}
                            value={dataDetail.trainingType}
                            onChange={(dt) => this.setState({
                                dataDetail: {
                                    ...this.state.dataDetail,
                                    trainingType: dt
                                }
                            })}
                            type='bizpar'
                            data={this.bizparType} />
                    </div>
                </div>
            </div>
        )
    }

    renderDetail = (type) => {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-tasks"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Training Plan  - {type === "detail" ? "Detail Form" : "Edit Form"}
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>


                <div>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <form action="#" onSubmit={(e) => {
                                    e.preventDefault()
                                    this.props.onClickSave(this.state.dataDetail)
                                }}>
                                <div className="app-open-close margin-top-10px margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-cah" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-tasks margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Training Plan General</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-cah">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content margin-bottom-30px">
                                        { this.renderForm(type) }
                                    </div>
                                </div>


                                <div className="app-open-close margin-bottom-30px">
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="navmenu"
                                            className="app-open-close-input"
                                            id="navmenu-ca" />
                                        <div className="grid grid-2x margin-bottom-10px">
                                            <div className="col-1">
                                                <div className="display-flex-normal margin-top-10px">
                                                    <i className="fa fa-1x fa-tasks margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">
                                                        Training Org Levels
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <label htmlFor="navmenu-ca">
                                                    <div className="app-open-close-icon"></div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="app-open-close-content">
                                            <div className="padding-bottom-15px">
                                                {type !== 'detail' && (
                                                    <div className='padding-bottom-10px grid grid-2x'>
                                                        <div className='column-1'></div>
                                                        <div className='column-2 content-right'>
                                                            <button
                                                                type="button"
                                                                onClick={() => this.openPopupOrgLevels()}
                                                                className="btn btn-circle btn-blue"
                                                            >
                                                                <i className="fa fa-lg fa-plus" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        title={'Training Org Levels'}
                                                        // subtitle={'lorem ipsum dolor'}
                                                        data={this.state.dataTableOrgLevelsNew}
                                                        columns={this.columnsOrgLevels}
                                                        options={options5}
                                                    />
                                                </MuiThemeProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <div className="margin-bottom-15px">
                                            <div className="grid">
                                                <div className="content-right">
                                                    <button
                                                        className="btn btn-blue"
                                                        type="submit"
                                                    // onClick={this.props.onClickSave}
                                                    >
                                                        <span>SUBMIT</span>
                                                    </button>
                                                    <button
                                                        style={{ marginLeft: "15px" }}
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={this.props.onClickClose}
                                                    >
                                                        <span>CLOSE</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>


            </div >
        )
    }

    renderCreate = () => {
        let type = 'create'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Training Plan - Create Form'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="navigator nav-all nav-theme-2">
                            <ul>
                                {this.state.navigator.map((item, i) => (
                                    <li
                                        onClick={this.opNavigator.bind(this)}
                                        className={item.status}
                                        data-id={i}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <form action="#" onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(this.state.dataDetail)
                        }}>
                        
                        <div className="padding-15px" style={{height: 'calc(100vh - 250px)', overflow: 'auto'}}>
                        
                            <div className={this.state.navigator[0].content}>
                                { this.renderForm(type) }
                            </div>

                            <div className={this.state.navigator[1].content}>
                                <div>
                                    <div className='padding-bottom-10px grid grid-2x'>
                                        <div className='column-1'></div>
                                        <div className='column-2 content-right'>
                                            <button
                                                type="button"
                                                onClick={() => this.openPopupOrgLevels()}
                                                className="btn btn-circle btn-blue"
                                            >
                                                <i className="fa fa-lg fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={'Training Org Levels'}
                                            // subtitle={'lorem ipsum dolor'}
                                            data={this.state.dataTableOrgLevelsNew}
                                            columns={this.columnsOrgLevels}
                                            options={options5}
                                        />
                                    </MuiThemeProvider>
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px margin-bottom-15px">
                            <div className="grid">
                                <div className="content-right">
                                    <button
                                        className="btn btn-blue"
                                        type="submit"
                                    // onClick={this.props.onClickSave}
                                    >
                                        <span>SUBMIT</span>
                                    </button>
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.onClickClose}
                                    >
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        </form>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div >
        )
    }
    
    render() {
        return (
            <div>
                { this.props.type === 'create' ? this.renderCreate() : this.renderDetail(this.props.type) }
                { this.state.visiblePopupSearch && this.renderBudget() }
                { this.state.visiblePopupOrgLevels && this.renderOrgLevels() }
            </div>
        )
    }
}

export default TrainingPlanCreateForm 