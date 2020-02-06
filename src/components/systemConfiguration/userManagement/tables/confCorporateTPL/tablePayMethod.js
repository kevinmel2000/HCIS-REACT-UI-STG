import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import EditPayMethod from "../../forms/edit/corGlobal/editPayMethod";
import PopUp from "../../../../pages/PopUpAlert";
import * as R from 'ramda'

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TablePayMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bizparSymbol: this.props.bizparSymbol,
      type: props.type,
      data: props.data,
      editVisible: false,
      deletePopUpVisible: false,
      dataTablePayment: [],
      selectedIndex: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      if (this.props.visible === true) {
        this.setState({ data: this.props.data });
        this.getData(this.props.data);
      } else {
        this.setState({
          data: [], dataTablePayment: []
        })
      }
    }
  }

  componentDidMount = () => this.getData(this.state.data);

  getData(data) {
    let { type } = this.state;
    console.log(data)
    if (type === "create") {
      data =
        typeof data.cglobalPolicyValue === "string"
          ? []
          : data.cglobalPolicyValue;
      let dataTablePayment = data.map((value, index) => {
        return [
          (index += 1),
          value.id,
          value.type,
          value.method,
          value.threshold.replace(/([~;])/g, "")
        ];
      });
      this.setState({ dataTablePayment });
    } else {
      data = JSON.parse(data.cglobalPolicyValue);
      let dataTablePayment = data.map((value, index) => {
        return [
          (index += 1),
          value.id,
          value.type,
          value.method,
          value.threshold.replace(/([~;])/g, "")
        ];
      });
      this.setState({ dataTablePayment });
    }
  }

  columns = [
    "No",
    "Method ID",
    "Payment Type",
    "Payment Method",
    "Threshold",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="grid grid-2x">
              <div className="column-1">
                <button
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  type="button"
                  onClick={() => this.openEdit(tableMeta.rowIndex)}
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
              </div>
              <div className="column-2">
                <button
                  className="btnAct"
                  type="button"
                  onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}
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
            </div>
          );
        }
      }
    }
  ];

  async openEdit(index) {
    this.setState({
      selectedIndex: index,
      editVisible: !this.state.editVisible
    });
  }

  openDeletePopUp = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  handleDelete() {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
    this.props.onClickDelete(this.state.selectedIndex);
  }

  close() {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }

  render() {
    let { data, dataTablePayment, selectedIndex, type } = this.state;
    return (
      <div>
        <div>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={dataTablePayment}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
        <div>
          {this.state.editVisible && (
            <EditPayMethod
              type={"update"}
              bizparSymbol={this.state.bizparSymbol}
              bizparPaymentMethod={this.props.bizparPaymentMethod}
              bizparPaymentType={this.props.bizparPaymentType}
              onClickSave={value => {
                this.props.onClickSave(value);
                this.setState({ editVisible: false });
              }}
              onClickClose={this.close.bind(this)}
              data={
                type === "create"
                  ? data.cglobalPolicyValue[selectedIndex]
                  : JSON.parse(data.cglobalPolicyValue)[selectedIndex]
              }
            />
          )}
        </div>
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={this.handleDelete.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TablePayMethod;
