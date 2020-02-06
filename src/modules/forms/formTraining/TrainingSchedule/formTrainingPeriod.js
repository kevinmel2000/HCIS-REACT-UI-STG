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
            deletePopUpVisible: false

        };
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    handleDelete = () => {
        this.setState({ deletePopUpVisible: false });
    };

    openDeletePopup = index => {
        console.log(this.state.deletePopUpVisible)
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index
        });
    };


    handleUpdate = () => {
        this.openSavePopUp();
    };

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
    };
    openCreateForm = () => {
        this.setState({ createVisible: !this.state.createVisible })
    }


    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columns = [
        "No",
        "Period",
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
        ["1", "Januari 2019", " "]];

    render() {
        return (
            <div className="vertical-tab-content active">
                <div className="col-2 content-right">
                    <button
                        type="button"
                        className="btn btn-circle background-blue"
                        style={{ marginRight: 15, marginTop: 15 }}
                        onClick={() => this.openCreateForm()}
                    >
                        <i className="fa fa-1x fa-plus" />
                    </button>
                </div>
                <form action="#">
                    <div className="padding-15px border-bottom">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Period'
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
                                    onClick={this.handleUpdate}
                                >
                                    <span>SAVE</span>
                                </button>
                                <button
                                    style={{ marginLeft: "15px"}}
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
                                        Training Schedule - Period - Create Form
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
                                    <div className="border-bottom padding-15px">
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Periode</h4>
                                                </div>
                                            </div>
                                            <DropDown
                                                title="-- please select period --"
                                                onChange={(dt) => console.log(dt)}
                                                // type="bizpar"
                                                // disabled={this.props.type === "update" ? true : false}
                                                data={[
                                                    {id: '1', title: '2019', value: '2019'},
                                                    {id: '2', title: '2020', value: '2020'}
                                                ]} />
                                            {/*<select
                                                className="cf-select slc slc-sekunder"
                                                required
                                            >
                                                <option value="1"></option>
                                                <option value="1">2019</option>
                                            </select>*/}
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
                                                        style={{ marginLeft: "15px"}}
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
            </div>
        )
    }
}

export default FormTrainingRequirement;


