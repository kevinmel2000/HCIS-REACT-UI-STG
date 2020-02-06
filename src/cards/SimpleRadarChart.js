import React, { Component } from 'react'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'

const data = [
  {
    subject: 'Math', A: 120, B: 110, fullMark: 150,
  },
  {
    subject: 'Chinese', A: 98, B: 130, fullMark: 150,
  },
  {
    subject: 'English', A: 86, B: 130, fullMark: 150,
  },
  {
    subject: 'Geography', A: 99, B: 100, fullMark: 150,
  },
  {
    subject: 'Physics', A: 85, B: 90, fullMark: 150,
  },
  {
    subject: 'History', A: 65, B: 85, fullMark: 150,
  },
]

class CardBartChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      title: this.props.title,
      data: this.props.data,
      dataKey: this.props.dataKey
    }
  }
  
  componentDidMount () {
    console.log('data', this.state.dataKey)
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <div className="card">
        <div className="padding-10px background-white border-bottom">
          <div className="txt-site txt-bold text-main txt-12">
            { this.state.title }
          </div>
        </div>
        <div>
          <div className="padding-10px txt-site txt-9">
            <ResponsiveContainer 
              width='100%' 
              aspect={4.0/2.8}>
              <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>

            <div className="padding-15px">
              <div className="display-flex-normal txt-site txt-center" style={{margin: 'auto'}}>
                { this.BarInfo() }
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  BarInfo = () => {
    let dt = []
    let val = this.state.dataKey.length

    for (let index = 0; index < val; index++) {
      dt.push(
        <div className="display-flex-normal padding-5px">
          <div className="width width-20px">
            <span 
              className="fa fa-lw fa-circle" 
              style={{color: this.state.dataKey[index].color}} /> 
          </div>
          <div className="txt-site txt-main txt-thin txt-11">
            { this.state.dataKey[index].key }
          </div>
        </div>
      )
    }

    return dt
  }

}

export default CardBartChart