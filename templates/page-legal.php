<?php
/**
 * Template Name: Legal
 *
 * Plantilla para páginas legales (política de privacidad, política de
 * cookies, términos y condiciones). Se asigna desde el editor de páginas.
 * Contenido 100% PHP/WP, indexable, con fecha de última actualización.
 */
get_header();
?>

<main id="contenido-principal">
	<article class="container-ink max-w-3xl py-16">
		<h1 class="text-4xl font-heading font-extrabold text-[var(--color-navy)] sm:text-5xl">
			<?php the_title(); ?>
		</h1>
		<p class="mt-2 text-sm text-[var(--color-gray-text)]">
			Última actualización: <?php echo esc_html( get_the_modified_date() ); ?>
		</p>
		<div class="prose prose-lg mt-8 max-w-none">
			<?php the_content(); ?>
		</div>
	</article>
</main>

<?php get_footer(); ?>
