import React, { Component } from 'react'
import Form from '../../../components/pages/FieldForm'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormSppdFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sppdData: props.sppdData,
            dataTableFacility: []
        }
    }

    componentWillMount() {
        let dataTableFacility = this.state.sppdData.sppdFacilities.map((value, index) => {
            const { facilityType, facilityCategory, facilityOrderType, facilityOrderCategory, sppdIsBill, sppdNotes } = value
            return [
                facilityType ? facilityType.bizparValue : "",
                facilityCategory ? facilityCategory.bizparValue : "",
                facilityOrderType ? facilityOrderType.bizparValue : "",
                facilityOrderCategory ? facilityOrderCategory.bizparValue : "",
                sppdIsBill,
                sppdNotes ? sppdNotes : ""
            ]
        })

        this.setState({ dataTableFacility })
        console.log(this.state.sppdData.sppdFacilities)
    }

    columnsFacilities = [
        {
            name: "Facilities Type",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <Form
                                field={"select"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                disabled={true}
                                placeholder={val}
                            />
                        </div>
                    );
                }
            }
        },
        {
            name: "Facilities Category",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <Form
                                field={"select"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                disabled={true}
                                placeholder={val}
                            />
                        </div>
                    );
                }
            }
        },
        {
            name: "Booking Type",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <Form
                                field={"select"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                disabled={true}
                                placeholder={val}
                            />
                        </div>
                    );
                }
            }
        },
        {
            name: "Booking Category",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <Form
                                field={"select"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                disabled={true}
                                placeholder={val}
                            />
                        </div>
                    );
                }
            }
        },
        {
            name: "Bill Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <input type="checkbox" disabled checked={val === true ? true : false} /> Bill
                </div>
                    );
                }
            }
        },
        {
            name: "Information",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <Form
                                field={"select"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                disabled={true}
                                placeholder={val}
                            />
                        </div>
                    );
                }
            }
        }
    ];

    dataFacilities = [[]];

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-5px app-main-helped">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Facility'
                                data={this.state.dataTableFacility}
                                columns={this.columnsFacilities}
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
                                    onClick={this.props.onClickClose}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormSppdFacility