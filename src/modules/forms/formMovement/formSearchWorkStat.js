import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";

class formSearchEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  render() {
    return (
      <div className="app-popup app-popup-show">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Movement - Working Status - Edit Form
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div className="padding-15px grid grid-2x grid-mobile-none gap-10px">
            <div className="column-1">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Employee Type
                  </span>
                </div>
                <select
                  className="cf-select slc slc-sekunder"
                  disabled
                  style={{ backgroundColor: "#E6E6E6" }}
                >
                  <option value="">-- please movement type --</option>
                </select>
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Employee Category
                  </span>
                </div>
                <select
                  className="cf-select slc slc-sekunder"
                  disabled
                  style={{ backgroundColor: "#E6E6E6" }}
                >
                  <option value="">-- please movement category --</option>
                </select>
              </div>
            </div>
            <div className="column-2">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Join Date
                  </span>
                </div>
                <input
                  type="date"
                  className="txt txt-sekunder-color"
                  placeholder="Request Number"
                  required
                />
              </div>
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    End Date
                  </span>
                </div>
                <input
                  type="date"
                  className="txt txt-sekunder-color"
                  placeholder="Request Number"
                  required
                />
              </div>
            </div>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1"></div>
              <div className="col-2 content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickSave}
                >
                  <span>SAVE</span>
                </button>
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formSearchEmployee;
