/**
 * >>> <BasicCard graphData={graphData} nodeInfo={nodeInfo}/>
 *
 * Requirement list
 * import Chart from "react-apexcharts";
 * import Card from '@mui/material/Card';
 * import Typography from '@mui/material/Typography';
 * import Box from '@mui/material/Box'
 *
 * You can use like below
 *
 * <BasicCard graphData={graphData} nodeInfo={nodeInfo}/>
 *
 * const graphData = [
 *     {
 *         series: [44, 33],
 *         labels: ['e', 'f'],
 *         width: 300,
 *         title: 'one',
 *     },
 *     {
 *         series: [44, 22],
 *         labels: ['a', 'b'],
 *         width: 300,
 *         title: 'two',
 *     }]
 * const nodeInfo = {
 *     nodeName: 'Alfa',
 *     ip: '11.12.233.2',
 *     region: 'Istanbul',
 * }
 */

import React from 'react';
import Chart from "react-apexcharts";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UseData = ({series, labels, width, title}) => {
    const p1 = {
        series: [44, 55, 13, 43],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D'],
            theme: {
                monochrome: {
                    enabled: true
                }
            },
            title: {
                text: 'Pie',
            },
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
        }
    }

    p1.options.labels = labels;
    p1.options.title.text = title;

    return (
        <Chart
            series={series}
            options={p1.options}
            width={width}
            type={"pie"}
        />
    )

}

const Monitor = ({data}) => {
    const dataList = data.map((element, index) => {
        return <UseData
            series={element.series}
            labels={element.labels}
            width={element.width}
            title={element.title}
            key={index}
        />
    })

    return (
        <div className="app">
            {dataList}
            <style jsx>{`
              .app {
                display: flex;
              }
            `}</style>
        </div>
    );
}

export default function BasicCard({graphData, nodeInfo}) {

    console.log(nodeInfo)

    return (
        <Card sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'fit-content',
            height: 'fit-content',
            flexDirection: 'column',
        }}>
            <Monitor data={graphData}/>
            <Box className='boxStyle' sx={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
            }}>
                <Typography variant="h6" gutterBottom>
                    Node Adı: <span>{nodeInfo.nodeName}</span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Ip: <span>{nodeInfo.ip}</span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Bölge: <span>{nodeInfo.region}</span>
                </Typography>
                <style jsx>{`
                  span {
                    color: rgba(0, 157, 255, 0.65);
                  }
                `}</style>
            </Box>
        </Card>
    );
}

const objeData = [
    {
        series: [44, 33],
        labels: ['e', 'f'],
        width: 300,
        title: 'one',
    },
    {
        series: [44, 22],
        labels: ['a', 'b'],
        width: 300,
        title: 'two',
    },
    {
        series: [44, 22],
        labels: ['a', 'b'],
        width: 300,
        title: 'two',
    }]

const textData = {
    nodeName: 'Alfa',
    ip: '12.13.244.3',
    region: 'İstanbul',
}

