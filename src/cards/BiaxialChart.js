import React, { Component } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

class CardBiaxialChart extends Component {

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
              <LineChart
                // width={500}
                // height={300}
                data={this.state.data}
                margin={{
                  top: 0, right: 0, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                {/* <YAxis yAxisId="right" orientation="right" /> */}
                <Tooltip />
                {/* /> */}

                {
                    this.state.dataKey.map(
                      (entry, index) => <Line 
                        key={index}
                        yAxisId="left" 
                        type="monotone"
                        dataKey={entry.key}
                        stroke={entry.color} />
                    )
                }
                {/* <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="uv" stroke="#82ca9d" />
                <Line yAxisId="left" type="monotone" dataKey="amt" stroke="#FF8042" /> */}
              </LineChart>
            </ResponsiveContainer>

            <div className="padding-15px">
              <div className="display-flex-normal txt-site txt-center" style={{margin: 'auto'}}>
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

export default CardBiaxialChart