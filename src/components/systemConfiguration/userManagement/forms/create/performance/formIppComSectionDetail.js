import React, { Component } from "react";
import DropDown from "../../../../../../modules/popup/DropDown";
import M from 'moment'

const dataCreate = {
  computeItemID: '',
  criteria: '',
  weight: '',
  value: '',
  totalValue: '',
}

class FormIppComSectionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.rawData ? props.rawData : { ...dataCreate, computeItemID: 'COMP-ITEM-' + M() }
    };
  }

  render() {
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Criteria Value -{" "}
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
            <div className="border-bottom padding-15px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Component Type <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select component --"
                  type="bizpar"
                  data={this.props.bizparActivityPlanSection}
                  value={data.criteria ? data.criteria.bizparKey : ''}
                  onChange={e => this.setState({ data: { ...data, criteria: e } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Weight <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={data.weight}
                  onChange={e => this.setState({ data: { ...data, weight: e.target.value } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Value</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  style={{ backgroundColor: this.props.type !== 'create' && "#E6E6E6" }}
                  readOnly={this.props.type !== 'create'}
                  value={data.value}
                  onChange={e => this.setState({ data: { ...data, value: e.target.value } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Total Value</h4>
                  </div>
                </div>
                <input
                  type="text"
                  style={{ backgroundColor: this.props.type !== 'create' && "#E6E6E6" }}
                  readOnly={this.props.type !== 'create'}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={data.totalValue}
                  onChange={e => this.setState({ data: { ...data, totalValue: e.target.value } })}
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
                onClick={()=> this.props.onClickSave(this.props.type, data)}
              >
                SAVE
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default FormIppComSectionDetail;
