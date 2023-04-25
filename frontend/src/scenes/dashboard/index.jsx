import React, { useContext, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { DownloadOutlined, Email, PointOfSale, PersonAdd, Traffic, Block, Battery0Bar, BatteryFull, BatteryChargingFull, BlurCircular } from "@mui/icons-material";
import { Box, Button, Typography, useTheme, useMediaQuery, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetChargerPointsOnlineQuery, useGetDashboardQuery } from "state/api";
import StatBox from "components/StatBox";
import DatePickerRange from "./DatePickerRange";
import { Link } from "react-router-dom";
import { I18nContext } from '../../i18n'
import { ResponsivePie } from "@nivo/pie";
import BasicTabs from "./Graphs";


function getTimeDifference(date1, date2) {
    const diffInMs = Math.abs(date1 - date2);
    const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const minutes = Math.floor((diffInMs / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const seconds = Math.floor((diffInMs / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });

    return `${hours}:${minutes}:${seconds}`;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const usdPrice = { type: 'number', valueFormatter: ({ value }) => currencyFormatter.format(Number(value)) };
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Dashboard = () => {
    const theme = useTheme();
    const { translate: t } = useContext(I18nContext);

    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const { data, isLoading } = useGetDashboardQuery();
    const { data: dataOnline, isLoading: isLoadingOnline } = useGetChargerPointsOnlineQuery();
    console.log("🚀 ~ file: index.jsx:42 ~ Dashboard ~ isLoadingOnline:", isLoadingOnline)
    console.log("🚀 ~ file: index.jsx:42 ~ Dashboard ~ dataOnline:", dataOnline)

    
    const [graphData, setGraphData] = useState({
        salesGraph: [],
        salesByPeriod: []
    });
    const [unit, setUnit] = useState('hour');
    const [dateTitle, setDateTitle] = React.useState(t("dashboard.datePicker.title.last7Days"))

  
    // const dataPie = [
    //     {
    //         id: "online",
    //         label: "Online",
    //         value: isLoadingOnline ? Number((dataOnline.length && dataOnline[0].count / (dataOnline[0].count + dataOnline[1].count)) * 100).toFixed(2) : 0
    //     },
    //     {
    //         id: "offline",
    //         label: "Offline",
    //         value: isLoadingOnline ? Number((dataOnline[1].count / (dataOnline[0].count + dataOnline[1].count)) * 100).toFixed(2) : 0
    //     }
    // ]

    const columns = [
        //{ field: "_id", headerName: "ID", flex: 1 },
        // {
        //     field: "status", headerName: t("dashboard.datagrid.status"), flex: 0.5, sortable: false, renderCell: (params) => {
        //         const status = params.row?.chargerPointId?.connectors
        //         const connector = params.row?.connectorId
        //         if (status) {
        //             switch (status[connector - 1].status) {
        //                 case "Available":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <BlurCircular />
        //                         </Tooltip>
        //                     );
        //                 case "Available":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <BlurCircular />
        //                         </Tooltip>
        //                     );
        //                 case "Charging":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <BatteryChargingFull />
        //                         </Tooltip>
        //                     );
        //                 case "Finishing":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <BatteryFull />
        //                         </Tooltip>
        //                     );
        //                 case "Preparing":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <Battery0Bar />
        //                         </Tooltip>
        //                     );
        //                 case "SuspendedEVSE":
        //                 case "SuspendedEV":
        //                     return (
        //                         <Tooltip title={status[connector - 1].status} key={status[connector - 1]._id}>
        //                             <Block />
        //                         </Tooltip>
        //                     );

        //                 default:
        //                     return null;
        //             }
        //         }

        //     }
        // },
        {
            field: "chargerPointId", headerName: t("dashboard.datagrid.chargerPoint"), flex: 1, renderCell: (params) => {
                if (params.row.chargerPointId?._id) {
                    return (
                        <Link to={`/charger-stations/transactions/${params.row.chargerPointId._id}`} style={{
                            color: "inherit",
                            textDecoration: "inherit"
                        }}>{params.row.chargerPointId.charger_box_id} </Link>
                    )
                }
                return "NA"
            }
        },
        {
            field: "user", headerName: t("dashboard.datagrid.user"), flex: 1, renderCell: (params) => {
                if (params.row.user) {
                    return params.row.user.email
                } else {
                    return 'N/A'
                }
            }
        },
        { field: "connectorId", headerName: t("dashboard.datagrid.connectorId"), flex: 0.5, sortable: false },
        { field: "start_timestamp", headerName: t("dashboard.datagrid.startTime"), flex: 1, type: 'dateTime', valueFormatter: params => (new Date(params.value)).toLocaleString() },
        //{ field: "start_value", headerName: "start_value", flex: 1, valueFormatter: ({value}) => numberWithCommas(value) },
        { field: "stop_timestamp", headerName: t("dashboard.datagrid.stopTime"), flex: 1, type: 'dateTime', valueFormatter: params => (new Date(params.value)).toLocaleString() },
        //{ field: "stop_value", headerName: "stop_value", flex: 1, valueFormatter: ({value}) => numberWithCommas(value) },
        {
            field: "total_time", headerName: t("dashboard.datagrid.duration"), flex: 0.5, renderCell: (params) => {
                const startTime = new Date(params.row.start_timestamp)
                const stopTime = new Date(params.row.stop_timestamp)

                return getTimeDifference(startTime, stopTime)
            }
        },
        {
            field: "total_power", headerName: t("dashboard.datagrid.consumption"), flex: 0.5, renderCell: (params) => {
                const startValue = params.row.start_value
                const stopValue = params.row.stop_value
                return (stopValue - startValue) / 1000
            }
        },

        { field: "cost", headerName: t("dashboard.datagrid.cost"), flex: 0.5, ...usdPrice },
    ];



    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
                <Box>
                    <Typography variant="subtitle2" component="p">
                        {dateTitle}
                    </Typography>
                    <DatePickerRange setGraphData={setGraphData} setUnit={setUnit} isLoading={isLoading} setDateTitle={setDateTitle} />
                </Box>
            </FlexBetween>
            <Box
                mt="20px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{ "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" } }}
            >


                <StatBox title={t("dashboard.statbox.totalIncome")} value={data && data.totalSales.length > 0 && currencyFormatter.format(Number(data.totalSales[0].sum)) || 0} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                <StatBox title={t("dashboard.statbox.todayIncome")} value={data && data.salesToday.length > 0 && currencyFormatter.format(Number(data.salesToday[0].SUM)) || 0} increase="+21%" description="Since last month" icon={<PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                <Box gridColumn="span 8" gridRow="span 2" backgroundColor={theme.palette.background.alt} p="1rem" borderRadius="0.55rem">
                    <BasicTabs graphData={graphData} unit={unit} />
                </Box>
                <StatBox title={t("dashboard.statbox.monthIncome")} value={data && data.salesMonth.length > 0 && currencyFormatter.format(Number(data.salesMonth[0].SUM)) || 0} increase="+5%" description="Since last month" icon={<PersonAdd sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                <StatBox title={t("dashboard.statbox.yearIncome")} value={data && data.salesYear.length > 0 && currencyFormatter.format(Number(data.salesYear[0].SUM)) || 0} increase="+43%" description="Since last month" icon={<Traffic sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                {/* <Box gridColumn="span 8" gridRow="span 1" sx={{ "& .MuiDataGrid-root": { border: "none", borderRadius: "5rem" } }}> */}
                <StatBox title={t("dashboard.statbox.totalCP")} increase={isLoadingOnline && dataOnline ? dataOnline[0].count : 0} description={"Online"} value={data && data.CPcount} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />
                <StatBox title={t("dashboard.statbox.totalEnergy")} value={data && data.totalPower.length > 0 && new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 1,
                }).format((data.totalPower[0].sum) / 1000) + " kWh" || 0 + " kWh"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />

                <StatBox title={t("dashboard.statbox.todayEnergy")} value={data && data.powerToday.length > 0 && new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 1,
                }).format((data.powerToday[0].SUM) / 1000) + " kWh" || 0 + " kWh"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />

                <StatBox title={t("dashboard.statbox.monthEnergy")} value={data && data.powerMonth.length > 0 && new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 1,
                }).format((data.powerMonth[0].SUM) / 1000) + " kWh" || 0 + " kWh"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />

                <StatBox title={t("dashboard.statbox.yearEnergy")} value={data && data.powerYear.length > 0 && new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 1,
                }).format((data.powerYear[0].SUM) / 1000) + " kWh" || 0 + " kWh"} icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />} />


                <Box
                    gridColumn="span 2"
                    gridRow="span 1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    p="1.25rem 1rem"
                    flex="1 1 100%"
                    backgroundColor={theme.palette.background.alt}
                    borderRadius="0.55rem"
                >

                    <FlexBetween>
                        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
                        {t("dashboard.statbox.totalCPS")}
                        </Typography>
                        {data && data.CPcount}

                    </FlexBetween>
                    <FlexBetween>
                        <Typography variant="h6" sx={{ color: theme.palette.secondary[100], display: "flex", alignItems: "center" }}>
                            <div style={{ width: "px", height: "10px", borderRadius: "50px", background: "green", marginRight: "10px" }}></div> {t("dashboard.statbox.onlineCPS")}
                        </Typography>
                        {isLoadingOnline && dataOnline ? dataOnline[0].count : 0}
                    </FlexBetween>
                    <FlexBetween>
                        <Typography variant="h6" sx={{ color: theme.palette.secondary[100], display: "flex", alignItems: "center" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50px", background: "gray", marginRight: "10px" }}></div> {t("dashboard.statbox.offlineCPS")}
                        </Typography>
                        {data && data.CPcount && dataOnline ? data.CPcount - dataOnline[0].count : 0}
                    </FlexBetween>

                    <FlexBetween>
                        <Typography variant="h6" sx={{ color: theme.palette.secondary[100], display: "flex", alignItems: "center" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50px", background: "red", marginRight: "10px" }}></div> {t("dashboard.statbox.faultedCPS")}
                        </Typography>
                        0 
                    </FlexBetween>
                    {/* <ResponsivePie
      data={dataPie}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0} //
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      enableArcLinkLabels={false}
      legends={[
        {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemTextColor: '#000'
                    }
                }
            ]
        }
    ]}
    /> */}
                </Box>

                {/* </Box>    */}
                <Box gridColumn="span 12" gridRow="span 3" sx={{ "& .MuiDataGrid-root": { border: "none", borderRadius: "5rem" } }}>
                    <DataGrid loading={isLoading || !data} getRowId={(row) => row._id} rows={(data && data.recentTransactions) || []} columns={columns} />
                </Box>
            </Box>
        </Box>
    );
};



export default Dashboard;