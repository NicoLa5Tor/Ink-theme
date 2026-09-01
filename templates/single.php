<?php
/**
 * single.php — el artículo completo se renderiza en PHP puro (contenido
 * indexable). React solo hidrata los botones de compartir (#share-buttons-root),
 * ver src/entries/single.jsx.
 */
get_header();
?>

<main id="contenido-principal">
	<?php while ( have_posts() ) : the_post(); ?>
		<article class="container-ink max-w-3xl py-16">
			<header class="mb-8">
				<p class="text-sm font-semibold uppercase tracking-wide text-[var(--color-blue)]">
					<?php echo esc_html( get_the_date() ); ?>
				</p>
				<h1 class="mt-2 text-4xl font-heading font-extrabold text-[var(--color-navy)] sm:text-5xl">
					<?php the_title(); ?>
				</h1>
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="mt-8 overflow-hidden rounded-xl">
						<?php the_post_thumbnail( 'large', array( 'class' => 'w-full object-cover', 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
					</div>
				<?php endif; ?>
			</header>

			<div class="prose prose-lg max-w-none">
				<?php the_content(); ?>
			</div>

			<div class="mt-10 border-t border-[var(--color-gray-text)]/20 pt-6">
				<p class="mb-3 text-sm font-semibold text-[var(--color-navy)]">Comparte este artículo</p>
				<div
					id="share-buttons-root"
					data-url="<?php echo esc_url( get_permalink() ); ?>"
					data-title="<?php echo esc_attr( get_the_title() ); ?>"
				></div>
			</div>
		</article>
	<?php endwhile; ?>
</main>

<?php get_footer(); ?>
