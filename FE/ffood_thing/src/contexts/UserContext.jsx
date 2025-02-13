import React, { createContext, useState, useEffect } from "react"
import axios from "axios"

export const UserContext = createContext()

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken")
//         if (!accessToken) throw new Error("엑세스 토큰이 없습니다.")

//         const response = await axios.get("https://localhost:8080/api/users/read/my-info", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })

//         const userInfo = response.data
//         setUser(userInfo)
//         sessionStorage.setItem("user", JSON.stringify(userInfo))
//         console.log("Session User Info:", userInfo) // 콘솔에 사용자 정보 출력
//       } catch (error) {
//         console.error("Error fetching user info:", error.response?.data || error.message)
//       }
//     }

//     // 세션에 저장된 사용자 정보를 가져와 설정하거나 새로 불러옴
//     const storedUser = sessionStorage.getItem("user")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//       console.log("Session User Info:", JSON.parse(storedUser)) // 콘솔에 사용자 정보 출력
//     } else {
//       fetchUserInfo()
//     }
//   }, [])

//   return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
// }

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 로컬 스토리지에서 액세스 토큰 가져오기
        const accessToken = localStorage.getItem("accessToken");
        //if (!accessToken) throw new Error("엑세스 토큰이 없습니다.");
        if(accessToken){
          // 서버에서 사용자 정보 가져오기
        const response = await axios.get("https://i12e107.p.ssafy.io/api/users/read/my-info", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("my-info 호출!!!");
        const userInfo = response.data;
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
        console.log("Session User Info:", userInfo); // 콘솔에 사용자 정보 출력
        }
        
      } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message);
      }
    };

    // 세션에 저장된 사용자 정보를 가져오거나 새로 불러옴
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Session User Info:", JSON.parse(storedUser)); // 콘솔에 사용자 정보 출력
    } else {
      fetchUserInfo();
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
