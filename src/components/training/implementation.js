import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormDetail from "../../modules/forms/formTraining/implementation/formDetail"
import FormParticipant from "../../modules/forms/formTraining/implementation/formParticipant";
import FormFacilitator from "../../modules/forms/formTraining/implementation/formFacilitator";
import FormBudget from "../../modules/forms/formTraining/implementation/formBudget";
import FormDocument from "../../modules/forms/formTraining/implementation/formDocument";
import FormPTRU from "../../modules/forms/formTraining/implementation/formPTRU";
import FormAttUpload from "../../modules/forms/formTraining/implementation/formAttUpload";
import FormCommitee from "../../modules/forms/formTraining/implementation/formCommitee";
import DropDown from '../../modules/popup/DropDown';

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Implementation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savePopUpVisible: false,
            confirmPopUpVisible: false,
            deletePopUpVisible: false,
            createPopUpVisible: false,

            formEditVisible: false,
            formDetailVisible: false,
            formParticipantVisible:false,
            formFacilitatorVisible:false,
            formBudgetVisible:false,
            formDocumentVisible:false,
            formPTRUVisible:false,
            formAttUploadVisible:false,
            formCommiteeVisible:false,

            activeTab: "",
            tabMenu: ["Detail", "Participant","Facilitator","Budget","Document",
            "Pre Test Result Upload","Attendance Upload","Commitee"]
        };
    }


    openEdit = index => {
        let { formEditVisible } = this.state;
        this.setState({
            formEditVisible: !formEditVisible,
            selectedIndex: !formEditVisible ? index : null,
            activeTab: !formEditVisible ? "Detail" : "",
            formDetailVisible: !formEditVisible
                ? true
                : false,
                formParticipantVisible:false,
                formFacilitatorVisible:false,
                formBudgetVisible:false,
                formDocumentVisible:false,
                formPTRUVisible:false,
                formAttUploadVisible:false,
                formCommiteeVisible:false
        });
    };

    handleUpdate = () => {
        this.openSavePopUp();
    };

    handleDelete = () => {
        this.setState({ deletePopUpVisible: false });
    };
    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
    };

    openConfirmPopUp = index => {
        this.setState({
            confirmPopUpVisible: !this.state.confirmPopUpVisible,
            selectedIndex: index
        });
    };

    openDeletePopup = index => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index
        });
    };

    componentDidMount() {
        this.onFinishFetch();
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    handleUpdate() {
        this.openSavePopUp();
    }
    // important
    // vertical tab function
    opNavigator = title => {
        let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
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
            formDetailVisible: false,
            formParticipantVisible:false,   
            formFacilitatorVisible:false,
            formBudgetVisible:false,
            formDocumentVisible:false,
            formPTRUVisible:false,
            formAttUploadVisible:false,
            formCommiteeVisible:false,
            activeTab: title
        };

        switch (title) {
            case "Detail":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDetailVisible: true
                };
                break;
            case "Participant":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formParticipantVisible: true
                };
                break;
            case "Facilitator":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formFacilitatorVisible: true
                };
                break;
            case "Budget":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formBudgetVisible: true
                };
                break;
            case "Document":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDocumentVisible: true
                };
                break;
            case "Pre Test Result Upload":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formPTRUVisible: true
                };
                break;
            case "Attendance Upload":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formAttUploadVisible: true
                };
                break;
            case "Commitee":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCommiteeVisible: true
                };
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    };

    columns = [
        "No",
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
                                    this.openEdit(tableMeta.rowIndex)
                                }
                            >
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                        </div>
                    );
                }
            }
        },
        {
            name: "Document Status",
            options: {
              customBodyRender: val => {
                return (
                  <div>
                    <label
                      style={{
                        backgroundColor: "brown",
                        color: "white",
                        padding: "2px",
                        borderRadius: 2,
                        border: "4px solid brown"
                      }}
                    >
                      {val}
                    </label>
                  </div>
                );
              }
            }
          },
        "Training Name",
        {
            name: <div style={{ float: "center" }}>Training Detail</div>,
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
        "Start Date",
        "End Date",
        "Time",
        "Location",
        "Planning PIC",
        "Realization PIC",
        "Number of Participant",
        "Cost Total"
    ];

    dataTable = [
        ["1", "DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY","DUMMY",]
    ];

    render() {
        return (
            <div className="main-content">
                <div>
                    <div>
                        <form action="#">
                            <div className="margin-right-15px margin-left-15px margin-top-10px">
                                <div className="margin-bottom-10px txt-site txt-14 txt-bold txt-main">
                                    Data Training Realization
                                </div>
                                <div class="grid grid-2x">
                                    <div class="col-1">
                                        <div >
                                            <div className="display-flex-normal">
                                              <div style={{width: '100px', position: 'relative', top: '10px'}}>
                                                <span className="txt-site txt-11 txt-main-color">
                                                    Training Type
                                                </span>
                                              </div>
                                              <div style={{width: '500px'}}>
                                                <DropDown
                                                  title="-- please select training type --"
                                                  onChange={(dt) => console.log(dt)}
                                                  // type="bizpar"
                                                  // disabled={this.props.type === "update" ? true : false}
                                                  data={[
                                                    {id: '1', title: 'beginner', value: 'beginner'}, 
                                                    {id: '1', title: 'beginner', value: 'beginner'}]} />
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-2">
                                        <div className="content-right">
                                            <button
                                                type="button"
                                                className="btn btn-blue btn-small-circle"
                                            >
                                                <i className="fa fa-lw fa-download" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="padding-10px grid-mobile-none gap-20px">
                                <div className="padding-5px" />
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        title='Employee Training - Trining Implementation'
                                        subtitle={'lorem ipsum dolor'}
                                        data={this.dataTable}
                                        columns={this.columns}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>

                            {this.state.formEditVisible && (
                                <div className={"app-popup app-popup-show"}>
                                    <div className="padding-top-20px" />
                                    <div className="popup-content background-white border-radius">
                                        <div className="popup-panel grid grid-2x">
                                            <div className="col-1">
                                                <div className="popup-title">
                                                    Training Implementation - Edit Form
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-circle btn-grey"
                                                    onClick={this.openEdit}
                                                >
                                                    <i className="fa fa-lg fa-times" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="popup-content-grid">
                                            <div className="popup-scroll popup-col-1">
                                                <ul className="vertical-tab">
                                                    {this.state.tabMenu.map((data, index) => {
                                                        return this.opNavigator(data);
                                                    })}
                                                </ul>
                                            </div>

                                            <div className="popup-scroll popup-col-2">
                                                {this.state.formDetailVisible && (
                                                    <FormDetail
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formParticipantVisible && (
                                                    <FormParticipant
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formFacilitatorVisible && (
                                                    <FormFacilitator
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formBudgetVisible && (
                                                    <FormBudget
                                                        onClickConfirm={this.openConfirmPopUp}
                                                        onClickDelete={this.openDeletePopup}
                                                        onClickSave={this.handleUpdate}
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formDocumentVisible && (
                                                    <FormDocument
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formPTRUVisible && (
                                                    <FormPTRU
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formAttUploadVisible && (
                                                    <FormAttUpload
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}
                                                {this.state.formCommiteeVisible && (
                                                    <FormCommitee
                                                        onClickClose={this.openEdit}
                                                    />
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="padding-bottom-20px" />
                                </div>
                            )}
                            {this.state.confirmPopUpVisible && (
                                <PopUp
                                    type={"confirm"}
                                    class={"app-popup app-popup-show"}
                                    onClick={this.openConfirmPopUp}
                                />
                            )}
                            {this.state.savePopUpVisible && (
                                <PopUp
                                    type={"save"}
                                    class={"app-popup app-popup-show"}
                                    onClick={this.openSavePopUp}
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
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Implementation;
