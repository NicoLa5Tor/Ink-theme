# SEO Checklist — Lanzamiento Ink Theme

Verificar cada punto antes de apuntar el dominio de producción al nuevo tema.

## Indexación y metadatos
- [ ] Canonical presente en todas las páginas (`inc/seo.php` o Rank Math si está activo)
- [ ] `/gracias/` con `noindex` (verificar `<meta name="robots" content="noindex,nofollow">`)
- [ ] Slugs en minúsculas, sin tildes, sin espacios en todas las URLs
- [ ] `robots.txt` sin bloquear `/wp-content/themes/ink-theme/dist/`
- [ ] `sitemap.xml` generado (Rank Math o WP Sitemap nativo) y accesible

## Tracking y consentimiento
- [ ] GTM activo y verificado en Tag Assistant
- [ ] Consent Mode v2 (`gtag('consent','default', ...)`) se imprime ANTES del snippet de GTM en el `<head>`
- [ ] Evento `conversion` de GA4 se dispara correctamente al cargar `/gracias/`
- [ ] Formulario de contacto redirige a `/gracias/` con un submit clásico (no AJAX)

## Open Graph y datos estructurados
- [ ] OG tags verificados con Facebook Sharing Debugger
- [ ] JSON-LD Organization validado en Rich Results Test (home)
- [ ] JSON-LD Article validado en Rich Results Test (un post de blog)

## Performance / Core Web Vitals
- [ ] Fonts (Montserrat, Inter) precargadas con `<link rel="preload">` en `<head>`, `font-display: swap`
- [ ] LCP < 2.5s en PageSpeed Insights (mobile y desktop)
- [ ] El H1 del hero está en el HTML servido por PHP (verificar con `curl -s https://inkdigital.co/ | grep -i "<h1"`)
- [ ] GSAP y React cargan con `defer`/`type="module"`, nunca bloquean el render
- [ ] Imagen LCP del hero sin `loading="lazy"`
- [ ] Imágenes subidas por el editor de medios se convierten a WebP automáticamente

## Compliance / Google Ads
- [ ] `/politica-de-privacidad/` indexable y enlazada desde el footer
- [ ] `/politica-de-cookies/` y `/terminos-y-condiciones/` indexables y enlazadas
- [ ] Sin pop-ups que bloqueen contenido en mobile al cargar

## CTAs y contenido
- [ ] Todos los CTAs de WhatsApp incluyen UTM completos (`utm_source`, `utm_medium`, `utm_campaign`)
- [ ] No hay texto indexable "quemado" en imágenes — todo el copy vive en HTML real
- [ ] Todas las secciones críticas (Hero, Servicios, Planes, Contacto) tienen su contenido visible sin depender de JS

## Search Console
- [ ] Propiedad verificada en Google Search Console
- [ ] Sitemap enviado en Search Console
- [ ] Sin errores de cobertura tras el primer crawl post-lanzamiento

## Verificación técnica de hidratación
- [ ] `curl -s https://inkdigital.co/ | grep -i "h1"` devuelve el H1 real del hero
- [ ] Con JavaScript deshabilitado, el contenido de todas las páginas sigue siendo legible e indexable
- [ ] No hay ningún `ReactDOM.render`/`createRoot().render()` que reemplace contenido ya pintado por PHP (solo `hydrateRoot` sobre nodos con HTML existente, o roots exclusivos para islas de interactividad vacías como el toggle del menú o el botón de WhatsApp)
