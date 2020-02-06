import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import Api from "../../../../Services/Api";
import * as R from "ramda";

var ct = require("../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class TableTalent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      allowanceCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    };
  }

  componentDidMount() {
    this.getData(this.state.table_page, this.state.table_limit)
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        dataTable: this.props.data
      })
    }
  }

  getData(page, limit) {
    console.log(page, limit, this.state.table_query)
    if (!R.isEmpty(this.state.table_query)) {
      let body = {
        "params": {
          "cNBComponentAllowanceName": this.state.table_query
        },
        "offset": page,
        "limit": limit
      }
      Api.create('CFG').getCountComponentAllowanceByName(this.state.table_query).then((response) => {
        this.setState({
          allowanceCount: response.data.data
        })
      })
      Api.create('CFG').getComponentAllowanceByName(body).then((res) => {
        if (res.data.code === "201") {
          let dataTable = res.data.data.map((item, index) => {
            return [
              index += 1,
              item.cnbcomponentAllowanceName,
              item.cnbcomponentAllowanceType,
              item.cnbcomponentName,
              item.cnbcomponentKey,
              item.cnbcomponentGrade.bizparValue,
              String(new Intl.NumberFormat("ID", { style: "currency", currency: "IDR" }).format(item.cnbcomponentAmount)),
              item.cnbcomponentAllowanceStatus === "ACTIVE" ? "YES" : "NO"
            ]
          })
          setTimeout(() => {
            this.setState({
              dataTable, rawData: res.data.data
            })
          }, 200);

        }
      })
    } else {
      let body = {
        "params": {
          "cNBComponentAllowanceStatus": "ACTIVE"
        },
        "offset": page,
        "limit": limit
      }
      Api.create('CFG').getCountComponentAllowanceByStatus("ACTIVE").then((response) => {
        this.setState({
          allowanceCount: response.data.data
        })
      })
      Api.create('CFG').getAllComponentAllowanceByStatus(body).then((res) => {
        if (res.data.code === "201") {
          let dataTable = res.data.data.map((item, index) => {
            return [
              index += 1,
              item.cnbcomponentAllowanceName,
              item.cnbcomponentAllowanceType,
              item.cnbcomponentName,
              item.cnbcomponentKey,
              item.cnbcomponentGrade.bizparValue,
              String(new Intl.NumberFormat("ID", { style: "currency", currency: "IDR" }).format(item.cnbcomponentAmount)),
              item.cnbcomponentAllowanceStatus === "ACTIVE" ? "YES" : "NO"
            ]
          })
          setTimeout(() => {
            this.setState({
              dataTable, rawData: res.data.data
            }, () => console.log(this.state.dataTable))
          }, 200);

        }
      })
    }
  }

  columns = [
    "No",
    "Name",
    "Component Type",
    "Component Name",
    "Component Key",
    "Grade",
    "Amount",
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
                style={{ marginRight: 10 }}
                type="button"
                onClick={this.props.openSlide(
                  "slide-talent",
                  this.state.rawData[tableMeta.rowIndex]
                )}
              >
                <i
                  className="fa fa-lw fa-pencil-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
              <button
                className="btnAct"
                type="button"
                onClick={() => this.props.onDeletePopup(this.state.rawData[tableMeta.rowIndex])}
              >
                <i
                  className="fa fa-lw fa-trash-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    fontSize: 20
                  }}
                />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    let { allowanceCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: allowanceCount,
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
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            key={allowanceCount}
            title={"C&B Component Allowance"}
            subtitle={"lorem ipsum dolor"}
            data={this.state.dataTable}
            columns={this.columns}
            options={tableOptions}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
export default TableTalent;
