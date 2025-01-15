/*
 User API 예시
 */

 import axios from 'axios'
 
 const requestLogin = async (data, callback, errorCallback) => {
    try {
        // 백엔드에 로그인 요청
        console.log("백엔드에 로그인 요청");
        console.log(data);

        // email과 password를 쿼리 파라미터로 전달
        const response = await axios.get('http://localhost:8081/account/login', {
            params: {
                email: data.email,
                password: data.password
            },
            headers: {
                'Content-Type': 'application/json', // JSON 형식 명시
            },
        });

        console.log(response);
        callback(response.data); // 성공 시 응답 데이터를 callback으로 전달
        console.log(response.data);
    } catch (error) {
        if (errorCallback) {
            console.log("error")
            errorCallback(error.response ? error.response.data : error.message); // 에러 처리
            console.log(error.message)
        }
    }
};


const UserApi = {
    requestLogin:(data,callback,errorCallback)=>requestLogin(data,callback,errorCallback)
}

export default UserApi
