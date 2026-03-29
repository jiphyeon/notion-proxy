// Vercel Serverless Function - 노션 API 프록시
// CORS 문제 없이 Framer에서 노션 API 호출 가능

const NOTION_API = "https://api.notion.com/v1"
const NOTION_KEY = process.env.NOTION_API_KEY // Vercel 환경변수로 설정

export default async function handler(req, res) {
    // CORS 허용
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // OPTIONS 프리플라이트 요청 처리
    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    const { path } = req.query
    if (!path) {
        return res.status(400).json({ error: "path가 필요합니다" })
    }

    try {
        const url = `${NOTION_API}/${Array.isArray(path) ? path.join("/") : path}`

        const response = await fetch(url, {
            method: req.method,
            headers: {
                Authorization: `Bearer ${NOTION_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
        })

        const data = await response.json()
        return res.status(response.status).json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
