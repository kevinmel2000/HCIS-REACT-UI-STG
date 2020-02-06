import React, { Component } from 'react'
import TimePicker from 'react-times'

class Pages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeState: this.props.time ? this.props.time : ""
    }
  }

  // componentWillMount() {
  //   console.log('time', this.props.time)
  // }

  onTimeChange(options) {
    // do something
    var t = options.hour + ':' + options.minute
    var p = options.hour + ':' + options.minute + ':00'

    // console.log('now', t)

    this.setState({
      timeState: t
    })

    this.props.onChange(p)

  }

  onFocusChange(focusStatue) {
    // do something
    // console.log(focusStatue)

    // if (focusStatue === false) {
    //   var p = this.state.timeState

    //   console.log('time', p)
    //   this.props.onChange(p)
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.time !== prevProps.time) {
      this.setState({
        timeState: this.props.time
      })
    }
  }

  render() {
    return (
      <div className="card-time-picker">
        <TimePicker
          showTimezone
          // focused
          withoutIcon
          time={this.state.timeState}
          disabled={this.props.disabled}
          // theme="material"
          // timeMode="12"
          // timezone="America/New_York"
          onFocusChange={this.onFocusChange.bind(this)}
          onTimeChange={this.onTimeChange.bind(this)}
        />
      </div>
    )
  }
}

export default Pages