import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from "../../../Services/Api";
import M from "moment";

var ct = require("../../custom/customTable");

class FormTrainingCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawData: []
    };
  }

  getDataTraining() {
    let payload = {
      limit: 100,
      offset: 0,
      params: {
        employeeID: this.props.employeeID
      }
    };
    console.log(this.props.employeeID);
    API.create("TRAINING_QUERY")
      .getTrainingRequestById(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            let rawData = res.data.data.map(data => {
              return {
                ...data,
                trainingType: data.trainingID.trainingID,
                trainingName: data.trainingID.trainingName,
                trainingStartDate: M(
                  data.trainingID.trainingStartDate,
                  "DD-MM-YYYY"
                ).format("YYYY-MM-DD"),
                trainingEndDate: M(
                  data.trainingID.trainingEndDate,
                  "DD-MM-YYYY"
                ).format("YYYY-MM-DD"),
                trainingInstitutions: data.trainingID.trainingID
              };
            });
            this.setState({
              rawData
            });
          }
        }
      });
  }

  componentDidMount() {
    this.onFinishFetch();
    this.getDataTraining();
    console.log(this.state.rawData);
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "Training Type",
    "Training Name",
    "Start Training",
    "End Training",
    "Institutions"
  ];

  render() {
    let dataTable = this.state.rawData.map((value, index) => {
      const {
        trainingType,
        trainingName,
        trainingStartDate,
        trainingEndDate,
        trainingInstitutions
      } = value;

      return [
        (index += 1),
        trainingType,
        trainingName,
        trainingStartDate,
        trainingEndDate,
        trainingInstitutions
      ];
    });

    return (
      <div className="vertical-tab-content active">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <form action="#">
          <div className="padding-10px  grid-mobile-none gap-20px">
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title={"Training"}
                subtitle={"lorem ipsum dolor"}
                data={dataTable}
                columns={this.columns}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>
      </div>
    );
  }
}

export default FormTrainingCertificate;
