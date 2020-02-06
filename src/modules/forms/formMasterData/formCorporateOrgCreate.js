import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import API from '../../../Services/Api'
import { connect } from 'react-redux'
import M from 'moment'
import * as R from 'ramda'
import CalendarPicker from '../../../modules/popup/Calendar'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const defaultPayload = {
    "isOrgStructureDefault": true,
    "orgStructureEndDate": '',
    "orgStructureSKNumber": "",
    "orgStructureStartDate": '',
    "orgStructureTPLID": "",
    "orgStructureTPLName": "",
    "orgStructureTPLStatus": true,
    "orgStructureTag": "",
    "payload": {},
    "referenceOrgStructureTPLID": ""
}


class FormCorporateOrgCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data ? {
                ...this.props.data,
                orgStructureStartDate: R.isNil(this.props.data.orgStructureStartDate) || R.isEmpty(this.props.data.orgStructureStartDate) ? '' : M(this.props.data.orgStructureStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                orgStructureEndDate: R.isNil(this.props.data.orgStructureStartDate) || R.isEmpty(this.props.data.orgStructureEndDate) ? '' : M(this.props.data.orgStructureEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            } : {
                    ...defaultPayload,
                    orgStructureTPLID: 'OS-' + M(),
                    orgStructureTag: 'V-' + M().format('x')
                },
            searchVisible: false,
            formCreateVisible: false,
            editVisible: false,
            esData: [],
            placeDateRange: false,
            placeDateStart: false,
            placeDate: false,
            dateRangePicker: {
                selection: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                    color: '#2ecc71'
                },
                compare: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'compare',
                },
            },
            auth: this.props.auth.user,
            orgCount: 0,
            table_limit: 5,
            table_page: 0,
            table_query: "",
        }
    }

    async getTaxPay() {
        let { payload, res } = ''
        payload = {
            "limit": 5,
            "offset": 0,
            "params": {}
        }
        res = await API.create('CFG').getAllTax(payload)
        if (res.data && res.data.status === 'S') {
            console.log('Get Tax', res.data.data)
            this.setState({
                rawDataTax: res.data.data,
            })
        }

        payload = {
            "params": {
                "payrollTPLStatus": "ACTIVE"
            },
            "offset": 0,
            "limit": 5
        }
        res = await API.create('CFG').getAllPayroll(payload)
        if (res.data && res.data.status === 'S') {
            console.log('Get Payroll', res.data.data)
            this.setState({
                rawDataPayroll: res.data.data,
            })
        }
    }

    pickOrg(index) {
        this.setState({
            searchVisible: !this.state.searchVisible,
            data: {
                ...this.state.data,
                referenceOrgStructureTPLID: this.state.type === 'create' ? this.state.rawDataOrg[index].orgStructureTPLId : this.state.rawDataOrg[index],
                payload: this.props.type === 'create' ? this.state.rawDataOrg[index].orgStructureTPLDetails : this.state.data.payload,
            },
            esData: this.state.rawDataOrg[index].orgStructureTPLDetails[0]
        })
    }

    async getAllOrg(page, limit) { 
        if (!R.isEmpty(this.state.table_query)) {
            let response = await API.create('CFG').getCountOrgbyStatusAndName(this.state.table_query)
            console.log(response)
            let payload = {
                "limit": limit,
                "offset": page,
                "params": {
                    "orgStructureTPLName": this.state.table_query
                }
              }
            let res = await API.create('CFG').getCorpOrgbyName(payload)
            if (res.data && res.data.status === 'S') {
                console.log('res', res.data.data)
                let dataTableOrg = res.data.data.map((value) => {
                    if (value !== null) {
                        const { orgStructureTPLId, orgStructureTPLName } = value
                        return [
                            orgStructureTPLId,
                            orgStructureTPLName,
                        ]
                    } else {
                        return ['', '', '']
                    }
                })
                this.setState({
                    dataTableOrg,
                    rawDataOrg: res.data.data,
                    orgCount: response.data.data
                })
            }
        } else {
            let response = await API.create('CFG').getCountCorpOSbyStatus('ACTIVE')
            console.log(response)
            let payload = {
                "limit": limit,
                "offset": page,
                "params": {
                    "orgStructureTPLStatus": "ACTIVE"
                }
            }
            let res = await API.create('CFG').getAllOrg(payload)
            if (res.data && res.data.status === 'S') {
                console.log('res', res.data.data)
                let dataTableOrg = res.data.data.map((value) => {
                    if (value !== null) {
                        const { orgStructureTPLId, orgStructureTPLName } = value
                        return [
                            orgStructureTPLId,
                            orgStructureTPLName,
                        ]
                    } else {
                        return ['', '', '']
                    }
                })
                this.setState({
                    dataTableOrg,
                    rawDataOrg: res.data.data,
                    orgCount: response.data.data
                })
            }
        }

    }


    componentDidMount() {
        if (this.props.type !== 'create') {
            if (this.state.data.referenceOrgStructureTPLID) this.getDataDiagram()
        }
        this.getAllOrg(this.state.table_page, this.state.table_limit)
        this.getTaxPay()
    }

    renderChildren = (data) => {
        return (
            <ul>
                {data.ouchildren.map((data, index) => {
                    return (
                        <li>
                            <label for={'child-' + data.ouid}>
                                {this.cardSpace(data.ouposition.bizparValue, '')}
                            </label>
                            <input
                                checked={true}
                                id={'child-' + data.ouid}
                                className="tree-button"
                                type="checkbox" />
                            {data.ouchildren.length > 0 && this.renderChildren(data)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    getDataDiagram = async () => {
        let res = await API.create('ES').getEsById(this.props.esid)
        console.log('chicken', res)
        if (res.data && res.data.status === "S") {
            this.setState({ esData: res.data.data && res.data.data.orgStructureTPL[this.props.masterIndex] && res.data.data.orgStructureTPL[this.props.masterIndex].referenceOrgStructureTPLID.orgStructureTPLDetails ? res.data.data.orgStructureTPL[this.props.masterIndex].referenceOrgStructureTPLID.orgStructureTPLDetails[0] : [] })
        } else {
            alert(res.data && res.data.message ? res.data.message : res.problem)
        }
    }

    openForm = (type, index) => {
        switch (type) {
            case "search":
                this.setState({ searchVisible: !this.state.searchVisible })
                break
            case "create":
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                break
            case "edit":
                this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    renderSearch = () => {
        let columnsSearch = ["ORG ID", "ORG NAME",
            {
                name: "Action",
                options: {
                    customBodyRender: (val, tableMeta) => (
                        <div>
                            <button
                                type="button"
                                onClick={() => this.pickOrg(tableMeta.rowIndex)}
                                className="btn btn-blue btn-small-circle">
                                <i className={"fa fa-lw fa-plus"} />
                            </button>
                        </div>
                    )
                }
            }
        ]

        let { orgCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: orgCount,
            searchText: table_query,
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.setState({ table_page: tableState.page })
                        this.getAllOrg(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'changeRowsPerPage':
                        this.setState({ table_limit: tableState.rowsPerPage })
                        this.getAllOrg(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'search':
                        let searchText = tableState.searchText ? tableState.searchText : ""
                        this.setState({ table_query: searchText }, () => {
                            this.getAllOrg(tableState.page, tableState.rowsPerPage)
                        })
                        break;
                    default:
                        break;
                }
            }
        }

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Org Structure Template
                            </div>
                        </div>
                    </div>
                    <div className="padding-10px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                key={orgCount}
                                title='Organization Structure'
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableOrg}
                                columns={columnsSearch}
                                options={tableOptions}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.openForm("search")}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }

    renderTable = () => {
        let columns = ["Node ID", "Level", "Parent", "Position", "Tax Template", "Pay Template",
            {
                name: "Activation",
                options: {
                    customBodyRender: (val) => {
                        return (
                            <div>
                                <i
                                    className="fa fa-lw fa-circle"
                                    style={{
                                        color: val === "YES" ? "green" : "brown",
                                        marginRight: 10
                                    }}
                                />
                                {val}
                            </div>
                        );
                    }
                }
            },
        ]
        let data = this.props.type === 'create' ? [] : this.props.rawDataTableDetail && this.props.rawDataTableDetail.map((value) => {
            const {
                outaxTPLID,
                oulevel,
                oupayrollTPLID,
                ouparentID,
                ouposition,
                ouid
            } = value
            return [
                ouid,
                oulevel ? oulevel.bizparValue : '',
                ouparentID,
                <div className='grid'>
                    <div className='col-1'>
                        {ouposition ? ouposition.bizparKey : ''}
                    </div>
                    <div className='col-2'>
                        {ouposition ? ouposition.bizparValue : ''}
                    </div>
                </div>,
                outaxTPLID === null || outaxTPLID === undefined ? '' : outaxTPLID.taxTPLID === null ? '' : outaxTPLID.taxTPLID,
                oupayrollTPLID === null || oupayrollTPLID === undefined ? '' : oupayrollTPLID.payrollTPLID === null ? '' : oupayrollTPLID.payrollTPLID,
                'YES'
            ]
        })

        let doto = []
        return (
            <div className="padding-15px">
                <div className="txt-site txt-11 txt-main txt-bold"></div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='Organization Structure Template Detail'
                        subtitle={"lorem ipsum dolor"}
                        data={this.props.rawDataTableDetail === undefined || (this.props.rawDataTableDetail.length === 1 && this.props.rawDataTableDetail[0].ouid === null) ? doto : data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }

    cardSpace = (title, report) => {
        if (report === '') {
            var bot = ''
        } else {
            bot = (
                <div className="co-bot">
                    <div className="txt-site txt-9 txt-primary">{report}</div>
                </div>
            )
        }
        return (
            <div className="card-org">
                <div className="co-top">
                    <div className="txt-site txt-11 txt-thin txt-main">{title}</div>
                </div>
                {bot}
            </div>
        )
    }

    renderDiagram = () => {
        let { esData } = this.state
        console.log(esData)
        if (esData && esData && esData.ouposition) {
            return (
                <div className="tree hidden background-dark-grey" style={{ whiteSpace: 'nowrap', width: 0 }}>
                    <ul>
                        <li>
                            <label for='parent'>
                                {this.cardSpace(esData.ouposition.bizparValue, '')}
                            </label>
                            <input
                                id='parent'
                                checked={true}
                                className="tree-button"
                                type="checkbox" />
                            {this.renderChildren(esData)}
                        </li>
                    </ul>
                </div>
            )
        }
    }

    handleSelectDateStart = (date) => {
        this.setState({
            data: {
                ...this.state.data,
                orgStructureStartDate: date
            }
        })
    }

    opPlaceDateStart = () => {
        if (this.state.placeDateStart === false) {
            this.setState({
                placeDateStart: true
            })
        } else {
            this.setState({
                placeDateStart: false
            })
        }
    }

    handleSelectDate = (date) => {
        this.setState({
            data: {
                ...this.state.data,
                orgStructureEndDate: date
            }
        })
    }

    opPlaceDate = () => {
        if (this.state.placeDate === false) {
            this.setState({
                placeDate: true
            })
        } else {
            this.setState({
                placeDate: false
            })
        }
    }

    opPlaceDateRange = () => {
        if (this.state.placeDateRange === false) {
            this.setState({
                placeDateRange: true
            })
        } else {
            this.setState({
                placeDateRange: false
            })
        }
    }

    render() {
        let { referenceOrgStructureTPLID, orgStructureTPLName, orgStructureSKNumber, orgStructureStartDate, orgStructureEndDate, orgStructureTag } = this.state.data
        let { type } = this.props
        let titleType = type === 'create' ? 'Create' : type === 'view' ? 'View' : 'Edit'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Corporate - Organization Structure - {titleType} Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!R.isEmpty(this.state.data.orgStructureStartDate) && !R.isEmpty(this.state.data.orgStructureEndDate) && (this.state.data.orgStructureEndDate < this.state.data.orgStructureStartDate)) return alert('End Date Should be Greater Than Start Date.')
                            let data = {
                                ...this.state.data,
                                orgStructureStartDate: R.isEmpty(this.state.data.orgStructureStartDate) ? '' : M(this.state.data.orgStructureStartDate).format('YYYY-MM-DD'),
                                orgStructureEndDate: R.isEmpty(this.state.data.orgStructureEndDate) ? '' : M(this.state.data.orgStructureEndDate).format('YYYY-MM-DD')
                            }
                            if (R.isNil(data.referenceOrgStructureTPLID) || R.isEmpty(data.referenceOrgStructureTPLID)) return alert('Template ID is Required')
                            this.props.onClickSave(data)
                        }}
                    >
                        <div>
                            <div className="display-flex-normal">
                                <div style={{ width: '49.99%' }}>
                                    <div className="padding-15px">
                                        <div className="card-date-picker margin-bottom-20px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Template ID <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                            <div className="double margin-5px">
                                                <input
                                                    style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                                    className='input'
                                                    type="text"
                                                    placeholder=""
                                                    required
                                                    readOnly
                                                    value={referenceOrgStructureTPLID && referenceOrgStructureTPLID.orgStructureTPLId} />
                                                <button
                                                    type="button"
                                                    className="btn btn-grey border-left btn-no-radius"
                                                    onClick={() => this.openForm("search")}
                                                >
                                                    <i className="fa fa-lg fa-search"></i>
                                                </button>
                                            </div>
                                            {this.state.searchVisible && this.renderSearch()}
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Template Name <span style={{ color: "red" }}>*</span></h4>
                                            </div>

                                            <div className="margin-5px">
                                                <input type="text" className="txt txt-sekunder-color"
                                                    required
                                                    value={orgStructureTPLName}
                                                    style={type === "view" ? { backgroundColor: "#E6E6E6" } : { marginRight: "10px" }}
                                                    readOnly={type === "view"}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                orgStructureTPLName: e.target.value
                                                            }
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>SK Number <span style={{ color: "red" }}>*</span></h4>
                                            </div>

                                            <div className="margin-5px">
                                                <input
                                                    required
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    style={type === "view" ? { backgroundColor: "#E6E6E6" } : { marginRight: "10px" }}
                                                    readOnly={type === "view"}
                                                    value={orgStructureSKNumber}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                orgStructureSKNumber: e.target.value
                                                            }
                                                        })
                                                    }} />
                                            </div>
                                        </div>
                                        {type === "create" ?
                                            <div>
                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Period</h4>
                                                    </div>
                                                    <div className="margin-5px display-flex-normals">
                                                        <CalendarPicker
                                                            disabled={this.props.type === "view" ? true : false}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    orgStructureStartDate: M(e).format("YYYY-MM-DD")
                                                                }
                                                            })} />
                                                        <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                                                            To
                                                         </div>
                                                        <CalendarPicker
                                                            disabled={this.props.type === "view" ? true : false}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    orgStructureEndDate: M(e).format("YYYY-MM-DD")
                                                                }
                                                            })} />
                                                    </div>
                                                </div>

                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Tag <span style={{ color: "red" }}>*</span></h4>
                                                    </div>

                                                    <div className="margin-5px">
                                                        <input type="text" className="txt txt-sekunder-color"
                                                            style={{ backgroundColor: "#E6E6E6" }}
                                                            readOnly
                                                            value={orgStructureTag}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    data: {
                                                                        ...this.state.data,
                                                                        orgStructureTag: e.target.value
                                                                    }
                                                                })
                                                            }} />
                                                    </div>
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Activation <span style={{ color: "red" }}>*</span></h4>
                                                    </div>
                                                    <div className="margin-15px">
                                                        <label className="radio">
                                                            <input type="checkbox" name="status" checked disabled
                                                            />
                                                            <span className="checkmark" />
                                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                                Activate now
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> : null}
                                    </div>
                                </div>

                                <div style={{ width: '49.99%' }}>
                                    <div className="padding-15px">
                                        {type !== "create" ?
                                            <div>
                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Period</h4>
                                                    </div>
                                                    <div className="margin-5px display-flex-normals">
                                                        <CalendarPicker
                                                            date={orgStructureStartDate}
                                                            disabled={this.props.type === "view" ? true : false}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    orgStructureStartDate: M(e).format("YYYY-MM-DD")
                                                                }
                                                            })} />
                                                        <div className="txt-site txt-11 txt-primary txt-center margin-10px">
                                                            To
                                                         </div>
                                                        <CalendarPicker
                                                            date={orgStructureEndDate}
                                                            disabled={this.props.type === "view" ? true : false}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    orgStructureEndDate: M(e).format("YYYY-MM-DD")
                                                                }
                                                            })} />
                                                    </div> </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Tag <span style={{ color: "red" }}>*</span></h4>
                                                    </div>

                                                    <div className="margin-5px">
                                                        <input type="text" className="txt txt-sekunder-color" value={orgStructureTag}
                                                            style={{ backgroundColor: "#E6E6E6" }}
                                                            readOnly
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    data: {
                                                                        ...this.state.data,
                                                                        orgStructureTag: e.target.value
                                                                    }
                                                                })
                                                            }} />
                                                    </div>
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                        <h4>Activation <span style={{ color: "red" }}>*</span></h4>
                                                    </div>
                                                    <div className="margin-15px">
                                                        <label className="radio">
                                                            <input type="checkbox" name="status" checked disabled
                                                            />
                                                            <span className="checkmark" />
                                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                                Activate now
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> : (
                                                <div style={{ overflow: "scroll" }}>
                                                    {this.renderDiagram()}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                            {type !== "create" ? this.renderTable() : null}
                            {type !== "create" ? <div><div className="padding-15px txt-site txt-13 txt-main txt-bold">Template Visualization</div> {this.renderDiagram()} </div> : null}

                            <div className="border-top padding-15px content-right">
                                <button
                                    onClick={this.props.onClickClose}
                                    className="btn btn-primary margin-right-10px">
                                    CLOSE
                                </button>
                                {this.props.type !== 'view' ?
                                    <button
                                        type='submit'
                                        className="btn btn-blue">
                                        SAVE
                                    </button>
                                    : null}

                            </div>

                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(FormCorporateOrgCreate);