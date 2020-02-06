import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";
import NumberFormat from "react-number-format";

const dataCreate = {
  "eduID": '',
  "eduName": '',
  "eduGPA": '',
  "eduType": ''
}

class FormOutsourceFormalEduDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataEdu: props.type !== 'create' ? props.dataEdu : { ...dataCreate, eduID: "FEDU-" + M() },
      bizparEduLevel: props.bizparEduLevel
    };
  }

  render() {
    let { dataEdu } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Formal Education - Create Form"
                  : this.props.type === "update"
                    ? "Formal Education - Edit Form"
                    : "Formal Education - View Form"}
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
                    <h4>Education ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  value={dataEdu.eduID}
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
                      Education Type <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select education --"
                  type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  // data={this.state.bizparEduLevel}
                  data={[
                    {bizparKey: 'UNIV', bizparValue: 'UNIVERSITAS'}
                  ]}
                  value={dataEdu.eduType}
                  onChange={(e) => this.setState({
                    dataEdu: { ...dataEdu, eduType: e }
                  })}
                />
              </div>
              {!(
                this.state.level === "EDULVL-001" ||
                this.state.level === "EDULVL-002" ||
                this.state.level === "EDULVL-003" ||
                this.state.level === "EDULVL-004"
              ) && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          GPK <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      value={dataEdu.eduGPA}
                      onChange={(e) => this.setState({
                        dataEdu: { ...dataEdu, eduGPA: e.target.value }
                      })}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      type="number"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                    {/* <NumberFormat
                      required
                      className="txt txt-sekunder-color"
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      readOnly={this.props.type === "view" ? true : false}
                      decimalSeparator={"."}
                      placeholder={"4.0"}
                      format={"#.##"}
                      decimalScale={2}
                      onChange={(e) => this.setState({
                        dataEdu: { ...dataEdu, eduGPA: e.target.value }
                      })}
                    /> */}
                  </div>
                )}
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
                      onClick={() => this.props.onClickSave(this.props.type, dataEdu)}
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
export default FormOutsourceFormalEduDetail;
