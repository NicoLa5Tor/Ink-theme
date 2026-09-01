<?php
/**
 * inc/seo.php
 *
 * SEO técnico propio del tema: title, meta description, OG tags, JSON-LD,
 * canonical y noindex. Si Rank Math (u otro plugin SEO reconocido) está
 * activo, este archivo cede el control por completo para evitar duplicados.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Detecta si un plugin SEO conocido está activo y manejando meta/OG/JSON-LD.
 */
function ink_seo_plugin_active() {
	return defined( 'RANK_MATH_VERSION' )
		|| class_exists( 'WPSEO_Options' ) // Yoast
		|| defined( 'AIOSEO_VERSION' );
}

if ( ink_seo_plugin_active() ) {
	// Un plugin SEO ya está activo: el tema no imprime title/meta/OG/JSON-LD
	// propios para evitar duplicados. Rank Math ya remueve wp_head core tags
	// (title-tag, canonical, etc.) por su cuenta; aquí solo nos aseguramos
	// de no añadir los nuestros.
	return;
}

// --- A partir de aquí, el tema maneja el SEO por su cuenta ---

// WordPress imprime el <title> (title-tag), pero con nuestro valor calculado.
add_theme_support( 'title-tag' );
add_filter( 'pre_get_document_title', 'ink_seo_get_title' );

add_action( 'wp_head', 'ink_seo_meta_tags', 2 );
add_action( 'wp_head', 'ink_seo_json_ld', 5 );

/**
 * Nombre, logo y descripción configurables desde Personalizar > Ink SEO
 * (Panel registrado en inc/menus.php como theme_mod).
 */
function ink_seo_get_site_meta() {
	return array(
		'name'        => get_theme_mod( 'ink_seo_org_name', get_bloginfo( 'name' ) ),
		'description' => get_theme_mod( 'ink_seo_org_description', get_bloginfo( 'description' ) ),
		'logo'        => get_theme_mod( 'ink_seo_org_logo', get_template_directory_uri() . '/assets/logo.png' ),
	);
}

/**
 * Páginas con noindex forzado: /gracias/ siempre, más cualquier página
 * con el meta box "ink_noindex" marcado desde el editor.
 */
function ink_seo_is_noindex() {
	if ( is_page( 'gracias' ) ) {
		return true;
	}

	if ( is_page() && get_post_meta( get_the_ID(), 'ink_noindex', true ) ) {
		return true;
	}

	return false;
}

function ink_seo_meta_tags() {
	$site  = ink_seo_get_site_meta();
	$title = ink_seo_get_title();
	$desc  = ink_seo_get_description();
	$url   = ink_seo_get_canonical_url();
	$image = ink_seo_get_og_image();

	if ( ink_seo_is_noindex() ) {
		echo '<meta name="robots" content="noindex,nofollow">' . "\n";
	} else {
		echo '<meta name="robots" content="index,follow">' . "\n";
	}

	printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	printf( '<link rel="canonical" href="%s">' . "\n", esc_url( $url ) );

	printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( $title ) );
	printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:url" content="%s">' . "\n", esc_url( $url ) );
	printf( '<meta property="og:type" content="%s">' . "\n", esc_attr( is_single() ? 'article' : 'website' ) );
	printf( '<meta property="og:site_name" content="%s">' . "\n", esc_attr( $site['name'] ) );
	if ( $image ) {
		printf( '<meta property="og:image" content="%s">' . "\n", esc_url( $image ) );
	}

	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
}

function ink_seo_get_title() {
	if ( is_front_page() ) {
		return get_bloginfo( 'name' ) . ' — Agencia de marketing digital en Bogotá';
	}
	if ( is_single() || is_page() ) {
		return get_the_title() . ' — ' . get_bloginfo( 'name' );
	}
	if ( is_archive() || is_home() ) {
		return 'Blog — ' . get_bloginfo( 'name' );
	}
	return wp_get_document_title();
}

function ink_seo_get_description() {
	if ( is_singular() && has_excerpt() ) {
		return wp_strip_all_tags( get_the_excerpt() );
	}
	if ( is_singular() ) {
		return wp_trim_words( wp_strip_all_tags( get_the_content() ), 30 );
	}
	return get_bloginfo( 'description' );
}

function ink_seo_get_canonical_url() {
	if ( is_front_page() ) {
		return home_url( '/' );
	}
	if ( is_singular() ) {
		return get_permalink();
	}
	if ( is_paged() ) {
		global $wp;
		return home_url( add_query_arg( array(), $wp->request ) );
	}
	return home_url( $_SERVER['REQUEST_URI'] ?? '/' ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
}

function ink_seo_get_og_image() {
	if ( is_singular() && has_post_thumbnail() ) {
		return get_the_post_thumbnail_url( get_the_ID(), 'large' );
	}
	$site = ink_seo_get_site_meta();
	return $site['logo'];
}

/**
 * JSON-LD: Organization en home, Article en posts individuales.
 */
function ink_seo_json_ld() {
	$site = ink_seo_get_site_meta();

	if ( is_front_page() ) {
		$data = array(
			'@context' => 'https://schema.org',
			'@type'    => 'Organization',
			'name'     => $site['name'],
			'url'      => home_url( '/' ),
			'logo'     => $site['logo'],
			'description' => $site['description'],
			'sameAs'   => array_filter(
				array(
					get_theme_mod( 'ink_social_facebook', '' ),
					get_theme_mod( 'ink_social_instagram', '' ),
					get_theme_mod( 'ink_social_linkedin', '' ),
				)
			),
		);
		printf( '<script type="application/ld+json">%s</script>' . "\n", wp_json_encode( $data ) );

		global $ink_home_data;
		$sites = $ink_home_data['portfolio']['items'] ?? array();
		if ( $sites ) {
			$list = array(
				'@context'        => 'https://schema.org',
				'@type'           => 'ItemList',
				'name'            => $ink_home_data['portfolio']['title'] ?? 'Portafolio de sitios web',
				'description'     => $ink_home_data['portfolio']['subtitle'] ?? '',
				'itemListElement' => array(),
			);
			foreach ( $sites as $i => $site ) {
				$list['itemListElement'][] = array(
					'@type'    => 'ListItem',
					'position' => $i + 1,
					'item'     => array(
						'@type'       => 'WebSite',
						'name'        => $site['title'] ?? '',
						'description' => $site['description'] ?? '',
						'url'         => ! empty( $site['href'] ) && 0 === strpos( $site['href'], 'http' ) ? $site['href'] : home_url( '/#portafolio' ),
						'image'       => $site['image'] ?? '',
					),
				);
			}
			printf( '<script type="application/ld+json">%s</script>' . "\n", wp_json_encode( $list ) );
		}
		return;
	}

	if ( is_single() ) {
		$data = array(
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'headline'      => get_the_title(),
			'datePublished' => get_the_date( 'c' ),
			'dateModified'  => get_the_modified_date( 'c' ),
			'author'        => array(
				'@type' => 'Organization',
				'name'  => $site['name'],
			),
			'publisher'     => array(
				'@type' => 'Organization',
				'name'  => $site['name'],
				'logo'  => array(
					'@type' => 'ImageObject',
					'url'   => $site['logo'],
				),
			),
			'mainEntityOfPage' => get_permalink(),
		);

		if ( has_post_thumbnail() ) {
			$data['image'] = get_the_post_thumbnail_url( get_the_ID(), 'large' );
		}

		printf( '<script type="application/ld+json">%s</script>' . "\n", wp_json_encode( $data ) );
	}
}
