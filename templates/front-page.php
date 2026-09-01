<?php
/**
 * front-page.php
 *
 * Todo el contenido indexable (H1, textos, precios, testimonios) se
 * construye aquí en PHP y se imprime como HTML real ANTES de que cualquier
 * JS se ejecute. El mismo array $ink_home_data se expone a React vía
 * wp_localize_script (inc/enqueue.php) para que Hero/Services/Results/
 * Portfolio/Plans/Contact hidraten con hydrateRoot sin duplicar contenido:
 * React reconcilia contra este HTML, no lo reemplaza.
 *
 * IMPORTANTE: se construye $ink_home_data ANTES de get_header() porque
 * wp_enqueue_scripts (y por lo tanto wp_localize_script) se dispara dentro
 * de wp_head(), que corre adentro de get_header().
 */

global $ink_home_data;

$ink_plans_data = ink_get_plans_data();

$ink_home_data = array(
	'hero'      => array(
		'eyebrow'      => 'Agencia de marketing digital en Bogotá',
		'title'        => 'Ink Digital: más clientes, más ventas, resultados que se ven en tu negocio',
		'subtitle'     => 'Estrategia, pauta digital y contenido que convierten. Auditamos tu presencia digital gratis y te mostramos exactamente qué está frenando tu crecimiento.',
		'ctaPrimary'   => array(
			'label' => 'Hablemos de tu proyecto',
			'href'  => '#contacto',
		),
		'ctaSecondary' => array(
			'label' => 'Ver portafolio',
			'href'  => '#portafolio',
		),
		'heroImage'    => get_template_directory_uri() . '/assets/hero/mas-clientes.png',
		'heroImageB'   => get_template_directory_uri() . '/assets/hero/mas-ventas.png',
		'stats'        => array(
			array(
				'value' => 180,
				'label' => 'Sitios y campañas construidos',
			),
			array(
				'value' => 8,
				'label' => 'Años de experiencia',
			),
			array(
				'value'  => 95,
				'suffix' => '%',
				'label'  => 'Clientes que renuevan',
			),
			array(
				'value' => 40,
				'label' => 'Marcas activas en pauta',
			),
		),
	),
	'services'  => array(
		'eyebrow'  => 'Lo que hacemos',
		'title'    => 'Servicios diseñados para crecer tu negocio',
		'subtitle' => 'Cada servicio se conecta con el siguiente: estrategia, ejecución y medición en un solo equipo.',
		'services' => array(
			array(
				'title'       => 'Estrategia digital',
				'description' => 'Diagnóstico, objetivos y plan de acción trimestral.',
				'href'        => '#contacto',
				'icon'        => '🎯',
				'image'       => get_template_directory_uri() . '/assets/services/estrategia.png',
			),
			array(
				'title'       => 'Gestión de redes sociales',
				'description' => 'Contenido, comunidad y calendario editorial.',
				'href'        => '#contacto',
				'icon'        => '📱',
				'image'       => get_template_directory_uri() . '/assets/services/redes.png',
				'frame'       => 'portrait',
			),
			array(
				'title'       => 'Meta Ads',
				'description' => 'Campañas en Facebook e Instagram optimizadas a conversión.',
				'href'        => '#contacto',
				'icon'        => '📈',
				'image'       => get_template_directory_uri() . '/assets/services/meta-ads.png',
			),
			array(
				'title'       => 'Google Ads',
				'description' => 'Búsqueda, display y remarketing con foco en ROAS.',
				'href'        => '#contacto',
				'icon'        => '🔍',
				'image'       => get_template_directory_uri() . '/assets/services/google-ads.png',
			),
			array(
				'title'       => 'SEO',
				'description' => 'Posicionamiento orgánico técnico y de contenido.',
				'href'        => '#contacto',
				'icon'        => '🚀',
				'image'       => get_template_directory_uri() . '/assets/services/seo.png',
			),
			array(
				'title'       => 'Email marketing y automatización',
				'description' => 'Flujos automatizados que nutren y convierten leads.',
				'href'        => '#contacto',
				'icon'        => '✉️',
				'image'       => get_template_directory_uri() . '/assets/services/email.png',
			),
			array(
				'title'       => 'Chatbots con IA',
				'description' => 'Atención automatizada 24/7 en WhatsApp y web.',
				'href'        => '#contacto',
				'icon'        => '🤖',
				'badge'       => 'nuevo',
				'image'       => get_template_directory_uri() . '/assets/services/chatbots.png',
				'frame'       => 'portrait',
			),
			array(
				'title'       => 'Diseño y desarrollo web',
				'description' => 'Sitios rápidos, responsivos y optimizados para SEO.',
				'href'        => '#contacto',
				'icon'        => '💻',
				'image'       => get_template_directory_uri() . '/assets/services/web.png',
			),
		),
	),
	'results'   => array(
		'title'    => 'Resultados que respaldan la estrategia',
		'subtitle' => 'Números reales de campañas activas en los últimos 12 meses.',
		'metrics'  => array(
			array(
				'value' => 3.2,
				'suffix' => 'x',
				'label' => 'ROAS promedio en Meta Ads',
			),
			array(
				'value' => 120,
				'suffix' => '%',
				'label' => 'Crecimiento en tráfico orgánico',
			),
			array(
				'value' => 65,
				'suffix' => '%',
				'label' => 'Reducción en costo por lead',
			),
			array(
				'value' => 40,
				'label' => 'Marcas acompañadas activamente',
			),
		),
	),
	'portfolio' => array(
		'title'    => 'Sitios web construidos para vender y captar clientes',
		'subtitle' => 'Portafolio real: e-commerce, legal, salud, hospitality y turismo.',
		'items'    => array(
			array(
				'title'       => 'Savake',
				'client'      => 'E-commerce / Retail industrial',
				'description' => 'Tienda online con inventario, promociones automáticas y una UX pensada para convertir. En 14 meses: +200% en ventas online y 40% menos errores de stock.',
				'image'       => get_template_directory_uri() . '/assets/websites/savake.jpg',
				'href'        => 'https://savake.com.co/',
			),
			array(
				'title'       => 'Tu Legal Migración',
				'client'      => 'Servicios legales / Inmigración',
				'description' => 'Sitio + SEO local y contenido educativo para captar leads en un mercado saturado. En 11 meses: +350% de tráfico orgánico y consultas calificadas constantes.',
				'image'       => get_template_directory_uri() . '/assets/websites/tu-legal-migracion.jpg',
				'href'        => 'https://tulegalmigracion.com/',
			),
			array(
				'title'       => 'MásQSalud',
				'client'      => 'Salud / Planes de pago',
				'description' => 'Sitio de planes de pago y cuidado personal: hero, catálogo de servicios y canales de contacto para convertir visitas en citas.',
				'image'       => get_template_directory_uri() . '/assets/websites/mas-q-salud.jpg',
				'href'        => 'https://micirugiaya.com/',
			),
			array(
				'title'       => 'Megy',
				'client'      => 'Hospitality / Cafetería creativa',
				'description' => 'Web para reservar experiencias (cerámica, totebags) y café en Bogotá: menú claro, reservas y WhatsApp en el mismo flujo.',
				'image'       => get_template_directory_uri() . '/assets/websites/megy.jpg',
				'href'        => 'https://megy.com.co/',
			),
			array(
				'title'       => 'Visas Continental',
				'client'      => 'Servicios / Visas',
				'description' => 'Sitio de asesoría de visas con campañas de contenido (Mundial 2026) y captación de leads por formulario y WhatsApp.',
				'image'       => get_template_directory_uri() . '/assets/websites/visas-continental.jpg',
				'href'        => 'https://visascontinental.com/',
			),
			array(
				'title'       => 'La Torre de Guardiola',
				'client'      => 'Turismo rural / Hospitality',
				'description' => 'Web de turismo rural en Berguedà: alojamiento, galería y reserva, con idioma y contacto directo.',
				'image'       => get_template_directory_uri() . '/assets/websites/torre-de-guardiola.jpg',
				'href'        => 'https://latorredeguardiola.com/',
			),
		),
		'ctaLabel' => 'Cuéntame sobre tu proyecto',
		'ctaHref'  => '#contacto',
	),
	'plans'     => array(
		'title'    => $ink_plans_data['title'],
		'subtitle' => $ink_plans_data['subtitle'],
		'plansUrl' => $ink_plans_data['plansUrl'],
		'plans'    => $ink_plans_data['plans'],
	),
	'contact'   => array(
		'title'        => '¿Listo para crecer?',
		'subtitle'     => 'Cuéntanos sobre tu negocio y te contactamos en menos de 24 horas.',
		'whatsappHref' => 'https://api.whatsapp.com/send?' . http_build_query(
			array(
				'phone'        => '573164637827',
				'text'         => 'Hola, quiero más información sobre sus servicios',
				'utm_source'   => 'web',
				'utm_medium'   => 'cta',
				'utm_campaign' => 'contacto',
			)
		),
	),
);

