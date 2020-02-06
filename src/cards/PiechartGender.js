import React, { Component } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Male', value: 400 },
  { name: 'Female', value: 300 }
];

const COLORS = ['#0088FE', '#00C49F'];

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

class CardPieChartGender extends Component {
	
	state = {
    activeIndex: 0,
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <div className="card">
                    
        <div className="padding-10px background-white border-bottom">
          <div className="txt-site txt-bold text-main txt-12">Employee by Gender</div>
        </div>

        <div className="padding-bottom-10px txt-site txt-11">
          <ResponsiveContainer 
            width='100%' 
            aspect={4.0/2.8}>
	        	<PieChart style={{
	        		margin: 'auto',
	        		}}>
			        <Pie
			          data={data}
			          labelLine={false}
			          label={renderCustomizedLabel}
			          outerRadius={90}
			          fill="#8884d8"
			          dataKey="value"
			        >
			          {
			            data.map(
			            	(entry, index) => <Cell 
			            		key={`cell-${index}`} 
			            		fill={COLORS[index % COLORS.length]} />
			            )
			          }
			        </Pie>
			      </PieChart>
          </ResponsiveContainer>

          <div className="padding-15px">
            <div>
              { this.PieInfo() }
            </div>
          </div>

        </div>
      </div>
    )
  }

  PieInfo = () => {
    let dt = []
    let val = data.length

    for (let index = 0; index < val; index++) {
      dt.push(
        <div className="margin-5px" key={index}>
          <span className="fa fa-lw fa-circle" style={{color: COLORS[index], marginRight: "7.5px"}} /> 
          <span className="txt-site txt-main txt-thin txt-11">{ data[index].name }</span>
        </div>
      )
    }

    return dt
  }

}

export default CardPieChartGender