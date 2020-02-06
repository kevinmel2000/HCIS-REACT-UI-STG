import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import * as R from 'ramda'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMonitoringQualification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monitoringData: props.monitoringData
        }
    }

    columnsQualification = [
        "No",
        {
            name: "Qualification Type",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <input type="checkbox" style={{ marginRight: 5 }} disabled checked={val !== "" ? true : false} />
                            {val}
                        </div>
                    );
                }
            }
        },
        "Qualification",
        "Comment",
        {
            name: "Mandatory",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <input type="checkbox" disabled checked={val === true ? true : false} />
                        </div>
                    );
                }
            }
        }
    ];

    render() {
        let { monitoringData } = this.state
        let dataTableQualification = monitoringData.recruitmentRequestQualificationDTOs.map((value, index) => {
            const { qualificationType, requestQualifications, requestQualificationNotes, isMandatory } = value;
            return [
                index +=1,
                qualificationType ? qualificationType.bizparValue : "",
                !R.isNil(requestQualifications) ? requestQualifications.map((data) => {
                    return data.bizparValue+
                    ","+
                    " "
                }) : "",
                requestQualificationNotes,
                isMandatory
            ]
        })

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px  grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                data={dataTableQualification}
                                columns={this.columnsQualification}
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
            </div>
        )
    }
}

export default FormMonitoringQualification