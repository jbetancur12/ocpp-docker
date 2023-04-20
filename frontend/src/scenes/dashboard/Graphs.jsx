import React, { useContext, useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import DatePickerRange from './DatePickerRange';
import FlexEnd from "components/FlexEnd";
import OverviewChart from 'components/OverviewChart';
import { I18nContext } from 'i18n';

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



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
                <Box sx={{ margin: "16px 0px" }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


function Graphs({ graphData = { salesGraph: [], salesByPeriod: [] }, unit, isLoading }) {

    const theme = useTheme();
    const { translate: t } = useContext(I18nContext);
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [value, setValue] = useState(0);
    const [data, setData] = useState([])
    const [unitMeasure, setUnitMeasure] = useState("$")

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setUnitMeasure("$")
            setData(graphData.salesGraph.map(v => { return { x: v._id, y: v.sumIncome } }))
        }
        if (newValue === 1) {
            setUnitMeasure("kWh")
            setData(graphData.salesGraph.map(v => { return { x: v._id, y: v.sumPower } }))
        }
        if (newValue === 2) {
            setUnitMeasure("")
            setData(graphData.salesGraph.map(v => { return { x: v._id, y: v.sumTransactions } }))
        }
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    useEffect(() => {
        setData(graphData.salesGraph.map(v => { return { x: v._id, y: v.sumIncome } }))

    }, [graphData.salesGraph])

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                    sx={{
                        "&& .Mui-selected": {
                            boxShadow: "rgba(111, 126, 177, 0.1) -4px 0px 12px, rgba(111, 126, 177, 0.1) 4px 0px 12px",
                            color: "#090b0e"
                        },

                        "&& .MuiTab-root": {
                            padding: "0px 15px"
                        },

                        "&& .MuiTab-root  p":{
                            margin: 0, marginTop: "10px"
                        }

                    }}
                >
                    <Tab
                        sx={{ textTransform: "capitalize" }}
                        label={
                            <>
                                <div >{t("dashboard.tabpanel.title.income")}</div>
                                <p style={{ fontSize: 18 }}>
                                    {(graphData.salesByPeriod &&
                                        graphData.salesByPeriod.length > 0 &&
                                        currencyFormatter.format(
                                            Number(graphData.salesByPeriod[0].totalIncome)
                                        )) ||
                                        "$ 0"}
                                </p>
                            </>
                        } {...a11yProps(0)} />
                    <Tab sx={{ textTransform: "capitalize" }} label={
                        <>
                            <div>{t("dashboard.tabpanel.title.energy")}</div>
                            <p style={{ fontSize: 18 }}>
                                {(graphData &&
                                    graphData.salesByPeriod.length > 0 &&
                                    numberWithCommas(
                                        graphData.salesByPeriod[0].totalPower / 1000
                                    ) + " Kwh") ||
                                    " 0 kwh"}
                            </p>
                        </>
                    }  {...a11yProps(1)} />
                    <Tab sx={{ textTransform: "capitalize" }} label={
                        <>
                            <div>{t("dashboard.tabpanel.title.transactions")}</div>
                            <p style={{ fontSize: 18 }}>
                                {(graphData &&
                                    graphData.salesByPeriod.length > 0 &&
                                    numberWithCommas(
                                        graphData.salesByPeriod[0].totalTransactions
                                    )) ||
                                    " 0"}
                            </p>
                        </>
                    }{...a11yProps(2)} />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    gridAutoRows="105px"
                    gap="20px"
                    sx={{
                        "& > div": {
                            gridColumn: isNonMediumScreens ? undefined : "span 12",
                        },
                    }}
                >
                    <Box
                        gridColumn="span 12"
                        gridRow="span 2"
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="0.55rem"
                    >
                        <OverviewChart view="sales" isDashboard={true} data={data} unit={unit} isLoading={false} unitMeasure={unitMeasure} />
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    gridAutoRows="115px"
                    gap="20px"
                    sx={{
                        "& > div": {
                            gridColumn: isNonMediumScreens ? undefined : "span 12",
                        },
                    }}
                >
                    <Box
                        gridColumn="span 12"
                        gridRow="span 2"
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="0.55rem"
                    >
                        <OverviewChart view="sales" isDashboard={true} data={data} unit={unit} isLoading={false} unitMeasure={unitMeasure} />
                    </Box>
                </Box>
            </TabPanel>


            <TabPanel value={value} index={2}>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    gridAutoRows="115px"
                    gap="20px"
                    sx={{
                        "& > div": {
                            gridColumn: isNonMediumScreens ? undefined : "span 12",
                        },
                    }}
                >
                    <Box
                        gridColumn="span 12"
                        gridRow="span 2"
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="0.55rem"
                    >
                        <OverviewChart view="sales" isDashboard={true} data={data} unit={unit} isLoading={false} unitMeasure={unitMeasure} />
                    </Box>
                </Box>
            </TabPanel>

        </Box>
    )
}

export default Graphs;