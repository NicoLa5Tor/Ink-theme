# Auditoría SEO y SEM — Ink Digital

**Veredicto: no es excelente.** Producción **31/100**. Tema nuevo **52/100**.

El sitio publicado (https://inkdigital.co/) es Elementor, no este tema. El canvas de Cursor fallaba al abrir (el editor convertía los guiones del path en espacios). Esta copia vive en la raíz del repo.

---

## Producción (lo que Google/Ads ven hoy)

| Sev | Área | Hallazgo |
|-----|------|----------|
| P0 | On-page | Title = `ink digital`. Sin meta description, OG ni Twitter. |
| P0 | On-page | Home **sin ningún H1**. Hero = slider. |
| P0 | SEM | Sin GTM, GA4, Meta Pixel ni evento de lead. Form WPForms vuelve a `/`. CTA a `wa.link`. |
| P0 | Contenido | Sitemap: 3 páginas + `hello-world`. `/blog/` = 404. |
| P0 | Indexación | `/mantenimineto/` y `/mantenimineto/catalogo/` indexables (typo). |
| P1 | Trust | Email `Gestion@inkdigital.con`. Redes con `href` vacío. |
| P1 | On-page | Alts: `Gemini_Generated_…`, `WhatsApp Image 2025-…`. |
| P1 | Contenido | Contadores en 0 / -200. Jerarquía h2→h5/h6. |
| P1 | Técnico | HTML home ~538 KB (Elementor). Sin JSON-LD. |
| P2 | Técnico | HTTPS, www→apex y LiteSpeed+Cloudflare sí están bien. |

---

## Tema nuevo — lo que ya resuelve

- Title home: `{marca} — Agencia de marketing digital en Bogotá`
- Canonical, robots, `noindex` en `/gracias/`
- H1/H2/precios/form en PHP (sin JS)
- Form clásico → `/gracias/` (útil para SEM)

## Tema nuevo — bloqueos

| Sev | Hallazgo |
|-----|----------|
| P0 | `GTM-XXXXXXX` / `G-XXXXXXXXXX`. Consent denied **y no hay CMP**. |
| P0 | `gtag('event','conversion')` con ID de GA4 (formato Ads, no `generate_lead`). |
| P0 | Una sola URL comercial. Servicios = `#contacto`. No hay landings. |
| P1 | `createRoot` pisa el PHP. `Services.jsx` quita descripciones. |
| P1 | PNG hero/servicios 1.1–2.3 MB. |
| P1 | Description home = tagline de WP. OG default `assets/logo.png` no existe. |
| P1 | Schema solo Organization/Article. Sin LocalBusiness, FAQ, Service. |

---

## Checklist para “excelente”

1. IDs reales GTM + GA4 + Ads + Meta Pixel. CMP que haga `consent update`.
2. `generate_lead` + conversión Ads en `/gracias/`. WhatsApp como conversión aparte.
3. Description/OG fijos. Imagen 1200×630. LocalBusiness + NAP + sameAs.
4. WebP/AVIF + srcset. Quitar PNG de 2 MB del LCP.
5. `hydrateRoot` (o no destruir el copy de servicios).
6. Páginas `/servicios/{slug}` + 6–10 posts. noindex de `hello-world` y mantenimiento.
7. Landings de Ads (1 H1 = 1 keyword).
8. Search Console + sitemap limpio + Google Business Profile Bogotá.
