import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
    useGetDashboardStatsByCPQuery,
    useGetTransactionsByCPQuery,
} from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import StatBox from "components/StatBox";
import { Email, PersonAdd, PointOfSale, Traffic } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import FlexEnd from "components/FlexEnd";
import DatePickerRange from "scenes/CPDetails/DatePickerRange";
import OverviewChart from "./OverviewChart";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ id }) {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const { data, isLoading } = useGetTransactionsByCPQuery(id);
    const { data: dataCP, isLoading: isLoadingCP } =
        useGetDashboardStatsByCPQuery({ cp: id });
    const [value, setValue] = React.useState(0);
    const [value2, setValue2] = React.useState(0);
    const [dateTitle, setDateTitle] = React.useState("Last 7 Days")
    const [graphData, setGraphData] = React.useState(null);
    const [isLoadingCPGraph, setIsLoadingCPGraph] = React.useState(true);
    const [unit, setUnit] = React.useState("hour");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleChange2 = (event, newValue) => {
        setValue2(newValue);
    };

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    const usdPrice = {
        type: "number",
        valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    };

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const columns = [
        // {
        //   field: "chargerPointId",
        //   headerName: "ID",
        //   flex: 0.5,
        // },
        {
            field: "transactionId",
            headerName: "Transaction Id",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "user",
            headerName: "User",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "start_timestamp",
            headerName: "Start Time",
            flex: 1,
            headerAlign: "center",
            align: "center",
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
        },
        {
            field: "start_value",
            headerName: "Start Value",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueFormatter: ({ value }) => numberWithCommas(value),
        },
        {
            field: "stop_timestamp",
            headerName: "Stop Time",
            flex: 1,
            headerAlign: "center",
            align: "center",
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
        },
        {
            field: "stop_value",
            headerName: "Stop Value",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueFormatter: ({ value }) => numberWithCommas(value),
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            headerAlign: "center",
            align: "center",
            ...usdPrice,
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                >
                    <Tab label="Overview" {...a11yProps(0)} />
                    <Tab label="Sessions" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box m="1.5rem 2.5rem">
                    <FlexEnd>
                        {/* <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> */}
                        <Box>
                            <Typography variant="subtitle2" component="p">
                                {dateTitle}
                            </Typography>
                            <DatePickerRange
                                setGraphData={setGraphData}
                                setUnit={setUnit}
                                setIsLoadingGraph={setIsLoadingCPGraph}
                                setDateTitle={setDateTitle}
                                id={id}
                            />
                        </Box>
                    </FlexEnd>
                    {/* <Box
                        mt="20px"
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gridAutoRows="160px"
                        gap="20px"
                        sx={{ "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" } }}
                    > */}
                    {/* <StatBox title="Sales Today" value={dataCP && dataCP.salesToday.length > 0 && currencyFormatter.format(Number(dataCP.salesToday[0].sales)) || "$ 0"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Sales Month" value={dataCP && dataCP.salesMonth.length > 0 && currencyFormatter.format(Number(dataCP.salesMonth[0].sales)) || "$ 0"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Sales Year" value={dataCP && dataCP.salesYear.length > 0 && currencyFormatter.format(Number(dataCP.salesYear[0].sales)) || "$ 0"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />        
                        
                        <StatBox title="Power Today" value={dataCP && dataCP.powerToday.length > 0 && (dataCP.powerToday[0].power)/1000 + " KWh"|| "0 Kwh"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Power Month" value={dataCP && dataCP.powerMonth.length > 0 && (dataCP.powerMonth[0].power)/1000 + " KWh" || "0 Kwh"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Power Year" value={dataCP && dataCP.powerYear.length > 0 && (dataCP.powerYear[0].power)/1000 + " KWh" || "$ 0 Kwh"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Power Year" value={dataCP && dataCP.powerYear.length > 0 && (dataCP.powerYear[0].power)/1000 + " KWh" || "$ 0 Kwh"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                    <StatBox title="Power Year" value={graphData && graphData.salesByPeriod.length > 0 && (graphData.salesByPeriod[0].SUM) + " $" || "$ 0"} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} /> */}
                    <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={value2}
                                onChange={handleChange2}
                                aria-label="basic tabs example"
                            >
                                <Tab
                                    sx={{ textTransform: "capitalize" }}
                                    label={
                                        <>
                                            <div >Sales</div>
                                            <p style={{ fontSize: 18 }}>
                                                {(graphData &&
                                                    graphData.salesByPeriod.length > 0 &&
                                                    currencyFormatter.format(
                                                        Number(graphData.salesByPeriod[0].SUM)
                                                    )) ||
                                                    "$ 0"}
                                            </p>
                                        </>
                                    }
                                    wrapped
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    sx={{ textTransform: "capitalize" }}
                                    label={
                                        <>
                                            <div>Power</div>
                                            <p style={{ fontSize: 18 }}>
                                                {(graphData &&
                                                    graphData.powerByPeriod.length > 0 &&
                                                    numberWithCommas(
                                                        graphData.powerByPeriod[0].SUM / 1000
                                                    ) + " Kwh") ||
                                                    " 0 kwh"}
                                            </p>
                                        </>
                                    }
                                    wrapped
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={value2} index={0}>
                            <Box
                                mt="20px"
                                display="grid"
                                gridTemplateColumns="repeat(12, 1fr)"
                                gridAutoRows="160px"
                                gap="20px"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMediumScreens ? undefined : "span 12",
                                    },
                                }}
                            >
                                <Box
                                    gridColumn="span 12"
                                    gridRow="span 3"
                                    backgroundColor={theme.palette.background.alt}
                                    p="1rem"
                                    borderRadius="0.55rem"
                                >
                                    <OverviewChart
                                        view="sales"
                                        isDashboard={true}
                                        data={graphData}
                                        unit={unit}
                                        isLoading={isLoadingCPGraph}
                                    />
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value={value2} index={1}>
                            <Box
                                mt="20px"
                                display="grid"
                                gridTemplateColumns="repeat(12, 1fr)"
                                gridAutoRows="160px"
                                gap="20px"
                                sx={{
                                    "& > div": {
                                        gridColumn: isNonMediumScreens ? undefined : "span 12",
                                    },
                                }}
                            >
                                <Box
                                    gridColumn="span 12"
                                    gridRow="span 3"
                                    backgroundColor={theme.palette.background.alt}
                                    p="1rem"
                                    borderRadius="0.55rem"
                                >
                                    <OverviewChart
                                        view="power"
                                        isDashboard={true}
                                        data={graphData}
                                        unit={unit}
                                        isLoading={isLoadingCPGraph}
                                    />
                                </Box>
                            </Box>
                        </TabPanel>
                    </Box>

                    {/* <StatBox title="Monthly Sales" value={data && data.salesMonth.length > 0 &&  currencyFormatter.format(Number(data.salesMonth[0].SUM)) || 0} increase="+5%" description="Since last month" icon={<PersonAdd  sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                        <StatBox title="Yearly Sales" value={data && data.salesYear.length > 0 && currencyFormatter.format(Number(data.salesYear[0].SUM)) || 0 } increase="+43%" description="Since last month" icon={<Traffic sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} /> */}
                    {/* <Box gridColumn="span 12" gridRow="span 3" backgroundColor={theme.palette.background.alt} p="1rem" borderRadius="0.55rem"><OverviewChart view="sales" isDashboard={true} data={graphData} unit={unit} isLoading={false}/></Box> */}
                    {/* </Box> */}
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Box m="1.5rem 2.5rem">
                    <Header title="CUSTOMERS" subtitle="List of Customers" />
                    <Box
                        mt="40px"
                        height="75vh"
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme.palette.background.alt,
                                color: theme.palette.secondary[100],
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme.palette.primary.light,
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme.palette.background.alt,
                                color: theme.palette.secondary[100],
                                borderTop: "none",
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: `${theme.palette.secondary[200]} !important`,
                            },
                        }}
                    >
                        <DataGrid
                            loading={isLoading || !data}
                            getRowId={(row) => row._id}
                            rows={data || []}
                            columns={columns}
                        />
                    </Box>
                </Box>
            </TabPanel>
        </Box>
    );
}
