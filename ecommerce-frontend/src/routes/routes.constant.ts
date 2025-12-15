import React from "react";
import HistoryLanding from "Templates/Template4/Pages/HistoryLanding";
import HistoryTimeline from "Templates/Template4/Pages/HistoryTimeline";

export const ECOMHistoryRoutes = [
  {
    path: "/history",
    element: React.createElement(HistoryLanding),
  },
  {
    path: "/history-timeline",
    element: React.createElement(HistoryTimeline),
  },
];





export const ECOMAdminPath = '/admin';

export const ECOMLoyaltyPointsPath = '/loyalty-points';

export const ECOMAdminLoyaltyPointsRoute = `${ECOMAdminPath}${ECOMLoyaltyPointsPath}`;