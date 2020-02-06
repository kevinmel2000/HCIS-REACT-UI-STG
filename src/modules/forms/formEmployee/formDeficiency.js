import React, { Component } from "react"
import M from 'moment';
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadDeficiency = {
  "employeeWeaknessID": "W-" + Date.now(),
  "weaknessCategory": "",
  "weaknessDate": "",
  "weaknessName": "",
  "weaknessNotes": "",
  "weaknessType": ""
}

class FormDeficiency extends Component {
  constructor(props) {
    super(props);
    let {
      employeeDataDeficiency,
      bizparDeficiencyType,
      bizparDeficiencyCategory
    } = this.props

    this.state = {
      employeeDataDeficiency: employeeDataDeficiency ? {
        ...employeeDataDeficiency,
        weaknessDate: M(
          employeeDataDeficiency.weaknessDate,
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD')
      } : defaultPayloadDeficiency,
      bizparDeficiencyType,
      bizparDeficiencyCategory
    }
  }

  
  handleSelectDate = (date) => {
    this.setState({
      employeeDataDeficiency: {
            ...this.state.employeeDataDeficiency,
            weaknessDate: M(date).format("YYYY-MM-DD")
        }
    })
  }

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
            <Button
            state={this.props.sendState}
            style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 165 }}
              className="btn btn-blue"
              type="submit"
            >
              <span>SAVE</span>
            </Button>
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
  )

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">

          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Employee Detail – Deficiency –  Create Form"
                  : this.props.type === "update"
                    ? "Employee Detail – Deficiency –  Edit Form"
                    : "Employee Detail – Deficiency –  View Form"}
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

          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
              if (R.isEmpty(this.state.employeeDataDeficiency.weaknessDate)) {
                return alert('Date of Period is Required.')
              }
              if (R.isEmpty(this.state.employeeDataDeficiency.weaknessType) || R.isEmpty(this.state.employeeDataDeficiency.weaknessType.bizparKey)) {
                return alert('Deficiency Type is Required.')
              }
              if (R.isEmpty(this.state.employeeDataDeficiency.weaknessCategory) || R.isEmpty(this.state.employeeDataDeficiency.weaknessCategory.bizparKey)) {
                return alert('Deficiency Category is Required.')
              }
              else
                this.props.onClickSave(this.state.employeeDataDeficiency)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Deficiency Number</h4>
                      </div>
                    </div>
                    <input
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={this.state.employeeDataDeficiency.employeeWeaknessID}
                    />
                  </div>
                ) : null}

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Period <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <CalendarPicker disabled={this.props.type === "view" ? true : false} date={this.state.employeeDataDeficiency.weaknessDate} onChange={(e) => {
                      this.handleSelectDate(e)
                  }} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Deficiency Type <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select deficiency type --"
                    onChange={(e) => this.setState({
                      employeeDataDeficiency: {
                        ...this.state.employeeDataDeficiency,
                        weaknessType: {
                          ...this.state.employeeDataDeficiency.weaknessType,
                          bizparKey: e
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparDeficiencyType}
                    value={this.state.employeeDataDeficiency.weaknessType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Deficiency Category <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select deficiency category --"
                    onChange={(e) => this.setState({
                      employeeDataDeficiency: {
                        ...this.state.employeeDataDeficiency,
                        weaknessCategory: {
                          ...this.state.employeeDataDeficiency.weaknessCategory,
                          bizparKey: e
                        }
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparDeficiencyCategory}
                    value={this.state.employeeDataDeficiency.weaknessCategory.bizparKey} />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Deficiency Name</h4>
                    </div>
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
                    value={this.state.employeeDataDeficiency.weaknessName}
                    onChange={e =>
                      this.setState({
                        employeeDataDeficiency: {
                          ...this.state.employeeDataDeficiency,
                          weaknessName: e.target.value
                        }
                      })}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Information</h4>
                    </div>
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
                    value={this.state.employeeDataDeficiency.weaknessNotes}
                    onChange={e =>
                      this.setState({
                        employeeDataDeficiency: {
                          ...this.state.employeeDataDeficiency,
                          weaknessNotes: e.target.value
                        }
                      })}
                  />
                </div>
              </div>

            </div>

            {this.renderFooter()}

          </form>

        </div>
        <div className="padding-bottom-20px" />
      </div>
    )
  }

}

export default FormDeficiency