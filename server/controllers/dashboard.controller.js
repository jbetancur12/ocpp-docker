import Transaction from '../models/transaction.model';


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

const getDashboardStats = async (req, res) => {
    try {
        

        /* Recent Transactions */
        const recentTransactions = await Transaction.find()
            .limit(50)
            .sort({ createdOn: -1 });

      

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
                                  unit: "month",
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





        res.status(200).json({
            recentTransactions,
            salesToday,
            salesMonth,
            salesYear,
            salesByMonth
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default { getDashboardStats };