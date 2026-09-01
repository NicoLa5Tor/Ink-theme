<?php
/**
 * Datos de planes (home teaser + página /planes).
 */
defined( 'ABSPATH' ) || exit;

/**
 * @return array<string, mixed>
 */
function ink_get_plans_data() {
	$planes_url = home_url( '/planes/' );

	return array(
		'title'        => 'Planes para cada etapa de tu negocio',
		'subtitle'     => 'Elige el nivel de acompañamiento. Escala cuando tu empresa lo necesite.',
		'pageEyebrow'  => 'Planes Ink Digital',
		'pageTitle'    => 'Invierte en crecimiento, no en improvisación',
		'pageSubtitle' => 'Somos tu equipo de marketing en Bogotá: estrategia, contenido, pauta y medición en un solo lugar. Sin paquetes genéricos — cada plan está pensado para generar resultados medibles.',
		'plansUrl'     => $planes_url,
		'whyUs'        => array(
			array(
				'title' => 'Un solo equipo, cero fricción',
				'text'  => 'Community manager, pauta y reportes coordinados. No persigues a cinco proveedores distintos.',
			),
			array(
				'title' => 'Estrategia con IA aplicada',
				'text'  => 'Usamos inteligencia artificial para acelerar análisis, contenido y decisiones — siempre con criterio humano.',
			),
			array(
				'title' => 'Resultados que puedes leer',
				'text'  => 'Engagement, leads y ROAS en reportes claros. Sabes qué funciona y qué ajustar cada mes.',
			),
		),
		'guarantee'    => 'En los primeros 90 días definimos métricas claras, ejecutamos y ajustamos con datos reales de tu negocio.',
		'plans'        => array(
			array(
				'slug'     => 'basico',
				'name'     => 'Básico',
				'price'    => '$3.2M',
				'period'   => 'mes',
				'idealFor' => 'Pequeñas empresas que inician en digital',
				'teaser'   => array(
					'Community Manager dedicado',
					'6 piezas de contenido al mes',
				),
				'features' => array(
					'Servicios básicos incluidos',
					'Community Manager dedicado',
					'6 piezas de contenido mensuales',
					'Gestión de redes sociales básica',
					'Análisis y reporte mensual',
					'Apoyo estrategia IA básica',
					'Soporte vía email',
				),
				'results'  => '150–300% aumento en engagement',
				'href'     => ink_get_whatsapp_href(),
				'moreHref' => $planes_url . '#basico',
			),
			array(
				'slug'     => 'plus',
				'name'     => 'Plus',
				'price'    => '$6.2M',
				'period'   => 'mes',
				'idealFor' => 'Empresas en crecimiento que buscan leads',
				'teaser'   => array(
					'Meta Ads + campañas',
					'8 piezas de contenido al mes',
				),
				'features' => array(
					'Todo en Básico +',
					'Publicidad Digital (Meta Ads)',
					'8 piezas de contenido mensuales',
					'Gestión de crisis e investigación',
					'Organización de campañas',
					'Marketing de contenidos avanzado',
					'Soporte telefónico',
				),
				'results'  => '300–800% aumento en leads',
				'href'     => ink_get_whatsapp_href(),
				'moreHref' => $planes_url . '#plus',
				'featured' => true,
			),
			array(
				'slug'     => 'profesional',
				'name'     => 'Profesional',
				'price'    => '$8.8M',
				'period'   => 'mes',
				'idealFor' => 'Empresas establecidas que quieren dominar',
				'teaser'   => array(
					'Google Ads + optimización web',
					'Gerente de cuenta dedicado',
				),
				'features' => array(
					'Todo en Plus +',
					'Google Ads (campañas completas)',
					'10 piezas de contenido mensuales',
					'Capacitación fuerza de ventas',
					'Desarrollo y optimización WEB + IA',
					'Gerente de cuenta dedicado',
					'Reportes semanales',
				),
				'results'  => '150–300% aumento en engagement',
				'href'     => ink_get_whatsapp_href(),
				'moreHref' => $planes_url . '#profesional',
			),
		),
	);
}
