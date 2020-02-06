import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FlexView from 'react-flexview'
import Api from '../../../Services/Api';
import { connect } from 'react-redux';

var ct = require("../../custom/customTable")

class FormSearchBank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rawData: [],
            dataTable: [],
            refreshing: false,
            fetching: false,
            auth: props.auth
        }
    }

    componentWillMount() {
        let { auth } = this.state
        console.log('auth', auth)
        this.getAllBank(auth.user.companyID)
    }

    async getAllBank(value) {
        let body = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }
        let response = await Api.create("MASTERDATA").getAllBank(body)
        if (response.ok === true && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { bankID, bankCode, bicode, bankName } = value
                return [
                    index += 1,
                    bankName,
                    bankCode,
                    bicode,
                    bankName
                ]
            })
            this.setState({ dataTable, rawData: response.data.data }, () => console.log(this.state.dataTable))
        }
        console.log(response)
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions()

    columns = [
        "No",
        "Bank Name",
        "Bank Code",
        "BI Code",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                onClick={() => this.props.onClick(this.state.rawData[tableMeta.rowIndex])}
                                className="btn btn-blue btn-small-circle">
                                <i className="fa fa-lw fa-plus"/>
                            </button>
                        </div>
                    )
                }
            }
        }
    ] 

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="margin-bottom-5px display-flex-normal padding-15px ">
                                <i className="fa fa-lg fa-dollar-sign margin-right-10px margin-top-5px"></i>
                                <h1 className="txt-site txt-18 txt-main ">Bank Account List</h1>
                            </div>
                        </div>
                    </div>
                    <div className="padding-10px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Bank Account List'
                                data={this.state.dataTable}
                                columns={this.columns}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(FormSearchBank)
// export default FormSearchEmployee;