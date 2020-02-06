import React, { Component } from "react";
import DropDown from "../../../../../../modules/popup/DropDown";
import API from "../../../../../../Services/Api";
import * as R from "ramda";
import M from "moment";

const defaultPayload = {
  id: "",
  type: "",
  method: "",
  threshold: ""
};

class EditPayMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bizparSymbol: this.props.bizparSymbol,
      dataGlobal: props.data
        ? props.data
        : { ...defaultPayload, id: "ID-" + M() },
      bizparPaymentMethod: props.bizparPaymentMethod,
      bizparPaymentType: props.bizparPaymentType,
      symbol1: "",
      visibleRange: false,
      visibleSymbol: true
    };
  }

  selectSymbol(sym) {
    if (sym === "~") {
      this.setState({
        visibleRange: true,
        visibleSymbol: false
      });
    } else {
      this.setState({
        visibleRange: false,
        visibleSymbol: true
      });
    }
  }

  checkSymbol() {
    if (String(this.state.dataGlobal.threshold).indexOf("~") === 0) {
      let str = this.state.dataGlobal.threshold;
      let a = String(str).replace(/([;-])/g, " ");
      let array = a.split(" ");
      setTimeout(() => {
        this.setState({
          symbol1: array[0],
          value1: array[1],
          visibleRange: true,
          visibleSymbol: false
        });
      }, 200);
    } else {
      let str = this.state.dataGlobal.threshold;
      let a = String(str).replace(/([;#])/g, " ");
      let array = a.split(" ");
      setTimeout(() => {
        this.setState({
          symbol1: array[0],
          value1: array[1],
          visibleRange: false,
          visibleSymbol: true
        });
      }, 200);
    }
  }
  
  validation() {
    if (this.state.symbol1 === "~") {
      this.setState(
        {
          dataGlobal: {
            ...this.state.dataGlobal,
            threshold: `${this.state.symbol1};${this.state.value1}-${this.state.value2}`
          }
        },
        () => this.props.onClickSave(this.state.dataGlobal)
      );
    } else {
      this.setState(
        {
          dataGlobal: {
            ...this.state.dataGlobal,
            threshold: `${this.state.symbol1};${this.state.value1}`
          }
        },
        () => this.props.onClickSave(this.state.dataGlobal)
      );
    }
  }

  componentDidMount() {
    console.log(JSON.stringify(this.props.bizparSymbol));
    this.checkSymbol(this.state.dataGlobal.threshold)
  }

  render() {
    let { dataGlobal, bizparPaymentMethod, bizparPaymentType } = this.state;
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <form action="#">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">Payment Method - Edit Form</div>
              </div>
              <div className="col-2 content-right">
                <button
                  type="button"
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose.bind(this)}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>
            <div className="display-flex-normal">
              <div className="padding-15px">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Method ID <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                    value={dataGlobal.id}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Payment Type <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select payment type --"
                      onChange={dt =>
                        this.setState({
                          dataGlobal: {
                            ...dataGlobal,
                            type: dt
                          }
                        })
                      }
                      data={bizparPaymentType}
                      value={dataGlobal.type}
                      type="bizpar"
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Payment Method <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select payment method --"
                      onChange={dt =>
                        this.setState({
                          dataGlobal: {
                            ...dataGlobal,
                            method: dt
                          }
                        })
                      }
                      data={bizparPaymentMethod}
                      value={dataGlobal.method}
                      type="bizpar"
                    />
                  </div>
                </div>
                {/* threshold range */}
                {this.state.visibleRange && (
                  <div className="grid grid-3x grid-mobile-none gap-10px">
                    <div className="column-1">
                      <div className="margin-bottom-20px ">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Threshold <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <input
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
                      <div className="margin-bottom-20px">
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
                              Threshold <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <input
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

                {/* threshold symbol */}
                {this.state.visibleSymbol && (
                  <div>
                    <div className="margin-bottom-20px">
                      <div className="grid grid-2x grid-mobile-none gap-10px">
                        <div className="column-1">
                          <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>
                                Symbol
                                <span style={{ color: "red" }}>*</span>
                              </h4>
                            </div>
                          </div>
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
                            value={this.state.symbol1}
                            bizValue={this.state.symbol1}
                            data={this.state.bizparSymbol}
                            type="bizpar"
                          />
                        </div>
                        <div className="column-2">
                          <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                              <h4>
                                Threshold{" "}
                                <span style={{ color: "red" }}>*</span>
                              </h4>
                            </div>
                          </div>
                          <input
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
                  </div>
                )}

                {/* <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Threshold <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder={""}
                    onChange={e =>
                      this.setState({
                        dataGlobal: {
                          ...dataGlobal,
                          threshold: e.target.value
                        }
                      })
                    }
                    value={dataGlobal.threshold}
                  />
                </div> */}
              </div>
            </div>

            <div className="border-top padding-15px content-right">
              <button
                type="button"
                onClick={this.props.onClickClose.bind(this)}
                className="btn btn-primary margin-right-10px"
              >
                BACK
              </button>
              <button
                className="btn btn-blue"
                type="button"
                onClick={() => this.validation()}
              >
                SAVE
              </button>
            </div>
          </form>
        </div>
        <div className="padding-top-20px" />
      </div>
    );
  }
}

export default EditPayMethod;
