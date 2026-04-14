export async function POST(req: Request) {
  const { query, filter, mode } = await req.json();

  // 🧠 AI Answer (used in both modes)
  const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: query },
      ],
    }),
  });

  const aiData = await aiRes.json();
  const answer =
    aiData?.choices?.[0]?.message?.content || "No answer";

  // 👉 CHAT MODE (only AI)
  if (mode === "chat") {
    return Response.json({
      answer,
      papers: [],
      docs: [],
    });
  }

  // 📄 arXiv
  const arxivRes = await fetch(
    `http://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=3`
  );

  const xml = await arxivRes.text();

  const titleMatches = [...xml.matchAll(/<title>(.*?)<\/title>/g)];
  const linkMatches = [...xml.matchAll(/<id>(.*?)<\/id>/g)];

  const papers = titleMatches.slice(1, 4).map((m, i) => ({
    title: m[1],
    link: linkMatches[i + 1]?.[1] || "#",
  }));

  // 🌐 Docs
  let searchQuery = query;

  if (filter === "pdf") searchQuery += " filetype:pdf";
  if (filter === "ppt") searchQuery += " filetype:ppt";
  if (filter === "doc") searchQuery += " filetype:doc";
  if (filter === "image")
    searchQuery += " filetype:jpg OR filetype:png";

  const webRes = await fetch(
    `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`
  );

  const html = await webRes.text();

  const results = [
    ...html.matchAll(
      /<a rel="nofollow" class="result__a" href="(.*?)">(.*?)<\/a>/g
    ),
  ];

  const docs = results
    .map((r) => ({
      link: r[1],
      title: r[2].replace(/<.*?>/g, ""),
    }))
    .slice(0, 6);

  return Response.json({
    answer,
    papers,
    docs,
  });
}