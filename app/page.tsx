"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState("search");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const search = async () => {
    if (!query) return;

    setLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query, filter, mode }),
    });

    const result = await res.json();

    if (mode === "chat") {
      setChatHistory((prev) => [...prev, { q: query, a: result.answer }]);
    } else {
      setData(result);
    }

    setQuery("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      
      {/* 🔥 Search Box */}
      <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
        <h1>Curatly</h1>

        <div style={{ marginBottom: 10 }}>
          <button onClick={() => setMode("search")}>Search</button>
          <button onClick={() => setMode("chat")}>Chat</button>
        </div>

        <input
          value={query}
          placeholder="Search anything..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {mode === "search" && (
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pdf">PDF</option>
            <option value="ppt">PPT</option>
            <option value="doc">DOC</option>
          </select>
        )}

        <br /><br />

        <button onClick={search}>Go</button>
      </div>

      {loading && <p>Loading...</p>}

      {/* 🔥 CHAT */}
      {mode === "chat" &&
        chatHistory.map((c, i) => (
          <div key={i} style={{ marginTop: 20, background: "#fff", padding: 15 }}>
            <p><b>You:</b> {c.q}</p>
            <p><b>AI:</b> {c.a}</p>
          </div>
        ))}

      {/* 🔥 SEARCH RESULTS */}
      {mode === "search" && data && (
        <div style={{ marginTop: 20 }}>
          
          <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
            <h2>Answer</h2>
            <p>{data.answer}</p>
          </div>

          <div style={{ marginTop: 20, background: "#fff", padding: 20 }}>
            <h3>Papers</h3>
            {data.papers.map((p: any, i: number) => (
              <div key={i}>
                <a href={p.link} target="_blank">{p.title}</a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, background: "#fff", padding: 20 }}>
            <h3>Documents</h3>
            {data.docs.map((d: any, i: number) => (
              <div key={i}>
                <a href={d.link} target="_blank">{d.title}</a>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}