import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import FormProApp from "../../../forms/create/performance/formProAppraisal";

import TableProCriApp from "../../../tables/confPerformance/tblProCriApp";

const dataCreate = {
  "outputCriteriaProcessValuationID": "",
  "activityPlanSection": '',
  "activityPlanWeightPerformance": '',
  "subCriteria": {
    "outputCriteriaProcessValuationSubcriteriaID": '',
    "criteriaCategory": '',
    "criteriaExplanation": ''
  },
  "ocpvAppraisalByTime": []
}

class FormProCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createProCriApp: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : {
        ...dataCreate,
        outputCriteriaProcessValuationID: 'COMP-PROC-' + M(),
        subCriteria: { ...dataCreate.subCriteria, outputCriteriaProcessValuationSubcriteriaID: 'COMP-PROC-SUB-' + M() + M() }
      }
    };
  }

  handleDelete(index) {
    this.setState({
      deleteVisible: !this.state.deleteVisible, index
    })
  }

  async handleSave(type, value) {
    let payload, index = ''
    let { data } = this.state
    let ocpvAppraisalByTime = !data.ocpvAppraisalByTime ? [] : data.ocpvAppraisalByTime.map((data) => {
      const { outputCriteriaProcessValuationAppraisalID, performanceWeight, performanceType, performanceValue } = data
      let detailsPerformanceValue = !performanceValue ? [] : performanceValue.map((valueDetailPerf) => {
        const { ocpvaItemID, ocpvaItemComponent, ocpvaItemValue } = valueDetailPerf
        return {
          ocpvaItemID: ocpvaItemID,
          ocpvaItemValue: ocpvaItemValue,
          ocpvaItemComponent: ocpvaItemComponent ? ocpvaItemComponent.bizparKey ? ocpvaItemComponent.bizparKey : ocpvaItemComponent : '',
        }
      })
      return {
        outputCriteriaProcessValuationAppraisalID: outputCriteriaProcessValuationAppraisalID,
        performanceWeight: performanceWeight,
        performanceType: performanceType ? performanceType.bizparKey ? performanceType.bizparKey : performanceType : '',
        performanceValue: detailsPerformanceValue
      }
    })
    switch (type) {
      case 'create':
        ocpvAppraisalByTime.push(value)
        break;
      case 'update':
        let data = {
          ...value,
          performanceType: value.performanceType ? value.performanceType.bizparKey ? value.performanceType.bizparKey : value.performanceType : '',
        }
        index = R.findIndex(R.propEq('outputCriteriaProcessValuationAppraisalID', value.outputCriteriaProcessValuationAppraisalID))(ocpvAppraisalByTime)
        if (index >= 0) {
          ocpvAppraisalByTime[index] = data
        } else return alert('Data not found.')
        break;
      case 'delete':
        ocpvAppraisalByTime.splice(this.state.index, 1)
        break;
      default: break;
    }
    payload = {
      ...data,
      ocpvAppraisalByTime: ocpvAppraisalByTime
    }
    this.props.onClickSave('update', payload)
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { ocpvAppraisalByTime } = this.state.data
    let dataTable = !ocpvAppraisalByTime ? [] : ocpvAppraisalByTime.map((value, index) => {
      const { outputCriteriaProcessValuationAppraisalID, performanceType, performanceWeight } = value
      return [
        index += 1,
        outputCriteriaProcessValuationAppraisalID,
        performanceType ? performanceType.bizparValue : 'Component Type',
        performanceWeight
      ]
    })
    this.setState({ dataTable, rawData: ocpvAppraisalByTime })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editProApp: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-proApp":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createProCriApp: !this.state.createProCriApp,
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
            id="navmenu-par"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Process Appraisal
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-par">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-proApp")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createProCriApp && (
            <FormProApp
              type={"create"}
              bizparPerformaceValue={this.props.bizparPerformaceValue}
              bizparPerformaceType={this.props.bizparPerformaceType}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-proApp")}
            />
          )}
          <div className="app-open-close-content">
            <TableProCriApp
              rawData={this.state.rawData}
              dataTable={this.state.dataTable}
              bizparPerformaceValue={this.props.bizparPerformaceValue}
              bizparPerformaceType={this.props.bizparPerformaceType}
              onDeletePopUp={this.handleDelete.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-proApp")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparCriteriaCategory, bizparPerformaceType, bizparPerformaceValue, bizparActivityPlanSection } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Process Criteria -{" "}
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
                  id="navmenu-pcl"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Process Criteria
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-pcl">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="column-1">
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Component ID</h4>
                          </div>
                        </div>
                        <input
                          readOnly
                          value={data.outputCriteriaProcessValuationID}
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
                            <h4>Criteria Name</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select name --"
                          type="bizpar"
                          disabled={type !== 'create'}
                          data={bizparActivityPlanSection}
                          value={data.activityPlanSection ? data.activityPlanSection.bizparKey : ''}
                          onChange={e => this.setState({ data: { ...data, activityPlanSection: e } })}
                        />
                      </div>
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Weight</h4>
                          </div>
                        </div>
                        <input
                          readOnly={type !== 'create'}
                          style={{ backgroundColor: type !== 'create' && "#E6E6E6" }}
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={data.activityPlanWeightPerformance}
                          onChange={e => this.setState({ data: { ...data, activityPlanWeightPerformance: e.target.value } })}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Component Category</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select category --"
                          type="bizpar"
                          data={bizparCriteriaCategory}
                          value={data.subCriteria.criteriaCategory ? data.subCriteria.criteriaCategory.bizparKey : ''}
                          onChange={e => this.setState({
                            data: {
                              ...data, subCriteria: {
                                ...data.subCriteria, criteriaCategory: e
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Category Description
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <textarea
                          style={
                            this.props.type === "view"
                              ? { backgroundColor: "#E6E6E6" }
                              : null
                          }
                          readOnly={this.props.type === "view"}
                          type="text"
                          className="txt txt-sekunder-color"
                          rows={5}
                          placeholder={""}
                          value={data.subCriteria.criteriaExplanation}
                          onChange={e => this.setState({
                            data: {
                              ...data, subCriteria: {
                                ...data.subCriteria, criteriaExplanation: e.target.value
                              }
                            }
                          })}
                        />
                      </div>
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
        {this.state.deleteVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.handleDelete(null)}
            onClickDelete={() => this.handleSave('delete')}
          />
        )}
      </div>
    );
  }
}

export default FormProCriteria;
