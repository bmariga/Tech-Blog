// UserContext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  // Your context provider logic here
  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export default UserContext;
