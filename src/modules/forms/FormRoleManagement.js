import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import uuid from "uuid";
import API from '../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../components/pages/PopUpAlert'

let ct = require("../custom/customTable")

const defaultPayloadRole = {
    "roleID": "",
    "roleName": "",
    "roleStatus": "ACTIVE",
    "roleCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    },
    "privileges": []
}

class FormRoleManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payloadRole: props.payloadRole ? props.payloadRole : {
                ...defaultPayloadRole,
                roleID: uuid.v1(),
                roleCreationalDTO: {
                    ...defaultPayloadRole.roleCreationalDTO,
                    createdBy: this.props.user.employeeID,
                    modifiedBy: this.props.user.employeeID
                }
            },
            dataTablePrivileges: [],
            rowsSelected: [],
            formSearchVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false
        }
    }
    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = {
        ...ct.customOptions2(),
        selectableRowsOnClick: true,
        onRowsSelect: (currentRowsSelected, allRowsSelected) => {
            let privileges = []
            allRowsSelected.map((data, index) => {
                privileges.push({
                    privilegeCode: this.state.rawDataPrivileges[data.index].privilegeCode
                })
            })
            this.setRole(privileges)
        }
    }

    options2 = ct.customOptions()

    setRole(privileges) {
        this.setState({
            payloadRole: {
                ...this.state.payloadRole,
                privileges
            }
        })
    }

    addPrivilege(value) {
        let { rawDataPrivileges, payloadRole } = this.state
        let selectedPrivilege = rawDataPrivileges[value]
        let indexPrivilege = R.findIndex(R.propEq('privilegeCode', selectedPrivilege.privilegeCode))(payloadRole.privileges)
        if (indexPrivilege < 0) {
            let payload = {
                roleID: payloadRole.roleID,
                privilegeID: selectedPrivilege.privilegeCode
            }
            API.create("IDP").addPrivilege(payload).then(
                (res) => {
                    if (res.data.status === "S") {
                        let dataRolePrivilege = Object.assign([], this.state.payloadRole.privileges)
                        dataRolePrivilege.push({
                            ...selectedPrivilege
                        })
                        this.setState({ formSearchVisible: !this.state.formSearchVisible, savePopUpVisible: true })
                        this.props.getDataRole()
                        this.getTablePrivilege(dataRolePrivilege)
                    } else {
                        alert("Failed: " + res.data.message)
                    }
                }
            )
        } else {
            alert("Privilege is exist")
        }
    }

    deletePrivilege(value) {
        let { payloadRole } = this.state
        let selectedPrivilege = payloadRole.privileges[value]
        let payload = {
            roleID: payloadRole.roleID,
            privilegeID: selectedPrivilege.privilegeCode
        }
        API.create("IDP").deletePrivilege(payload).then(
            (res) => {
                if (res.data.status === "S") {
                    let dataRolePrivilege = Object.assign([], payloadRole.privileges)
                    dataRolePrivilege.splice(value, 1)
                    this.setState({ deletePopUpVisible: false })
                    this.props.getDataRole()
                    this.getTablePrivilege(dataRolePrivilege)
                } else {
                    alert("Failed: " + res.data.message)
                }
            }
        )
    }

    getTablePrivilege(dataRolePrivilege) {
        dataRolePrivilege = dataRolePrivilege.map((value, index) => {
            return [
                value.name,
                value.description
            ]
        })
        this.setState({ dataRolePrivilege })
    }

    getPrivileges() {
        let payload = {
            limit: 150,
            offset: 0
        }
        API.create('IDP').getPrivilegeAll(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        console.log("Privileges : ", res.data);

                        let { payloadRole } = this.state
                        let rowsSelected = []
                        payloadRole.privileges.map((data, index) => {
                            let code = data.privilegeCode
                            code = R.findIndex(R.propEq('privilegeCode', code))(res.data.data)
                            if (code >= 0) rowsSelected.push(code)
                        })

                        let dataTablePrivileges = res.data.data.map((value, index) => {
                            const { name, description } = value;
                            return [
                                name,
                                description
                            ]
                        })

                        this.options = {
                            ...this.options,
                            rowsSelected
                        }

                        this.setState({
                            dataTablePrivileges,
                            rawDataPrivileges: res.data.data
                        })
                    }
                }
            }
        )
    }

    columns = [
        "Privilege Name",
        "Description",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type === "update" ?
                            <div>
                                <button
                                    type="button"
                                    onClick={() => !this.state.formSearchVisible ? this.openDeletePopup(tableMeta.rowIndex) : this.addPrivilege(tableMeta.rowIndex)}
                                    className={!this.state.formSearchVisible ? "btn btn-red btn-small-circle" : "btn btn-blue btn-small-circle"}>
                                    <i className={!this.state.formSearchVisible ? "fa fa-lw fa-times" : "fa fa-lw fa-plus"}
                                    // style={!this.state.formSearchVisible ? { backgroundColor: 'transparent', color: 'red', fontSize: 20 } : { backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}
                                    />
                                </button>
                            </div> : null
                    )
                }
            }
        }
    ]

    openSearch = () => {
        this.setState({ formSearchVisible: !this.state.formSearchVisible })
    }

    openDeletePopup(selectedIndex) {
        console.log(selectedIndex);
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    componentDidMount() {
        this.getPrivileges();
        this.getTablePrivilege(this.state.payloadRole.privileges);
    }

    componentDidUpdate(prevProps) {
        if (this.props.type === "update") {
            if (this.props.payloadRole !== prevProps.payloadRole) {
                this.setState({ payloadRole: this.props.payloadRole })
                this.getTablePrivilege(this.props.payloadRole.privileges);
            }
        }
    }

    renderSearch = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Privilege Search Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-circle btn-grey"
                                type="button"
                                onClick={this.openSearch}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px border-bottom">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                data={this.state.dataTablePrivileges}
                                columns={this.columns}
                                options={this.options2}
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
                                    onClick={this.openSearch}>
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

    renderEditForm = () => {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-users"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    {this.props.label}
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#" onSubmit={(e) => {
                    e.preventDefault()
                    if (this.props.type === "update") {
                        if ((this.state.dataRolePrivilege.length === 0 && this.state.payloadRole.privileges.length === 0)) return alert("Privileges is Required")
                    } else {
                        if (this.state.payloadRole.privileges.length === 0) return alert("Privileges is Required.")
                    }
                    this.props.onSave(this.state.payloadRole)
                }}>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Role Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.payloadRole.roleName}
                                        type="text"
                                        required
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        onChange={(e) => this.setState({ payloadRole: { ...this.state.payloadRole, roleName: e.target.value } })}
                                    ></input>
                                </div>
                                {this.props.type === "update" ?
                                    <div className="content-right margin-bottom-10px">
                                        <button
                                            onClick={this.openSearch}
                                            type="button"
                                            className="btn btn-circle background-blue" >
                                            <i className='fa fa-1x fa-plus'></i>
                                        </button>
                                    </div> : null}
                                <div>
                                    <MuiThemeProvider theme={this.getMuiTheme()}>
                                        <MUIDataTable
                                            title={<span> Privileges <span style={{ color: "red" }}>*</span></span>}
                                            subtitle={"lorem ipsum dolor"}
                                            data={this.props.type === "update" ? this.state.dataRolePrivilege : this.state.dataTablePrivileges}
                                            columns={this.columns}
                                            options={this.props.type === "update" ? this.options2 : this.options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                {this.state.formSearchVisible && (
                                    this.renderSearch()
                                )}
                                <div className="padding-15px border-top content-right">
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="submit">
                                        <span>SAVE</span>
                                    </button>
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.closeSlide}>
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </form>
                <ReactTooltip />
                {this.state.savePopUpVisible && (
                    <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={() => this.setState({ savePopUpVisible: false })} />
                )}
                {this.state.deletePopUpVisible && (
                    <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup.bind(this)} onClickDelete={() => this.deletePrivilege(this.state.selectedIndex)} />
                )}
            </div >
        )
    }

    render() {
        return (
            this.props.type === "update" ? this.renderEditForm() :
                <div className="app-popup app-popup-show">
                    <div className="padding-top-20px"></div>
                    <div className="popup-content-small background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {this.props.label}
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button className="btn btn-circle btn-grey" onClick={this.props.onClose}>
                                    <i className="fa fa-lg fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <form action="#" onSubmit={(e) => {
                            e.preventDefault()
                            if (this.props.type === "update") {
                                if ((this.state.dataRolePrivilege.length === 0 && this.state.payloadRole.privileges.length === 0)) return alert("Privileges is Required")
                            } else {
                                if (this.state.payloadRole.privileges.length === 0) return alert("Privileges is Required.")
                            }
                            this.props.onSave(this.state.payloadRole)
                        }}>
                            <div className="column-2 padding-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Role Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.payloadRole.roleName}
                                        type="text"
                                        required
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        onChange={(e) => this.setState({ payloadRole: { ...this.state.payloadRole, roleName: e.target.value } })}
                                    ></input>
                                </div>
                                {this.props.type === "update" ?
                                    <div className="content-right margin-bottom-10px">
                                        <button
                                            onClick={this.openSearch}
                                            type="button"
                                            className="btn btn-circle background-blue" >
                                            <i className='fa fa-1x fa-plus'></i>
                                        </button>
                                    </div> : null}
                                <div>
                                    <MuiThemeProvider theme={this.getMuiTheme()}>
                                        <MUIDataTable
                                            title={<span> Privileges <span style={{ color: "red" }}>*</span></span>}
                                            subtitle={"lorem ipsum dolor"}
                                            data={this.props.type === "update" ? this.state.dataRolePrivilege : this.state.dataTablePrivileges}
                                            columns={this.columns}
                                            options={this.props.type === "update" ? this.options2 : this.options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                {this.state.formSearchVisible && (
                                    this.renderSearch()
                                )}
                            </div>
                            <div className="padding-15px border-top">
                                <div className="grid grid-2x">
                                    <div className="col-1"></div>
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit">
                                            <span>SAVE</span>
                                        </button>
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => this.props.onClose()}>
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="padding-top-20px"></div>
                </div>
        )
    }
}

export default FormRoleManagement