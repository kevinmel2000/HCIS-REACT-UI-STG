import React, { Component } from "react";
import FormSearchTraining from "../formSearchTraining";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormRequirement from "../../../../modules/forms/formTraining/TrainingSchedule/formTrainingRequirement";
import FormParticipant from "../../../../modules/forms/formTraining/TrainingSchedule/formTrainingParticipant";
import FormPeriod from "../../../../modules/forms/formTraining/TrainingSchedule/formTrainingPeriod";
import DropDown from "../../../../modules/popup/DropDown";

class ScheduleCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false,
      savePopUpVisible: false,
      formRequirementVisible: true,
      formParticipantVisible: false,
      formPeriodeVisible: false,
      activeTab: "",
      tabMenu: ["Requirement", "Participant", "Periode"]
    };
  }

  handleUpdate = () => {
    this.openSavePopUp();
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openSearchForm = () => {
    this.setState({ searchVisible: !this.state.searchVisible });
  };

  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formRequirementVisible: false,
      formParticipantVisible: false,
      formPeriodeVisible: false,
      activeTab: title
    };
    switch (title) {
      case "Requirement":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formRequirementVisible: true
        };
        break;
      case "Participant":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formParticipantVisible: true
        };
        break;
      case "Periode":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPeriodeVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
            <div className="column-1">
              {/* <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Training Name
                      {this.props.type === "create" ? (
                        <span style={{ color: "red" }}>*</span>
                      ) : null}
                    </h4>
                  </div>
                </div>
                <input
                  style={{ backgroundColor: "#E6E6E6", width: "84%" }}
                  className="txt txt-sekunder-color"
                  type="text"
                  readOnly
                  placeholder=""
                ></input>
                <button
                  disabled={this.props.type === "create" ? false : true}
                  className={"btn btn-circle background-primary"}
                  type="button"
                  style={{ marginLeft: 10 }}
                  onClick={this.openSearchForm}
                >
                  <i className="fa fa-lg fa-search"></i>
                </button>
              </div> */}
              <div className="card-date-picker" style={{ marginBottom: 17 }}>
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Training Name <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <div className="double">
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    className='input'
                    type="text"
                    required
                  />
                  <button
                    disabled={this.props.type === "create" ? false : true}
                    type="button"
                    className="btn btn-grey border-left btn-no-radius"
                    onClick={this.openSearchForm}
                  >
                    <i className="fa fa-lg fa-search"></i>
                  </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Year <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select year --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  // disabled={this.props.type === "update" ? true : false}
                  data={[
                    { id: "1", title: "2019", value: "2019" },
                    { id: "2", title: "2020", value: "2020" }
                  ]}
                />
                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    required
                                >
                                    <option value="1"></option>
                                    <option value="1">2019</option>
                                </select>*/}
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Participant Quota per Activity{" "}
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Annual Quota Participant{" "}
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>

          {this.props.type !== "create" ? (
            <div className="display-flex-normal">
              <div className="width width-300px">
                <ul className="vertical-tab">
                  {this.state.tabMenu.map((data, index) => {
                    return this.opNavigator(data, index);
                  })}
                </ul>
              </div>
              <div className="width width-full">
                {this.state.formRequirementVisible && (
                  <FormRequirement
                    onClickClose={this.props.onClickClose}
                    onClickSave={this.openSavePopUp}
                  />
                )}
                {this.state.formParticipantVisible && (
                  <FormParticipant onClickClose={this.props.onClickClose} />
                )}
                {this.state.formPeriodeVisible && (
                  <FormPeriod onClickClose={this.props.onClickClose} />
                )}
              </div>
            </div>
          ) : null}
          {this.props.type === "create" ? (
            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={this.props.onClickSave}
                  >
                    <span>SAVE</span>
                  </button>
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
          ) : null}

          {this.state.searchVisible && (
            <FormSearchTraining onClickClose={this.openSearchForm} />
          )}

          {this.state.savePopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.openSavePopUp}
            />
          )}
        </form>
      </div>
    );
  }
}

export default ScheduleCreate;
