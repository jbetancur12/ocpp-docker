import React, { useContext } from "react";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    ReceiptLongOutlined,
    PublicOutlined,
    PointOfSaleOutlined,
    TodayOutlined,
    CalendarMonthOutlined,
    AdminPanelSettingsOutlined,
    TrendingUpOutlined,
    PieChartOutlined,
    ChargingStation,
    MonetizationOn,
    Place,
    Business
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpeg";
import logo from "assets/ev2.jpg";
import { I18nContext } from "i18n";

const navItems = (t) => [
    {
        text: t("sidebar.dashboard"),
        icon: <HomeOutlined />,
        path: "dashboard"
    },
    {
        text: t("sidebar.chargerPoints"),
        icon: <ChargingStation />,
        path: "charger-stations"
    },
    {
        text: t("sidebar.rates"),
        icon: <MonetizationOn />,
        path: "rates"
    },
    {
        text: t("sidebar.locations"),
        icon: <Place />,
        path: "locations"
    },
    {
        text: t("sidebar.customers"),
        icon: <Groups2Outlined />,
        path: "customers",
    },
    {
        text: t("sidebar.transactions"),
        icon: <ReceiptLongOutlined />,
        path: "transactions"
    },
    {
        text: t("sidebar.companies"),
        icon: <Business />,
        path: "companies"
    },
    //   {
    //     text: "Client Facing",
    //     icon: null,
    //   },
    //   {
    //     text: "Products",
    //     icon: <ShoppingCartOutlined />,
    //   },

    //   {
    //     text: "Geography",
    //     icon: <PublicOutlined />,
    //   },
    //   {
    //     text: "Sales",
    //     icon: null,
    //   },
    //   {
    //     text: "Overview",
    //     icon: <PointOfSaleOutlined />,
    //   },
    //   {
    //     text: "Daily",
    //     icon: <TodayOutlined />,
    //   },
    //   {
    //     text: "Monthly",
    //     icon: <CalendarMonthOutlined />,
    //   },
    //   {
    //     text: "Breakdown",
    //     icon: <PieChartOutlined />,
    //   },
    //   {
    //     text: "Management",
    //     icon: null,
    //   },
    //   {
    //     text: "Admin",
    //     icon: <AdminPanelSettingsOutlined />,
    //   },
    //   {
    //     text: "Performance",
    //     icon: <TrendingUpOutlined />,
    //   },
];

const kebabCase = string => string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const Sidebar = ({
    user,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();
    const { translate: t } = useContext(I18nContext)

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname]);

    return (
        <Box component="nav">
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            color: theme.palette.secondary[200],
                            backgroundColor: theme.palette.background.alt,
                            boxSixing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width: drawerWidth,
                        },
                    }}
                >
                    <Box width="100%">
                        <Box m="1.5rem 2rem 2rem 3rem">
                            <FlexBetween color={theme.palette.secondary.main}>
                                <Box display="flex" alignContent="center" justifyContent="center" gap="0.5rem">
                                    {/* <Typography variant="h4" fontWeight="bold">
                    ECOMVISION
                  </Typography> */}

                                    <Box
                                        component="img"
                                        alt="logo"
                                        src={logo}
                                        height="60px"
                                        width="60px"
                                        borderRadius="50%"
                                        sx={{ objectFit: "cover" }}
                                    />
                                </Box>
                                {!isNonMobile && (
                                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        </Box>
                        <List>
                            {navItems(t).map(({ text, icon, path }) => {
                                if (!icon) {
                                    return (
                                        <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                                            {text}
                                        </Typography>
                                    );
                                }
                                const lcText = kebabCase(text);

                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                navigate(`/${path}`);
                                                setActive(path);
                                            }}
                                            sx={{
                                                backgroundColor:
                                                    active === path
                                                        ? theme.palette.secondary[300]
                                                        : "transparent",
                                                color:
                                                    active === path
                                                        ? theme.palette.primary[600]
                                                        : theme.palette.secondary[100],
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: "2rem",
                                                    color:
                                                        active === path
                                                            ? theme.palette.primary[600]
                                                            : theme.palette.secondary[200],
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                            {active === path && (
                                                <ChevronRightOutlined sx={{ ml: "auto" }} />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    <Box position="absolute" bottom="2rem">
                        <Divider />
                        <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                            <Box
                                component="img"
                                alt="profile"
                                src={profileImage}
                                height="40px"
                                width="40px"
                                borderRadius="50%"
                                sx={{ objectFit: "cover" }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight="bold"
                                    fontSize="0.9rem"
                                    sx={{ color: theme.palette.secondary[100] }}
                                >
                                    {user.name}
                                </Typography>
                                <Typography
                                    fontSize="0.8rem"
                                    sx={{ color: theme.palette.secondary[200] }}
                                >
                                    {user.occupation}
                                </Typography>
                            </Box>
                            <SettingsOutlined
                                sx={{
                                    color: theme.palette.secondary[300],
                                    fontSize: "25px ",
                                }}
                            />
                        </FlexBetween>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
};

export default Sidebar;
