import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../utils/auth";

function ProtectedRoute({ component: Component, children, ...rest }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const protectedPaths = ["/home", "/chart", "/tips", "/about"];
  const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

  const pathLower = location.pathname.toLowerCase();
  const isProtectedPath = protectedPaths.some(
    (p) => pathLower === p.toLowerCase()
  );

  if (!isLoggedIn && isProtectedPath) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isLoggedIn || publicPaths.includes(pathLower) ? (
          Component ? (
            <Component {...routeProps} />
          ) : (
            children
          )
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default ProtectedRoute;
