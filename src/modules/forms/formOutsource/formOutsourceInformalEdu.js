import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
// import FormInformalEdu from "../formsRecApplicant/formInformalEducation";
import PopUp from "../../../components/pages/PopUpAlert"
import FormOutsourceInformalEduDetail from './formOutsourceInformalEduDetail'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormOutsourceInformalEdu extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableInformalEdu: [],
            bizparTrainingType: [],
            bizparCostType: [],
            createVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            editVisible: false,
            viewVisible: false,
            refreshing: false,
            fetching: false
        }
    }

    handleSubmit(value, type = "") {
        if (type !== "delete") this.setState({ createPopUpVisible: true })
        else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    openCloseCreate() {
        let createPopUpVisible = this.state.createPopUpVisible
            ? !this.state.createPopUpVisible
            : false;
        this.setState({
            createVisible: !this.state.createVisible,
            createPopUpVisible
        });
    }

    openCloseEdit(selectedIndex) {
        let createPopUpVisible = this.state.createPopUpVisible
            ? !this.state.createPopUpVisible
            : false;
        this.setState({ editVisible: !this.state.editVisible, createPopUpVisible, selectedIndex, });
    }

    openCloseView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    columnsInformEdu = [
        "Informal Education Number",
        "Start Date",
        "Finish Date",
        "Training Type",
        "Training Name",
        "Certificate Number",
        "Date of Certificate",
        "Cost of Education",
        "Name of Institution",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div>
                                <div className="col-1">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCloseView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }
        }
    ]

    data = [
        ["INF-001", "01-01-2020", "02-02-2020", "PELATIHAN", "JAVA", "CERT-001", "03-01-2019", "OWN", "INST"]
    ]
    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-6">
                <form action="#">
                    <div
                        className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCloseCreate.bind(this)}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Informal Education'
                                subtitle={"lorem ipsum dolor"}
                                data={this.data}
                                columns={this.columnsInformEdu}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormOutsourceInformalEduDetail
                            type={"create"}
                            bizparTrainingType={this.state.bizparTrainingType}
                            onClickClose={this.openCloseCreate.bind(this)}
                            bizparCostType={this.state.bizparCostType}
                            onClickSave={() => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}
                        />
                    )}
                    {this.state.editVisible && (
                        <FormOutsourceInformalEduDetail
                            type={"update"}
                            bizparTrainingType={this.state.bizparTrainingType}
                            bizparCostType={this.state.bizparCostType}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={() => this.setState({ createPopUpVisible: !this.state.createPopUpVisible })}

                        />
                    )}
                    {this.state.viewVisible && (
                        <FormOutsourceInformalEduDetail
                            type={"view"}
                            bizparTrainingType={this.state.bizparTrainingType}
                            bizparCostType={this.state.bizparCostType}
                            onClickClose={this.openCloseView.bind(this)}
                        />
                    )}
                    {this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createVisible: false,
                                    editVisible: false,
                                    createPopUpVisible: false
                                })
                            }}
                        />
                    )}
                    {this.state.deletePopUpVisible && (
                        <PopUp
                            type={"delete"}
                            class={"app-popup app-popup-show"}
                            onClick={this.openDeletePopup.bind(this)}
                            onClickDelete={this.openDeletePopup.bind(this)}
                        />
                    )}
                </form>
            </div>
        );
    }
}

export default FormOutsourceInformalEdu