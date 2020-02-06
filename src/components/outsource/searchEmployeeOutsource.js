import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import AuthAction from '../../Redux/AuthRedux'
import { connect } from 'react-redux'
import Api from '../../Services/Api'
import M from 'moment'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class SearchEmployeeOutsource extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            rawData: [],
        }
    }

    async getData() {
        let payload = {
            "limit": 5,
            "offset": 0,
            "params": {
            }
        }
        let res = await Api.create('OUTSOURCE_QUERY').getAllOutsource(payload)
        if (res.data.status === 'S') {
            let data = res.data.data.map((value) => {
                const { outsourceID, outsourceName, osGender, osDateOfBirth, osPlaceOfBirth, osReligion } = value
                return [
                    outsourceID,
                    outsourceName,
                    osGender,
                    osPlaceOfBirth,
                    osDateOfBirth && M(osDateOfBirth).format('DD-MMM-YYYY'),
                    osReligion
                ]
            })
            this.setState({
                data,
                rawData: res.data.data
            })
            this.onFinishFetch()
        }
    }

    componentDidMount() {
        this.startFetch()
        this.getData()
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };


    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
    }

    columns = [
        'NIK',
        'Employee Name',
        'Gender',
        'Birth Place',
        'Date of Birth',
        'Religion',
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
                        <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.props.onChoose(this.state.rawData[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-1x fa-plus" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Employee - Search Form </div>
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

                    <div className="padding-15px grid-mobile-none">
                        <div className="margin-bottom-15px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={"Employee Outsource List"}
                                    subtitle={"lorem ipsum dolor"}
                                    data={this.state.data}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchEmployeeOutsource)
