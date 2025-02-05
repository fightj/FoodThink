import axios from "axios"

export const reissueAccessToken = async (expiredToken) => {
  try {
    console.log("Reissuing access token...") // 디버깅용 출력
    const response = await axios.post("http://localhost:8080/auth/reissue", null, {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    })
    console.log("Reissue response:", response) // 디버깅용 출력

    if (response.status === 200) {
      const { accessToken } = response.data
      console.log("New access token:", accessToken) // 디버깅용 출력
      localStorage.setItem("accessToken", accessToken)
      return accessToken
    } else {
      throw new Error("Failed to reissue access token")
    }
  } catch (error) {
    console.error("Error reissuing access token:", error)
    throw error
  }
}
