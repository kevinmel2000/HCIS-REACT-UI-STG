import React, { Component } from 'react'

class Statistic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      value: this.props.value,
      label: this.props.label
    }
  }

  render() {
    return (
      <div className="card">
        <div className="padding-10px background-white border-bottom">
          <div className="txt-site txt-bold text-main txt-12">
            { this.state.title }
          </div>
          <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
            { this.state.subtitle }
          </div>
        </div>
        <div className="padding-15px">
          <div className="margin-15px txt-site txt-main txt-big txt-bold">
            { this.state.value }
          </div>
          <div className="margin-bottom-20px txt-site txt-primary txt-11">
            { this.state.label }
          </div>
        </div>
      </div>
    )
  }
}

export default Statistic