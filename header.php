<?php
/**
 * Header del tema. Se incluye en todas las plantillas vía get_header().
 * Imprime dentro de #site-header-root la barra flotante oscura con el logo
 * y los links. Los entries de Vite (mountChrome.jsx) montan encima, vía
 * createRoot, la versión con el GooeyNav (nav con partículas). Si el JS no
 * carga, esta barra ya se ve completa y los links siguen siendo 100%
 * navegables e indexables. `fixed` para que flote sobre el contenido sin
 * dejar un hueco en el flujo del documento.
 */

$ink_menu_items = array(
	array(
		'href'  => home_url( '/' ),
		'label' => 'Inicio',
	),
	array(
		'href'  => home_url( '/#servicios' ),
		'label' => 'Servicios',
	),
	array(
		'href'  => home_url( '/#portafolio' ),
		'label' => 'Portafolio',
	),
	array(
		'href'  => home_url( '/planes/' ),
		'label' => 'Planes',
	),
	array(
		'href'  => home_url( '/blog/' ),
		'label' => 'Blog',
	),
	array(
		'href'  => home_url( '/#contacto' ),
		'label' => 'Contacto',
	),
);

// La barra es siempre oscura -> logo blanco y links blancos.
$ink_logo_white_url = get_template_directory_uri() . '/assets/images/logo-white.png';
$ink_logo_black_url = get_template_directory_uri() . '/assets/images/logo-black.png';
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php // Preloader: cubre el flash de hidratación (SSR -> React+GSAP) con el fondo de marca + un spinner. app.jsx lo retira cuando las secciones ya montaron; el script inline es el respaldo. ?>
<div id="ink-preloader" role="status" aria-live="polite" aria-label="Cargando">
	<span class="ink-preloader__spinner" aria-hidden="true"></span>
</div>
<script>
	window.setTimeout(function () {
		var p = document.getElementById('ink-preloader');
		if (!p || p.classList.contains('is-hidden')) return;
		p.classList.add('is-hidden');
		window.setTimeout(function () { if (p && p.parentNode) p.parentNode.removeChild(p); }, 700);
	}, 3500);
</script>

<?php if ( defined( 'INK_GTM_ID' ) && INK_GTM_ID ) : ?>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_attr( INK_GTM_ID ); ?>"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<?php endif; ?>

<a class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2" href="#contenido-principal">
	Saltar al contenido principal
</a>

<div
	id="site-header-root"
	class="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
	data-home-url="<?php echo esc_url( home_url( '/' ) ); ?>"
	data-site-name="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
	data-logo-black-url="<?php echo esc_url( $ink_logo_black_url ); ?>"
	data-logo-white-url="<?php echo esc_url( $ink_logo_white_url ); ?>"
	data-mask-image-url="<?php echo esc_url( ink_img_url( 19, '/assets/hero/dash.webp' ) ); ?>"
>
	<div class="flex items-center gap-4 rounded-full border border-white/15 bg-[rgba(10,10,10,0.85)] px-6 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
			<img
				src="<?php echo esc_url( $ink_logo_white_url ); ?>"
				alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"
				width="40"
				height="40"
				class="h-10 w-10"
			>
		</a>

		<nav id="site-nav" class="site-nav">
			<ul class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
				<?php foreach ( $ink_menu_items as $item ) : ?>
					<li>
						<a href="<?php echo esc_url( $item['href'] ); ?>" class="block rounded-full px-4 py-2 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10">
							<?php echo esc_html( $item['label'] ); ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</nav>
	</div>
</div>
