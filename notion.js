const NOTION_API = "https://api.notion.com/v1"
const NOTION_KEY = process.env.NOTION_API_KEY

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    // URL에서 /api/notion/ 이후 경로 추출
    const fullPath = req.url.replace(/^\/api\/notion\/?/, "")

    if (!fullPath) {
        return res.status(400).json({ error: "경로가 필요합니다" })
    }

    try {
        const url = `${NOTION_API}/${fullPath}`
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
