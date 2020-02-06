import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import PopUp from "../../components/pages/PopUpAlert";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormOutsourceSdm from "../../modules/forms/formOutsource/formOutsourceSdm";
var ct = require("../../modules/custom/customTable");

class SdmAssessment extends Component {
    constructor() {
        super();
        this.state = {
            detailVisible: false,
            editVisible: false,
            viewVisible: false,
            createVisible: false,
            selectedIndex: null,
            printClass: "app-popup",
            rawData: [],
            dataTable: [],

            deletePopUpVisible: false,
            savePopUpVisible: false,
        };
    }

    openPrint = () => {
        if (this.state.printClass === "app-popup app-popup-show") {
            this.setState({ printClass: "app-popup" });
        } else {
            this.setState({ printClass: "app-popup app-popup-show" });
        }
    };

    openDeletePopup = index => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index
        });
    };

    openEdit = index => {
        // let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            editVisible: !this.state.editVisible,
            selectedIndex: index,
            type: "edit"
        });
    }

    openView = index => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            viewVisible: !this.state.viewVisible,
            savePopUpVisible,
            selectedIndex: index,
            type: "view"
        });
    }

    openCreate = index => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            createVisible: !this.state.createVisible,
            savePopUpVisible,
            selectedIndex: index,
            type: "create"
        });
    }

    handleUpdate = () => {
        this.openSavePopUp();
    };

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
      };

    componentDidMount() {
        this.onFinishFetch()
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columns = [

        "No",
        "Vendor ID",
        "Vendor Name",
        "Assessment Date",
        "Total Score",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>

                            <button
                                type="button"
                                className="btn btn-blue btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() =>
                                    this.openEdit()
                                }
                            >
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                            <button
                                type="button"
                                style={{ marginRight: 5 }}
                                className="btn btn-red btn-small-circle"
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                            <button
                                type="button"
                                style={{ marginRight: 5 }}
                                className="btn btn-blue btn-small-circle"
                                onClick={() => this.openView()}
                            >
                                <i className="fa fa-lw fa-ellipsis-v" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    dataPPh = [
        ["1", "2", "3", "4", "5"]
    ]


    render() {
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-5px">
                    <div className="col-2 content-right">
                        <button
                            type="button"
                            className="btn btn-circle background-blue"
                            onClick={() =>
                                this.openCreate()
                            }
                        >
                            <i className="fa fa-plus" />
                        </button>
                    </div>
                </div>
                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title='SDM Assesment'
                            data={this.dataPPh}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
                {this.state.editVisible && (
                    <FormOutsourceSdm
                        type={"edit"}
                        onClickSave={this.handleUpdate}
                        onClickClose={this.openEdit.bind(this)}
                    />
                )}
                {this.state.viewVisible && (
                    <FormOutsourceSdm
                        type={"view"}
                        onClickSave={this.handleUpdate}
                        onClickClose={this.openView.bind(this)}
                    />
                )}
                {this.state.createVisible && (
                    <FormOutsourceSdm
                        type={"create"}
                        onClickSave={this.openSavePopUp}
                        onClickClose={this.openCreate.bind(this)}
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
                        onClick={this.openSavePopUp}
                    />
                )}
            </div>
        );
    }
}


export default SdmAssessment