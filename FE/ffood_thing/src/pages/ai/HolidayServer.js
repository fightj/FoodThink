//백엔드(공휴일 api + gpt api 호출을 node.js 백엔드에서 수행) - 공휴일 & gpt api 연동
// <<이파일 백엔드쪽으로 가져가야함
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.PUBLIC_HOLIDAY_API_KEY;
const GPT_API_KEY = process.env.OPENAI_API_KEY;

// ✅ 오늘의 공휴일 확인 및 GPT로 음식 추천
app.get("/api/today-menu", async (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${API_KEY}&solYear=${year}&solMonth=${month}&_type=json`;

    try {
        const response = await axios.get(url);
        const holidays = response.data.response.body.items?.item || [];

        // 오늘 날짜의 공휴일 찾기
        const todayHoliday = holidays.find(h => h.locdate === `${year}${month}${day}`);

        let prompt;
        if (todayHoliday) {
            prompt = `${todayHoliday.dateName}에 어울리는 대표적인 음식 2가지만 추천해줘.`;
        } else {
            prompt = "오늘 먹을만한 랜덤한 메뉴 5가지를 추천해줘.";
        }

        // GPT API에 음식 추천 요청
        const gptResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: prompt }],
                max_tokens: 100,
            },
            {
                headers: {
                    "Authorization": `Bearer ${GPT_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const recommendedMenu = gptResponse.data.choices[0].message.content;

        res.json({ recommendedMenu });
    } catch (error) {
        console.error("📌 오류 발생:", error);
        res.status(500).json({ error: "데이터를 불러올 수 없습니다." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행됨: http://localhost:${PORT}`));
