"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Saved() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("saved_items").select("*");
      setItems(data || []);
    };
    load();
  }, []);

  return (
    <div>
      <h1>Saved Items</h1>

      {items.map((item, i) => (
        <div key={i}>
          <a href={item.link} target="_blank">{item.title}</a>
        </div>
      ))}
    </div>
  );
}