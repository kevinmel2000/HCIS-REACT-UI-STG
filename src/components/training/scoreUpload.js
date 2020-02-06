import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import ScrUploadCreate from "../../modules/forms/formTraining/formScrUploadCreate";
import ScrUploadDetail from "../../modules/forms/formTraining/formScrUploadDetail";

var ct = require("../../modules/custom/customTable");

class Performance extends Component {
    constructor() {
        super();
        this.state = {
            file: null,
            createVisible: false,
            editVisible: false,
            detailVisible: false,
            savePopUpVisible: false,
            rawData: [],
            dataTableIns: [],
            selectedIndex: [],
            fetching: false,
            saveClass: "app-popup",
            deleteClass: "app-popup",
            refreshing: false,
            value: ''
        };
    }
    openCreateForm = () => {
        this.setState({ createVisible: !this.state.createVisible })
    };

    openEditForm = (index = null) => {
        this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
    };

    openDetailForm = (index) => {
        this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
    };

    openSavePopUp = () => {
        if ((this.state.saveClass === "app-popup app-popup-show" && this.state.createVisible) || (this.state.saveClass === "app-popup app-popup-show" && this.state.editVisible)) {
            this.setState({
                saveClass: "app-popup",
                createVisible: false,
                // savePopUpVisible: !this.state.savePopUpVisible
            })
        } else {
            this.setState({ saveClass: "app-popup app-popup-show" });
        }
    };

    openDeletePopup = (index) => {
        if (this.state.deleteClass === "app-popup app-popup-show") {
            this.setState({ deleteClass: "app-popup", selectedIndex: null });
        } else {
            this.setState({ deleteClass: "app-popup app-popup-show", selectedIndex: index });
        }
    };

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columns = [
        "No",
        "Transaction Number",
        "Training Name",
        "Start Date",
        "End Date",
        {
            name: "Training Detail",
            options: {
                filter: false,
                customHeadRender: (columnMeta) => (
                    <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-6x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"Type"}
                            </div>
                            <div className="col-2">
                                {"Sub Type 1"}
                            </div>
                            <div className="col-3">
                                {"Sub Type 2"}
                            </div>
                            <div className="col-4">
                                {"Sub Type 3"}
                            </div>
                            <div className="col-5">
                                {"Sub Type 4"}
                            </div>
                            <div className="col-6">
                                {"Sub Type 5"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div className="grid grid-6x content-center">
                                <div className="col-1">
                                    {val}
                                </div>
                                <div className="col-2">
                                    {val}
                                </div>
                                <div className="col-3">
                                    {val}
                                </div>
                                <div className="col-4">
                                    {val}
                                </div>
                                <div className="col-5">
                                    {val}
                                </div>
                                <div className="col-6">
                                    {val}
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
        "Upload Date",
        "Amount of Data",
        {
            name: "Download",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div >
                            <button
                                className="btn btn-blue btn-small-circle"
                                // style={{ marginRight: 5}, {style: "text-align:center" }}
                                onClick={() =>
                                    this.openEditForm(tableMeta.rowIndex)
                                }
                            >
                                <i className="fa fa-lw fa-print"></i>
                            </button>
                        </div>
                    );
                }
            }
        },
        {
            name: "Detail",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-blue btn-small-circle"
                                // style={{ marginRight: 5 }}
                                onClick={() =>
                                    this.openDetailForm(tableMeta.rowIndex)
                                }
                            >
                                <i className="fa fa-lw fa-sign-out-alt" />
                            </button>
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
                        <div >
                            <button
                                className="btn btn-red btn-small-circle"
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    data = [
        ["1", "1", "FULL TEST", "01/01/2019", "31/01/2019", "S1", "TES 1", "TEST", "WRITING", "SPEAKING",
            "-", "01/03/2019", "4 Data", "", ""]
    ];

    render() {
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-5px grid grid-2x">
                    <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            {/* EMPLOYEE TRAINING - SCORE UPLOAD */}
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

                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title='Training Score Upload'
                            subtitle={'lorem ipsum dolor'}
                            data={this.data}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>

                {this.state.detailVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content-small background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        Data Upload - Detail
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        className="btn btn-circle btn-grey"
                                        onClick={this.openDetailForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>

                                </div>
                            </div>
                            <ScrUploadDetail
                                //leaveData={rawData[selectedIndex]}
                                onClickClose={this.openDetailForm}
                                onClickSave={this.openSavePopUp}
                                type={"view"}
                            />
                        </div>
                        <div className="padding-top-20px" />
                    </div>
                )}

                {this.state.createVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content-small background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                       Training Score - Create Form
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        className="btn btn-circle btn-grey"
                                        onClick={this.openCreateForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>

                                </div>
                            </div>
                            <ScrUploadCreate
                                onClickClose={this.openCreateForm}
                                onClickSave={this.openSavePopUp}
                                type={"view"}
                            />
                        </div>
                        <div className="padding-top-20px" />
                    </div>
                )}

                <PopUp
                    type={"save"}
                    class={this.state.saveClass}
                    onClick={this.openSavePopUp}
                />

                <PopUp
                    type={"delete"}
                    class={this.state.deleteClass}
                    onClick={this.openDeletePopup}
                    onClickDelete={this.handleDelete}
                />
            </div>
        );
    };
}

export default Performance;
