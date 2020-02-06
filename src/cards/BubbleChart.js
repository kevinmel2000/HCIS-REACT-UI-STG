import React, { Component } from 'react'
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const data = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
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
              <ScatterChart
                // width={400}
                // height={400}
                margin={{
                  top: 0, right: 0, bottom: 0, left: 0,
                }} >
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="A school" data={data} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>

            {/* <div className="padding-15px">
              <div className="display-flex-normal txt-site txt-center" style={{margin: 'auto'}}>
                { this.BarInfo() }
              </div>
            </div> */}

          </div>
        </div>
      </div>
    )
  }

  // BarInfo = () => {
  //   let dt = []
  //   let val = this.state.dataKey.length

  //   for (let index = 0; index < val; index++) {
  //     dt.push(
  //       <div className="display-flex-normal padding-5px">
  //         <div className="width width-20px">
  //           <span 
  //             className="fa fa-lw fa-circle" 
  //             style={{color: this.state.dataKey[index].color}} /> 
  //         </div>
  //         <div className="txt-site txt-main txt-thin txt-11">
  //           { this.state.dataKey[index].key }
  //         </div>
  //       </div>
  //     )
  //   }

  //   return dt
  // }

}

export default CardBartChart