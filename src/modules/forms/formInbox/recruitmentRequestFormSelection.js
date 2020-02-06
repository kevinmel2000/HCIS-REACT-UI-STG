import React, { Component } from "react";

class formDocRecRequest extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                {this.props.type === "create"
                  ? "Selection - Create Form"
                  : this.props.type === "update"
                  ? "Selection - Edit Form"
                  : "Selection - View Form"}
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
          <form action="#">
            <div className="padding-15px grid grid-mobile-none gap-20px">
                <div className="margin-bottom-15px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Selection {this.props.selectype === 'Tulis' ? 'Test Tertulis Number' :
                      this.props.selectype === 'Awal' ? 'Interview Awal Number' :
                      this.props.selectype === 'Adm' ? 'Administrasi Number' :
                      this.props.selectype === 'Psikotes' ? 'Test Psikotes Number' :
                      this.props.selectype === 'Akhir' ? 'Interview Akhir Number' :
                      'Medical Check Up Number'
                      }
                    </span>
                  </div>
                  <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Selection Type
                  </span>
                </div>
                <input
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Sequence
                  </span>
                </div>
                <input
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Information
                  </span>
                </div>
                <textarea
                  rows={5}
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                    <input type="checkbox" />
                    <span className="txt-site txt-11 txt-main txt-bold" style={{marginLeft:10}}>
                        Mandatory
                    </span>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.props.onClickSave}
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
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
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formDocRecRequest;
