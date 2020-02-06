import React, { Component } from "react";

class FormCompany extends Component {
  constructor(props){
    super(props)
    this.state = {
      oujobDesc: ""
    }
  }

  renderForm = () => (
    <div className="border-bottom padding-15px">
      <div className="margin-bottom-15px">
        <div className="margin-5px">
          <span className="txt-site txt-11 txt-main txt-bold">
            Job Description Name
          </span>
        </div>
        <input
          type="text"
          className="txt txt-sekunder-color"
          placeholder=""
          required
          onChange={(e) => this.setState({ oujobDesc: e.target.value })}
        />
      </div>
    </div>
  );

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() => this.props.onClickSave(this.state.oujobDesc)}
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
  );
  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Company - Job Description - Create Form
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
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormCompany;
