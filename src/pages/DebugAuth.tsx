import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth/supabaseClient";

export default function DebugAuth() {
  const [session, setSession] = useState<string>("cargando...");
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(JSON.stringify(data.session, null, 2));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setEvents((prev) => [`[${new Date().toISOString()}] ${event} - user:${session?.user?.email ?? "null"}`, ...prev]);
      setSession(JSON.stringify(session ?? null, null, 2));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Debug Auth</h1>
      <pre style={{ background: "#f3f4f6", padding: 12 }}>{session}</pre>
      <h2>Eventos</h2>
      <ul>{events.map((e, i) => <li key={i}>{e}</li>)}</ul>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
