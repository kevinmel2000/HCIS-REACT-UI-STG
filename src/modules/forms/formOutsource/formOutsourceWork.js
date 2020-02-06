import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
// import FormWorkExp from './formWorkExperience'
import PopUp from "../../../components/pages/PopUpAlert"
import FormOutsourceWorkDetail from "./formOutsourceWorkDetail";
import * as R from 'ramda'
import M from 'moment'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormOutsourceWork extends Component {
    constructor(props) {
        super(props)
        let { data } = this.props

        this.state = {
            data,
            dataTableWorkExp: [],
            createVisible: false,
            viewVisible: false,
            updateVisible: false,
            createPopUpVisible: false
        }
    }

    async handleSave(type, value) {
        let { data } = this.state
        let payload = Object.assign([], data.osWorkExperience)
        let values = ''
        switch (type) {
            case 'create':
                values = {
                    ...value,
                    weStartDate: value.weStartDate && M(value.weStartDate).format('DD-MM-YYYY'),
                    weEndDate: value.weEndDate && M(value.weEndDate).format('DD-MM-YYYY'),
                }
                payload.push(values)
                break;
            case 'update':
                values = {
                    ...value,
                    weStartDate: value.weStartDate && M(value.weStartDate).format('DD-MM-YYYY'),
                    weEndDate: value.weEndDate && M(value.weEndDate).format('DD-MM-YYYY'),
                }
                let index = R.findIndex(R.propEq('weID', values.weID))(payload)
                if (index >= 0) {
                    payload[index] = values
                }
                break;
            case 'delete':
                payload.splice(this.state.selectedIndex, 1)
                break;
            default: break;
        }
        data = { ...data, osWorkExperience: payload }
        this.props.onClickSave('formalEdu', data)
    }

    componentDidMount() {
        // this.getBizpar()
        let { osWorkExperience } = this.state.data
        if (!R.isEmpty(osWorkExperience)) {
            let dataTableWorkExp = osWorkExperience.map((value, index) => {
                const { weID, weType, weStartDate, weEndDate } = value
                return [
                    weID, weType, weStartDate, weEndDate
                ]
            })
            this.setState({ dataTableWorkExp, rawData: osWorkExperience })
        }
    }

    openCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
    }

    openView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
    }

    openUpdate(selectedIndex) {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ updateVisible: !this.state.updateVisible, selectedIndex, createPopUpVisible })
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    handleSubmit(value, type = "") {
        if (type !== "delete") this.setState({ createPopUpVisible: true })
        else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columnsWorkExp = [
        "Work Experience ID",
        "Work Experience Type",
        "Start Date",
        "End Date",
        {
            name: "Action",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index}
                        style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={() => this.openUpdate(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openView(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div> :
                            <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openView(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>

                    );
                }
            }
        }
    ];

    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-7">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCreate.bind(this)}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Work Experience'
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableWorkExp}
                                columns={this.columnsWorkExp}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {this.state.createVisible && (
                        <FormOutsourceWorkDetail
                            type={'create'}
                            onClickClose={this.openCreate.bind(this)}
                            onClickSave={this.handleSave.bind(this)}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormOutsourceWorkDetail
                            type={'view'}
                            dataWork={this.state.rawData[this.state.selectedIndex]}
                            onClickClose={this.openView.bind(this)}
                        />
                    )}

                    {this.state.updateVisible && (
                        <FormOutsourceWorkDetail
                            type={'update'}
                            dataWork={this.state.rawData[this.state.selectedIndex]}
                            onClickClose={this.openUpdate.bind(this)}
                            onClickSave={this.handleSave.bind(this)}
                        />
                    )}

                    {this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createVisible: false,
                                    updateVisible: false,
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
                            onClickDelete={() => this.handleSave('delete')}
                        />
                    )}
                </form>
            </div>)
    }
}

export default FormOutsourceWork