import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import DropDown from '../../../../modules/popup/DropDown';

var ct = require("../../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormTrainingParticipant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
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

    openDeletePopup = index => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index
        });
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
        "Directorate",
        "Group",
        "Division",
        "SubDivision",
        "Deputy",
        "Section",
        "Unit",
        // "Branch",
        // "Location",
        // "Level",
        // "Job Type",
        // "Job",
        // "Managerial",
        // "Marketing",
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
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}  />
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
                <div className="col-2 content-right margin-top-15px margin-right-15px">
                    <button
                        type="button"
                        className="btn btn-circle background-blue"
                        onClick={() => this.openCreateForm()}
                    >
                        <i className="fa fa-1x fa-plus" />
                    </button>
                </div>

                <form action="#">
                    <div className="width width-full">

                        <div className="padding-15px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title='Participant'
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
                    </div>
                </form>

                {this.state.createVisible && (
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius" style={{ marginBottom: 10 }}>
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        Training Schedule - Participant - Create Form
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
                                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                                        <div className="column-1">
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Directorate</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select dorectorate --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Group</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select group --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Division</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select division --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>SubDivision</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select Sub-division --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Deputy</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select deputy --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Section</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select section --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Unit</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select unit --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                        </div>
                                        <div className="column-2">
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Branch</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select branch --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Level</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select level --"
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
                                                        <h4>Job Type</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select job type --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Job</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select dorectorate --"
                                                    onChange={(dt) => console.log(dt)}
                                                    // type="bizpar"
                                                    // disabled={this.props.type === "update" ? true : false}
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
                                                        <h4>Managerial</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select managerial --"
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
                                                        <h4>Marketing Job</h4>
                                                    </div>
                                                </div>
                                                <DropDown
                                                    title="-- please select marketing job --"
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
                                        </div>
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
                                                    onClick={this.openCreateForm}
                                                >
                                                    <span>CLOSE</span>
                                                </button>
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

export default FormTrainingParticipant;


