import React, { Component } from 'react'
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// const data = [
//     {
//       name: 'Page A', uv: 590, pv: 800, amt: 1400, cnt: 490,
//     },
//     {
//       name: 'Page B', uv: 868, pv: 967, amt: 1506, cnt: 590,
//     },
//     {
//       name: 'Page C', uv: 1397, pv: 1098, amt: 989, cnt: 350,
//     },
//     {
//       name: 'Page D', uv: 1480, pv: 1200, amt: 1228, cnt: 480,
//     },
//     {
//       name: 'Page E', uv: 1520, pv: 1108, amt: 1100, cnt: 460,
//     },
//     {
//       name: 'Page F', uv: 1400, pv: 680, amt: 1700, cnt: 380,
//     },
// ]

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
  
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
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
              <ComposedChart
                  data={this.state.data}
                  margin={{
                    top: 0, right: 0, left: 0, bottom: 0,
                  }} >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {/* <Legend /> */}
                  <Area type="monotone" dataKey="pts" fill="#8884d8" stroke="#8884d8" />
                  <Bar dataKey="op" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="consultan" stroke="#ff7300" />
                  {/* <Scatter dataKey="cnt" fill="red" /> */}
              </ComposedChart>
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
        <div className="display-flex-normal padding-5px" key={index}>
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