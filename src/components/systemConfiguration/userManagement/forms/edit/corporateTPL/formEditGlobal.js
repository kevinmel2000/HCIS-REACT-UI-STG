import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import PopUp from "../../../../../pages/PopUpAlert";
import DropDown from "../../../../../../modules/popup/DropDown";

import TablePayMethod from "../../../tables/confCorporateTPL/tablePayMethod";
import FormPayMethod from "../corGlobal/editPayMethod";
import * as R from 'ramda'

class EditGlobal extends Component {
  constructor(props) {
    super(props);
    let {
      bizparCorPolicyType,
      bizparTaxCalc,
      bizparSymbol,
      rawData
    } = this.props;
    this.state = {
      data: rawData,
      bizparCorPolicyType,
      bizparTaxCalc,
      bizparSymbol,
      createVibsible: false,
      savePopUpVisible: false,
      visiblePaymentDate: false,
      visiblePaymentMethod: false,
      visibleProrate: false,
      visibleUnpaid: false,
      visibleAttendance: false,
      visibleTax: false,
      visibleRange: false,
      day: "1",
      value1: "",
      value2: "",
      symbol1: "",
      symbol2: "",
      days:[]
    };
    this.day = Array.from(new Array(31), (val, index) => index + 1);
  }

  openPopupPage() {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVibsible: !this.state.createVibsible,
      savePopUpVisible
    });
  }

  componentDidMount() {
    console.log(JSON.stringify(this.props.rawData));
    this.selectType(
      this.state.data.cglobalPolicyType
        ? this.state.data.cglobalPolicyType.bizparKey
        : ""
    );
    console.log(JSON.stringify(this.props.bizparSymbol));
    this.getDays()
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.getDays()
      console.log(this.props.rawData)
      this.setState(
        {
          data: {
            ...this.props.rawData,
            cglobalPolicyValue: this.props.rawData.cglobalPolicyValue 
          },
          visibleRange: false,
          visibleAttendance: false,
          value1: "",
          value2: "",
          symbol1: "",
          symbol2: "",
          cglobalPolicyStatus:
            this.props.rawData.cglobalPolicyStatus === "ACTIVE" ? true : false
        },
        () => this.selectType(this.props.rawData.cglobalPolicyType.bizparKey)
      );
    }
  }

  selectSymbol(sym) {
    if (sym === "~") {
      this.setState({
        visibleRange: true,
        visibleAttendance: false
      });
    } else {
      this.setState({
        visibleRange: false,
        visibleAttendance: true
      });
    }
  }

  selectType(type) {
    if (type === "POLICYTYP-001") {
      this.setState({
        visiblePaymentDate: true,
        visiblePaymentMethod: false,
        visibleProrate: false,
        visibleAttendance: false,
        visibleTax: false,
        visibleRange: false,
        visibleUnpaid: false
      });
    } else if (type === "POLICYTYP-002") {
      this.setState({
        visiblePaymentDate: false,
        visiblePaymentMethod: true,
        visibleProrate: false,
        visibleAttendance: false,
        visibleTax: false,
        visibleRange: false,
        visibleUnpaid: false
      });
    } else if (type === "POLICYTYP-003") {
      this.setState({
        visiblePaymentMethod: false,
        visiblePaymentDate: false,
        visibleProrate: true,
        visibleAttendance: false,
        visibleTax: false,
        visibleRange: false,
        visibleUnpaid: false
      });
    } else if (type === "POLICYTYP-004") {
      this.setState({
        visiblePaymentMethod: false,
        visiblePaymentDate: false,
        visibleProrate: false,
        visibleTax: false,
        visibleRange: false,
        visibleUnpaid: false
      });
      if (String(this.state.data.cglobalPolicyValue).indexOf("~") === 0) {
        let str = this.state.data.cglobalPolicyValue;
        let a = String(str).replace(/([;-])/g, " ");
        let array = a.split(" ");
        setTimeout(() => {
          this.setState({
            symbol1: array[0],
            value1: array[1],
            value2: array[2],
            visibleRange: true,
            visibleAttendance: false
          });
        }, 200);
      } else {
        let str = this.state.data.cglobalPolicyValue;
        let a = String(str).replace(/([;#])/g, " ");
        let array = a.split(" ");
        setTimeout(() => {
          this.setState({
            symbol1: array[0],
            value1: array[1],
            symbol2: array[2],
            value2: array[3],
            visibleRange: false,
            visibleAttendance: true
          });
        }, 200);
      }
    } else if (type === "POLICYTYP-005") {
      this.setState({
        visiblePaymentMethod: false,
        visiblePaymentDate: false,
        visibleProrate: false,
        visibleAttendance: false,
        visibleTax: true,
        visibleRange: false,
        visibleUnpaid: false
      });
    } else if (type === "POLICYTYP-006") {
      this.setState({
        visiblePaymentMethod: false,
        visiblePaymentDate: false,
        visibleProrate: false,
        visibleAttendance: false,
        visibleTax: false,
        visibleRange: false,
        visibleUnpaid: true
      });
    }
  }

  validation() {
    if (this.state.data.cglobalPolicyType.bizparKey === "POLICYTYP-004") {
      console.log(
        `${this.state.symbol1};${this.state.value1}-${this.state.value2}`,
        "dan",
        `${this.state.symbol1};${this.state.value1}#${this.state.symbol1};${this.state.value2}`
      );
      if (this.state.symbol1 === "~") {
        this.setState(
          {
            data: {
              ...this.state.data,
              cglobalPolicyValue: `${this.state.symbol1};${this.state.value1}-${this.state.value2}`
            }
          },
          () => this.props.onClickSave(this.state.data)
        );
      } else {
        this.setState(
          {
            data: {
              ...this.state.data,
              cglobalPolicyValue: `${this.state.symbol1};${this.state.value1}#${this.state.symbol2};${this.state.value2}`
            }
          },
          () => this.props.onClickSave(this.state.data)
        );
      }
    } else {
      this.props.onClickSave(this.state.data);
    }
  }

  handleSavePayment = (dataPay) => {
    let { data } = this.state
    let value = JSON.parse(data.cglobalPolicyValue)
    let array = Object.assign([], value)
    let isExist = R.findIndex(R.propEq("id", dataPay.id))(array)
    if (isExist >= 0) array[isExist] = (dataPay)
    else array.push(dataPay)
    this.setState({ data: { ...data, cglobalPolicyValue: JSON.stringify(array) }, createVibsible: false })
  }

  handleDeletePayment = (index) => {
    let { data } = this.state
    let value = JSON.parse(data.cglobalPolicyValue)
    let array = Object.assign([], value)
    array.splice(index, 1)
    this.setState({ data: { ...data, cglobalPolicyValue: JSON.stringify(array) } })
  }

  getDays(){
    let days = this.day.map(day => {
      return {
        bizparKey: day,
        bizparValue: day
      };
    });
    this.setState({
      days:days
    })
  }

  render() {
    let { data } = this.state;
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-globe"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Corporate Global Policy - Edit Form
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
        <div className="a-s-p-mid a-s-p-pad border-top">
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              if (R.isEmpty(this.state.data.cglobalPolicyType))
              return alert("Policy Type is Required.");
              if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.visibleTax === true)
                return alert("Tax Calc Method is Required.");
              if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.visiblePaymentDate === true)
                return alert("Payment Date is Required.");
                if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.symbol1 === "" && this.state.visibleAttendance === true)
                return alert("Symbol is Required.");
              if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.symbol2 === "" && this.state.visibleAttendance === true)
                return alert("Symbol is Required.");
              if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.symbol1 === "" && this.state.visibleRange === true)
                return alert("Symbol is Required.");
              if (R.isEmpty(this.state.data.cglobalPolicyValue) && this.state.visiblePaymentMethod === true)
                return alert("Table data payment Method is Required .");
              this.validation()
            }}
          >
            <div className="display-flex-normal">
              <div className="padding-15px">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Policy ID <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    value={data.cglobalPolicyID}
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Policy Type <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select template type --"
                      onChange={dt =>
                        this.setState(
                          {
                            data: {
                              ...data,
                              cglobalPolicyType: {
                                ...this.state.data.cglobalPolicyType,
                                bizparKey: dt
                              }
                            }
                          },
                          () => this.selectType(dt)
                        )
                      }
                      bizValue={
                        this.state.data.cglobalPolicyType
                          ? this.state.data.cglobalPolicyType.bizparValue
                          : ""
                      }
                      value={
                        this.state.data.cglobalPolicyType
                          ? this.state.data.cglobalPolicyType.bizparKey
                          : ""
                      }
                      data={this.state.bizparCorPolicyType}
                      type="bizpar"
                    />
                  </div>
                </div>

                {/* paymentDate */}
                {this.state.visiblePaymentDate && (
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>
                        Payment Date <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                    <div className="margin-5px">
                      <DropDown
                        title="-- please select date --"
                        onChange={dt =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              cglobalPolicyValue: String(dt)
                            }
                          })
                        }
                        bizValue={
                          data.cglobalPolicyValue
                        }
                        value={Number(data.cglobalPolicyValue)}
                        data={this.state.days}
                        type="bizpar"
                      />
                    </div>
                  </div>
                )}

                {/* paymentMethod */}
                {this.state.visiblePaymentMethod && (
                  <div>
                    <div className="col-1 content-right margin-bottom-10px">
                      <button
                        type="button"
                        className="btn btn-circle background-blue"
                        onClick={this.openPopupPage.bind(this)}
                      >
                        <i className="fa fa-1x fa-plus" />
                      </button>
                    </div>
                    {this.state.createVibsible && (
                      <FormPayMethod
                        type="create"
                        bizparSymbol={this.props.bizparSymbol}
                        bizparPaymentMethod={this.props.bizparPaymentMethod}
                        bizparPaymentType={this.props.bizparPaymentType}
                        onClickSave={this.handleSavePayment.bind(this)}
                        onClickClose={this.openPopupPage.bind(this)}
                      />
                    )}
                    <TablePayMethod
                      type={"edit"}
                      bizparSymbol={this.props.bizparSymbol}
                      bizparPaymentMethod={this.props.bizparPaymentMethod}
                      bizparPaymentType={this.props.bizparPaymentType}
                      onClickSave={this.handleSavePayment.bind(this)}
                      onClickDelete={this.handleDeletePayment.bind(this)}
                      onClickClose={this.openPopupPage.bind(this)}
                      data={this.state.data}
                    />
                  </div>
                )}

                {/* prorate monthly */}
                {this.state.visibleProrate && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          Prorate Monthly Factor
                        <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      required
                      value={data.cglobalPolicyValue}
                      onChange={e => {
                        this.setState({
                          data: {
                            ...data,
                            cglobalPolicyValue: e.target.value
                          }
                        });
                      }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder={""}
                    />
                  </div>
                )}

                {/* unpaid */}
                {this.state.visibleUnpaid && (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>
                          value
                        <span style={{ color: "red" }}>*</span>
                        </h4>
                      </div>
                    </div>
                    <input
                      required
                      value={data.cglobalPolicyValue}
                      onChange={e => {
                        this.setState({
                          data: {
                            ...data,
                            cglobalPolicyValue: e.target.value
                          }
                        });
                      }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder={""}
                    />
                  </div>
                )}

                {/* attendance */}
                {this.state.visibleAttendance && (
                  <div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Month -1 Condition{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <div className="grid grid-2x grid-mobile-none gap-10px">
                        <div className="column-1">
                          <DropDown
                            title="-- please select symbol --"
                            onChange={dt =>
                              this.setState(
                                {
                                  data: {
                                    ...this.state.data,
                                    cglobalPolicyValue: dt
                                  }
                                },
                                () => this.selectSymbol(dt)
                              )
                            }
                            bizValue={this.state.symbol1}
                            value={this.state.symbol1}
                            data={this.state.bizparSymbol}
                            type="bizpar"
                          />
                        </div>
                        <div className="column-2">
                          <input
                            required
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder={""}
                            value={this.state.value1}
                            onChange={e => {
                              this.setState({
                                value1: e.target.value
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Current Month Condition{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <div className="grid grid-2x grid-mobile-none gap-10px">
                        <div className="column-1">
                          <DropDown
                            title="-- please select symbol --"
                            onChange={dt =>
                              this.setState(
                                {
                                  data: {
                                    ...this.state.data,
                                    cglobalPolicyValue: dt
                                  }
                                },
                                () => this.selectSymbol(dt)
                              )
                            }
                            bizValue={this.state.symbol2}
                            value={this.state.symbol2}
                            data={this.state.bizparSymbol}
                            type="bizpar"
                          />
                        </div>
                        <div className="column-2">
                          <input
                            required
                            value={this.state.value2}
                            onChange={e => {
                              this.setState({
                                value2: e.target.value
                              });
                            }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* attendance range */}
                {this.state.visibleRange && (
                  <div className="grid grid-3x grid-mobile-none gap-10px">
                    <div className="column-1">
                      <div className="margin-bottom-20px ">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Month -1 Condition{" "}
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <input
                          required
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder={""}
                          value={this.state.value1}
                          onChange={e => {
                            this.setState({
                              value1: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-20px margin-top-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>
                              Symbol <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="margin-5px">
                          <DropDown
                            title="-- please select symbol --"
                            onChange={dt =>
                              this.setState(
                                {
                                  symbol1: dt
                                },
                                () => this.selectSymbol(dt)
                              )
                            }
                            bizValue={this.state.symbol1}
                            data={this.state.bizparSymbol}
                            value={this.state.symbol1}
                            type="bizpar"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="column-3">
                      <div className="margin-bottom-20px ">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Current Month Condition{" "}
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <input
                          required
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder={""}
                          value={this.state.value2}
                          onChange={e => {
                            this.setState({
                              value2: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* tax method*/}
                {this.state.visibleTax && (
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>
                        Tax Calc Method <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                    <div className="margin-5px">
                      <DropDown
                        title="-- please select tax --"
                        onChange={dt =>
                          this.setState({
                            data: {
                              ...data,
                              cglobalPolicyValue: {
                                ...data.cglobalPolicyValue,
                                bizparKey: dt
                              }
                            }
                          })
                        }
                        bizValue={
                          data.cglobalPolicyValue
                            ? data.cglobalPolicyValue.bizparValue
                            : ""
                        }
                        value={
                          data.cglobalPolicyValue ? data.cglobalPolicyValue : ""
                        }
                        data={this.state.bizparTaxCalc}
                        type="bizpar"
                      />
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
                        checked={data.cglobalPolicyStatus}
                        disabled
                        onChange={e =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              cglobalPolicyStatus: e.target.checked
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
                          type="submit"
                          className="btn btn-blue"
                        >
                          SAVE
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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

export default EditGlobal;
