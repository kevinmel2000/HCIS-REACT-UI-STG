import React, { Component } from 'react'

class Statistic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      data: this.props.data,
      icon:this.props.icon
    }
  }

  render() {
    return (
      <div className="card">
        <div className="padding-10px background-white display-flex-normal">
          <div className="width width-full">
            <div className="txt-site txt-bold text-main txt-12">
                { this.state.title }
            </div>
            <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                { this.state.subtitle }
            </div>
          </div>
          <div className="width width-90px" style={{height: '25px', borderRadius: '25px', backgroundColor: '#0088FE'}}>
              <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">This Month</div>
          </div>
        </div>
        <div className="display-flex-normal padding-10px">
          <i className={this.state.icon} />
        </div>
        <div className="display-flex-normal padding-bottom-20px padding-top-10px">
            {this.props.data.map((dt, idx) => {
                return (<div className="padding-10px">
                    <div className="margin-bottom-10px txt-site txt-main txt-big txt-bold">
                        { dt.value }
                    </div>
                    <div className="margin-bottom-15px txt-site txt-thin txt-safe txt-11">
                        { dt.label }
                    </div>
                </div>)
            })}
        </div>
      </div>
    )
  }
}

export default Statistic