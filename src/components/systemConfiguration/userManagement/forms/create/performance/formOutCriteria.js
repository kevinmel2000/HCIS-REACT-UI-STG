import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import FormPerfPlan from "../../../forms/create/performance/formPerfPlan";
import FormPerfAppraisal from "../../../forms/create/performance/formPerfAppraisal";

import TablePerfPlan from "../../../tables/confPerformance/tblPerfPlan";
import TablePerfAppraisal from "../../../tables/confPerformance/tblPerfAppraisal";

const dataCreate = {
  "outputCriteriaValuationID": '',
  "activityPlanSection": '',
  "activityPlanWeightPerformance": '',
  "activityPlanCategory": '',
  "activityPlanDescription": "",
  "activityPlanWeight": '',
  "activityPlanUOM": '',
  "activityPlanPerformanceByTime": [],
  "activityPlanPerformanceAppraisalByTime": []
}

class FormOutCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPerfPlan: false,
      createPerfAppraisal: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataCreate, outputCriteriaValuationID: 'COMP-OUTCRITERIA-' + M() }
    };
  }

  handleDelete(index, type) {
    this.setState({
      deleteVisible: !this.state.deleteVisible, index,
      deleteType: type
    })
  }

  async handleSaveAppraisal(type, value) {
    let payload, index = ''
    let { data } = this.state
    let { activityPlanPerformanceAppraisalByTime } = data
    switch (type) {
      case 'create':
        activityPlanPerformanceAppraisalByTime.push(value)
        break;
      case 'update':
        index = R.findIndex(R.propEq('activityPlanPerformanceAppraisalID', value.activityPlanPerformanceAppraisalID))(activityPlanPerformanceAppraisalByTime)
        if (index >= 0) {
          activityPlanPerformanceAppraisalByTime[index] = value
        } else return alert('Data not found.')
        break;
      case 'delete':
        activityPlanPerformanceAppraisalByTime.splice(this.state.index, 1)
        break;
      default: break;
    }
    payload = {
      ...data,
      activityPlanPerformanceAppraisalByTime: activityPlanPerformanceAppraisalByTime
    }
    this.props.onClickSave('update', payload)
  }

  async handleSave(type, value) {
    let payload, index = ''
    let { data } = this.state
    let { activityPlanPerformanceByTime } = data
    switch (type) {
      case 'create':
        activityPlanPerformanceByTime.push(value)
        break;
      case 'update':
        index = R.findIndex(R.propEq('performancePlanID', value.performancePlanID))(activityPlanPerformanceByTime)
        if (index >= 0) {
          activityPlanPerformanceByTime[index] = value
        } else return alert('Data not found.')
        break;
      case 'delete':
        activityPlanPerformanceByTime.splice(this.state.index, 1)
        break;
      default: break;
    }
    payload = {
      ...data,
      activityPlanPerformanceByTime: activityPlanPerformanceByTime
    }
    this.props.onClickSave('update', payload)
  }

  componentDidMount() {
    let { data } = this.state
    if (data.activityPlanPerformanceByTime) {
      this.getTableActivityPlanPerformanceByTime(data)
    }
    if (data.activityPlanPerformanceAppraisalByTime) {
      this.getTableActivityPlanPerformanceAppraisalByTime(data)
    }
  }

  getTableActivityPlanPerformanceAppraisalByTime(value) {
    let { activityPlanPerformanceAppraisalByTime } = value
    let dataTableActivityPlanPerformanceAppraisalByTime = activityPlanPerformanceAppraisalByTime.map((value, index) => {
      const { activityPlanPerformanceAppraisalID, appraisalType, achievement } = value
      return [
        index += 1,
        activityPlanPerformanceAppraisalID,
        appraisalType ? appraisalType.bizparValue : 'Appraisal Name',
        achievement ? achievement.bizparValue : 'Achivement Name'
      ]
    })
    this.setState({ dataTableActivityPlanPerformanceAppraisalByTime, rawDataActivityPlanPerformanceAppraisalByTime: activityPlanPerformanceAppraisalByTime })
  }

  getTableActivityPlanPerformanceByTime(value) {
    let { activityPlanPerformanceByTime } = value
    let dataTableActivityPlanPerformanceByTime = activityPlanPerformanceByTime.map((value, index) => {
      const { performancePlanID, performancePlanComponent } = value
      return [
        index += 1,
        performancePlanID,
        performancePlanComponent ? performancePlanComponent.bizparValue : 'Component Name'
      ]
    })
    this.setState({ dataTableActivityPlanPerformanceByTime, rawDataActivityPlanPerformanceByTime: activityPlanPerformanceByTime })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editPerfPlan: false,
      editPerfAppraisal: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-perfPlan":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createPerfPlan: !this.state.createPerfPlan,
          savePopUpVisible
        });
        break;
      case "popup-perfApra":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createPerfAppraisal: !this.state.createPerfAppraisal,
          savePopUpVisible
        });
        break;
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
            id="navmenu-ior"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Performance Plan
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-ior">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-perfPlan")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createPerfPlan && (
            <FormPerfPlan
              type={"create"}
              bizparPerformancePlanComponent={this.props.bizparPerformancePlanComponent}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-perfPlan")}
            />
          )}
          <div className="app-open-close-content">
            <TablePerfPlan
              bizparPerformancePlanComponent={this.props.bizparPerformancePlanComponent}
              dataTable={this.state.dataTableActivityPlanPerformanceByTime}
              rawData={this.state.rawDataActivityPlanPerformanceByTime}
              onDeletePopUp={this.handleDelete.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-perfPlan")}
            />
          </div>
        </div>

        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-ipa"
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
              <label htmlFor="navmenu-ipa">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-perfApra")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createPerfAppraisal && (
            <FormPerfAppraisal
              type={"create"}
              bizparAppaItemComponent={this.props.bizparAppaItemComponent}
              bizparAchievement={this.props.bizparAchievement}
              bizparAppraisalType={this.props.bizparAppraisalType}
              onClickSave={this.handleSaveAppraisal.bind(this)}
              onClickClose={() => this.opPopupPage("popup-perfApra")}
            />
          )}
          <div className="app-open-close-content">
            <TablePerfAppraisal
              onDeletePopUp={this.handleDelete.bind(this)}
              bizparAppaItemComponent={this.props.bizparAppaItemComponent}
              bizparAchievement={this.props.bizparAchievement}
              bizparAppraisalType={this.props.bizparAppraisalType}
              rawData={this.state.rawDataActivityPlanPerformanceAppraisalByTime}
              dataTable={this.state.dataTableActivityPlanPerformanceAppraisalByTime}
              onClickSave={this.handleSaveAppraisal.bind(this)}
              onClickClose={() => this.opPopupPage("popup-perfApra")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparActivityPlanCategory, bizparActivityPlanSection } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: '170%' }}>
              <div className="popup-title">
                Output Criteria -{" "}
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
                  id="navmenu-ocr"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Output Criteria
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-ocr">
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
                          value={data.outputCriteriaValuationID}
                          style={{ backgroundColor: "#E6E6E6" }}
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                        />
                      </div>
                      {/* <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Criteria Name</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select name --"
                          type="bizpar"
                          disabled
                          data={[]}
                        />
                      </div> */}
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
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Component Category</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select category --"
                          type="bizpar"
                          data={bizparActivityPlanCategory}
                          value={data.activityPlanCategory ? data.activityPlanCategory.bizparKey : ''}
                          onChange={e => this.setState({ data: { ...data, activityPlanCategory: e } })}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Activity Plan</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select activity plan --"
                          type="bizpar"
                          data={bizparActivityPlanSection}
                          value={data.activityPlanSection ? data.activityPlanSection.bizparKey : ''}
                          onChange={e => this.setState({ data: { ...data, activityPlanSection: e } })}
                        />
                        {/* <input
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                        /> */}
                      </div>
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Weight Item</h4>
                          </div>
                        </div>
                        <input
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={data.activityPlanWeight}
                          onChange={e => this.setState({ data: { ...data, activityPlanWeight: e.target.value } })}
                        />
                      </div>
                      <div className="margin-bottom-15px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>UoM Item</h4>
                          </div>
                        </div>
                        <input
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={data.activityPlanUOM}
                          onChange={e => this.setState({ data: { ...data, activityPlanUOM: e.target.value } })}
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
          // onClick={() => this.opPopupPage("popup-criVal")}
          />
        )}
        {this.state.deleteVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.handleDelete(null)}
            onClickDelete={
              this.state.deleteType === 'perf' ? () => this.handleSave('delete') : () => this.handleSaveAppraisal('delete')
            }
          />
        )}
      </div>
    );
  }
}

export default FormOutCriteria;
