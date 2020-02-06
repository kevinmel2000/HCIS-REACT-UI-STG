import React, { Component } from "react";
import M from "moment";
import NumberFormat from "react-number-format";
import CalendarPicker from "../../../modules/popup/Calendar";
import DropDown from "../../../modules/popup/DropDown";
import * as R from 'ramda'

const defaultPayload = {
  "weID": "WE-" + M(),
  "weName": "",
  "weCompName": "",
  "weStartDate": "",
  "weEndDate": "",
  "weType": ""
};

class FormOutsourceWorkDetail extends Component {
  constructor(props) {
    super(props);
    let { dataWork } = this.props;

    this.state = {
      dataWork: dataWork ? dataWork : defaultPayload
    };
  }

  render() {
    let { dataWork } = this.state
    // console.log(M(dataWork.weEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'))
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Work Experience – Create Form"
                  : this.props.type === "update"
                    ? "Work Experience – Edit Form"
                    : "Work Experience – View Form"}
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
            <div className="padding-15px grid grid-mobile-none">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Work Experience ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  value={dataWork.weID}
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
                      Work Experience Type
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select work experience --"
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[
                    { bizparKey: 'TECH', bizparValue: 'TECH' }
                  ]}
                  value={dataWork.weType}
                  onChange={(e) => this.setState({ dataWork: { ...dataWork, weType: e } })}
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Name<span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder={"Name"}
                  required
                  value={dataWork.weName}
                  onChange={(e) => this.setState({ dataWork: { ...dataWork, weName: e.target.value } })}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="grid grid-2x grid-mobile-none gap-20px">
                  <div className="column-1">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Start Date</h4>
                      </div>
                    </div>
                    <CalendarPicker
                      date={M(dataWork.weStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                      onChange={(e) => this.setState({ dataWork: { ...dataWork, weStartDate: e } })} />
                  </div>
                  <div className="column-2">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>End Date</h4>
                      </div>
                    </div>
                    <CalendarPicker
                      date={M(dataWork.weEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                      onChange={(e) => this.setState({ dataWork: { ...dataWork, weEndDate: e } })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={() => this.props.onClickSave(this.props.type, dataWork)}
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
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
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}
export default FormOutsourceWorkDetail;
