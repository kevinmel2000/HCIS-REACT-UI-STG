import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import FormQuestion from "../../modules/forms/formTraining/questionDetail";
import FormScore from "../../modules/forms/formTraining/scoreDetail";

var ct = require("../../modules/custom/customTable");

class FacEval extends Component {
  constructor() {
    super();
    this.state = {
      detailQuestionVisible: false,
      detailScoreVisible: false,
      
      deletePopUpVisible: false,
      savePopUpVisible: false
    };
  }

  openQuestionDetailForm = () => {
    this.setState({
      detailQuestionVisible: !this.state.detailQuestionVisible,
    });
  };

  openScoreDetailForm = index => {
    this.setState({
      detailScoreVisible: !this.state.detailScoreVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "Training Name",
    {
      name: "Question",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openQuestionDetailForm(tableMeta.rowIndex)}
              >
                {val}
              </div>
            </div>
          );
        }
      }
    },
    {
      name: "Score",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openScoreDetailForm(tableMeta.rowIndex)}
              >
                {val}
              </div>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "Java", "3", "100"], ["2", "PHP", "2", "100"]];

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title='Training Facilitator Evaluation'
              subtitle={'lorem ipsum dolor'}
              data={this.data}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.detailQuestionVisible && (
          <FormQuestion onClickClose={this.openQuestionDetailForm} />
        )}

        {this.state.detailScoreVisible && (
          <FormScore onClickClose={this.openScoreDetailForm} />
        )}

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp.bind(this)}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup}
          />
        )}
      </div>
    );
  }
}

export default FacEval;
