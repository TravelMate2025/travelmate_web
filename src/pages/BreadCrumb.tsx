import React from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const breadcrumbMap: { [key: string]: { label: string; path?: string }[] } = {
  // Round-trip section
  "/departure-flight": [{ label: "Departure Flight" }],
  "/return-flight": [
    { label: "Departure Flight", path: "/departure-flight" },
    { label: "Return Flight" },
  ],


  // One-way trip section
  "/departure-flight-one-way": [{ label: "Departure Flight" }],
  

  // Multi-way trip section
  "/departure-flight-multi-way": [{ label: "Departure Flight 1" }],
  "/second-departure-flight": [
    { label: "Departure Flight 1", path: "/departure-flight-multi-way" },
    { label: "Departure Flight 2" },
  ],
};

const Breadcrumb = () => {
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || [];

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      <Link to="/" className="text-gray-600 hover:underline">Home</Link>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return crumb.path ? (
          <Link key={index} to={crumb.path} className="text-gray-600 hover:underline">
            {crumb.label}
          </Link>
        ) : (
          <Typography key={index} className={isLast ? "text-blue-600 font-semibold" : "text-gray-600"}>
            {crumb.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
