import React, { Component } from 'react'

class Statistic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      colorStatus: this.props.colorStatus,
      data: this.props.data
    }
  }

  render() {
    return (
      <div className="card">
        <div className="padding-10px display-flex-normal">
          <div className="width width-full">
            <div className="txt-site txt-bold text-main txt-12">
                { this.state.title }
            </div>
            <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                { this.state.subtitle }
            </div>
          </div>
          <div className="width width-110px" style={{height: '25px', borderRadius: '25px', backgroundColor: this.state.colorStatus}}>
              <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">7 Employees</div>
          </div>
        </div>
        <div className="display-flex-normal">
            <div className="padding-15px txt-site txt-center">
                <div className="txt-site txt-center txt-main txt-bold txt-18 margin-bottom-15px">
                    Thomas Marty
                </div>
                <div 
                    className="image image-circle image-100px"
                    style={{
                        margin: 'auto',
                        backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'
                    }}>
                </div>
            </div>

            <div className="padding-15px txt-site txt-center">
                <div className="txt-site txt-center txt-main txt-bold txt-18 margin-bottom-15px">
                    Edison
                </div>
                <div 
                    className="image image-circle image-100px"
                    style={{
                        margin: 'auto',
                        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/9/9d/Thomas_Edison2.jpg")'
                    }}>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default Statistic