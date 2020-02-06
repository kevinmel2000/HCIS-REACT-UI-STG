import React, { Component } from 'react'

class Statistic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      colorStatus: this.props.colorStatus
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
              <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">65 Employees</div>
          </div>
        </div>
        <div className="padding-15px">
            <div className="display-flex">
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
            </div>

            <div className="padding-10px"></div>

            <div className="display-flex">
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
            </div>

            <div className="padding-10px"></div>

            <div className="display-flex">
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
                <div 
                    className="image image-circle image-40px"
                    style={{backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")'}}>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default Statistic