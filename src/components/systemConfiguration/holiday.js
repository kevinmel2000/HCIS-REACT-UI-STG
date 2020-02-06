import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormHoliday from "../../modules/forms/formHoliday";
import PopUp from "../pages/PopUpAlert";

var ct = require("../../modules/custom/customTable");
const proxyurl = "https://cors-anywhere.herokuapp.com/";
var today = new Date();
var date =
  today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + " " + time;
console.log(dateTime);

class Pages extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      uploadClass: "app-popup",
      createClass: "app-popup",
      type: "create",
      updateClass: "app-popup",
      saveClass: "app-popup",
      deleteClass: "app-popup",
      dataHolidayStatus: [],
      selectedIndex: [],
      rawData: [],
      dataTable: [],
      holidayData : this.defaultHoliday,
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  defaultHoliday = {
    holidayID: "H - "+ Date.now(),
    holidayDate: "",
    holidayType: {
      bizparKey: ""
    },
    description:"",
    holidaySettingStatus:"ACTIVE"
  };

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  removeChange = () => {
    this.setState({
      file: null
    });
  };

  openUpload = () => {
    if (this.state.uploadClass === "app-popup app-popup-show") {
      this.setState({ uploadClass: "app-popup" });
    } else {
      this.setState({ uploadClass: "app-popup app-popup-show" });
    }
  };

  openCreateForm = (type = "create", index) => {
    if (this.state.createClass === "app-popup app-popup-show") {
      this.setState({ createClass: "app-popup", type, selectedIndex: null });
    } else {
      let holidayData = typeof index === "number" ? this.state.rawData[index] : null;
      this.setState({
        createClass: "app-popup app-popup-show",
        type,
        selectedIndex: index,
        holidayData: type === 'create' ? this.defaultHoliday : holidayData
      });
    }
  };

  openSavePopUp = () => {
    if (this.state.saveClass === "app-popup app-popup-show") {
      this.setState({ saveClass: "app-popup" });
      window.location.reload();
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = index => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
      window.location.reload();
    } else {
      this.setState({
        deleteClass: "app-popup app-popup-show",
        selectedIndex: index
      });
    }
  };

  opDeleteAble = () => {
    alert("delete");
  };

  componentDidMount() {
    this.startFetch();
    this.getDataHoliday();
    this.getDataHolidayStatus();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getDataHoliday() {
    fetch(
      proxyurl + "http://epx.eksadpro.io/masterdata/get.holidaySetting.by.status",
      {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        },
        body: JSON.stringify({
          params: {
            holidaySettingStatus: "ACTIVE"
          },
          offset: 0,
          limit: 10
        })
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.onFinishFetch();
        let dataTable = responseJson.data.map((value, index) => {
          const { holidayID, holidayDate, holidayType, description, holidaySettingStatus } = value;
          return [holidayID, holidayDate, holidayType.bizparValue, description, holidaySettingStatus];
        });

        this.setState({
          rawData: responseJson.data,
          dataTable
        });
      });
  }

  getDataHolidayStatus() {
    fetch(proxyurl + "http://epx.eksadpro.io/bizpar/get.bizpar.by.category", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
      },
      body: JSON.stringify({
        params: {
          bizparCategory: "HOLIDAY_STATUS"
        },
        offset: 0,
        limit: 5
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("holidayStatus", responseJson);
        this.setState({
          dataHolidayStatus: responseJson.data
        });
      });
  }

  postHoliday() {
    fetch(proxyurl + 'http://epx.eksadpro.io/masterdata/post.holidaySetting', {
      method: 'POST',
      mode: "cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      },
      body: JSON.stringify({
        "holidayID": this.state.holidayData.holidayID,
        "holidayDate" : this.state.holidayData.holidayDate,
        "holidayType" : this.state.holidayData.holidayType.bizparKey,
        "description" : this.state.holidayData.description,
        "holidaySettingStatus": "ACTIVE",
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.openSavePopUp()
    })
  }

  updateHoliday() {
    fetch(proxyurl + 'http://epx.eksadpro.io/masterdata/update.holidaySetting', {
      method: 'PUT',
      mode: "cors",
      headers: {
        'Accept': 'application/json',
        "Content-type": "application/json; charset=UTF-8",
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      },
      body: JSON.stringify({
        "holidayID": this.state.rawData[this.state.selectedIndex].holidayID,
        "holidayDate": this.state.holidayData.holidayDate,
        "holidayType": this.state.holidayData.holidayType.bizparKey,
        "description" : this.state.holidayData.description,
        "holidayStatus": this.state.holidayData.holidaySettingStatus
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.openSavePopUp()
    })
  }


  deleteDataHoliday() {
    fetch(proxyurl + "http://epx.eksadpro.io/masterdata/delete.holidaySetting", {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
      },
      body: JSON.stringify({
        referenceID: this.state.rawData[this.state.selectedIndex].holidayID,
        requestBy: "ADMIN",
        requestDate: dateTime
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ deleteClass: "app-popup" });
      });
  }

  handleSubmit(){
    this.postHoliday();
  }

  handleUpdate(){
    this.updateHoliday();
  }

  handleDelete() {
    this.deleteDataHoliday();
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    {
      name: "Holiday Setting ID",
      options: {
        customBodyRender: (val,tableMeta) => {
          return (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openCreateForm("view",tableMeta.rowIndex)}
              >
                {val}
              </div>
            </div>
          );
        }
      }
    },
    "Holiday Date",
    "Holiday Status",
    "Description",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openCreateForm("update", tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                className="btn btn-red btn-small-circle"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [
    ["HD-001", "12-06-2019", "LIBUR NASIONAL", "Hari ulang tahun Indonesia"],
    ["HD-002", "01-01-2019", "LIBUR NASIONAL", "Tahun Baru"]
  ];

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              Holiday Setting
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={() => this.openCreateForm("create")}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={this.openUpload}
            >
              <i className="fa fa-1x fa-upload" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.state.dataTable}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        <FormHoliday
          className={this.state.createClass}
          type={this.state.type}
          onClickClose={this.openCreateForm}
          onClickSave={this.state.type === 'create' ? this.handleSubmit : this.handleUpdate}
          onClickDelete={this.openDeletePopup}
          selectedIndex={this.state.selectedIndex}
          rawData={this.state.rawData}
          dataHolidayStatus={this.state.dataHolidayStatus}
          valueHolidayID={this.state.holidayData.holidayID}
          valueHolidayDate={this.state.holidayData.holidayDate}
          valueDescription={this.state.holidayData.description}
          selectedHoliday={this.state.holidayData.holidayType.bizparKey}
          valueStatus = {this.state.holidayData.holidaySettingStatus === 'ACTIVE' ? true : false}
          onChange={(e) => {
            let holidayData = JSON.stringify(this.state.holidayData)
            holidayData = JSON.parse(holidayData)
            holidayData.holidayType.bizparKey = e.target.value
            this.setState({ holidayData }, console.log(this.state.holidayData))
          }}
          onChangeHolidayDate={(e) => {
            let holidayData = JSON.stringify(this.state.holidayData)
            holidayData = JSON.parse(holidayData)
            holidayData.holidayDate = e.target.value
            this.setState({ holidayData })
          }}
          onChangeDescription={(e) => {
            let holidayData = JSON.stringify(this.state.holidayData)
            holidayData = JSON.parse(holidayData)
            holidayData.description = e.target.value
            this.setState({ holidayData })
          }}
        />

        <PopUp
          type={"save"}
          class={this.state.saveClass}
          onClick={this.handleSubmit}

        />
        <PopUp
          type={"delete"}
          class={this.state.deleteClass}
          onClick={this.openDeletePopup}
          onClickDelete={this.handleDelete}
        />
        <PopUp
          type={"upload"}
          class={this.state.uploadClass}
          onClick={this.openUpload}
          file={this.state.file}
          title={"Employee - Upload Form"}
          onChange={this.handleChange}
          removeChange={this.removeChange}
        />
      </div>
    );
  }
}

export default Pages;