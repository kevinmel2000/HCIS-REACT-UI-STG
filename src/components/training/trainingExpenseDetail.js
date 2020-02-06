import React, { Component } from "react";
import * as R from 'ramda'
import M from 'moment'
import DropDown from '../../modules/popup/DropDown';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import CreateTrainingExpense from './createTrainingExpense'
import Api from "../../Services/Api";
import PopUp from '../pages/PopUpAlert'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class trainingExpanse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            createTraningExpense: false,
            editTraningExpense: false,
            viewTraningExpense: false,
            saveVisible: false,
            deleteVisible: false,
            limit: 50,
            offset: 0,
        }
    }

    componentWillMount() {
        this.getData(this.state.limit, this.state.offset)
    }

    openCreate(type, selectedIndex) {
        if (type === "create") {
            this.setState({
                createTraningExpense: !this.state.createTraningExpense, selectedIndex: null
            })
        } else if (type === "edit") {
            console.log('masuk')
            this.setState({
                editTraningExpense: !this.state.editTraningExpense, selectedIndex
            })
        } else {
            this.setState({
                viewTraningExpense: !this.state.viewTraningExpense, selectedIndex
            })
        }
    }

    async handleCrud(type, value) {
        let payload, res = ''
        let createdBy, updatedBy = this.props.user
        let trainingID = this.props.trainingID
        switch (type) {
            case 'create':
                payload = {
                    "trainingExpenseID": value.trainingExpenseID,
                    "trainingExpenseName": value.trainingExpenseName,
                    "trainingExpensePIC": value.trainingExpensePIC,
                    "trainingExpenseReference": value.trainingExpenseReference,
                    "trainingExpenseAmount": value.trainingExpenseAmount,
                    "trainingExpenseCOA": value.trainingExpenseCOA,
                    "trainingExpenseDate": R.isEmpty(value.trainingExpenseDate) ? '' : M(value.trainingExpenseDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    "trainingExpenseDescription": value.trainingExpenseDescription,
                    // "trainingExpenseTrainingID": value.trainingExpenseTrainingID,
                    "trainingExpenseTrainingID": trainingID,
                    "createdBy": createdBy,
                    "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
                    "updatedBy": updatedBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
                res = await Api.create('TRAINING').postTrainingExpense(payload)
                break;
            case 'edit':
                payload = {
                    "trainingExpenseID": value.trainingExpenseID,
                    "trainingExpenseName": value.trainingExpenseName,
                    "trainingExpensePIC": value.trainingExpensePIC,
                    "trainingExpenseReference": value.trainingExpenseReference,
                    "trainingExpenseAmount": value.trainingExpenseAmount,
                    "trainingExpenseCOA": value.trainingExpenseCOA,
                    "trainingExpenseDate": R.isEmpty(value.trainingExpenseDate) ? '' : M(value.trainingExpenseDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    "trainingExpenseDescription": value.trainingExpenseDescription,
                    // "trainingExpenseTrainingID": value.trainingExpenseTrainingID,
                    "trainingExpenseTrainingID": trainingID,
                    "updatedBy": updatedBy,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                }
                res = await Api.create('TRAINING').putTrainingExpense(payload)
                break;
            case 'delete':
                payload = {
                    "trainingExpenseID": this.state.rawData[this.state.selectedIndex].trainingExpenseID,
                }
                res = await Api.create('TRAINING').deleteTrainingExpense(payload)
                break;
            default:
                break;
        }
        if (res.data.status === 'S' && type !== 'delete') {
            this.openSavePopup()
            this.getData(this.state.limit, this.state.offset)
        } else {
            this.getData(this.state.limit, this.state.offset)
            this.setState({ deleteVisible: false })
        }
    }

    openSavePopup() {
        this.setState({ saveVisible: !this.state.saveVisible, viewTraningExpense: false, editTraningExpense: false, createTraningExpense: false })
    }

    openPopupDelete(selectedIndex) {
        this.setState({ deleteVisible: !this.state.deleteVisible, selectedIndex })
    }

    async getData(limit, offset) {
        let { trainingID } = this.props
        let rawData = []
        let payload = {
            "limit": limit,
            "offset": offset,
            "params": {}
        }
        let res = await Api.create('TRAINING_QUERY').getAllTrainingExpense(payload)
        console.log(res)
        if (res.data && res.data.status === 'S') {
            res.data.data.map((value) => {
                const { trainingExpenseTrainingID } = value
                if (trainingExpenseTrainingID === trainingID) {
                    rawData.push(value)
                }
            })
            if (!R.isEmpty(rawData)) {
                let dataTable = rawData.map((value, index) => {
                    const { trainingExpenseID, trainingExpenseName, trainingExpenseAmount, trainingExpenseCOA, trainingExpenseDate } = value
                    return [
                        index += 1,
                        trainingExpenseID,
                        trainingExpenseName,
                        trainingExpenseAmount,
                        trainingExpenseCOA,
                        trainingExpenseDate
                    ]
                })
                this.setState({ rawData, dataTable })
            }
        } else return alert(res.originalError)
    }

    columns = [
        "No",
        "Training Expense ID",
        "Item Name",
        "Amount",
        "COA",
        "Date",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btnAct"
                                style={{ marginRight: 10 }}
                                type="button"
                                onClick={() => this.openCreate("edit", tableMeta.rowIndex)}
                            >
                                <i
                                    className="fa fa-lw fa-pencil-alt"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#004c97",
                                        fontSize: 20
                                    }}
                                />
                            </button>
                            <button
                                className="btnAct"
                                type="button"
                                style={{ marginRight: 10 }}
                                onClick={() => this.openPopupDelete(tableMeta.rowIndex)}
                            >
                                <i
                                    className="fa fa-lw fa-trash-alt"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "red",
                                        fontSize: 20
                                    }}
                                />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openCreate("view", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];


    render() {
        let { createTraningExpense, editTraningExpense, viewTraningExpense, selectedIndex, saveVisible, deleteVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                {createTraningExpense && (
                    <CreateTrainingExpense
                        type={"create"}
                        onClickClose={() => this.openCreate("create")}
                        onClickSave={this.handleCrud.bind(this)}
                    // data={this.data[selectedIndex]}
                    />
                )}
                {editTraningExpense && (
                    <CreateTrainingExpense
                        type={"edit"}
                        onClickClose={() => this.openCreate("edit")}
                        onClickSave={this.handleCrud.bind(this)}
                        data={this.state.rawData[selectedIndex]}
                    />
                )}
                {viewTraningExpense && (
                    <CreateTrainingExpense
                        type={"view"}
                        onClickClose={() => this.openCreate("view")}
                        data={this.state.rawData[selectedIndex]}
                    />
                )}
                {saveVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openSavePopup()}
                    />
                )}
                {deleteVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openPopupDelete()}
                        onClickDelete={() => this.handleCrud('delete')}
                    />
                )}
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Training Expense - Detail
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="display-flex-normals" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                        <div className='grid grid-2x' style={{ marginTop: 10, marginBottom: 10 }}>
                            <div className='column-1'></div>
                            <div className='column-2 content-right'>
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={() => this.openCreate("create")}
                                >
                                    <i className="fa fa-lg fa-plus" />
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={"Training Expense"}
                                    subtitle={"lorem ipsum dolor"}
                                    data={this.state.dataTable}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        );
    }
}
export default trainingExpanse;
