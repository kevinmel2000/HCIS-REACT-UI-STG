import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FlexView from 'react-flexview'
import Api from '../../../Services/Api';
import { connect } from 'react-redux';

var ct = require("../../custom/customTable")

class FormSearchEmployee extends Component {
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
        this.getEmployeeByEsid(auth.user.companyID)
    }

    async getEmployeeByEsid(value) {
        let payload = {
            "params": {
                "eSID": value
            },
            "offset": 0,
            "limit": 150
        }
        let imageUser = []
        let res = await Api.create('EMPLOYEE_QUERY').getEmployeeByEsid(payload)
        console.log('res', res)
        if (res.data && res.data.status === 'S') {
            let dataTable = res.data.data.map((value) => {
                const { employeeID, employeeName } = value
                return [
                    <div className='grid'>
                        <div className='col-1'>
                            {employeeID}
                        </div>
                        <div className='col-2'>
                            {employeeName}
                        </div>
                    </div>
                ]
            })
            for (let i = 0; i < res.data.data.length; i++) {
                let { employeeID } = res.data.data[i]
                let img = await this.getImage(employeeID && employeeID)
                if (img) imageUser[employeeID] = img
            }
            console.log(imageUser)
            this.setState({
                dataTable,
                rawData: res.data.data,
                imageUser
            })
        }
    }

    async getImage(employeeID) {
        let response = await fetch(
            process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.photo.get/" +
            employeeID,
            {
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
                }
            }
        );
        response = await response.blob();
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            return response
        } else {
            return null
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions()

    columns = [
        // "Employee",
        {
            name: "Employee",
            options: {
                customBodyRender: (val, tableMeta) => {
                    let { rawData, imageUser } = this.state
                    let photo = null
                    let empId = rawData[tableMeta.rowIndex] && rawData[tableMeta.rowIndex].employeeID
                    if (empId) {
                        photo = imageUser[empId]
                    }
                    return (
                        <FlexView vAlignContent="center">
                            <FlexView>
                                {/* {!R.isNil(this.state.imageUrl) && !R.isEmpty(this.state.imageUrl) ? (
                                    <img width="100%" height="100%" src={this.state.imageUrl} alt="img" />
                                ) : <i className="far fa-lw fa-user-circle" style={{ color: 'blue', marginRight: 10, fontSize: 44 }} />
                                } */}
                                {photo ? (
                                    <img width="100%" height="100%" src={photo} alt="img" style={{ verticalAlign: "middle", borderRadius: "50%", width: "50px", height: "50px", marginRight: 25 }} />
                                ) : <i className="far fa-lw fa-user-circle" style={{ color: 'blue', marginRight: 10, fontSize: 44 }} />
                                }
                            </FlexView>
                            <div style={{ fontWeight: 'bold', fontSize: 15 }}>
                                {val}
                            </div>
                        </FlexView>
                    )
                }
            }
        },
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

    data = [
        ["Employee Name1",
            "Branch Position1",
            "Employee Position1"],

        ["Employee Name2",
            "Branch Position2",
            "Employee Position2"]
    ]

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="margin-bottom-5px display-flex-normal padding-15px ">
                                <i className="fa fa-lg fa-users margin-right-10px margin-top-5px"></i>
                                <h1 className="txt-site txt-18 txt-main ">Employee</h1>
                            </div>
                        </div>
                    </div>
                    <div className="padding-10px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Employee List'
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

export default connect(mapStateToProps)(FormSearchEmployee)
// export default FormSearchEmployee;