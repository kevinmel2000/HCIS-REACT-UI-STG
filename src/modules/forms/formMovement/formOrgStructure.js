import React, { Component } from "react";

class FormOrgStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                {this.props.label}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.props.onClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-15px">
                    <div className="margin-5px">
                      <span className="txt-site txt-11 txt-main txt-bold">
                        Province
                      </span>
                    </div>
                    <select
                      className="cf-select slc slc-sekunder"
                      disabled={this.props.type === "view" ? true : false}
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                    >
                      <option>Jawa Barat</option>
                    </select>
                  </div>
                ) : null}

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Branch
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  >
                    <option>Dago</option>
                  </select>
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Office Type
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  >
                    <option>Cabang</option>
                  </select>
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Location
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  >
                    <option>Bandung</option>
                  </select>
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      HR Position
                    </span>
                  </div>
                  <select
                    className="cf-select slc slc-sekunder"
                    disabled={this.props.type === "view" ? true : false}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                  >
                    <option>HR</option>
                  </select>
                </div>

                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Efective Date
                    </span>
                  </div>
                  <div className="margin-5px">
                    <input
                      style={{ width: "38%" }}
                      type="date"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                    <span className="padding-15px">To</span>
                    <input
                      style={{ width: "38%" }}
                      type="date"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
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
                      onClick={this.props.onSave}
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={this.props.onClose}
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

export default FormOrgStructure;
