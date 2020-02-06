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
      data: this.props.data,
      colors: this.props.colors
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
        </div>

        <div className="padding-bottom-10px txt-site txt-11">
          <ResponsiveContainer 
            width='100%' 
            aspect={4.0/2.8}>
	        	<PieChart style={{
	        		margin: 'auto',
	        		}}>
			        <Pie
			          data={this.state.data}
			          labelLine={false}
                label={renderCustomizedLabel}
                // innerRadius={80}
                // outerRadius={100}
                // paddingAngle={5}
			          fill="#8884d8"
			          dataKey="value"
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

          <div className="padding-15px">
            <div className="display-flex-normal">
              { this.PieInfo() }
            </div>
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
            { this.state.data[index].name }
          </div>
        </div>
      )
    }

    return dt
  }

}

export default CardPieChart