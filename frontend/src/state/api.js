import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const test_user  =  process.env.REACT_APP_TEST_USER
const mode = process.env.REACT_APP_MODE

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "ChargerPoints",
    "Cost",
    "Companies"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "api/users",
      providesTags: ["Customers"],
    }),
    //
    getCompanies: build.query({
        query: () => "ocpp/company",
        providesTags: ["Companies"],
      }),
      addNewCompany: build.mutation({
        query: (payload) => ({
            url: '/ocpp/company',
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['Companies'],
    }),


    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "ocpp/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),

    //
    getDashboard: build.query({
      query: () => "ocpp/dashboard",
      providesTags: ["Dashboard"],
    }),

    getDashboardGraph: build.query({
        query: (arg) => ({url: `ocpp/dashboard/graphs`, params: {...arg}}),
        providesTags: ["Dashboard"],
      }),

      getDashboardCPGraph: build.query({
        query: (arg) => ({url: `ocpp/dashboard/charger-points-graphs`, params: {...arg}}),
        providesTags: ["Dashboard"],
      }), 
    
      getDashboardStatsByCP: build.query({
        query: (arg) => ({url: `ocpp/dashboard/charger-points`, params: {...arg}}),
        providesTags: ["Dashboard"],
      }),

    //
    getCosts: build.query({
        query: () => "/ocpp/cost",
        providesTags: ["Cost"],
    }),
    addNewCost: build.mutation({
        query: (payload) => ({
            url: '/ocpp/cost',
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['Cost'],
    }),

    updateCost: build.mutation({
        query: (arg) => ({
            url: `/ocpp/cost/${arg.id}`,
            method: 'put',
            body: arg.payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['Cost'],
    }),

    deleteCost: build.mutation({
        query: (id) => ({
            url: `/ocpp/cost/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags : ['Cost']
    }),

    //

    getLocations: build.query({
        query: () => "/ocpp/locations",
        providesTags: ["location"],
    }), 
    addNewLocation: build.mutation({
        query: (payload) => ({
            url: '/ocpp/locations',
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['location'],
    }),


    //
    getTransactionsByCP: build.query({
        query: (id) => `/ocpp/transactions/${id}`,
        providesTags:['Transactions']
    }),

    //
    getChargerPoints: build.query({
        query: () => "/ocpp/chargerPoints",
        providesTags: ["ChargerPoints"],
      }),

    getChargerPointsOnline: build.query({
        query: () => "/ocpp/chargerPoints/online-cps",
        providesTags: ["ChargerPoints"],
      }),
    addNewChargerStation: build.mutation({
        query: (payload) => ({
            url: '/ocpp/chargerPoints',
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['ChargerPoints'],
    }),
    updateChargerStation: build.mutation({
        query: (arg) => ({
            url: `/ocpp/chargerPoints/${arg.id}`,
            method: 'put',
            body: arg.payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['ChargerPoints'],
    }),
    addNewConnector: build.mutation({
        query: (arg) => ({
            url: `/ocpp/chargerPoints/addConnector/${arg.id}`,
            method: 'PUT',
            body: arg.payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }),
          invalidatesTags: ['ChargerPoints'],
    }),
    deleteChargerStation: build.mutation({
        query: (id) => ({
            url: `/ocpp/chargerPoints/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags : ['ChargerPoints']
    }),
    startRemoteChargerStation: build.mutation({
        query: (payload) => ({
            url: mode === "development" ? `/ocpp/chargerPoints/start/${test_user}`: null,
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        }),
        invalidatesTags : ['ChargerPoints']
    }),
    stopRemoteChargerStation: build.mutation({
        query: (payload) => ({
            url: `/ocpp/chargerPoints/stop`,
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        }),
        invalidatesTags : ['ChargerPoints']
    })
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetCompaniesQuery,
  useAddNewCompanyMutation,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetChargerPointsQuery,
  useGetChargerPointsOnlineQuery,
  useAddNewChargerStationMutation,
  useUpdateChargerStationMutation,
  useAddNewConnectorMutation,
  useDeleteChargerStationMutation,
  useStartRemoteChargerStationMutation,
  useStopRemoteChargerStationMutation,
  useGetCostsQuery,
  useAddNewCostMutation,
  useUpdateCostMutation,
  useDeleteCostMutation,
  useGetTransactionsByCPQuery,
  useGetDashboardGraphQuery,
  useGetDashboardCPGraphQuery,
  useGetDashboardStatsByCPQuery,
  useGetLocationsQuery,
  useAddNewLocationMutation,
} = api;
