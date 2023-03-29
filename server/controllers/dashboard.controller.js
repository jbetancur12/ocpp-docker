import Transaction from '../models/transaction.model';
import ChargerPoint from '../models/chargerPoint.model';
import mongoose from 'mongoose';


function getActualMonthSinceFirstDay(type) {
    // create a new date object
    const currentDate = new Date();
  
    // get the year, month and day from the current date object
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    // create a new Date object with the start of the year
    const firstDayOfYear = new Date(currentYear, 0, 1);
  
    // create a new Date object with the start of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
    // create a new Date object with the start of the day
    const firstDayOfDay = new Date(currentYear, currentMonth, currentDay);
  
    // return the date object based on the type of operation
    switch (type) {
      case "year":
        return firstDayOfYear;
      case "month":
        return firstDayOfMonth;
      case "day":
        return firstDayOfDay;
      default:
        return "Invalid type";
    }
  }

// const getCPStats = async(req, res) => {
//     try {

//         //daily
//         const salesToday = await Transaction.aggregate(
//             [{
//                 $match: {
//                     $and: [
//                         {
//                             createdAt: {
//                                 $gte: getActualMonthSinceFirstDay("day"),
        
//                             }
//                         },
//                         {
//                             chargerPointId: req.query.cp
//                         }
//                     ]
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     SUM: {
//                         $sum: {
//                             $toDouble: "$cost"
//                         }
//                     },
//                     COUNT: {
//                         $sum: 1
//                     }
//                 }
//             }
//                 ,
//             { "$unset": ["_id"] }
//             ])

//             const powerToday = await Transaction.aggregate(
//                 [{
//                     $match: {
//                         $and: [
//                             {
//                                 createdAt: {
//                                     $gte: getActualMonthSinceFirstDay("day"),
            
//                                 }
//                             },
//                             {
//                                 chargerPointId: req.query.cp
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         SUM: {
//                             $sum: {
//                                 $toDouble: "$stop_value"
//                             }
//                         },
//                         COUNT: {
//                             $sum: 1
//                         }
//                     }
//                 }
//                     ,
//                 { "$unset": ["_id"] }
//                 ])

//                 //Montly
//         const salesMonth = await Transaction.aggregate(
//             [{
//                 $match: {
//                     $and: [
//                         {
//                             createdAt: {
//                                 $gte: getActualMonthSinceFirstDay("month"),
        
//                             }
//                         },
//                         {
//                             chargerPointId: req.query.cp
//                         }
//                     ]
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     SUM: {
//                         $sum: {
//                             $toDouble: "$cost"
//                         }
//                     },
//                     COUNT: {
//                         $sum: 1
//                     }
//                 }
//             }
//                 ,
//             { "$unset": ["_id"] }
//             ])

//             const powerMonth = await Transaction.aggregate(
//                 [{
//                     $match: {
//                         $and: [
//                             {
//                                 createdAt: {
//                                     $gte: getActualMonthSinceFirstDay("month"),
            
//                                 }
//                             },
//                             {
//                                 chargerPointId: req.query.cp
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         SUM: {
//                             $sum: {
//                                 $toDouble: "$stop_value"
//                             }
//                         },
//                         COUNT: {
//                             $sum: 1
//                         }
//                     }
//                 }
//                     ,
//                 { "$unset": ["_id"] }
//                 ])

//             res.status(200).json({
//                salesToday,
//                powerToday,
//                salesMonth,
//                powerMonth
//             });
//         } catch (error) {
//             res.status(404).json({ message: error.message });
//         }
// }

const getCPStats = async (req, res) => {
    try {
      const { cp } = req.query;
      const periodTypes = {
        DAILY: "day",
        MONTHLY: "month",
        YEARLY: "year"
      };
  
      const getSalesAndPower = period => {
        const commonFields = {
          createdAt: {
            $gte: getActualMonthSinceFirstDay(periodTypes[period])
          },
          chargerPointId: cp
        };
        const salesField = {
          $sum: {
            $toDouble: "$cost"
          }
        };
        const powerField = {
          $sum: {
            $toDouble: "$stop_value"
          }
        };
  
        const pipeline = [
          { $match: { $and: [commonFields] } },
          {
            $group: {
              _id: null,
              sales: salesField,
              power: powerField,
              count: { $sum: 1 }
            }
          },
          { $unset: ["_id"] }
        ];
  
        return Transaction.aggregate(pipeline);
      };
  
      const salesToday = await getSalesAndPower("DAILY");
      const powerToday = await getSalesAndPower("DAILY");
      const salesMonth= await getSalesAndPower("MONTHLY");
      const powerMonth= await getSalesAndPower("MONTHLY");      
      const salesYear= await getSalesAndPower("YEARLY");
      const powerYear= await getSalesAndPower("YEARLY");
 
  
      res.status(200).json({ salesToday, powerToday, salesMonth, powerMonth, salesYear, powerYear });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  const getDashboardGrap = async(req, res) => {
    try{
        const { startDate, endDate, unit } = req.query; //destructure the query parameters
        const salesGraph = await Transaction.aggregate([
            {    
                $match: {
                    createdAt: {
                        $gte: new Date(startDate), //use the destructure variable
                        $lte: new Date(endDate), //use the destructure variable
                    }
                },
            },
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: '$createdAt',
                            unit: unit, //use the destructure variable
                            binSize:1,
                        },
                    },
                    sum: { $sum: { $toDouble: "$cost" } },
                },
            },
            { $sort: { _id: 1 } },
        ]);



        res.status(200).json(salesGraph);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getDashboardGraphs = async(req, res) => {
    try{
        const { startDate, endDate, unit, id } = req.query;
       
        
        const costGraph = await Transaction.aggregate([
            {    
                $match: {
                    $and: [
                        {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate),
                            }
                        },
                        { chargerPointId: mongoose.Types.ObjectId(id) }
                    ]
            },
        },
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: '$createdAt',
                            unit: unit,
                            binSize:1,
                        },
                    },
                    sum: { $sum: { $toDouble: "$cost" } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const powerGraph = await Transaction.aggregate([
            {    
                $match: {
                    $and: [
                        {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate),
                            }
                        },
                        { chargerPointId: mongoose.Types.ObjectId(id) }
                    ]
            },
        },
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: '$createdAt',
                            unit: unit,
                            binSize:1,
                        },
                    },
                    sum: { $sum: { $toDouble: "$stop_value" } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const salesByPeriod = await Transaction.aggregate(
            [
                {    
                    $match: {
                        $and: [
                            {
                                createdAt: {
                                    $gte: new Date(startDate),
                                    $lte: new Date(endDate),
                                }
                            },
                            { chargerPointId: mongoose.Types.ObjectId(id) }
                        ]
                },
            },
            {
                $group: {
                    _id: null,
                    SUM: {
                        $sum: {
                            $toDouble: "$cost"
                        }
                    },
                    COUNT: {
                        $sum: 1
                    }
                }
            }
                ,
            { "$unset": ["_id"] }
            ])

            
        const powerByPeriod = await Transaction.aggregate(
            [
                {    
                    $match: {
                        $and: [
                            {
                                createdAt: {
                                    $gte: new Date(startDate),
                                    $lte: new Date(endDate),
                                }
                            },
                            { chargerPointId: mongoose.Types.ObjectId(id) }
                        ]
                },
            },
            {
                $group: {
                    _id: null,
                    SUM: {
                        $sum: {
                            $toDouble: "$stop_value"
                        }
                    },
                    COUNT: {
                        $sum: 1
                    }
                }
            }
                ,
            { "$unset": ["_id"] }
            ])

        res.status(200).json({costGraph, powerGraph, salesByPeriod, powerByPeriod});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getDashboardStats = async (req, res) => {
    try {
        

        /* Recent Transactions */
        const recentTransactions = await Transaction.find()
            .limit(50)
            .sort({ start_timestamp: -1 })
            .populate('user',"name email").populate('chargerPointId',"charger_box_id connectors")

        

      

        const salesToday = await Transaction.aggregate(
            [{
                $match: {
                    createdAt: {
                        $gte: getActualMonthSinceFirstDay("day"),

                    }
                }
            },
            {
                $group: {
                    _id: null,
                    SUM: {
                        $sum: {
                            $toDouble: "$cost"
                        }
                    },
                    COUNT: {
                        $sum: 1
                    }
                }
            }
                ,
            { "$unset": ["_id"] }
            ])

        const salesMonth = await Transaction.aggregate(
            [{
                $match: {
                    createdAt: {
                        $gte: getActualMonthSinceFirstDay("month"),

                    }
                }
            },
            {
                $group: {
                    _id: null,
                    SUM: {
                        $sum: {
                            $toDouble: "$cost"
                        }
                    },
                    COUNT: {
                        $sum: 1
                    }
                }
            }
                ,
            { "$unset": ["_id"] }
            ])

            const salesYear = await Transaction.aggregate(
                [{
                    $match: {
                        createdAt: {
                            $gte: getActualMonthSinceFirstDay("year"),
    
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        SUM: {
                            $sum: {
                                $toDouble: "$cost"
                            }
                        },
                        COUNT: {
                            $sum: 1
                        }
                    }
                }
                    ,
                { "$unset": ["_id"] }
                ])

                const salesByMonth = await Transaction.aggregate(
                    [{
                        $match: {
                            $and: [
                              {
                                createdAt: {
                                  $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                                  $lte: new Date()
                                }
                              }
                            ]
                          },
                        },
                          {
                            $group: {
                              _id: {
                                $dateTrunc: {
                                  date: '$createdAt',
                                  unit: "day",
                                  binSize:1
                                }
                              },
                              sum: { $sum: {
                                $toDouble: "$cost"
                            } },
                            }
                          },
                          { $sort: { _id: 1 } }
                    ]
                )

                const CPcount = await ChargerPoint.count()





        res.status(200).json({
            recentTransactions,
            salesToday,
            salesMonth,
            salesYear,
            salesByMonth,
            CPcount,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default { getDashboardStats ,getDashboardGrap, getCPStats, getDashboardGraphs};