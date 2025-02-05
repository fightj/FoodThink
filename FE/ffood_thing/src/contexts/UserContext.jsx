import React, { createContext, useState, useContext } from "react"

const UserContext = createContext() // Context 생성

export const useUser = () => useContext(UserContext) // Custom hook

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

// UserContext도 export
export { UserContext }
