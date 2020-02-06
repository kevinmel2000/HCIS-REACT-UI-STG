import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");

class FormLeaveDocument extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveData: props.leaveData,
            dataTableDoc: []
        }
    }

    componentWillMount() {
        let dataTableDoc = []
        dataTableDoc.push(
            [this.state.leaveData.leaveDocumentURL]
        )
        this.setState({ dataTableDoc })
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columnsDocument = [
        {
            name: "Document",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i className="fas fa-lw fa-file" /> {val}
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btn btn-blue btn-small-circle"
                            >
                                <i className="fas fa-lw fa-print" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px  grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Document'
                                data={this.state.dataTableDoc}
                                columns={this.columnsDocument}
                                options={this.options}
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

export default FormLeaveDocument