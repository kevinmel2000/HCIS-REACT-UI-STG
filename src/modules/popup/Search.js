import React, { Component } from 'react'

var opContentPopup = 'search-content active'
var clContentPopup = 'search-content'
var opSearchPicker = 'search-picker active'
var clSearchPicker = 'search-picker'

class Pages extends Component {

  constructor () {
    super()
    this.state = {
    	searchClass: clContentPopup,
      searchPicker: clSearchPicker,
      searchContent: clContentPopup,
    	valSearch: '',
    }
  }

  handleClickOutside(element) {
    // console.log(element)
    const outsideclickListener = event => {
      if (!element.contains(event.target)) {
        this.setState({searchContent: clContentPopup})
        this.setState({searchPicker: clSearchPicker})
        removeClickListener()
      }
    }

    const removeClickListener = () => {
      this.setState({searchContent: clContentPopup})
      this.setState({searchPicker: clSearchPicker})
      document.removeEventListener('click', outsideclickListener)
    }

    document.addEventListener('click', outsideclickListener)
  }

  opFormSearch = () => {
    var element = document.getElementById('app-search')
    this.handleClickOutside(element)
    this.setState({searchPicker: opSearchPicker})
  }

  clFormSearch = () => {
    this.setState({searchPicker: opSearchPicker})
  }

  keyUpSearch = (event) => {
    var dt = event.target.value;
    this.setState({valSearch: dt})

    if (dt.length > 0) { 
      this.setState({searchContent: opContentPopup})
    } else {
      this.setState({searchContent: clContentPopup})
    }
  }


  contentSearch = (length) => {
    var data = []
    for (var i = 0; i < length; ++i) {
      data.push(
      <div className="card-notif" key={i}>
        <div className="c-n-col-1">
          <div className="image image-40px background-blue"></div>
        </div>
        <div className="c-n-col-2">
          <div className="txt-site txt-description txt-bold txt-main">
            Name of Item
          </div>
          <div className="txt-site txt-description txt-bold color-orange">
            Rp. 25.000.000
          </div>
        </div>
      </div>)
    }
    return data
  }

  render () {
		return (
      <div 
        className={this.state.searchPicker}
        id="app-search">

        <form onSubmit={this.opSearch}>
          <div className="search-form">
            <div className="search-button">
              <button 
                type="button" 
                className="btn btn-circle"
                onClick={this.opFormSearch}>
                <i className="icn fa fa-1x fa-search" />
              </button>
            </div>
            <div className="search-input">
              <input 
                type="search"
                name="search"
                className="txt"
                placeholder="Search.."
                onChange={this.keyUpSearch}
                value={this.state.valSearch} />
            </div>
          </div>
        </form>

        <div className={this.state.searchContent}>
          <div className="search-place">
            { this.contentSearch(8) }
          </div>
        </div>

      </div>
    )
	}

}

export default Pages