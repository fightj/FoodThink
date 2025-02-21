import React, { createContext, useState, useEffect, useRef } from "react"
import axios from "axios"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user")
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null)
  const didMount = useRef(false) // 🚀 첫 실행 방지용 ref

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true // 🚀 첫 번째 실행만 막고 종료
      return
    }

    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken && !user) {
          const response = await axios.get("https://i12e107.p.ssafy.io/api/users/read/my-info", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          console.log("my-info 호출!!!")
          const userInfo = response.data
          setUser(userInfo)
          sessionStorage.setItem("user", JSON.stringify(userInfo))
          console.log("Session User Info:", userInfo)
        }
      } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message)
      }
    }

    if (!user) {
      fetchUserInfo()
    }
  }, [user]) // user 상태 변경될 때만 실행

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
