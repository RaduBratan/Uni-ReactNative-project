import React, { useEffect, useContext } from "react";
import {
  NavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";
import { useAuth } from "../services/AuthProvider";

interface ResetNavigationProps {
  navigationRef: React.RefObject<NavigationContainerRef<ParamListBase>>;
}

const ResetNavigation: React.FC<ResetNavigationProps> = ({ navigationRef }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && navigationRef.current) {
      navigationRef.current.resetRoot({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }
  }, [isAuthenticated, navigationRef]);

  return null;
};

export default ResetNavigation;
