// import React, { useEffect, useContext } from "react"
// import axios from "axios"
// import { UserContext } from "../../contexts/UserContext"
// import { reissueAccessToken } from "../../utils/auth" // 새로 작성한 토큰 재발급 함수 import

// const FetchUserSession = () => {
//   const { setUser } = useContext(UserContext)

//   useEffect(() => {
//     const fetchSession = async () => {
//       console.log("Fetching session...")
//       let token = localStorage.getItem("accessToken")
//       if (token) {
//         console.log("Token found:", token)
//         try {
//           let response = await axios.get("http://localhost:8080/users/read", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })

//           console.log("User data fetched:", response.data)
//           setUser(response.data)
//         } catch (error) {
//           if (error.response && error.response.status === 401) {
//             console.log("Token expired, reissuing...")
//             try {
//               token = await reissueAccessToken(token)
//               console.log("New token:", token) // 디버깅용 출력
//               let response = await axios.get("http://localhost:8080/users/read", {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               })

//               console.log("User data fetched after reissue:", response.data)
//               setUser(response.data)
//             } catch (reissueError) {
//               console.error("Failed to reissue access token:", reissueError)
//               setUser(null)
//             }
//           } else {
//             console.error("Error fetching user data:", error)
//             setUser(null)
//           }
//         }
//       } else {
//         console.log("No token found")
//         setUser(null)
//       }
//     }

//     fetchSession()
//   }, [setUser])

//   return null // 컴포넌트는 화면에 아무것도 렌더링하지 않음
// }

// export default FetchUserSession
