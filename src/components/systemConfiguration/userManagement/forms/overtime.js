import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import ResizeSlider from '../../../../modules/resize/Slider'
import FormOvertimeCreate from './create/overtime/formOvertimeCreate'
import PopUp from '../../../pages/PopUpAlert'
import Api from '../../../../Services/Api'
import M from 'moment'

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class confOvertime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreate: false,
            editOvertime: false,
            allowResize: false,
            savePopUpVisible: false,
            saveOk: false,
            deletePopUpVisible: false,
            dataTable: [],
            rawData: [],
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        }
    }

    componentDidMount() {
        this.getDataOvertime()
    }

    async getDataOvertime() {
        let payload = {
            "params": {
                "esID": this.props.auth.companyID
            },
            "offset": 0,
            "limit": 100
        }

        let response = await Api.create("CFG").getCorporateOvertimeByEsId(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { company, corporateOvertimeID, corporateOvertimeName, corporateOvertimeStartDate, corporateOvertimeEndDate, corporateOvertimeMaxValue, corporateOvertimeStatus } = value
                return [
                    index += 1,
                    company ? company.esID : "-",
                    corporateOvertimeID,
                    corporateOvertimeName,
                    corporateOvertimeStartDate,
                    corporateOvertimeEndDate,
                    corporateOvertimeMaxValue,
                    corporateOvertimeStatus === "ACTIVE" ? "YES" : "NO"
                ]
            })
            this.setState({ dataTable, rawData: response.data.data })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleSubmit() {
        let payload = this.state.payload
        payload = {
            ...payload,
            corporateOvertimeStartDate: M(payload.corporateOvertimeStartDate).format("DD-MM-YYYY"),
            corporateOvertimeEndDate: M(payload.corporateOvertimeEndDate).format("DD-MM-YYYY")
        }

        let response = await Api.create("CFG").postCorporateOvertimeType(payload)
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getDataOvertime()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate() {
        let payload = this.state.payload
        payload = {
            ...payload,
            company: payload.company.esID,
            corporateOvertimeStartDate: M(payload.corporateOvertimeStartDate).format("DD-MM-YYYY"),
            corporateOvertimeEndDate: M(payload.corporateOvertimeEndDate).format("DD-MM-YYYY"),
            corporateOvertimeCreational: {
                ...payload.corporateOvertimeCreational,
                modifiedBy: "SYSTEM",
                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
            }
        }

        let response = await Api.create("CFG").updateCorporateOvertimeType(payload)
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getDataOvertime()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let payload = {
            "referenceID": this.state.rawData[this.state.selectedIndex].corporateOvertimeID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        let response = await Api.create("CFG").deleteCorporateOvertimeType(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getDataOvertime()
        } else {
            alert("Failed: " + response.data.message)
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
            editOvertime: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({ editOvertime: false, selectedIndex })

        this.opResizePane()

        switch (menu) {
            case 'slide-overtime':
                this.setState({
                    editOvertime: true,
                    selectedIndex,
                    payloadOvertime: this.state.rawData[selectedIndex]
                })
                break;
            default:
                break
        }

    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({
            saveOk: false,
            savePopUpVisible: !this.state.savePopUpVisible,
            editOvertime: false
        })
    }

    openSaveOk = (payload) => {
        this.setState({ saveOk: !this.state.saveOk, payload })
    }

    openDeletePopUp = (index, type) => {
        this.clResizePane()
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, formType: type,
            editOvertime: false
        })
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        this.setState({ editOvertime: false })
        this.clResizePane()
        switch (type) {
            case "popup-overtime":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ formCreate: !this.state.formCreate, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    columns = [
        "No", "ES_ID", "Overtime Code", "Overtime Type", "Start Date", "End Date", "Value (Hour)",
        {
            name: "Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div>
                                <i
                                    className="fa fa-lw fa-circle"
                                    style={{
                                        color:
                                            val === "YES"
                                                ? "green"
                                                : "brown",
                                        marginRight: 10,
                                        padding: "5px"
                                    }}
                                />
                                {val}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => (
                    <div>
                        <button
                            className="btnAct"
                            style={{ marginRight: 15 }}
                            onClick={this.opSidePage("slide-overtime", tableMeta.rowIndex)}
                        >
                            <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                        </button>
                        <button
                            className="btnAct"
                            onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}
                        >
                            <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                        </button>
                    </div>
                )
            }
        }
    ]

    render() {
        return (
            <div>
                <ResizeSlider
                    allowResize={this.state.allowResize}
                    defaultSize={this.state.defaultSize}
                    minSize={this.state.minSize}
                    maxSize={this.state.maxSize}
                    main={(
                        <div>
                            <div className="a-s-p-place a-s-p-content active">
                                <div className="a-s-p-top">
                                    <div className="grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                                <div>
                                                    <i className="color-blue fa fa-1x fa-clock margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        Overtime Template
                                                    </div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">
                                                        Overtime Template
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="a-s-p-mid border-top">
                                    <div className="padding-10px">
                                        <div className="app-open-close margin-bottom-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-coh" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1"></div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-coh">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={() => this.opPopupPage("popup-overtime")}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                                {this.state.formCreate &&
                                                    <FormOvertimeCreate
                                                        type="create"
                                                        auth={this.props.auth.companyID}
                                                        loginEmployeeID={this.props.auth.employeeID}
                                                        onClickSave={this.openSaveOk.bind(this)}
                                                        onClickClose={this.opPopupPage.bind(this, "popup-overtime")}
                                                    />
                                                }
                                            </div>
                                            <div className="app-open-close-content">
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        title={"Overtime Template"}
                                                        subtitle={"lorem ipsum dolor"}
                                                        data={this.state.dataTable}
                                                        columns={this.columns}
                                                        options={options} />
                                                </MuiThemeProvider>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    side={(
                        <div className="a-s-p-side">
                            {this.state.editOvertime && (
                                <FormOvertimeCreate
                                    type={"update"}
                                    payload={this.state.payloadOvertime}
                                    auth={this.props.auth.companyID}
                                    loginEmployeeID={this.props.auth.employeeID}
                                    onDeletePopUp={this.openDeletePopUp}
                                    closeSlide={this.clResizePane}
                                    onClickSave={this.openSaveOk.bind(this)} />
                            )}
                        </div>
                    )}
                />

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.state.formCreate ? this.opPopupPage("popup-overtime") : this.setState({ savePopUpVisible: false })}
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp.bind(this)}
                        onClickDelete={this.handleDelete.bind(this)}
                    />
                )}
                {this.state.saveOk && (
                    <PopUp
                        type={"simpan"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSaveOk.bind(this)}
                        onClickSimpan={this.state.formCreate ? this.handleSubmit.bind(this) : this.handleUpdate.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default confOvertime