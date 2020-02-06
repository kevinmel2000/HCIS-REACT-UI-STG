import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormOTDetail from "./formOTDetail";

var ct = require("../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormOTDO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false,
      viewVisible: false
    };
  }
  dataTable = [
    [
      "1",
      "Java Basic",
      "s1",
      "Basic 1",
      "Basic 2",
      "Basic 3",
      "Basic 4",
      "Basic 5",
      "Januari 2019",
      "DUMMY",
      "DUMMY",
      "DUMMY"
    ]
  ];
  //PopUp Add,Edit,Update Registration
  openCloseCreate() {
    this.setState({ createVisible: !this.state.createVisible });
  }

  openEdit = index => {
    this.setState({
      editVisible: !this.state.editVisible,
      selectedIndex: index
    });
  };

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  columns = [
    // {
    //   name: "No",
    //   options: {
    //     customBodyRender: (val, tableMeta) => {
    //       return (
    //         <div>
    //           <button
    //             style={{ cursor: "pointer", backgroundColor: "#fff" }}
    //             type="button"
    //             onClick={() => this.openCloseView(tableMeta.rowIndex)}
    //           >
    //             {val}
    //           </button>
    //         </div>
    //       );
    //     }
    //   }
    // },
    "No",
    "NIP",
    "Name",
    "Position",
    "Division",
    "Period",
    {
      name: <div style={{ float: "center" }}>Official Travel</div>,
      options: {
        filter: false,
        customHeadRender: columnMeta => (
          <th
            style={{
              cursor: "pointer",
              backgroundColor: "#F6F6F6",
              color: "#555555",
              fontSize: 12,
              fontWeight: 1
            }}
          >
            <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>
              {columnMeta.name}
            </div>
            <div
              className="grid grid-9x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Departure Date"}</div>
              <div className="col-2">{"Return Date"}</div>
              <div className="col-3">{"Destination"}</div>
              <div className="col-4">{"Transport Type"}</div>
              <div className="col-5">{"Transport Cost"}</div>
              <div className="col-6">{"Lodging Cost"}</div>
              <div className="col-7">{"Pocket Money"}</div>
              <div className="col-8">{"Local Transport"}</div>
              <div className="col-9">{"Total"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => {
          return (
            <div>
              <div className="grid grid-9x content-center">
                <div className="col-1">{val}</div>
                <div className="col-2">{val}</div>
                <div className="col-3">{val}</div>
                <div className="col-4">{val}</div>
                <div className="col-5">{val}</div>
                <div className="col-6">{val}</div>
                <div className="col-7">{val}</div>
                <div className="col-8">{val}</div>
                <div className="col-9">{val}</div>
              </div>
            </div>
          );
        }
      }
    },
    "Fee",
    "Sub Total",
    "PPN",
    "Total",
    "PPH",
    {
      name: "Total Cost",
      options: {
        customBodyRender: (val, tableMeta) => {
          return this.props.type !== "view" ? (
            <div>
              <button
                disabled={this.props.type === "view"}
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                type="button"
                onClick={this.openEdit}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                disabled={this.props.type === "view"}
                className="btn btn-red btn-small-circle"
                type="button"
                onClick={this.props.onClickDelete}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
              <button
              type="button  "
              className="btn btn-blue btn-small-circle"
              onClick={() => this.openCloseView(tableMeta.rowIndex)}
            >
              <i className="fa fa-lw fa-ellipsis-v" />
            </button>
            </div>
          ) : <button
          type="button  "
          className="btn btn-blue btn-small-circle"
          onClick={() => this.openCloseView(tableMeta.rowIndex)}
        >
          <i className="fa fa-lw fa-ellipsis-v" />
        </button>;
        }
      }
    }
  ];

  render() {
    return (
      <div className="c-n-content active" id="content-nav-1">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px">
          {this.props.type !== "view" ? (
            <div className="col-2 content-right margin-bottom-10px">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.openCloseCreate.bind(this)}
              >
                <i className="fa fa-plus" />
              </button>
            </div>
          ) : null}
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={this.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <FormOTDetail
            type={"create"}
            onSave={this.props.onClickSave}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormOTDetail
            type={"edit"}
            onSave={this.props.onClickSave}
            onClickClose={this.openEdit}
          />
        )}
        {this.state.viewVisible && (
          <FormOTDetail
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
          />
        )}
      </div>
    );
  }
}

// export default Pages;

export default FormOTDO;
