import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import API from '../../Services/Api'
var ct = require("../../modules/custom/customTable")

class formSearchRec extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataTable: [],
            rawData: []
        }

    }

    componentDidMount() {
        this.getDataRecruitment()
    }

    getDataRecruitment() {
        let payload = {
            limit: 100,
            offset: 0
        }
        API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
          (res) => {
            if(res.status === 200) {
                if(res.data.status === 'S') {
                    console.log("rec : ", res.data);

                    let dataTable = res.data.data.map((value, index) => {
                        const { recruitmentRequestID, recruitmentType, recruitmentCategory, recruitmentPublishStartDate, recruitmentRequestBy } = value;
                        return [
                            index +=1,
                            recruitmentRequestID,
                            recruitmentType.bizparValue+" | "+recruitmentCategory.bizparValue,
                            recruitmentPublishStartDate,
                            recruitmentRequestBy.employeeName
                        ]
                    })
                        this.setState({
                            dataTable,
                            rawData: res.data.data
                        })
                    }
                }
            }
        )
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions()

    columns = [
        "No",
        "Request Number",
        "Recruitment Type | Category",
        "Publish Date",
        "Requestor",
        {
          name: "Action",
          options: {
            customBodyRender: (val, tableMeta) => {
              return (
                <div>
                    <button 
                        type="button"
                        onClick={() => this.props.onClick(tableMeta.rowIndex, this.state.rawData)}
                        className={"btn btn-blue btn-small-circle"}>
                        <i className={"fa fa-lw fa-plus"} />
                    </button>
                </div>
              )
            }
          }
        }
    ]

    render() {
        return(
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-white grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                Recruitment Request - Search Form
                            </div>
                        </div>
                    </div>
                    <div className="padding-10px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
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
                            style={{marginLeft: "15px"}}
                            className="btn btn-primary" 
                            type="button"
                            onClick={ this.props.onClickClose }>
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

export default formSearchRec