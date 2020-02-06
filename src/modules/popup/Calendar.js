import React, { Component } from 'react'
import { Calendar } from 'react-date-range'
import moment from 'moment'

class Pages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      datePicker: this.props.date,
      dateField: this.props.date ? moment(this.props.date).format("DD-MM-YYYY") : "DD-MM-YYYY",
      dateContent: 'content',
      calendarVisible: false
    }
  }

  handleClickOutside(target) {
    // // console.log(element)
    // const outsideclickListener = event => {
    //   if (!element.contains(event.target)) {
    //     console.log('target', event.target)
    //     this.setState({calendarVisible: !this.state.calendarVisible})
    //     removeClickListener()
    //   }
    // }

    // const removeClickListener = () => {
    //   // this.setState({smallProfileClass: clActivePopup})
    //   document.removeEventListener('click', outsideclickListener)
    // }

    // document.addEventListener('click', outsideclickListener)

    var element = document.querySelector(target)

    const outsideclickListener = (event) => {
      if (!element.contains(event)) {
        this.setState({calendarVisible: false}) 
      }
    }

    document.addEventListener("click", function (event) {
      if (event.target.closest(target)) return
      outsideclickListener()
    })
  }

  clPlaceDate = () => {
    // var element = document.getElementById('card-date-picker')
    this.setState({dateContent: 'content'})
  }

  opPlaceDate = () => {
    // var element = document.getElementsByClassName('card-date-picker')
    // element.style.display = 'block'
    this.setState({calendarVisible: !this.state.calendarVisible })
    this.handleClickOutside('.card-date-picker')
  }

  handleChange = moment => {
    console.log(moment)
  }

  handleSave = () => {
    console.log('saved', this.state.datePicker)
  }

  handleSelectDate = (e) => {
    this.props.onChange(e)
    this.setState({
      datePicker: e
    })
  }

  clearDateField = () => {
    this.setState({
      // calendarVisible: false,
      datePicker: false,
      dateField: 'DD-MM-YYYY'
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      // const dt = (this.state.dateField !== undefined && this.state.dateField !== null && this.state.dateField !== "") ? moment(this.state.dateField).format("DD-MM-YYYY") : "DD-MM-YYYY"
      const dt = (this.state.datePicker !== undefined && this.state.datePicker !== null && this.state.datePicker !== "") ? moment(this.state.datePicker).format("DD-MM-YYYY") : "DD-MM-YYYY"
      this.setState({
        datePicker: this.props.date,
        dateField: dt
      })
    }
  }


  render() {
    return (
      <div id="card-date-picker" key={this.props.key}>
        <div className="card-date-picker" >
          <div className="double">
            <div className="input">
              <input
                type="text"
                className="ip"
                readOnly
                style={{ backgroundColor: this.props.disabled ? "#E6E6E6" : null }}
                value={(this.state.datePicker !== undefined && this.state.datePicker !== null && this.state.datePicker !== "") ? moment(this.state.datePicker).format("DD-MM-YYYY") : "DD-MM-YYYY"} />
              {/*!this.props.disabled 
                ? <button 
                    type="button"
                    className="cl" 
                    onClick={!this.props.disabled ? this.clearDateField : null}>
                    <i className="fa fa-1x fa-times" />
                  </button>
              : null*/}
            </div>
            {!this.props.disabled 
              ? <button
                  type="button"
                  className="btn btn-grey border-left btn-no-radius"
                  onClick={!this.props.disabled ? this.opPlaceDate : null}>
                  <i className="fa fa-lg fa-calendar-alt" />
                </button> 
              : null}
          </div>
          {this.state.calendarVisible && 
          <div className={"content active"}>
              <Calendar
                date={this.state.datePicker}
                onChange={this.handleSelectDate}
                color="#004c97" /> 
          </div>}
        </div>
      </div>
    )
  }

}

export default Pages