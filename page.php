<?php
/**
 * Plantilla genérica para páginas WP estándar (nosotros, planes, portafolio,
 * hubs de servicios, casos de éxito, etc.). Contenido 100% desde el editor
 * de WordPress, renderizado en PHP puro.
 */
get_header();
?>
<main id="contenido-principal">
	<?php while ( have_posts() ) : the_post(); ?>
		<article class="container-ink py-20">
			<h1 class="text-4xl font-heading font-extrabold text-[var(--color-navy)] sm:text-5xl"><?php the_title(); ?></h1>
			<div class="prose prose-lg mt-8 max-w-none">
				<?php the_content(); ?>
			</div>
		</article>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
