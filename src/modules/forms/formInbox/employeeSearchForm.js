import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FlexView from 'react-flexview'
import API from '../../../Services/Api'
import LoadingBar from 'react-top-loading-bar'
import * as R from 'ramda'
import { connect } from 'react-redux'

const ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class employeeSearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      rawData: [],
      employeeCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: ""
    }
  }

  componentDidMount() {
    this.startFetch()
    this.getData(this.state.table_page, this.state.table_limit)
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };


  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  async getData(page, limit) {
    let payload = {
      "params": {
        "employeeName": this.state.table_query
      },
      "offset": page,
      "limit": limit
    }
    let imageUser = []
    let response = await API.create('EMPLOYEE_QUERY').getEmployeeByName(payload)
    if (response.data && response.data.status === "S") {
      let rawData = response.data.data
      let data = response.data.data.map((item, index) => {
        const { employeeName, position, company } = item
        return [
          employeeName,
          company ? company.companyName : '-',
          position ? position.positionName : '-'
        ]
      })
      for (let i = 0; i < response.data.data.length; i++) {
        let { employeeID } = response.data.data[i]
        let img = await this.getImage(employeeID && employeeID)
        if (img) imageUser[employeeID] = img
      }
      this.onFinishFetch()
      this.setState({ data, rawData, imageUser })
    }
    this.getCountPage()
  }

  async getDataAll() {
    this.startFetch()
    let res = await API.create('EMPLOYEE_QUERY').getCountEmployeeByEsid(this.props.auth.user.companyID)

    let payload = {
      "offset": 0,
      "limit": res.data.data,
      "params": {
        "eSID": this.props.auth.user.companyID
      }
    }
    let response = await API.create('EMPLOYEE_QUERY').getEmployeeByEsid(payload)
    if (response.data && response.data.status === "S") {
      this.onFinishFetch()
      this.props.onChoose(response.data.data, "all")
    } else {
      this.onFinishFetch()
      alert("TIME OUT")
    }
  }

  getCountPage = async () => {
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('EMPLOYEE_QUERY').getCountEmployee(this.state.table_query)
      if (response.ok) {
        this.setState({ employeeCount: response.data.data })
      }
    } else {
      let res = await API.create('EMPLOYEE_QUERY').getCountAllEmployee()
      this.setState({ employeeCount: res.data.data })
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

  columns = [
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
                {photo ? (
                  <img width="100%" height="100%" src={photo} alt="img" style={{ verticalAlign: "middle", borderRadius: "50%", width: "50px", height: "50px", marginRight: 25 }} />
                ) : <i className="far fa-lw fa-user-circle" style={{ color: 'blue', marginRight: 10, fontSize: 44 }} />
                }
              </FlexView>
              <div style={{ fontWeight: 'bold', fontSize: 15 }}>
                {val}
              </div>
            </FlexView>
          );
        }
      }
    },
    "Branch",
    "Position",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                onClick={() => this.props.onChoose(this.state.rawData[tableMeta.rowIndex], "single")}
              >
                <i className="fa fa-1x fa-plus" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    let { employeeCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: employeeCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getData(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Employee - Search Form
              </div>
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

          <form action="#">
            <div className="padding-15px grid-mobile-none">
              <div className="margin-bottom-15px">
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    key={employeeCount}
                    title={"Employee List"}
                    subtitle={"lorem ipsum dolor"}
                    data={this.state.data}
                    columns={this.columns}
                    options={tableOptions}
                  />
                </MuiThemeProvider>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.form === "select" ?
                    <button
                      className="btn btn-blue"
                      type="button"
                      onClick={this.getDataAll.bind(this)}
                    >
                      <span>SELECT ALL</span>
                    </button> : null}
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

        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps)(employeeSearchForm);
