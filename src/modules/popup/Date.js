import React, { Component } from 'react'
import InputMoment from 'input-moment'
import moment from 'moment'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
    	placeDate: false,
    	moment: moment(),
    }
  }

  handleClickOutside(element) {
    // console.log(element)
    const outsideclickListener = event => {
      if (!element.contains(event.target)) {
        element.style.display = 'none'
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      // this.setState({smallProfileClass: clActivePopup})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  clPlaceDate = () => {
    var element = document.getElementById('app-date-picker')
    element.style.display = 'none'
  }

  opPlaceDate = () => {
    var element = document.getElementById('app-date-picker')
    element.style.display = 'block'
    this.handleClickOutside(element)

    // if (this.state.placeDate == false) { 
    //   this.setState({placeDate: true})
    // } else {
    //   this.setState({placeDate: false})
    // }
  }

  handleChange = moment => {
    this.setState({moment})
  }

  handleSave = () => {
    console.log('saved', this.state.moment.format('llll'))
  }
  

  render () {
		return (
      <div>
      	<div className="card-date-picker">
          <div className="double">
            <div className="input">
              <input
                type="text"
                className="ip"
                readOnly
                value={ this.state.moment.format('llll') } />
            </div>
            <button 
              type="button" 
              className="btn btn-grey border-left btn-no-radius" 
              onClick={this.opPlaceDate}>
              <i className="fa fa-lg fa-calendar-alt" />
            </button>
          </div>

          {/* {(this.state.placeDate) ? ( */}
            <div className="content" style={{display: 'none'}} id="app-date-picker">
              <div>
                {/*<Calendar 
                  date={ this.state.datePicker } 
                  onChange={ this.handleSelectDate }
                  color="#2ecc71" />*/}
                <InputMoment
                  moment={this.state.moment}
                  onChange={this.handleChange}
                  minStep={1} 
                  hourStep={1} 
                  prevMonthIcon="fa fa-1x fa-angle-left" 
                  nextMonthIcon="fa fa-1x fa-angle-right" />
              </div>
            </div>
          {/* ) : (
            <div></div>
          )} */}
      	</div>
      </div>
    )
	}

}

export default Pages