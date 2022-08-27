/**
 * export default function CustomizedTables({rows})
 *
 * function createData(clusterName, condition, health, ratio, untitled) {
 * 	return {condition, clusterName, health, ratio, untitled};
 * }
 *
 * const rows = [
 * 	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
 * 	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
 * 	createData('Eclair', 262, 16.0, 24, 6.0),
 * 	createData('Cupcake', 305, 3.7, 67, 4.3),
 * 	createData('Gingerbread', 356, 16.0, 49, 3.9),
 * ];
 *
 *
 * need requirements
 * import * as React from 'react';
 * import {styled} from '@mui/material/styles';
 * import Table from '@mui/material/Table';
 * import TableBody from '@mui/material/TableBody';
 * import TableCell, {tableCellClasses} from '@mui/material/TableCell';
 * import TableContainer from '@mui/material/TableContainer';
 * import TableHead from '@mui/material/TableHead';
 * import TableRow from '@mui/material/TableRow';
 * import Paper from '@mui/material/Paper';
 * import SmallPieChart from "./SmallPieChart";
 * import {useEffect, useState} from "react";
 * import {Button} from "@mui/material";
 * import BasicCard from "../NodeInfoCard";
 * import {FaSort, FaSortAlphaDown} from 'react-icons/fa';
 */

import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SmallPieChart from "./SmallPieChart";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import BasicCard from "../NodeInfoCard";
import {FaSort, FaSortAlphaDown} from 'react-icons/fa';



const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#033e8a",
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:hover': {
		boxShadow: "0 0 15px -7px",
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

function createData(clusterName, condition, health, ratio, untitled) {
	return {condition, clusterName, health, ratio, untitled};
}

export const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function CustomizedTables({rows}) {

	const [position, setPosition] = useState(true);
	const [data, setData] = useState(rows);
	const [reRender, setReRender] = useState(true);

	function handleOnClick(row) {
		setPosition(!position);
	}

	function comeBack() {
		if (!position)
			setPosition(!position);
	}

	function handleClickSortName() {
		const oldData = data;
		oldData.sort((a, b) => {
			if (a.clusterName < b.clusterName)
				return -1;
			else if (a.clusterName > b.clusterName)
				return 1;
			return 0;
		})
		setData(oldData);
		setReRender(!reRender);
	}

	function handleClickSortCondition() {
		const oldData = data;
		oldData.sort((a, b) => {
			if (a.condition < b.condition)
				return -1;
			else if (a.condition > b.condition)
				return 1;
			return 0;
		})
		setData(oldData);
		setReRender(!reRender);
	}

	function handleClickSortHealth() {
		const oldData = data;
		oldData.sort((a, b) => {
			if (a.health < b.health)
				return -1;
			else if (a.health > b.health)
				return 1;
			return 0;
		})
		setData(oldData);
		setReRender(!reRender);
	}

	function handleClickSortRatio() {
		const oldData = data;
		oldData.sort((a, b) => {
			if (a.ratio < b.ratio)
				return -1;
			else if (a.ratio > b.ratio)
				return 1;
			return 0;
		})
		setData(oldData);
		setReRender(!reRender);
	}

	return (
		position ?
			<TableContainer sx={{maxWidth: 1200, margin: '20px'}} component={Paper}>
				<Table sx={{minWidth: 700,}} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell style={{display: 'flex', alignItems: 'center'}}>Küme Adı
								<FaSortAlphaDown onClick={handleClickSortName}/></StyledTableCell>
							<StyledTableCell align="right">Durum
								<FaSortAlphaDown onClick={handleClickSortCondition}/></StyledTableCell>
							<StyledTableCell align="right">Altyapı Sağlığı
								<FaSortAlphaDown onClick={handleClickSortHealth}/></StyledTableCell>
							<StyledTableCell align="right">Oran
								<FaSortAlphaDown onClick={handleClickSortRatio}/></StyledTableCell>
							<StyledTableCell align="right">???
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row) => (
							<StyledTableRow
								key={row.clusterName}
								onClick={() => handleOnClick(row)}
								style={{cursor: 'pointer',}}>
								<StyledTableCell component="th" scope="row">
									{row.clusterName}
								</StyledTableCell>
								<StyledTableCell align="right">{row.condition}</StyledTableCell>
								<StyledTableCell align="right">{row.health}</StyledTableCell>
								<StyledTableCell align="right">
									<SmallPieChart ratio={row.ratio}/>
								</StyledTableCell>
								<StyledTableCell align="right">{row.untitled}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer> :
			<div style={{margin: '20px'}}>
				<Button variant="contained"
						sx={{width: 'fit-content',}}
						onClick={comeBack}>Geri</Button>
				<div style={{margin: '20px'}}>
					<BasicCard graphData={objeData} nodeInfo={textData}/>
				</div>
			</div>
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
	}]

const textData = {
	nodeName: 'Alfa',
	ip: '12.13.244.3',
	region: 'İstanbul',
}