get_header();
?>

<main id="contenido-principal">

	<?php // Datos para hidratar/re-montar las secciones React (también tras un swap AJAX). ?>
	<script type="application/json" id="ink-page-data"><?php echo wp_json_encode( $ink_home_data ); ?></script>

	<div id="hero-root">
		<?php // Fallback estático (pre-hidratación / sin JS). React lo reemplaza con la secuencia animada. ?>
		<section class="ink-hero relative min-h-[100svh] overflow-hidden bg-[var(--color-charcoal)]">
			<div class="container-ink flex min-h-[100svh] flex-col items-center justify-center gap-10 py-24 text-center">
				<p class="ink-hero__kicker" style="position:static;transform:none;width:auto"><?php echo esc_html( $ink_home_data['hero']['eyebrow'] ); ?></p>
				<div class="ink-card" style="grid-area:auto">
					<div class="ink-card__img" style="background-image:url('<?php echo esc_url( $ink_home_data['hero']['heroImage'] ); ?>')"></div>
				</div>

				<div class="mx-auto w-full max-w-2xl">
					<h1 class="ink-gradient-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
						<?php echo esc_html( $ink_home_data['hero']['title'] ); ?>
					</h1>
					<p class="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
						<?php echo esc_html( $ink_home_data['hero']['subtitle'] ); ?>
					</p>
					<div class="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
						<a href="<?php echo esc_url( $ink_home_data['hero']['ctaPrimary']['href'] ); ?>" class="inline-flex items-center justify-center rounded-md border border-[var(--color-blue)] bg-[var(--color-blue)] px-6 py-3 text-base font-medium text-[var(--color-text-on-accent)] shadow-[0px_-1px_0px_0px_#FFFFFF60_inset,0px_1px_0px_0px_#FFFFFF60_inset]">
							<?php echo esc_html( $ink_home_data['hero']['ctaPrimary']['label'] ); ?>
						</a>
						<a href="<?php echo esc_url( $ink_home_data['hero']['ctaSecondary']['href'] ); ?>" class="inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white hover:bg-neutral-800/60">
							<?php echo esc_html( $ink_home_data['hero']['ctaSecondary']['label'] ); ?>
						</a>
					</div>
					<dl class="mx-auto mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
						<?php foreach ( $ink_home_data['hero']['stats'] as $stat ) : ?>
							<div class="ink-surface-card bg-[var(--color-charcoal)]/70 p-4 text-center backdrop-blur-md">
								<dd class="text-2xl font-semibold text-[var(--color-blue)] md:text-3xl">
									<?php echo esc_html( $stat['value'] . ( $stat['suffix'] ?? '+' ) ); ?>
								</dd>
								<dt class="mt-1 text-xs text-[var(--color-muted)] md:text-sm"><?php echo esc_html( $stat['label'] ); ?></dt>
							</div>
						<?php endforeach; ?>
					</dl>
				</div>
			</div>
		</section>
	</div>

	<div id="services-root">
		<section id="servicios" class="ink-section scroll-mt-24 py-20">
					<div class="container-ink text-center">
						<h2 class="ink-gradient-heading mx-auto max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
							<?php echo esc_html( $ink_home_data['services']['title'] ); ?>
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
							<?php echo esc_html( $ink_home_data['services']['subtitle'] ); ?>
						</p>
						<div class="ink-bento-grid mt-12">
							<?php foreach ( $ink_home_data['services']['services'] as $service ) : ?>
								<a href="<?php echo esc_url( $service['href'] ); ?>" class="ink-surface-card block p-6 text-left">
									<span class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-2xl text-[var(--color-blue)]"><?php echo esc_html( $service['icon'] ); ?></span>
									<h3 class="text-lg font-semibold text-[var(--color-text-primary)]"><?php echo esc_html( $service['title'] ); ?></h3>
									<p class="mt-2 text-sm text-[var(--color-gray-text)]"><?php echo esc_html( $service['description'] ); ?></p>
								</a>
							<?php endforeach; ?>
						</div>
					</div>
				</section>
			</div>

	<div class="ink-light-rest">
	<?php // A partir de aquí el sitio queda en blanco (el túnel termina en blanco). ?>
	<div id="results-root">
		<section class="ink-section py-20">
			<div class="container-ink text-center">
				<h2 class="ink-gradient-heading mx-auto max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
					<?php echo esc_html( $ink_home_data['results']['title'] ); ?>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
					<?php echo esc_html( $ink_home_data['results']['subtitle'] ); ?>
				</p>
				<div class="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
					<?php foreach ( $ink_home_data['results']['metrics'] as $metric ) : ?>
						<div class="ink-surface-card p-6">
							<p class="text-3xl font-semibold text-[var(--color-blue)] md:text-4xl">
								<?php echo esc_html( $metric['value'] . ( $metric['suffix'] ?? '+' ) ); ?>
							</p>
							<p class="mt-2 text-sm text-[var(--color-muted)]"><?php echo esc_html( $metric['label'] ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	</div>

	<div id="portfolio-root">
		<section class="ink-section py-20">
			<div class="container-ink text-center">
				<h2 class="ink-gradient-heading mx-auto max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
					<?php echo esc_html( $ink_home_data['portfolio']['title'] ); ?>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
					<?php echo esc_html( $ink_home_data['portfolio']['subtitle'] ); ?>
				</p>
				<div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<?php foreach ( $ink_home_data['portfolio']['items'] as $item ) : ?>
						<a href="<?php echo esc_url( $item['href'] ); ?>" class="ink-surface-card block overflow-hidden text-left"<?php echo ( 0 === strpos( $item['href'], 'http' ) ) ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
							<img src="<?php echo esc_url( $item['image'] ); ?>" alt="<?php echo esc_attr( $item['title'] . ': ' . ( $item['description'] ?? '' ) ); ?>" width="1600" height="750" loading="lazy" class="h-44 w-full object-cover object-top opacity-90">
							<div class="border-t border-neutral-800 p-5">
								<p class="text-xs font-medium uppercase tracking-wider text-[var(--color-blue)]"><?php echo esc_html( $item['client'] ); ?></p>
								<h3 class="mt-1 text-lg font-semibold text-[var(--color-text-primary)]"><?php echo esc_html( $item['title'] ); ?></h3>
							</div>
						</a>
					<?php endforeach; ?>
				</div>
				<div class="mt-10 text-center">
					<a href="<?php echo esc_url( $ink_home_data['portfolio']['ctaHref'] ); ?>" class="inline-flex items-center justify-center rounded-md border border-[var(--color-blue)] bg-[var(--color-blue)] px-6 py-3 text-sm font-medium text-[var(--color-text-on-accent)]">
						<?php echo esc_html( $ink_home_data['portfolio']['ctaLabel'] ); ?>
					</a>
				</div>
			</div>
		</section>
	</div>


	<div id="plans-root">
		<section id="planes" class="ink-section ink-plans scroll-mt-24 py-20">
			<div class="container-ink text-center">
				<h2 class="ink-gradient-heading mx-auto max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
					<?php echo esc_html( $ink_home_data['plans']['title'] ); ?>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-base text-[var(--color-gray-text)] md:text-lg">
					<?php echo esc_html( $ink_home_data['plans']['subtitle'] ); ?>
				</p>
				<div class="ink-plans-teaser">
					<?php foreach ( $ink_home_data['plans']['plans'] as $plan ) : ?>
						<article class="ink-plans-teaser__card<?php echo ! empty( $plan['featured'] ) ? ' is-featured' : ''; ?>">
							<p class="ink-plans-teaser__name"><?php echo esc_html( $plan['name'] ); ?></p>
							<p class="ink-plans-teaser__price">
								<?php echo esc_html( $plan['price'] ); ?>
								<?php if ( ! empty( $plan['period'] ) ) : ?>
									<span>/<?php echo esc_html( $plan['period'] ); ?></span>
								<?php endif; ?>
							</p>
							<?php if ( ! empty( $plan['idealFor'] ) ) : ?>
								<p class="ink-plans-teaser__ideal"><?php echo esc_html( $plan['idealFor'] ); ?></p>
							<?php else : ?>
								<ul class="ink-plans-teaser__list">
									<?php foreach ( ( $plan['teaser'] ?? array_slice( $plan['features'], 0, 2 ) ) as $item ) : ?>
										<li><?php echo esc_html( $item ); ?></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
							<a class="ink-plans-teaser__more" href="<?php echo esc_url( $plan['moreHref'] ?? $ink_home_data['plans']['plansUrl'] . '#' . $plan['slug'] ); ?>">
								Ver más
							</a>
						</article>
					<?php endforeach; ?>
				</div>
				<div class="ink-plans-teaser__cta">
					<a href="<?php echo esc_url( $ink_home_data['plans']['plansUrl'] ); ?>" class="ink-plans-teaser__cta-btn">
						Ver comparativa completa de planes
					</a>
				</div>
			</div>
		</section>
	</div>

	<div id="contact-root">
		<?php get_template_part( 'templates/parts/contact-form' ); ?>
	</div>
	</div>

</main>

<?php get_footer(); ?>
