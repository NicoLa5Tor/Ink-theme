<?php
/**
 * Fallback requerido por WordPress para todo tema. En la práctica,
 * front-page.php / single.php / archive.php / page.php cubren las
 * plantillas reales del sitio.
 */
get_header();
?>
<main id="contenido-principal" class="container-ink py-20">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<article>
				<h1 class="text-3xl font-heading font-extrabold text-[var(--color-navy)]"><?php the_title(); ?></h1>
				<div class="prose mt-6 max-w-none"><?php the_content(); ?></div>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<p>No se encontró contenido.</p>
	<?php endif; ?>
</main>
<?php get_footer(); ?>
