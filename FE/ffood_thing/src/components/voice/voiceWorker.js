self.onmessage = function (e) {
  const { audioBlob, recipeId, token } = e.data

  const formData = new FormData()
  formData.append("file", audioBlob, "음성.wav")
  formData.append("recipeId", recipeId)

  const headers = {};
  if(token){
    headers.Authorization = token;
  }

  fetch("https://i12e107.p.ssafy.io/api/speech/process", {
    method: "POST",
    body: formData,
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      self.postMessage({ data })
    })
    .catch((error) => {
      self.postMessage({ error: error.message })
    })
}
