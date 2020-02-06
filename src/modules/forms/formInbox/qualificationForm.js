import React, { Component } from "react";
import { getBizpar, renderInputText } from '../../../Services/Utils'
import FlexView from "react-flexview";
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'

class qualificationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bizpar: [],
      optionsType: ""
    }
  }

  async componentWillMount() {
    let bizpar = []
    let optionsType = ""
    let data;

    switch (this.props.qualificationType) {
      case "AKREDITASI PRODI/JURUSAN":
        bizpar = await getBizpar('ACCREDITATION_TYPE')
        optionsType = "checkbox"
        break
      case "AKREDITASI PT":
        bizpar = await getBizpar('ACCREDITATION_TYPE')
        optionsType = "checkbox"
        break
      case "NILAI/IPK":
        bizpar = await getBizpar('GPA')
        optionsType = "selectbox"
        break
      case "KEWARGANEGARAAN":
        bizpar = await getBizpar('NATIONALITY_TYPE')
        optionsType = "checkbox"
        break
      case "TOEFL":
        bizpar = await getBizpar('TOEFL')
        optionsType = "selectbox"
        break
      case "PENGUASAAN BAHASA":
        bizpar = await getBizpar('LANGUAGE_SKILL')
        optionsType = "checkbox"
        break
      case "PENDIDIKAN":
        bizpar = await getBizpar('EDUCATION_LEVEL')
        optionsType = "checkbox"
        break
      case "BERPENGALAMAN":
        bizpar = await getBizpar('RECRUITMENT_WORK_EXPERIENCE')
        optionsType = "selectbox"
        break
      case "UMUR":
        bizpar = await getBizpar('RECRUITMENT_AGE')
        optionsType = "selectbox"
        break
      case "JENIS KELAMIN":
        bizpar = await getBizpar('GENDER_TYPE')
        optionsType = "checkbox"
        break
      default:
        bizpar = []
        optionsType = ""
        break
    }

    let notes = ""
    let selected = optionsType === "checkbox" ? [] : ""
    let is_mandatory = false

    let {
      requestQualifications,
      requestQualificationNotes,
      isMandatory,

      documentMandatory,
      requestDocumentNotes,
      requestDocumentSequence,

      requestSelectionSequence,
      requestSelectionNotes,
      requestSelectionMandatory
    } = this.props.data

    if (requestQualificationNotes) notes = requestQualificationNotes
    if (requestDocumentNotes) notes = requestDocumentNotes
    if (requestSelectionNotes) notes = requestSelectionNotes

    if (requestQualifications) selected = requestQualifications
    if (requestDocumentSequence || requestDocumentSequence === 0) selected = requestDocumentSequence
    if (requestSelectionSequence || requestSelectionSequence === 0) selected = requestSelectionSequence

    if (isMandatory) is_mandatory = isMandatory
    if (documentMandatory) is_mandatory = documentMandatory
    if (requestSelectionMandatory) is_mandatory = requestSelectionMandatory


    switch (optionsType) {
      case "checkbox":
        data = {
          notes,
          selected,
          is_mandatory
        }
        break
      default:
        data = {
          notes,
          selected,
          is_mandatory
        }
        break
    }

    let { bizValue } = ''
    let index = R.findIndex(R.propEq('bizparKey', data.selected[0]))(bizpar)
    if (index >= 0) {
      bizValue = bizpar[index].bizparValue
      // bizKey = bizpar[index].bizparKey
    }

    this.setState({ bizpar, optionsType, data, bizValue })
  }

  renderOptions() {
    if (this.state.optionsType === "checkbox") {
      return (
        <FlexView row="true">
          {this.state.bizpar.map((data, index) => {
            let { selected } = this.state.data
            let is_checked = false

            selected.map((item, index) => {
              if (item === data.bizparKey) is_checked = true
              return null
            })

            return (
              <div key={index} style={{ padding: 5 }}>
                <label>
                  <input
                    checked={is_checked}
                    onChange={(e) => {
                      let checked = Object.assign([], this.state.data.selected)
                      if (e.target.checked) {
                        checked.push(data.bizparKey)
                      } else {
                        selected.map((selectedItem, index) => {
                          if (selectedItem === data.bizparKey) checked.splice(index, 1)
                          return null
                        })
                      }
                      this.setState({
                        data: {
                          ...this.state.data,
                          selected: checked
                        }
                      })
                    }}
                    value={data.bizparKey}
                    type="checkbox" /> {this.props.qualificationType === 'PENGUASAAN BAHASA' ?  <span style={{ fontSize: 13 }}> <br/> {data.bizparValue}</span> : data.bizparValue}
                </label>
              </div>
            )
          })}
        </FlexView>
      )
    } else if (this.state.optionsType === "selectbox") {
      return (
        // renderSelectBox(
        //   '',
        //   this.props.qualificationType,
        //   this.state.data && this.state.data.selected,
        //   this.state.bizpar,
        //   (e) => this.setState({
        //     data: {
        //       ...this.state.data,
        //       selected: e.target.value
        //     }
        //   })
        // )

        <DropDown
          title="-- please select qualification --"
          bizValue={this.state.bizValue}
          onChange={(dt) => this.setState({
            data: {
              ...this.state.data,
              selected: dt
            }
          })}
          type="bizpar"
          data={  this.state.bizpar}
          value={this.state.data.selected[0]} />
      )
    } else {
      return (
        renderInputText(
          '',
          this.state.data && this.state.data.selected,
          (e) => {
            if (isNaN(e.target.value)) return true
            this.setState({
              data: {
                ...this.state.data,
                selected: e.target.value
              }
            })
          }
        )
      )
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
                {this.props.title}
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
          <form action="#">
            <div className="padding-15px grid-mobile-none">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Qualification Type
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={this.props.qualificationType}
                  // style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    {this.state.optionsType === "" ? "Sequence" : "Qualification"} <div style={{ color: "red", display: "inline-block" }}>*</div>
                  </span>
                </div>
                {this.renderOptions()}
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Notes
                  </span>
                </div>
                <textarea
                  value={this.state.data && this.state.data.notes}
                  onChange={(e) => this.setState({
                    data: {
                      ...this.state.data,
                      notes: e.target.value
                    }
                  })}
                  rows={5}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Is Mandatory <div style={{ color: "red", display: "inline-block" }}>*</div>
                  </span>
                </div>
                <label className="radio">
                  <input type="checkbox" name="status" checked={this.state.data && this.state.data.is_mandatory}
                    onChange={(e) => this.setState({
                      data: {
                        ...this.state.data,
                        is_mandatory: e.target.checked
                      }
                    })} />
                  <span className="checkmark" />
                  <span className="txt-site txt-11 txt-bold txt-main">
                    Activate now
                          </span>
                </label>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      if (R.isEmpty(this.state.data.selected)) return alert('Qualification is Required.')
                      if (this.state.data.selected === 0) return alert('Sequence is Required.')
                      this.props.onClickSave(this.state.data)
                    }}
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
export default qualificationForm;
