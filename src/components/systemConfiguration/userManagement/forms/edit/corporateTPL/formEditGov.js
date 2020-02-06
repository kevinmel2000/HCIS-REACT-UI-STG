import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import PopUp from "../../../../../pages/PopUpAlert";
import DropDown from "../../../../../../modules/popup/DropDown";
import * as R from "ramda";
import NumberFormat from "react-number-format";

class EditGov extends Component {
  constructor(props) {
    super(props);
    let {
      bizparGovPolicyType,
      bizparInsuranceCat,
      bizparPTKP,
      rawData
    } = this.props;
    this.state = {
      data: rawData,
      bizparGovPolicyType,
      bizparInsuranceCat,
      bizparPTKP,
      visibleBPJS: false,
      visiblePTKP: false
    };
  }

  componentDidMount() {
    console.log(JSON.stringify(this.props.rawData));
    this.selectType(
      this.state.data.governmentPolicyType
        ? this.state.data.governmentPolicyType.bizparKey
        : ""
    );
    let splitArray = String(this.props.rawData.value).split('-', 2)
    this.setState({
      data: {
        ...this.props.rawData,
        value: splitArray[0],
        maxValue: splitArray[1]
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.setState({
        data: this.props.rawData,
        governmentPolicyStatus:
          this.props.rawData.governmentPolicyStatus === "ACTIVE" ? true : false
      });
      let splitArray = String(this.props.rawData.value).split('-', 2)
      this.setState({
        data: {
          ...this.props.rawData,
          value: splitArray[0],
          maxValue: splitArray[1]
        }
      })
      this.selectType(this.props.rawData.governmentPolicyType.bizparKey)
    }
  }

  selectType(type) {
    console.log(JSON.stringify(this.props.rawData));
    if (type === "GOV-002") {
      this.setState({ visibleBPJS: true, visiblePTKP: false });
    } else if (type === "GOV-001") {
      this.setState({ visibleBPJS: false, visiblePTKP: true });
    }
  }

  render() {
    let { data } = this.state;
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-landmark"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Goverment Policy Edit Form
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey"
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="display-flex-normal">
          <div className="padding-15px">
            <div className="margin-bottom-20px">
              <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                <h4>Goverment Policy ID</h4>
              </div>
              <div className="margin-5px">
                <div className="card-date-picker">
                  <div className="double">
                    <input
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      readOnly
                      className="txt txt-sekunder-color"
                      value={data.governmentPolicyID}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="margin-bottom-20px">
              <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                <h4>
                  Years <span style={{ color: "red" }}>*</span>
                </h4>
              </div>
              <div className="margin-5px">
                <div className="card-date-picker">
                  <div className="double">
                    <input
                      type="text"
                      required
                      className="txt txt-sekunder-color"
                      value={data.years ? data.years : ""}
                      onChange={e => {
                        if (isNaN(e.target.value)) return true
                        this.setState({
                          data: {
                            ...this.state.data,
                            years: e.target.value
                          }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="margin-bottom-20px">
              <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                <h4>
                  Template Type <span style={{ color: "red" }}>*</span>
                </h4>
              </div>
              <div className="margin-5px">
                <DropDown
                  title="-- please select template type --"
                  onChange={dt =>
                    this.setState(
                      {
                        data: {
                          ...this.state.data,
                          governmentPolicyType: {
                            ...this.state.data.governmentPolicyType,
                            bizparKey: dt
                          },
                        }
                      },
                      () => this.selectType(dt)
                    )
                  }
                  bizValue={
                    this.state.data.governmentPolicyType
                      ? this.state.data.governmentPolicyType.bizparValue
                      : ""
                  }
                  value={
                    this.state.data.governmentPolicyType
                      ? this.state.data.governmentPolicyType.bizparKey
                      : ""
                  }
                  data={this.state.bizparGovPolicyType}
                  type="bizpar"
                />
              </div>
            </div>

            {this.state.visibleBPJS && (
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>
                    BPJS Type <span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
                <div className="margin-5px">
                  <DropDown
                    title="-- please select template type --"
                    onChange={dt =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          governmentPolicyItem: {
                            ...this.state.data.governmentPolicyItem,
                            bizparKey: dt
                          }
                        }
                      })
                    }
                    bizValue={
                      this.state.data.governmentPolicyItem
                        ? this.state.data.governmentPolicyItem.bizparValue
                        : ""
                    }
                    value={
                      this.state.data.governmentPolicyItem
                        ? this.state.data.governmentPolicyItem.bizparKey
                        : ""
                    }
                    data={this.state.bizparInsuranceCat}
                    type="bizpar"
                  />
                </div>
              </div>
            )}

            {this.state.visibleBPJS && (
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>
                    Min Value <span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
                <div className="margin-5px">
                  <div className="card-date-picker">
                    <div className="double">
                      <NumberFormat
                        thousandSeparator={true}
                        value={data.value}
                        className="txt txt-sekunder-color"
                        placeholder=""
                        onValueChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              value: e.formattedValue
                            }
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {this.state.visibleBPJS && (
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>
                    Max Value <span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
                <div className="margin-5px">
                  <div className="card-date-picker">
                    <div className="double">
                      <NumberFormat
                        thousandSeparator={true}
                        value={data.maxValue}
                        className="txt txt-sekunder-color"
                        placeholder=""
                        onValueChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              maxValue: e.formattedValue
                            }
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {this.state.visiblePTKP && (
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>PTKP Type </h4>
                </div>
                <div className="margin-5px">
                  <DropDown
                    title="-- please select template type --"
                    onChange={dt =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          governmentPolicyItem: {
                            ...this.state.data.governmentPolicyItem,
                            bizparKey: dt
                          }
                        }
                      })
                    }
                    bizValue={
                      this.state.data.governmentPolicyItem
                        ? this.state.data.governmentPolicyItem.bizparValue
                        : ""
                    }
                    value={
                      this.state.data.governmentPolicyItem
                        ? this.state.data.governmentPolicyItem.bizparKey
                        : ""
                    }
                    data={this.state.bizparPTKP}
                    type="bizpar"
                  />
                </div>
              </div>
            )}

            {this.state.visiblePTKP && (
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>
                    Value <span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
                <div className="margin-5px">
                  <div className="card-date-picker">
                    <div className="double">
                      <NumberFormat
                        thousandSeparator={true}
                        className="txt txt-sekunder-color"
                        placeholder=""
                        value={data.value}
                        onValueChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              value: e.formattedValue
                            }
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="margin-bottom-20px">
              <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                <h4>Activation</h4>
              </div>
              <div className="margin-15px">
                <label className="radio">
                  <input
                    type="checkbox"
                    name="all-day"
                    checked={this.state.data.governmentPolicyStatus}
                    disabled
                    onChange={e =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          governmentPolicyStatus: e.target.checked
                        }
                      })
                    }
                  />
                  <span className="checkmark" />
                  <span className="txt-site txt-11 txt-bold txt-main">
                    Activate Now
                  </span>
                </label>
              </div>
            </div>
            <div className="display-flex-normals margin-bottom-15px">
              <div className="border-top padding-top-20px">
                <div className="grid grid-2x">
                  <div className="col-1 content-left"></div>
                  <div className="col-2 content-right">
                    <button
                      type="button"
                      className="btn btn-blue"
                      onClick={() => {
                        if (
                          R.isEmpty(this.state.data.governmentPolicyType) ||
                          R.isNil(this.state.data.governmentPolicyType) ||
                          R.isEmpty(
                            this.state.data.governmentPolicyType.bizparKey
                          )
                        )
                          return alert("Template Type is Required");
                        if (
                          (R.isEmpty(this.state.data.governmentPolicyItem) && this.state.visibleBPJS === true) ||
                          (R.isNil(this.state.data.governmentPolicyItem) && this.state.visibleBPJS === true) ||
                          (R.isEmpty(
                            this.state.data.governmentPolicyItem.bizparKey
                          ) && this.state.visibleBPJS === true)
                        )
                          return alert("BPJS Type is Required");
                        if (
                          (R.isEmpty(this.state.data.governmentPolicyItem) && this.state.visiblePTKP === true) ||
                          (R.isNil(this.state.data.governmentPolicyItem) && this.state.visiblePTKP === true) ||
                          (R.isEmpty(
                            this.state.data.governmentPolicyItem.bizparKey
                          ) && this.state.visiblePTKP === true)
                        )
                          return alert("PTKP Type is Required");
                        if (
                          (!R.isEmpty(this.state.data.value) && this.state.visibleBPJS === true) &&
                          (!R.isEmpty(this.state.data.maxValue) && this.state.visibleBPJS === true) &&
                          (this.state.data.maxValue <= this.state.data.value)
                        )
                          return alert(
                            "Max Value Should be Greater Than Min Value."
                          );
                        if (
                          (R.isEmpty(this.state.data.value) && this.state.visibleBPJS === true) ||
                          (R.isNil(this.state.data.value) && this.state.visibleBPJS === true)
                        )
                          return alert("Min Value is Required");
                        if (
                          (R.isEmpty(this.state.data.value) && this.state.visiblePTKP === true) ||
                          (R.isNil(this.state.data.value) && this.state.visiblePTKP === true)
                        )
                          return alert("Value is Required");
                        if (
                          R.isEmpty(this.state.data.maxValue) ||
                          R.isNil(this.state.data.maxValue)
                        )
                          return alert("Max Value is Required");
                        if (
                          R.isEmpty(this.state.data.years) ||
                          R.isNil(this.state.data.years) ||
                          this.state.data.years === "0"
                        )
                          return alert("Years is Required");
                        this.props.onClickSave(this.state.data, "gov");
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-org")}
          />
        )}
        <ReactTooltip />
      </div>
    );
  }
}

export default EditGov;
