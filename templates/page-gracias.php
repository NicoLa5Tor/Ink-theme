<?php
/**
 * Template Name: Gracias
 *
 * Página de conversión post-formulario. noindex se aplica en inc/seo.php
 * (is_page('gracias')). El evento de conversión GA4 se dispara inline
 * en functions.php justo después del snippet de GTM cuando is_page('gracias').
 */
get_header();
?>

<main id="contenido-principal">
	<section class="container-ink flex flex-col items-center gap-6 py-24 text-center">
		<h1 class="text-4xl font-heading font-extrabold text-[var(--color-navy)] sm:text-5xl">
			¡Gracias por escribirnos!
		</h1>
		<p class="max-w-xl text-lg text-[var(--color-gray-text)]">
			Recibimos tu mensaje. Nuestro equipo te contactará en menos de 24 horas hábiles.
		</p>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-flex items-center justify-center rounded-lg bg-[var(--color-blue)] px-8 py-4 font-heading font-semibold text-white">
			Volver al inicio
		</a>
	</section>
</main>

<?php get_footer(); ?>
