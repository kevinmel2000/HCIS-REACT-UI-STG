import React, { Component } from "react";
import M from 'moment'

const payload = {
  "kelurahanCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": "SYSTEM",
    "modifiedDate": ""
  },
  "kelurahanID": "",
  "kelurahanName": "",
  "kelurahanStatus": "ACTIVE",
  "subZipcode": ""
}

class FormNesKelurahan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deletePopUpVisible: false,
      savePopUpVisible: false,
      // data: props.data ? props.data : payload,
      data: props.data ? props.data : {
        ...payload,
        kelurahanCreationalDTO: {
          ...payload.kelurahanCreationalDTO, createdBy: props.user.employeeID, modifiedBy: props.user.employeeID
        }
      },
      dataTableKelurahan: [],
      kecamatanID: props.kecamatanID
    };
  }

  render() {
    let { kelurahanID, kelurahanName } = this.state.data
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.title}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
              this.props.onClickSave(this.state.data, this.state.kecamatanID)
            }}
          >
            <div className="border-bottom padding-15px grid grid-mobile-none gap-20px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Kelurahan ID <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === "create" ? false : true}
                  style={{ backgroundColor: this.props.type === "create" ? "" : "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={kelurahanID}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        kelurahanID: e.target.value
                      }
                    })
                  }}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Kelurahan Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === "detail" ? true : false}
                  style={{ backgroundColor: this.props.type === "detail" ? "#E6E6E6" : "" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={kelurahanName}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        kelurahanName: e.target.value
                      }
                    })
                  }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Status
                    </span>
                </div>
                <div className="margin-15px">
                  <label className="radio">
                    <input type="checkbox" checked disabled />
                    <span className="checkmark" />
                    <span className="txt-site txt-11 txt-bold txt-main">
                      Active
                      </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="padding-5px grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "detail" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="submit"
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

export default FormNesKelurahan;
