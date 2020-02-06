import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormCreatePerformance from "../../modules/forms/formCreatePerformance";
import PopUp from "../pages/PopUpAlert";
import FormEditPerformance from "../../modules/forms/formEditPerformance";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

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
                savePopUpVisible: !this.state.savePopUpVisible
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

    columns = [
        "No",
        {
            name: "Request Number",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                            >
                                {val}
                            </div>
                        </div>
                    );
                }
            }
        },
        "NIK",
        "Employee Name",
        "Scoring Format",
        "Scoring Period",
        "Year",
        {
            name: "Score",
            options: {
                filter: false,
                customHeadRender: (columnMeta) => (
                    <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-4x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"Number"}
                            </div>
                            <div className="col-2">
                                {"Grade"}
                            </div>
                            <div className="col-3">
                                {"Performance"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div className="grid grid-4x content-center">
                                <div className="col-1">
                                    {val}
                                </div>
                                <div className="col-2">
                                    {val}
                                </div>
                                <div className="col-3">
                                    {val}
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
        "Request By",
        "Information",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-red btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() =>
                                    this.openEditForm(tableMeta.rowIndex)
                                }
                            >
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
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
        ["L001", "null", "null", "null", "null", "null", "null", "null", "null", "null",
            "null", "null",
            ""]
    ];

    render() {
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-15px grid grid-2x">
                    <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            {/* Performance */}
            </div>
                    </div>
                    <div className="col-2 content-right">
                        <button
                            type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 5 }}
                            onClick={this.openCreateForm.bind(this)}
                        >
                            <i className="fa fa-1x fa-plus" />
                        </button>
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Performance'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {this.state.createVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        Performance - Create Form
                                     </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        className="btn btn-circle background-blue"
                                        onClick={this.openCreateForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>

                                </div>
                            </div>

                            <FormCreatePerformance
                                type={"create"}
                                onClickClose={this.openCreateForm}
                                onClickSave={this.openSavePopUp}
                            />

                        </div>
                    </div>

                )}

                {this.state.detailVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        Performance - View Form
                                     </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        className="btn btn-circle background-blue"
                                        onClick={this.openDetailForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>

                                </div>
                            </div>

                            <FormCreatePerformance
                                type={"view"}
                                onClickClose={this.openDetailForm}
                            />

                        </div>
                    </div>

                )}

                {this.state.editVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="padding-15px background-blue border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        Performance - Detail
                                     </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        className="btn btn-circle background-blue"
                                        onClick={this.openEditForm}
                                    >
                                        <i className="fa fa-lg fa-times" />
                                    </button>

                                </div>
                            </div>

                            <FormEditPerformance
                                type={"edit"}
                                onClickClose={this.openCreateForm}
                                onClickSave={this.openSavePopUp}
                            />

                        </div>
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
