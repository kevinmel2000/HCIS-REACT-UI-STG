import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../modules/popup/DropDown";
import NumberFormat from "react-number-format";

const defaultData = {
  ssID: 'SKILL-' + M(),
  ssName: ''
}

class FormOutsourceSkillDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSkill: props.dataSkill ? props.dataSkill : defaultData
    };
  }

  render() {
    let { dataSkill } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Skill Set - Create Form"
                  : this.props.type === "update"
                    ? "Skill Set - Edit Form"
                    : "Skill Set - View Form"}
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
                    <h4>Skill ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  value={dataSkill.ssID}
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
                      Skill Name <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select skill --"
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[
                    { bizparKey: 'Coding full Stack', bizparValue: 'Coding full Stack' },
                    { bizparKey: 'Coding Back-end', bizparValue: 'Coding Back-end' }
                  ]}
                  value={dataSkill.ssName}
                  onChange={e => this.setState({ dataSkill: { ...dataSkill, ssName: e } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Description</h4>
                  </div>
                </div>
                <textarea
                  type="text"
                  className="txt txt-sekunder-color"
                  rows={4}
                  placeholder=""
                  readOnly={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                />
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
                      onClick={() => this.props.onClickSave(this.props.type, dataSkill)}
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
export default FormOutsourceSkillDetail;
