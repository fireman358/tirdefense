/**
 * Worker Tir & Défense
 * - sert le site statique
 * - gère l'inscription newsletter via Resend (POST /api/subscribe)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe") {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders() });
      }
      if (request.method !== "POST") {
        return json({ ok: false, error: "Méthode non autorisée" }, 405);
      }
      if (!env.RESEND_API_KEY) {
        return json({ ok: false, error: "Service non configuré (RESEND_API_KEY manquant)." }, 503);
      }
      if (!env.RESEND_AUDIENCE_ID) {
        return json({ ok: false, error: "Audience non configurée (RESEND_AUDIENCE_ID manquant)." }, 503);
      }

      let email = "";
      try {
        const body = await request.json();
        email = String(body.email || "").trim().toLowerCase();
      } catch {
        return json({ ok: false, error: "Requête invalide." }, 400);
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
        return json({ ok: false, error: "Adresse e-mail invalide." }, 400);
      }

      const res = await fetch(
        `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        return json({ ok: true, message: "Merci ! Vérifie ta boîte mail pour confirmer." });
      }
      // contact déjà présent : on ne le dit pas, on renvoie un succès neutre
      const msg = JSON.stringify(data).toLowerCase();
      if (msg.includes("already") || res.status === 409) {
        return json({ ok: true, message: "Tu es déjà inscrit, merci !" });
      }
      console.error("Resend error", res.status, data);
      return json({ ok: false, error: "Inscription momentanément indisponible." }, 502);
    }

    return env.ASSETS.fetch(request);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
