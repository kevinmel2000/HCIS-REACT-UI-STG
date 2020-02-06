import React, { Component } from "react";

class formOtherRecRequest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data ? this.props.data : "",
      previousData: this.props.data ? this.props.data : null
    }
  }
  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Other Clause
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle background-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
              this.props.onClickSave(this.state)
            }
            }>
            <div className="padding-15px grid grid-mobile-none gap-20px">

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Other Clause <span style={{ color: 'red' }}>*</span>
                  </span>
                </div>
                <textarea
                  value={this.state.data}
                  onChange={(e) => this.setState({ data: e.target.value })}
                  rows={5}
                  // style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
            {/* </div> */}

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="submit"
                  // onClick={() => this.props.onClickSave(this.state)}
                  >
                    <span>SAVE</span>
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

export default formOtherRecRequest;
