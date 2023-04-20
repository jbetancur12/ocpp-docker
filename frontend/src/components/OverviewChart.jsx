import React, { useContext, useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useGetDashboardQuery } from "state/api";
import {I18nContext} from '../i18n'

const OverviewChart = ({ isDashboard = false, view, data, isLoading, unit, unitMeasure }) => {
  const theme = useTheme();
  const { translate: t } = useContext(I18nContext);
  //const { data, isLoading } = useGetDashboardQuery();
  const [totalSalesLine] = useMemo(() => {
    if (!data) return [];

    
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalSalesLine2 = {
        id: "totalSales",
        color: theme.palette.secondary.main,
        data: [],
      };
    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
      
    };

 console.log(data)
    

       totalSalesLine.data = [
          ...totalSalesLine.data,
          ...data,
        ];



    return [[totalSalesLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || isLoading) return "Loading...";

 const Series = () => {
    
    switch (unitMeasure) {
    case "$":
        return <strong>{t("dashboard.chart.seriesName")}</strong>
    
    case "kWh":
        return  <strong>{t("dashboard.chart.series.energyDelivered")}</strong>

    default:
        return  <strong>{t("dashboard.chart.series.transactions")}</strong>
}}

  return (
    <ResponsiveLine
      enableSlices = "x"
      sliceTooltip={({ slice }) => {
                return (
                    <div
                        style={{
                            background: 'red',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <div>{slice.points[0].data.xFormatted}</div>
                        {slice.points.map(point => (
                            <div
                                key={point.id}
                                   style={{
                                    color: point.serieColor,
                                    padding: '3px 0',
                                }}
                           >    

                           {
                            
                           }
                               {`${Series()} => ${point.data.yFormatted}`} 
                           </div>
                    ))}
                      </div>
               )
           }}
      data={view === "sales" ? totalSalesLine : null}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      xFormat={function (value) {
        switch (unit) {
            case "hour":
                return (new Date(value).toLocaleString())
                case "day":
                return value.substring(0, 10)
                case "year":
                return value.substring(0,4)
               
         
            default:
                return "";
         }
      }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      useMesh
      yFormat={function(value){ 
        switch (unitMeasure) {
            case "$":
                return `$ ${Number(value).toLocaleString('en-EN', {minimumFractionDigits: 0})}`
            
            case "kWh":
                return `${Number(value/1000).toLocaleString('en-EN', {minimumFractionDigits: 0})} kwh`
        
            default:
                return `${Number(value).toLocaleString('en-EN', {minimumFractionDigits: 0})}`
        }

    }
               }
      curve="linear"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {

          //if (isDashboard) return v.slice(0, 3);
          //return v;
         switch (unit) {
            case "hour":
                return (new Date(v).toLocaleString()).substring(11, 19)
                case "day":
                return v.substring(0, 10)
                case "year":
                return v.substring(0,4)
               
         
            default:
                return "";
         }
          
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -60,
        legendPosition: "middle",
        format: function(value){ 
            switch (unitMeasure) {
                case "$":
                    return `$ ${Number(value).toLocaleString('en-EN', {minimumFractionDigits: 0})}`
                
                case "kWh":
                    return `${Number(value/1000).toLocaleString('en-EN', {minimumFractionDigits: 0})} kwh`
            
                default:
                    return `${Number(value).toLocaleString('en-EN', {minimumFractionDigits: 0})}`
            }
        }
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};
      

export default OverviewChart;
