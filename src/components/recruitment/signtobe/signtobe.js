import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../pages/PopUpAlert'
import FormSignDetail from "../../../modules/forms/formRecSign/formSignDetail";
import FormSignSalary from "../../../modules/forms/formRecSign/formSignSalary";
import FormSignFacilities from "../../../modules/forms/formRecSign/formSignFacilities";
import FormSignPersonal from "../../../modules/forms/formRecSign/formSignPersonal";
import FormSigntobeGeneral from "../../../modules/forms/formRecSign/formSigntobeGeneral";
import FormSignDetailEdit from "../../../modules/forms/formRecSign/formSignDetailEdit";

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class Signtobe extends Component {
    constructor() {
        super()
        this.state = {
            editAble: false,
            createPopUpVisible: false,
            createVisible: false,
            deletePopUpVisible: false,
            openSavePopUp: false,


            formSignViewVisible: false,
            formSignDetailVisible: false,
            formSignSalaryVisible: false,
            deleteClass: 'app-popup',
            saveClass: 'app-popup',
            editClass: "app-popup",
            formEditEdit: false,
            type: '',

            formGeneral: false,
            formGeneralVisible: false,
            formDetail: false,
            formDetailEdit: false,
            formDetailEditVisible: false,
            formSalary: false,
            formSignFacilities: false,
            formSignPersonal: false,
            activeTab: "",
            tabMenu: [
                'Detail',
                'Salary Negotiation',
                'Facilities',
                'Personal Data'

            ],
            tabMenuCreate: [
                'General',
                'Detail',
                'Salary Negotiation',
                'Facilities',
                'Personal Data'
            ]

        }
    }

    openCreateForm = (index) => {
        let { formGeneralVisible } = this.state
        this.setState({
            formGeneralVisible: !formGeneralVisible,
            selectedIndex: !formGeneralVisible ? index : null,
            activeTab: !formGeneralVisible ? "General" : "",
            formGeneral: !formGeneralVisible ? true : false,
            formDetail: false,
            formSalary: false,
            formSignFacilities: false,
            formSignPersonal: false,
            type: 'create1'
        })
    }

    openCreateEditForm = (index) => {
        let { formDetailEditVisible } = this.state
        this.setState({
            formDetailEditVisible: !formDetailEditVisible,
            selectedIndex: !formDetailEditVisible ? index : null,
            activeTab: !formDetailEditVisible ? "Detail" : "",
            formDetail: !formDetailEditVisible ? true : false,
            formSalary: false,
            formSignFacilities: false,
            formSignPersonal: false,
            type: 'create'
        })
    }

    openEditForm = () => {
        if (this.state.editClass === "app-popup app-popup-show") {
            this.setState({ editClass: "app-popup" });
        } else {
            this.setState({ editClass: "app-popup app-popup-show", applicantData: this.defaultApplicant, dataRecruitment: '', record: '' });
        }
    };

    openEditEditForm = (index) => {
        let { formGeneralVisible } = this.state
        this.setState({
            formGeneralVisible: !formGeneralVisible,
            selectedIndex: !formGeneralVisible ? index : null,
            activeTab: !formGeneralVisible ? "General" : "",
            formGeneral: !formGeneralVisible ? true : false,
            formDetail: false,
            formSalary: false,
            formSignFacilities: false,
            formSignPersonal: false,
            type: 'edit'
        })
    };

    openViewEditForm = (index) => {
        let { formGeneralVisible } = this.state
        this.setState({
            formGeneralVisible: !formGeneralVisible,
            selectedIndex: !formGeneralVisible ? index : null,
            activeTab: !formGeneralVisible ? "General" : "",
            formGeneral: !formGeneralVisible ? true : false,
            formDetail: false,
            formSalary: false,
            type: 'view'
        })
    };


    openCloseCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
    }

    opDeleteAble = () => {
        alert('delete');
    }

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        );
    };

    opContent = title => e => {
        e.preventDefault();

        let allStateVisibleFalse = {
            ...this.state,
            formGeneral: false,
            formDetail: false,
            formSalary: false,
            formSignFacilities: false,
            formSignPersonal: false,
            activeTab: title
        }

        switch (title) {
            case "General":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formGeneral: true
                }
                break;
            case "Detail":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDetail: true
                }
                break;
            case "Salary Negotiation":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSalary: true
                }
                break;
            case "Facilities":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSignFacilities: true
                }
                break;
            case "Personal Data":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSignPersonal: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    };

    openDeletePopup = () => {
        if (this.state.deleteClass === "app-popup app-popup-show") {
            this.setState({ deleteClass: "app-popup" });
        } else {
            this.setState({ deleteClass: "app-popup app-popup-show" });
        }
    };

    openSearchForm = (searchType = 'employee') => {
        if (this.state.searchClass === 'app-popup app-popup-show') {
            this.setState({ searchClass: 'app-popup', searchType })
        } else {
            this.setState({ searchClass: 'app-popup app-popup-show', searchType })
        }
    }

    openSavePopUp = () => {
        if ((this.state.saveClass === "app-popup app-popup-show")) {
            this.setState({ saveClass: "app-popup" });
        } else {
            this.setState({ saveClass: "app-popup app-popup-show" });
        }
    };

    handleUpdate = () => {
        this.openSavePopUp();
    };

    handleDelete = () => {
        this.setState({ deletePopUpVisible: false });
    };

    columns = [
        "No",
        "Request Number",
        "Request By",
        {
            name: "SIGN TO BE",
            options: {
                filter: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-2x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"Recruitment Type"}
                            </div>
                            <div className="col-2">
                                {"Employee"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div className="grid grid-2x">
                        <div className="col-1">
                            {val.split("|")[0]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[1]}
                        </div>
                    </div>
                ),
            }
        },
        {
            name: "Document Status",
            options: {
                customBodyRender: val => {
                    return (
                        <div className="grid grid-2x">
                            <div className="column-1 content-right">
                                <label
                                    style={{
                                        backgroundColor: val === "Mengajukan" ? "orange" : "brown",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: 4,
                                        fontSize: "14px",
                                        border: "4px white"
                                    }}
                                >
                                    {val}
                                </label>
                            </div>
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
                                onClick={this.openEditForm}
                                className="btn btn-green btn-small-circle">
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                            <button
                                className="btn btn-red btn-small-circle"
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    columnsEdit = [
        {
            name: "No",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                                type="button"
                                onClick={this.openViewEditForm}
                            >
                                {val}
                            </button>
                        </div>
                    );
                }
            }
        },
        {
            name: <div style={{ float: "center" }}>Applicant</div>,
            options: {
                filter: false,
                customHeadRender: (columnMeta) => (
                    <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-2x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"Number | Name"}
                            </div>
                            <div className="col-2">
                                {"Place | Birth Date"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div className="grid grid-2x content-center">
                                <div className="col-1">
                                    {val}
                                </div>
                                <div className="col-2">
                                    {val}
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: <div style={{ float: "center" }}>Sign To Be</div>,
            options: {
                filter: false,
                customHeadRender: (columnMeta) => (
                    <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-5x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"SPK"}
                                <div className="grid grid-2x center" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                                    <div className="column-1">
                                        {"Number"}
                                    </div>
                                    <div className="column-2">
                                        {"Date"}
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                {"Type | Category"}
                            </div>
                            <div className="col-3">
                                {"Contract Date"}
                                <div className="grid grid-2x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                                    <div className="col-1">
                                        {"Join"}
                                    </div>
                                    <div className="col-2">
                                        {"Finish"}
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                {"Document"}
                            </div>
                            <div className="col-5">
                                {"Action"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <div className="grid grid-5x content-center">
                                <div className="col-1">
                                    <div className="grid grid-2x content-center">
                                        <div className="col-1">
                                            {val}
                                        </div>
                                        <div className="col-2">
                                            {val}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    {val}
                                </div>
                                <div className="col-3">
                                    <div className="grid grid-2x content-center">
                                        <div className="col-1">
                                            {val}
                                        </div>
                                        <div className="col-2">
                                            {val}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <button
                                        className="btn btn-small-circle"
                                        type="button">
                                        <i className="fa fa-lw fa-print" />
                                    </button>
                                </div>
                                <div className="col-5">
                                    <button
                                        onClick={this.openEditEditForm}
                                        type="button"
                                        className="btn btn-green btn-small-circle">
                                        <i className="fa fa-lw fa-pencil-alt" />
                                    </button>
                                    <button
                                        className="btn btn-red btn-small-circle"
                                        type="button"
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                                        <i className="fa fa-lw fa-trash-alt" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
    ];

    render() {
        const dataEdit = [
            [
                "1",
                "10000",
                "LILYANA TAN",
                "Pengangkatan Karyawan - Traine ke tetap | RIO SATRIO WIBOWO",
                "Mengajukan",
                "2",
                "10000",
                "LILYANA TAN",
                "Pengangkatan Karyawan - Traine ke tetap | RIO SATRIO WIBOWO",
                "Mengajukan"
            ]
        ]
        const data = [
            [
                "1",
                "10000",
                "LILYANA TAN",
                "Pengangkatan Karyawan - Traine ke tetap | RIO SATRIO WIBOWO",
                "Mengajukan"
            ],
            [
                "2",
                "10000",
                "LILYANA TAN",
                "Pengangkatan Karyawan - Traine ke tetap | JOVIANDA MARTIS",
                "Disetujui"
            ],
        ]

        return (
            <div className="main-content">
                <div className="padding-5px">
                    <div className="txt-site txt-18 txt-bold txt-main">
                        {/* SIGN TO BE */}
                    </div>
                    <div className="col-2 content-right">
                        <button type="button"
                            className="btn btn-circle background-blue"
                            onClick={this.openCreateForm}>
                            <i className='fa fa-1x fa-plus'></i>
                        </button>
                    </div>
                </div>
                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='SIGN TO BE'
                            data={data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                <div className={this.state.editClass}>
                    <div className="padding-top-20px" />
                    <div className="popup-content background-white border-radius">
                        <div className="padding-15px border-bottom background-white grid grid-2x">
                            <div className="txt-site txt-12 txt-bold post-center">
                                SIGN TO BE - EDIT FORM
                            </div>
                        </div>
                        <form action="#">
                            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-15 txt-main txt-bold">
                                        REQUESTOR
                                    </span>
                                </div>
                                <div className="column-1">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>NIK</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee Name</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="column-2">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>BRANCH</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Position</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-15 txt-main txt-bold">
                                        HEADER
                                    </span>
                                </div>
                                <div className="column-1">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Request Number</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Recruitment Type</h4>
                                            </div>
                                        </div>
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6" }

                                            }
                                            required
                                        >
                                            <option value="1">-- please select type --</option>
                                            <option value="1">PELUNASAN</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="column-2">
                                    <div className="margin-bottom-15px padding-bottom-30px">
                                        <div className="margin-5px">
                                        </div>
                                    </div>
                                    <div className="margin-top-10px padding-top-30px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Recruitment Category</h4>
                                            </div>
                                        </div>
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6" }

                                            }
                                            required
                                        >
                                            <option value="1">-- please select type --</option>
                                            <option value="1">PELUNASAN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="content-right margin-right-15px">
                                    <button
                                        type="button"
                                        className="btn btn-circle background-blue"
                                        onClick={this.openCreateEditForm}
                                    >
                                        <i className="fa fa-lg fa-plus" />
                                    </button>
                                </div>

                                {this.state.formDetailEditVisible && (
                                    <div className="app-popup app-popup-show">
                                        <div className="padding-top-20px" />
                                        <div className="popup-content background-white border-radius">
                                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                                <div className="col-1">
                                                    <div className="txt-site txt-12 txt-bold post-center">
                                                        {this.state.type === "edit" ? "SIGN TO BE - EDIT FORM" : this.state.type === "create" ? "SIGN TO BE - CREATE FORM" : "SIGN TO BE - VIEW FORM"}
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <button
                                                        className="btn btn-circle background-blue"
                                                        onClick={this.openCreateEditForm}
                                                    >
                                                        <i className="fa fa-lg fa-times" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="popup-content-grid">
                                                <div className="popup-scroll popup-col-1">
                                                    <ul className="vertical-tab">
                                                        {this.state.type === 'create' ?
                                                            this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })
                                                            : this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                                                        {/* {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) } )} */}
                                                    </ul>
                                                </div>
                                                <div className="popup-scroll popup-col-2">
                                                    {/* Sign Detail*/}
                                                    {this.state.formDetail && (
                                                        <FormSignDetailEdit
                                                            type={this.state.type}
                                                            onClickClose={this.openCreateEditForm}
                                                            onSave={this.openSavePopUp.bind(this)}
                                                        />

                                                    )}
                                                    {/* Sign Salary*/}
                                                    {this.state.formSalary && (
                                                        <FormSignSalary
                                                            type={this.state.type}
                                                            onClickClose={this.openCreateEditForm}
                                                            onSave={this.openSavePopUp.bind(this)}
                                                            onDelete={this.openDeletePopup.bind(this)}
                                                        />
                                                    )}
                                                    {/* Sign Facilities*/}
                                                    {this.state.formSignFacilities && (
                                                        <FormSignFacilities
                                                            type={this.state.type}
                                                            onClickClose={this.openCreateEditForm}
                                                            onSave={this.openSavePopUp.bind(this)}
                                                        />
                                                    )}
                                                    {/* Sign Personal*/}
                                                    {this.state.formSignPersonal && (
                                                        <FormSignPersonal
                                                            type={this.state.type}
                                                            onClickClose={this.openCreateEditForm}
                                                            onSave={this.openSavePopUp.bind(this)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                            <div className="padding-15px">
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={dataEdit}
                                        columns={this.columnsEdit}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>

                            <div className="padding-15px">
                                <div className="grid grid-2x">
                                    <div className="col-1" />
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => this.handleUpdate()}
                                        >
                                            <span>PROCESS</span>
                                        </button>
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={this.openEditForm}
                                        >
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="padding-bottom-20px" />
                </div>

                {this.state.formEditEdit && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius">
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        {this.state.type === "edit" ? "SIGN TO BE - EDIT FORM" : this.state.type === "create" ? "SIGN TO BE - CREATE FORM" : "SIGN TO BE - VIEW FORM"}
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        type="button"
                                        className="btn btn-circle background-blue"
                                        onClick={this.openCreateForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="popup-content-grid">
                                <div className="popup-scroll popup-col-1">
                                    <ul className="vertical-tab">
                                        {this.state.type === 'create' ?
                                            this.state.tabMenuCreate.map((data, index) => { return this.opNavigator(data, index) })
                                            : this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                                        {/* {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) } )} */}
                                    </ul>
                                </div>
                                <div className="popup-scroll popup-col-2">
                                    {/* Sign General*/}
                                    {this.state.formGeneral && (
                                        <FormSigntobeGeneral
                                            type={this.state.type}
                                            onClickClose={this.openEditEditForm}
                                            onClickSearch={this.openSearchForm}

                                        />
                                    )}
                                    {/* Sign Detail*/}
                                    {this.state.formDetail && (
                                        <FormSignDetail
                                            type={this.state.type}
                                            onClickClose={this.openEditEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />

                                    )}
                                    {/* Sign Salary*/}
                                    {this.state.formSalary && (
                                        <FormSignSalary
                                            type={this.state.type}
                                            onClickClose={this.openEditEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                            onDelete={this.openDeletePopup.bind(this)}
                                        />
                                    )}
                                    {/* Sign Facilities*/}
                                    {this.state.formSignFacilities && (
                                        <FormSignFacilities
                                            type={this.state.type}
                                            onClickClose={this.openEditEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                    {/* Sign Personal*/}
                                    {this.state.formSignPersonal && (
                                        <FormSignPersonal
                                            type={this.state.type}
                                            onClickClose={this.openEditEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.formViewEdit && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius">
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        {this.state.type === "edit" ? "SIGN TO BE - EDIT FORM" : this.state.type === "create" ? "SIGN TO BE - CREATE FORM" : "SIGN TO BE - VIEW FORM"}
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        type="button"
                                        className="btn btn-circle background-blue"
                                        onClick={this.openCreateForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="popup-content-grid">
                                <div className="popup-scroll popup-col-1">
                                    <ul className="vertical-tab">
                                        {this.state.type === 'create' ?
                                            this.state.tabMenuCreate.map((data, index) => { return this.opNavigator(data, index) })
                                            : this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                                        {/* {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) } )} */}
                                    </ul>
                                </div>
                                <div className="popup-scroll popup-col-2">
                                    {/* Sign General*/}
                                    {this.state.formGeneral && (
                                        <FormSigntobeGeneral
                                            type={this.state.type}
                                            onClickClose={this.openViewEditForm}
                                            onClickSearch={this.openSearchForm}

                                        />
                                    )}
                                    {/* Sign Detail*/}
                                    {this.state.formDetail && (
                                        <FormSignDetail
                                            type={this.state.type}
                                            onClickClose={this.openViewEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                    {/* Sign Salary*/}
                                    {this.state.formSalary && (
                                        <FormSignSalary
                                            type={this.state.type}
                                            onClickClose={this.openViewEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                            onDelete={this.openDeletePopup.bind(this)}
                                        />
                                    )}
                                    {/* Sign Facilities*/}
                                    {this.state.formSignFacilities && (
                                        <FormSignFacilities
                                            type={this.state.type}
                                            onClickClose={this.openViewEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                    {/* Sign Personal*/}
                                    {this.state.formSignPersonal && (
                                        <FormSignPersonal
                                            type={this.state.type}
                                            onClickClose={this.openViewEditForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.formGeneralVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius">
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        {this.state.type === "edit" ? "SIGN TO BE - EDIT FORM" :
                                            this.state.type === "create" ? "SIGN TO BE - CREATE FORM" :
                                                this.state.type === "create1" ? "SIGN TO BE - CREATE FORM" :
                                                    "SIGN TO BE - VIEW FORM"}
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        type="button"
                                        className="btn btn-circle background-blue"
                                        onClick={this.openCreateForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="popup-content-grid">
                                <div className="popup-scroll popup-col-1">
                                    <ul className="vertical-tab">
                                        {this.state.type === 'create' ?
                                            this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })
                                            : this.state.tabMenuCreate.map((data, index) => { return this.opNavigator(data, index) })}
                                        {/* {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) } )} */}
                                    </ul>
                                </div>
                                <div className="popup-scroll popup-col-2">
                                    {/* Sign General*/}
                                    {this.state.formGeneral && (
                                        <FormSigntobeGeneral
                                            type={this.state.type}
                                            onClickClose={this.openCreateForm}
                                            onClickSearch={this.openSearchForm}

                                        />
                                    )}
                                    {/* Sign Detail*/}
                                    {this.state.formDetail && (
                                        <FormSignDetail
                                            type={this.state.type}
                                            onClickClose={this.openCreateForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />

                                    )}
                                    {/* Sign Salary*/}
                                    {this.state.formSalary && (
                                        <FormSignSalary
                                            type={this.state.type}
                                            onClickClose={this.openCreateForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                            onDelete={this.openDeletePopup.bind(this)}
                                        />
                                    )}
                                    {/* Sign Facilities*/}
                                    {this.state.formSignFacilities && (
                                        <FormSignFacilities
                                            type={this.state.type}
                                            onClickClose={this.openCreateForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                    {/* Sign Personal*/}
                                    {this.state.formSignPersonal && (
                                        <FormSignPersonal
                                            type={this.state.type}
                                            onClickClose={this.openCreateForm}
                                            onSave={this.openSavePopUp.bind(this)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <PopUp type={"delete"} class={this.state.deleteClass} onClick={this.openDeletePopup} />
                <PopUp type={"save"} class={this.state.saveClass} onClick={this.openSavePopUp} />
            </div>
        )
    }
}

export default Signtobe;