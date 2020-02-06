import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import FormIPPComSectionDetail from "../../../forms/create/performance/formIppComSectionDetail";
import TableIppComSectionEdit from "../../../tables/confPerformance/tableIppComSectionEdit";

const dataDefault = {
  computeID: '',
  computeType: '',
  computeCriterias: [],
  paYear: "",
  gradePerformance: ""
}

class FormCompHeadCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createCriteriaVal: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataDefault, computeID: 'COMP-COMPUTE-' + M() }
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
    let computeCriterias = !data.computeCriterias ? [] : data.computeCriterias.map((data) => {
      const { computeItemID, criteria, weight, value, totalValue } = data
      return {
        computeItemID: computeItemID,
        criteria: criteria ? criteria.bizparKey ? criteria.bizparKey : criteria : '',
        weight: weight,
        value: value,
        totalValue: totalValue
      }
    })
    switch (type) {
      case 'create':
        computeCriterias.push(value)
        break;
      case 'update':
        let data = {
          ...value,
          criteria: value.criteria ? value.criteria.bizparKey ? value.criteria.bizparKey : value.criteria : '',
        }
        index = R.findIndex(R.propEq('computeItemID', value.computeItemID))(computeCriterias)
        if (index >= 0) {
          computeCriterias[index] = data
        } else return alert('Data not found.')
        break;
      case 'delete':
        computeCriterias.splice(this.state.index, 1)
        break;
      default: break;
    }
    payload = {
      ...data,
      computeCriterias: computeCriterias
    }
    this.props.onClickSave('update', payload)
  }

  componentDidMount() {
    let { computeCriterias } = this.state.data
    let dataTable = !computeCriterias ? [] : computeCriterias.map((data, index) => {
      const { criteria, weight, value, totalValue } = data
      return [
        index += 1,
        criteria ? criteria.bizparValue : 'Component Name',
        weight,
        value,
        totalValue
      ]
    })
    this.setState({ dataTable, rawData: computeCriterias })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editCriteriaVal: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-criVal":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createCriteriaVal: !this.state.createCriteriaVal,
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
            id="navmenu-ics"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">Criteria Value</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-ics">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-criVal")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createCriteriaVal && (
            <FormIPPComSectionDetail
              type={"create"}
              bizparActivityPlanSection={this.props.bizparActivityPlanSection}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-criVal")}
            />
          )}
          <div className="app-open-close-content">
            <TableIppComSectionEdit
              bizparActivityPlanSection={this.props.bizparActivityPlanSection}
              dataTable={this.state.dataTable}
              rawData={this.state.rawData}
              onClick={this.props.onDeletePopup}
              onClickDelete={this.handleDelete.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-criVal")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparComputeType, bizparCorporateGrade } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Compute Section -{" "}
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
                  id="navmenu-cc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Compute Section Detail
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="column-1">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Component ID</h4>
                          </div>
                        </div>
                        <input
                          readOnly
                          value={data.computeID}
                          style={{ backgroundColor: "#E6E6E6" }}
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
                              Component Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select type --"
                          type="bizpar"
                          disabled={this.props.type === "view" ? true : false}
                          data={bizparComputeType}
                          value={data.computeType ? data.computeType.bizparKey : ''}
                          onChange={e => this.setState({ data: { ...data, computeType: e } })}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>P. A Mid Year</h4>
                          </div>
                        </div>
                        <input
                          style={{ backgroundColor: type !== 'create' && "#E6E6E6" }}
                          readOnly={type !== 'create'}
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={data.paYear}
                          onChange={e => this.setState({ data: { ...data, paYear: e.target.value } })}
                        />
                      </div>
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Grade Performance</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select grade --"
                          type="bizpar"
                          disabled={type !== 'create'}
                          data={bizparCorporateGrade}
                          value={data.gradePerformance ? data.gradePerformance.bizparKey : ''}
                          onChange={e => this.setState({ data: { ...data, gradePerformance: e } })}
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

export default FormCompHeadCreate;
