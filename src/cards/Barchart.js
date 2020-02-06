import React, { Component } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

class CardBartChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      title: this.props.title,
      subtitle: this.props.subtitle,
      data: this.props.data,
      colors: this.props.colors,
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
          <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
            { this.state.subtitle }
          </div>
        </div>
        <div>
          <div className="padding-10px txt-site txt-9">
            <ResponsiveContainer 
              width='100%' 
              aspect={4.0/2.8}>
              <BarChart
                data={this.state.data}
                margin={{
                  top: 0, right: 0, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                
                  {
                    this.state.dataKey.map(
                      (entry, index) => <Bar 
                        key={index}
                        // key={`bar-${index}`}
                        stackId='a'
                        dataKey={entry.key}
                        fill={entry.color} />
                    )
                  }
                
                {/* <Bar dataKey="Hired" stackId="a" fill="#8884d8" />
                <Bar dataKey="Promoted" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Resigned" stackId="a" fill="#ffc658" /> */}
              </BarChart>
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