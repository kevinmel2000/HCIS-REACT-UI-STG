import React, { Component } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class CardPieChart extends Component {
	
	constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      title: this.props.title,
      subtitle: this.props.subtitle,
      data: this.props.data,
      colors: this.props.colors,
      total: this.props.total
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
                    
        <div className="padding-10px background-white">
            <div className="txt-site txt-bold text-main txt-12">
                { this.state.title }
            </div>
            <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                { this.state.subtitle }
            </div>
        </div>

        <div className="display-flex-normal">

            <div className="width width-full txt-site txt-9">
                <ResponsiveContainer 
                    width='100%' 
                    aspect={1.3}>
                        <PieChart style={{
                            margin: 'auto',
                            }}>
                            <Pie
                            data={this.state.data}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            fill="#8884d8"
                            dataKey="totalEmployee"
                            >
                            {
                                this.state.data.map(
                                    (entry, index) => <Cell 
                                        key={`cell-${index}`} 
                                        fill={this.state.colors[index % this.state.colors.length]} />
                                )
                            }
                            </Pie>
                        </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="width width-150px margin-top-20px padding-5px">
                { this.PieInfo() }
            </div>
        </div>

        <div className="padding-10px display-flex-normal">
            <div className="width width-full">
                <span className="txt-site txt-10 txt-thin txt-main">25 employess not filled birth date in profile data.</span>
            </div>
            <div className="width width-150px content-right">
                <span className="txt-site txt-small txt-bold txt-main">{this.props.total} </span>
                <span className="txt-site txt-10 txt-thin txt-primary">Total</span>
            </div>
        </div>
      </div>
    )
  }

  PieInfo = () => {
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
            { this.state.data[index].bizValue }
          </div>
        </div>
      )
    }

    return dt
  }

}

export default CardPieChart