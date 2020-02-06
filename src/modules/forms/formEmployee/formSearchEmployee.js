import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import FlexView from "react-flexview"
import * as R from "ramda"
import API from "../../../Services/Api"

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class formSearchEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      rawData: [],
      auth: props.auth,
      employeeCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: ""
    };
  }

  componentDidMount() {
    this.startFetch();
    if (this.props.type === "head") {
      this.getHead();
    } else {
      this.getData(this.state.table_page, this.state.table_limit)
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getHead() {
    let payload = {
      offset: 0,
      limit: 50,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeHead(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            if (res.data.data !== null) {
              let dataTable = res.data.data.map(value => {
                const { employeeName, company, position } = value;
                return [
                  employeeName ? employeeName : "",
                  company ? company.esname : "",
                  position ? position.ouposition.bizparValue : ""
                ];
              });
              this.setState({
                rawData: res.data.data,
                dataTable
              });
            } else {
              alert(res.data.message);
            }
          } else {
            alert("Failed: " + res.data.message);
          }
        }
      });
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
      let dataTable = response.data.data.map((item, index) => {
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
      this.setState({ dataTable, rawData, imageUser })
    }
    this.getCountPage()
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
              <div style={{ fontWeight: "bold", fontSize: 15 }}>{val}</div>
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
                onClick={() =>
                  this.props.onClickEmp(tableMeta.rowIndex, this.state.rawData)
                }
                className={"btn btn-blue btn-small-circle"}
              >
                <i className={"fa fa-lw fa-plus"} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [
    ["Employee Name1", "Branch Position1", "Employee Position1"],

    ["Employee Name2", "Branch Position2", "Employee Position2"]
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
      <div className="app-popup app-popup-show">
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
                style={{ marginLeft: "15px" }}
                className="btn btn-circle btn-grey"
                type="button"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times"></i>
              </button>
            </div>
          </div>
          <div className="padding-15px border-bottom">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                key={employeeCount}
                title={"Employee List"}
                data={this.state.dataTable}
                columns={this.columns}
                options={tableOptions}
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
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="padding-bottom-20px"></div>
      </div>
    );
  }
}

export default formSearchEmployee
