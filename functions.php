<?php
/**
 * functions.php — Ink Theme
 *
 * Setup del tema, GTM + Consent Mode v2, conversión WebP en uploads,
 * e includes de inc/enqueue.php, inc/seo.php e inc/menus.php.
 */

defined( 'ABSPATH' ) || exit;

// IDs configurables — reemplazar por los valores reales del cliente antes del lanzamiento.
define( 'INK_GTM_ID', 'GTM-XXXXXXX' );
define( 'INK_GA4_ID', 'G-XXXXXXXXXX' );

require get_template_directory() . '/inc/enqueue.php';
require get_template_directory() . '/inc/seo.php';
require get_template_directory() . '/inc/menus.php';
require get_template_directory() . '/inc/plans-data.php';
require get_template_directory() . '/inc/legal-data.php';
require get_template_directory() . '/inc/whatsapp.php';
require get_template_directory() . '/inc/contact-data.php';
require get_template_directory() . '/inc/pages.php';

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'align-wide' );
	}
);

/**
 * Consent Mode v2 — se imprime ANTES del snippet de GTM para bloquear
 * analytics_storage y ad_storage hasta que el visitante acepte cookies.
 * El banner de consentimiento (CMP) debe llamar a gtag('consent','update', ...)
 * cuando el usuario acepte.
 */
add_action( 'wp_head', 'ink_print_consent_mode_default', 1 );

function ink_print_consent_mode_default() {
	?>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){ dataLayer.push(arguments); }
	gtag('consent', 'default', {
		'analytics_storage': 'denied',
		'ad_storage': 'denied',
		'ad_user_data': 'denied',
		'ad_personalization': 'denied',
		'wait_for_update': 500
	});
	</script>
	<?php
}

/**
 * Snippet de GTM en <head>. Se imprime DESPUÉS del consent default
 * (prioridad 2 > 1) para que GTM ya respete los valores por defecto.
 */
add_action( 'wp_head', 'ink_print_gtm_head', 2 );

function ink_print_gtm_head() {
	if ( ! defined( 'INK_GTM_ID' ) || ! INK_GTM_ID || 'GTM-XXXXXXX' === INK_GTM_ID ) {
		return;
	}
	?>
	<script>
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','<?php echo esc_js( INK_GTM_ID ); ?>');
	</script>
	<?php
}

/**
 * Evento de conversión GA4 en /gracias/. Se imprime en <head>, después del
 * snippet de GTM, únicamente en la página de gracias (carga tras submit
 * exitoso del formulario de contacto — ver inc/menus.php).
 */
add_action( 'wp_head', 'ink_print_conversion_event', 3 );

function ink_print_conversion_event() {
	if ( ! is_page( 'gracias' ) ) {
		return;
	}
	?>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){ dataLayer.push(arguments); }
	gtag('event', 'conversion', {
		'send_to': '<?php echo esc_js( INK_GA4_ID ); ?>',
		'event_category': 'formulario_contacto',
		'event_label': 'gracias'
	});
	</script>
	<?php
}

/**
 * Convierte a WebP los uploads de imágenes JPEG/PNG al subirlas desde el
 * editor de medios. Requiere soporte de WebP en la instalación de GD/Imagick
 * del hosting (Hostinger lo soporta por defecto en PHP 8.x).
 */
add_filter( 'wp_handle_upload', 'ink_convert_upload_to_webp' );

function ink_convert_upload_to_webp( $upload ) {
	$allowed_types = array( 'image/jpeg', 'image/png' );

	if ( empty( $upload['type'] ) || ! in_array( $upload['type'], $allowed_types, true ) ) {
		return $upload;
	}

	$file_path = $upload['file'];
	$image     = @imagecreatefromstring( file_get_contents( $file_path ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions, WordPress.PHP.NoSilencedErrors

	if ( ! $image ) {
		return $upload;
	}

	$webp_path = preg_replace( '/\.(jpe?g|png)$/i', '.webp', $file_path );

	if ( imagewebp( $image, $webp_path, 82 ) ) {
		imagedestroy( $image );
		$upload['file'] = $webp_path;
		$upload['url']  = preg_replace( '/\.(jpe?g|png)$/i', '.webp', $upload['url'] );
		$upload['type'] = 'image/webp';
	} else {
		imagedestroy( $image );
	}

	return $upload;
}
