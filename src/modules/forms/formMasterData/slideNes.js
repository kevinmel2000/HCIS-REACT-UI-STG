import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormNesProvince from "./formNesProvince";
import PopUp from "../../../components/pages/PopUpAlert";
import API from "../../../Services/Api"
import M from 'moment'

var ct = require("../../custom/customTable");

class SlideNes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            editVisible: false,
            detailVisible: false,
            deletePopUpVisible: false,
            savePopUpVisible: false,
            data: props.data,
            dataTableProvince: [],
        }
    }

    async getProvince(value) {
        API.create("MASTERDATA")
            .getProvince(value)
            .then(res => {
                if (res.status === 200) {
                    if (res.data.status === "S") {
                        this.setState({
                            dataTableProvince: res.data.data
                        });
                    }
                    let dataTableProvince = this.state.dataTableProvince.map((value) => {
                        const { provinceID, provinceName, provinceStatus } = value;
                        return [
                            provinceID,
                            provinceName,
                            provinceStatus
                        ]
                    })
                    this.setState({
                        dataTableProvince,
                        rawDataProvince: res.data.data
                    })
                }
            });
    }

    componentDidMount() {
        this.getProvince(this.state.data.countryID)
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions5();

    columns = [
        "Province ID",
        "Province Name",
        {
            name: "Province Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div className='grid grid-2x'>
                            <div className='column-1'>
                                <i
                                    className="fa fa-lw fa-circle"
                                    style={{
                                        color: val === "ACTIVE" ? "green" : "brown",
                                        marginRight: 5
                                    }}
                                />
                            </div>
                            <div className='column-2'>
                                {val}
                            </div>
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
                        this.props.type !== "detail" ?
                            <div>
                                <button
                                    className="btnAct"
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    type="button"
                                    onClick={() => this.openEditForm(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div> :
                            <button
                                type="button"
                                className="btn btn-blue btn-small-circle"
                                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-ellipsis-v" />
                            </button>
                    );
                }
            }
        }
    ];

    columnsDetail = [
        "Province ID",
        "Province Name",
        {
            name: "Province Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div className='grid grid-2x'>
                            <div className='column-1'>
                                <i
                                    className="fa fa-lw fa-circle"
                                    style={{
                                        color: val === "ACTIVE" ? "green" : "red",
                                        marginRight: 5
                                    }}
                                />
                            </div>
                            <div className='column-2'>
                                {val}
                            </div>
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
                        <button
                            type="button"
                            className="btnAct"
                            onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                        >
                            <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                        </button>
                    );
                }
            }
        }
    ];

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
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    };

    openDeletePopup = (index) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };

    handleSubmit = async (data, countryID) => {
        let payload = {
            countryID: countryID,
            province: {
                ...data,
                provinceCreationalDTO: {
                    ...data.provinceCreationalDTO,
                    createdDate: M().format("DD-MM-YYYY HH:mm:ss")
                },
            }
        }
        let response = await API.create('MASTERDATA').postProvince(payload)
        if (response.ok && response.data.status === 'S') {

            this.openSavePopUp()
            let dataTableProvince = Object.assign([], this.state.dataTableProvince)
            dataTableProvince.push(
                data.provinceID,
                data.provinceName,
                data.provinceStatus
            )
            this.setState({ dataTableProvince })
            this.getProvince(this.state.data.countryID)
        } else {
            if (response.data && response.data.message) alert("Data Already Exist")
        }
    }

    handleUpdate = async (data, countryID) => {
        let payload = {
            ...data,
            provinceCreationalDTO: {
                ...data.provinceCreationalDTO,
                createdDate: data.provinceCreationalDTO.createdDate,
                modifiedBy: "SYSTEM",
                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
            },
        }
        let response = await API.create('MASTERDATA').updateProvince(payload)
        if (response.ok && response.data.status === 'S') {
            let dataTableProvince = Object.assign([], this.state.dataTableProvince)
            dataTableProvince.splice(this.state.selectedIndex, 0,
                data.provinceID,
                data.provinceName,
                data.provinceStatus
            )
            this.setState({ dataTableProvince })
            this.openSavePopUp()
        } else {
            if (response.data && response.data.message) alert("Failed, Please Try Again")
        }
    }

    handlePopUp = () => {
        this.getProvince(this.state.data.countryID)

        this.setState({
            savePopUpVisible: false,
            createVisible: false,
            editVisible: false
        })
    }

    handleDelete = async () => {
        let payload = {
            referenceID: this.state.rawDataProvince[this.state.selectedIndex].provinceID,
            requestBy: "DELETE-TEST",
            requestDate: M().format("DD-MM-YYYY HH:mm:ss")
        }
        let response = await API.create('MASTERDATA').deleteProvince(payload)
        if (response.ok && response.data.status === 'S') {
            let dataTableProvince = Object.assign([], this.state.dataTableProvince)
            dataTableProvince.splice(this.state.selectedIndex, 1)
            this.setState({ dataTableProvince, deletePopUpVisible: false })
            this.getProvince(this.state.data.countryID)
        } else {
            if (response.data && response.data.message) alert("Failed, Please Try Again")
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data) {
            if (this.props.data !== prevProps.data) {
                this.setState({
                    data: this.props.data
                })
                this.getProvince(this.props.data.countryID)
            }
        }
    }

    render() {
        let { countryID, countryName } = this.state.data
        return (
            <div>
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1">
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-table"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        {this.props.title}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.closeSlide}
                                    className="btn btn-circle btn-grey">
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.data)
                    }}>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="display-flex-normals margin-bottom-15px">
                                <div>
                                    <div className="padding-top-15px padding-bottom-15px">
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Country ID <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <input
                                                readOnly={this.props.type === "create" ? false : true}
                                                style={{ backgroundColor: this.props.type === "create" ? "" : "#E6E6E6" }}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                value={countryID}
                                                onChange={(e) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            countryID: e.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Status   </span>
                                            </div>
                                            <div className="margin-20px">
                                                <label className="radio">
                                                    <input type="checkbox" checked disabled />
                                                    <span className="checkmark" />
                                                    <span className="txt-site txt-11 txt-bold txt-main">
                                                        Active     </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Country Name <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <input
                                                readOnly={this.props.type === "detail" ? true : false}
                                                style={{ backgroundColor: this.props.type === "detail" ? "#E6E6E6" : "" }}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                value={countryName}
                                                onChange={(e) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            countryName: e.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>

                                        <div className="padding-15px">
                                            <div className="padding-5px grid grid-2x">
                                                <div className="col-1"></div>
                                                {this.props.type === "edit" && (
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
                                                )}
                                            </div>
                                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                                <MUIDataTable
                                                    title='Province'
                                                    subtitle={"lorem ipsum dolor"}
                                                    data={this.state.dataTableProvince}
                                                    columns={this.props.type !== 'detail' ? this.columns : this.columnsDetail}
                                                    options={this.options}
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                        <div className="border-top padding-top-20px">
                                            <div className="grid grid-2x">
                                                <div className="col-1 content-left">
                                                    <button
                                                        onClick={this.props.closeSlide}
                                                        type='button'
                                                        className="btn btn-primary margin-right-10px content-left">
                                                        BACK
                                                    </button>
                                                </div>
                                                {this.props.type === 'edit' && (
                                                    <div className="col-2 content-right">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-blue"
                                                        >
                                                            SAVE
                                                </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <ReactTooltip />
                </div>
                {this.state.createVisible && (
                    <FormNesProvince
                        user={this.props.user}
                        type={"create"}
                        title={"NES Create - Province"}
                        countryID={this.state.data.countryID}
                        onClickClose={this.openCreateForm}
                        onClickSave={this.handleSubmit.bind(this)}
                        onClickDelete={this.openDeletePopup}
                    />
                )}

                {this.state.editVisible && (
                    <FormNesProvince
                        user={this.props.user}
                        type={"edit"}
                        title={"NES Update - Province"}
                        data={this.state.rawDataProvince[this.state.selectedIndex]}
                        onClickClose={this.openEditForm.bind(this)}
                        onClickSave={this.handleUpdate.bind(this)}
                        onClickDelete={this.openDeletePopup}
                    />
                )}

                {this.state.detailVisible && (
                    <FormNesProvince
                        user={this.props.user}
                        type={"detail"}
                        title={"NES Detail - Province"}
                        data={this.state.rawDataProvince[this.state.selectedIndex]}
                        onClickClose={this.openDetailForm}
                        onClickDelete={this.openDeletePopup}
                    />
                )}

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.handlePopUp.bind(this)}
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

export default SlideNes