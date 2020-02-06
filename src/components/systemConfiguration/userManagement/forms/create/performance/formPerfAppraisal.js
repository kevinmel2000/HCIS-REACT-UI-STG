import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import FormPerfAppraisalComp from "../../../forms/create/performance/formPerfAppraisalComp";

import TablePerfAppraisalComp from "../../../tables/confPerformance/tblPerfAppraisalComp";

const dataCreate = {
  "activityPlanPerformanceAppraisalID": '',
  "appraisalType": '',
  "achievement": '',
  "achievementValue": '',
  "performanceValue": []
}

class FormPerfAppraisal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAppraisalComp: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataCreate, activityPlanPerformanceAppraisalID: 'PERF-APPRAISAL-COMP-' + M() }
    };
  }

  handleDelete(index, type) {
    this.setState({
      deleteVisible: !this.state.deleteVisible, index,
      deleteType: type
    })
  }

  async handleSave(type, value) {
    let payload, index = ''
    let { data } = this.state
    let { performanceValue } = data
    switch (type) {
      case 'create':
        performanceValue.push(value)
        break;
      case 'update':
        index = R.findIndex(R.propEq('appaItemID', value.appaItemID))(performanceValue)
        if (index >= 0) {
          performanceValue[index] = value
        } else return alert('Data not found.')
        break;
      case 'delete':
        performanceValue.splice(this.state.index, 1)
        break;
      default: break;
    }
    payload = {
      ...data,
      performanceValue: performanceValue
    }
    this.props.onClickSave('update', payload)
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { performanceValue } = this.state.data
    let dataTable = !performanceValue ? [] : performanceValue.map((value, index) => {
      const { appaItemID, appaItemComponent } = value
      return [
        index += 1,
        appaItemID,
        appaItemComponent ? appaItemComponent.bizparValue : 'Component Name'
      ]
    })
    console.log('dataTable', dataTable)
    this.setState({ dataTable, rawData: performanceValue })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editAppraisalComp: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-appComp":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createAppraisalComp: !this.state.createAppraisalComp,
          savePopUpVisible
        });
      default:
        break;
    }
  };

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible
    });
  };

  renderFormEdit = () => {
    return (
      <div className="padding-10px">
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-pal"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Appraisal Component Value
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-pal">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-appComp")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createAppraisalComp && (
            <FormPerfAppraisalComp
              type={"create"}
              bizparAppaItemComponent={this.props.bizparAppaItemComponent}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-appComp")}
            />
          )}
          <div className="app-open-close-content">
            <TablePerfAppraisalComp
              onDeletePopUp={this.handleDelete.bind(this)}
              bizparAppaItemComponent={this.props.bizparAppaItemComponent}
              dataTable={this.state.dataTable}
              rawData={this.state.rawData}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-appComp")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparAppraisalType, bizparAchievement } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: '170%' }}>
              <div className="popup-title">
                Performance Appraisal -{" "}
                {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
            <div className="padding-10px">
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-pald"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Performance Appraisal
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-pald">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px">
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Component ID</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        value={data.activityPlanPerformanceAppraisalID}
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Component Type</h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select component --"
                        type="bizpar"
                        disabled={type !== 'create'}
                        value={data.appraisalType ? data.appraisalType.bizparKey : ''}
                        data={bizparAppraisalType}
                        onChange={e => this.setState({ data: { ...data, appraisalType: e } })}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Achievement Type{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select achievement --"
                        type="bizpar"
                        data={bizparAchievement}
                        value={data.achievement ? data.achievement.bizparKey : ''}
                        onChange={e => this.setState({ data: { ...data, achievement: e } })}
                      />
                    </div>
                  </div>

                  <div className="border-top padding-15px content-right">
                    <button
                      type="button"
                      onClick={this.props.onClickClose}
                      className="btn btn-primary margin-right-10px"
                    >
                      BACK
                    </button>
                    <button
                      className="btn btn-blue"
                      type="button"
                      onClick={() => this.props.onClickSave(type, data)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {type === "update" ? this.renderFormEdit() : null}
          </form>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-criVal")}
          />
        )}
      </div>
    );
  }
}

export default FormPerfAppraisal;
