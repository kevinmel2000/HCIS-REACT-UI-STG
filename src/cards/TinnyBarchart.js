import React, { Component } from 'react'
import {
    BarChart, Bar, Cell, XAxis, ResponsiveContainer
} from 'recharts'

// const TITLE = ['Hired']

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

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
  }

  render() {
    return (
      <div className="card">
        <div className="padding-10px background-white border-bottom">
          <div className="txt-site txt-bold text-main txt-12">
            { this.state.title }
          </div>
          {(this.state.subtitle) ? 
          <div className="txt-site txt-thin text-primary txt-9 margin-top-5px">
            { this.state.subtitle }
          </div>
          : null}
        </div>
        <div>
          <div className="padding-10px txt-site txt-9">
            <ResponsiveContainer 
              width='100%' 
              aspect={4.0/2.8}>
              <BarChart width={150} height={50} data={this.state.data}>
                <Bar dataKey="totalEmployee">
                  {
                    this.state.data.map(
                      (entry, index) => <Cell 
                        key={`cell-${index}`} 
                        fill={this.state.colors[index % this.state.colors.length]} />
                    )
                  }
                </Bar>
                <XAxis dataKey="division" />
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
    let val = this.state.data.length

    for (let index = 0; index < val; index++) {
      dt.push(
        <div className="display-flex-normal padding-5px" key={index}>
          <div className="width width-20px">
            <span 
              className="fa fa-lw fa-circle" 
              style={{color: this.state.colors[index]}} /> 
          </div>
          <div className="txt-site txt-main txt-thin txt-11">
            { this.state.data[index].division }
          </div>
        </div>
      )
    }

    return dt
  }

}

export default CardBartChart