import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import FormProAppraisalComp from "../../../forms/create/performance/formProAppraisalCompProcess";
import TableProCriAppComp from "../../../tables/confPerformance/tblProCriAppComp";

const dataCreate = {
  "outputCriteriaProcessValuationAppraisalID": "",
  "performanceWeight": '',
  "performanceType": '',
  "performanceValue": []
}

class FormProAppraisal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAppraisalCompV: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataCreate, outputCriteriaProcessValuationAppraisalID: 'COMP-PRO-APPRAISAL-' + M() }
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
    let performanceValue = !data.performanceValue ? [] : data.performanceValue.map((data) => {
      const { ocpvaItemID, ocpvaItemComponent, ocpvaItemValue } = data
      return {
        ocpvaItemID: ocpvaItemID,
        ocpvaItemValue: ocpvaItemValue,
        ocpvaItemComponent: ocpvaItemComponent ? ocpvaItemComponent.bizparKey ? ocpvaItemComponent.bizparKey : ocpvaItemComponent : '',
      }
    })
    switch (type) {
      case 'create':
        performanceValue.push(value)
        break;
      case 'update':
        let data = {
          ...value,
          ocpvaItemComponent: value.ocpvaItemComponent ? value.ocpvaItemComponent.bizparKey ? value.ocpvaItemComponent.bizparKey : value.ocpvaItemComponent : '',
        }
        index = R.findIndex(R.propEq('ocpvaItemID', value.ocpvaItemID))(performanceValue)
        if (index >= 0) {
          performanceValue[index] = data
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
      const { ocpvaItemID, ocpvaItemComponent } = value
      return [
        index += 1,
        ocpvaItemID,
        ocpvaItemComponent ? ocpvaItemComponent.bizparValue : 'Component Type'
      ]
    })
    this.setState({
      dataTable, rawData: performanceValue
    })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editAppraisalCompV: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-appCompV":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createAppraisalCompV: !this.state.createAppraisalCompV,
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
            id="navmenu-pac"
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
              <label htmlFor="navmenu-pac">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-appCompV")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createAppraisalCompV && (
            <FormProAppraisalComp
              type={"create"}
              bizparPerformaceValue={this.props.bizparPerformaceValue}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-appCompV")}
            />
          )}
          <div className="app-open-close-content">
            <TableProCriAppComp
              rawData={this.state.rawData}
              dataTable={this.state.dataTable}
              onDeletePopUp={this.handleDelete.bind(this)}
              bizparPerformaceValue={this.props.bizparPerformaceValue}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-appCompV")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparPerformaceType } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Process Appraisal -{" "}
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
                  id="navmenu-pav"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Process Appraisal Value
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-pav">
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
                        value={data.outputCriteriaProcessValuationAppraisalID}
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
                        data={bizparPerformaceType}
                        value={data.performanceType ? data.performanceType.bizparKey : ''}
                        onChange={e => this.setState({ data: { ...data, performanceType: e } })}
                      />
                    </div>
                    <div className="margin-bottom-15px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Weight</h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={data.performanceWeight}
                        onChange={e => this.setState({ data: { ...data, performanceWeight: e.target.value } })}
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

export default FormProAppraisal;
