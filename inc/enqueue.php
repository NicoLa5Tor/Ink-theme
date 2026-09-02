<?php
/**
 * inc/enqueue.php
 *
 * Lee dist/manifest.json (generado por Vite) y encola el CSS/JS correcto
 * según la plantilla activa. Fonts con preload en <head>. GSAP y React
 * con defer para nunca bloquear el render del HTML ya pintado por PHP.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lee y cachea (en memoria, por request) el manifest.json generado por Vite.
 *
 * @return array<string, array{file:string, css?: array<string>}>
 */
function ink_get_vite_manifest() {
	static $manifest = null;

	if ( null !== $manifest ) {
		return $manifest;
	}

	// Vite 5/6 escribe el manifest en dist/.vite/manifest.json por defecto.
	$manifest_path = get_template_directory() . '/dist/.vite/manifest.json';

	if ( ! file_exists( $manifest_path ) ) {
		$manifest = array();
		return $manifest;
	}

	$contents = file_get_contents( $manifest_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	$decoded  = json_decode( $contents, true );
	$manifest = is_array( $decoded ) ? $decoded : array();

	return $manifest;
}

/**
 * Determina qué entry de Vite (src/entries/*.jsx) corresponde a la request actual.
 *
 * @return string|null
 */
function ink_current_entry_key() {
	// Un solo bundle en todas las plantillas: monta el chrome una vez, hidrata
	// las secciones de cada página y maneja la navegación AJAX sin recargar.
	return 'src/entries/app.jsx';
}

add_action( 'wp_enqueue_scripts', 'ink_enqueue_assets' );

function ink_enqueue_assets() {
	$manifest   = ink_get_vite_manifest();
	$entry_key  = ink_current_entry_key();
	$theme_uri  = get_template_directory_uri();
	$theme_ver  = wp_get_theme()->get( 'Version' );

	if ( empty( $manifest ) || ! $entry_key || empty( $manifest[ $entry_key ] ) ) {
		return;
	}

	$entry = $manifest[ $entry_key ];
	$hash  = substr( md5( $entry['file'] ), 0, 8 ); // cache-busting basado en el hash del archivo

	// El CSS de Tailwind puede quedar en el propio entry o en los chunks
	// importados por él (p. ej. cuando varios componentes comparten un chunk).
	$css_files = $entry['css'] ?? array();
	foreach ( $entry['imports'] ?? array() as $import_key ) {
		if ( ! empty( $manifest[ $import_key ]['css'] ) ) {
			$css_files = array_merge( $css_files, $manifest[ $import_key ]['css'] );
		}
	}
	$css_files = array_unique( $css_files );

	foreach ( $css_files as $i => $css_file ) {
		wp_enqueue_style(
			"ink-{$entry_key}-css-{$i}",
			"{$theme_uri}/dist/{$css_file}",
			array(),
			$hash
		);
	}

	// JS del entry — defer para nunca bloquear el render inicial.
	wp_enqueue_script(
		'ink-entry',
		"{$theme_uri}/dist/{$entry['file']}",
		array(),
		$hash,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);
	// wp_script_add_data('type', 'module') no funciona: el script loader de WP
	// no reconoce esa clave para imprimir el atributo. Sin type="module" el
	// navegador ejecuta el bundle como script clásico y el `import` de ESM
	// revienta con "Cannot use import statement outside a module". Se fuerza
	// el atributo vía script_loader_tag.
	add_filter(
		'script_loader_tag',
		function ( $tag, $handle ) {
			if ( 'ink-entry' !== $handle || false !== strpos( $tag, ' type=' ) ) {
				return $tag;
			}
			return str_replace( ' src=', ' type="module" src=', $tag );
		},
		10,
		2
	);

	// Preload de imports/chunks que Vite generó para este entry (React, GSAP, etc.).
	if ( ! empty( $entry['imports'] ) ) {
		foreach ( $entry['imports'] as $import_key ) {
			if ( empty( $manifest[ $import_key ]['file'] ) ) {
				continue;
			}
			add_action(
				'wp_head',
				function () use ( $theme_uri, $manifest, $import_key ) {
					printf(
						'<link rel="modulepreload" href="%s">' . "\n",
						esc_url( "{$theme_uri}/dist/{$manifest[ $import_key ]['file']}" )
					);
				}
			);
		}
	}

	// Nota: los datos de cada página NO se localizan con wp_localize_script,
	// porque la navegación AJAX intercambia solo el <main>. En su lugar, cada
	// plantilla imprime un <script type="application/json" id="ink-page-data">
	// DENTRO del <main> (ver front-page.php), y app.jsx lo lee tras cada swap.
}

/**
 * Preload de fonts Montserrat/Inter en <head>, con font-display: swap ya
 * definido en @font-face (src/styles/app.css). El preload evita el salto
 * de layout (CLS) mientras carga el CSS.
 */
/**
 * Preload de la imagen del hero (candidata a LCP) solo en la portada, en alta
 * prioridad. Usa la misma URL que la cortina/MaskedHeading (ink_img_url), así el
 * navegador la descarga cuanto antes en vez de esperar a que el JS pinte el hero.
 */
add_action( 'wp_head', 'ink_preload_hero_lcp', 1 );

function ink_preload_hero_lcp() {
	if ( ! is_front_page() ) {
		return;
	}
	printf(
		'<link rel="preload" href="%s" as="image" fetchpriority="high">' . "\n",
		esc_url( ink_img_url( 21, '/assets/hero/mas-clientes.webp' ) )
	);
}

add_action( 'wp_head', 'ink_preload_fonts', 1 );

function ink_preload_fonts() {
	$theme_uri = get_template_directory_uri();
	$fonts     = array(
		'/assets/fonts/montserrat/montserrat-600.woff2',
		'/assets/fonts/montserrat/montserrat-800.woff2',
		'/assets/fonts/inter/inter-400.woff2',
		'/assets/fonts/inter/inter-600.woff2',
	);

	foreach ( $fonts as $font_path ) {
		// Root-relative (mismo formato que las URLs absolutas del @font-face en
		// app.css) para que el preload y la petición real del navegador sean
		// idénticas y no haya doble descarga.
		printf(
			'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
			esc_url( wp_make_link_relative( "{$theme_uri}{$font_path}" ) )
		);
	}
}
