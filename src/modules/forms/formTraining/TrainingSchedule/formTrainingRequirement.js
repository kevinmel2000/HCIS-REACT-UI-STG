import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import DropDown from '../../../../modules/popup/DropDown';

var ct = require("../../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormTrainingRequirement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false

        };
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    handleUpdate = () => {
        this.openSavePopUp();
    };

    handleDelete = () => {
        this.setState({ deletePopUpVisible: false });
      };

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
    };
    openCreateForm = () => {
        this.setState({ createVisible: !this.state.createVisible })
    }

    openDeletePopup = index => {
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible,
          selectedIndex: index
        });
      };

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columns = [
        "No",
        "Requirement Type",
        "Requirement Score",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }

    ];

    data = [
        ["1", "Materi", "1007", "ROBERT JULIUS", "VP PROJECT MANAGEMENT", "KUNINGAN CITY", "OPERATION", "100"]];

    render() {
        return (
            <div className="vertical-tab-content active">
                <div className="content-right margin-right-15px margin-top-15px">
                    <button
                        type="button"
                        className="btn btn-circle background-blue"
                        onClick={() => this.openCreateForm()}
                    >
                        <i className="fa fa-1x fa-plus" />
                    </button>
                </div>
                <form action="#">
                    <div className="padding-15px border-bottom">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Requirement'
                                data={this.data}
                                columns={this.columns}
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
                                    onClick={this.props.onClickSave}
                                >
                                    <span>SAVE</span>
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

                {this.state.createVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content-small background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        Training Schedule - Requirement - Create Form
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
                            <div className="vertical-tab-content active">
                                <form action="#">
                                    <div className="border-bottom padding-15px gap-20px">
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Requirement Type<span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <DropDown
                                                title="-- please select requirement type --"
                                                onChange={(dt) => console.log(dt)}
                                                // type="bizpar"
                                                disabled={this.props.type === "update" ? true : false}
                                                data={[
                                                    {id: '1', title: 'Performance', value: '1'},
                                                    {id: '2', title: 'Performance', value: '2'}
                                                ]} />
                                            {/*<select
                                                className="cf-select slc slc-sekunder"
                                                required
                                            >
                                                <option value="1"></option>
                                                <option value="1">Performance</option>
                                            </select>*/}
                                        </div>

                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Requirement Score (Month)<span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div>
                                            <div className="grid grid-2x">
                                                <div className="col-1" />
                                                <div className="col-2 content-right">
                                                    <button
                                                        style={{ marginLeft: "15px" }}
                                                        className="btn btn-blue"
                                                        type="button"
                                                        onClick={this.handleUpdate}
                                                    >
                                                        <span>SAVE</span>
                                                    </button>
                                                    <button
                                                        style={{ marginLeft: "15px" }}
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={this.openCreateForm}
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
                    </div>
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
        )
    }
}

export default FormTrainingRequirement;


