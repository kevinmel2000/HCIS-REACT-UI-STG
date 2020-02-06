import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormFacilityDetail from '../../create/facility/formFacilityDetail'
import Api from '../../../../../../Services/Api'

var ct = require("../../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class tableFacilityDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editVisible: false,
            dataTable: []
        }
    }

    openEdit = (selectedIndex) => {
        this.getBizparByParent(this.props.payloadFacility.facilities[selectedIndex].facilityType.bizparKey)
        this.setState({ selectedIndex })
    }

    closeForm() {
        this.setState({ editVisible: false })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.payloadFacility !== prevProps.payloadFacility) return this.getData()
    }

    getData() {
        let dataTable = this.props.payloadFacility.facilities.map((value) => {
            const { facilityDetailID, facilityType, facilitycategory, facilityDetailQty, } = value
            return [
                facilityDetailID,
                facilityType ? facilityType.bizparValue : "-",
                facilitycategory ? facilitycategory.bizparValue : "-",
                facilityDetailQty,
                "YES"
            ]
        })
        this.setState({ dataTable })
    }
    
    async getBizparByParent(data) {
        let payload = {
            "params": {
                "bizparKey": data
            },
            "offset": 0,
            "limit": 5
        }
        let response = await Api.create("BIZPAR").getAllBizparByParentKey(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ bizparFacilityCategory: response.data.data, editVisible: !this.state.editVisible })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    columns = [
        "Facility Detail ID",
        "Facility Type",
        "Facility Category",
        "Quantity",
        {
            name: "Activation",
            options: {
              customBodyRender: val => {
                return (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{
                        color: val === "YES" ? "green" : "brown",
                        marginRight: 10,
                        padding: "5px"
                      }}
                    />
                    {val}
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
                        <div>
                            <button
                                className="btnAct"
                                style={{marginRight: 15}}
                                type='button'
                                onClick={() => this.openEdit(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-detail")}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Facility Template Detail"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTable}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
                {this.state.editVisible &&
                    <FormFacilityDetail
                        type={"update"}
                        payloadFacility={this.props.payloadFacility.facilities[this.state.selectedIndex]}
                        bizparFacilityType={this.props.bizparFacilityType}
                        bizparFacilityCategory={this.state.bizparFacilityCategory}
                        onClickSave={this.props.onClickSave.bind(this)}
                        onClickClose={this.closeForm.bind(this)}
                    />}
            </div>
        )
    }
}
export default tableFacilityDetail