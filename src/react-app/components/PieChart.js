import React from "react";
import Chart from "react-apexcharts";

const data = {

    series: [44, 55, 13, 43],
    options: {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'front'
                }
            }
        }]
    },
};


export const Monitor = () => {
    return (
        <div className="app">
            <Chart
                options={data.options}
                series={data.series}
                type="pie"
                width="500"
            />
            <div className='threeCharts'>
                <Chart
                    options={data.options}
                    series={data.series}
                    type="pie"
                    width="300"
                />
                <Chart
                    options={data.options}
                    series={data.series}
                    type="pie"
                    width="300"
                />
                <Chart
                    options={data.options}
                    series={data.series}
                    type="pie"
                    width="300"
                />
            </div>
            <style jsx>{`
              .app {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
              }

              .threeCharts {
                display: flex;
                margin: 20px 10px;
              }
            `}</style>
        </div>
    );
}
