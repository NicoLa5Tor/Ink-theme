<?php
/**
 * archive.php — listado nativo de WordPress (blog index /blog/).
 * PHP puro, sin React. Paginación nativa vía the_posts_pagination().
 */
get_header();
?>

<main id="contenido-principal">
	<div class="container-ink py-16">
		<header class="mb-12">
			<h1 class="text-4xl font-heading font-extrabold text-[var(--color-navy)] sm:text-5xl">
				<?php is_home() ? esc_html_e( 'Blog', 'ink-theme' ) : the_archive_title(); ?>
			</h1>
			<p class="mt-3 max-w-2xl text-lg text-[var(--color-gray-text)]">
				Estrategia, tendencias y casos prácticos de marketing digital.
			</p>
		</header>

		<?php if ( have_posts() ) : ?>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<article class="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(11,37,69,0.08)]">
						<a href="<?php the_permalink(); ?>">
							<?php if ( has_post_thumbnail() ) : ?>
								<?php the_post_thumbnail( 'medium_large', array( 'class' => 'h-48 w-full object-cover', 'loading' => 'lazy' ) ); ?>
							<?php endif; ?>
							<div class="p-6">
								<p class="text-sm font-semibold uppercase tracking-wide text-[var(--color-blue)]">
									<?php echo esc_html( get_the_date() ); ?>
								</p>
								<h2 class="mt-2 text-xl font-heading font-semibold text-[var(--color-navy)]">
									<?php the_title(); ?>
								</h2>
								<p class="mt-2 text-[var(--color-gray-text)]"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
							</div>
						</a>
					</article>
				<?php endwhile; ?>
			</div>

			<nav class="mt-12">
				<?php
				the_posts_pagination(
					array(
						'mid_size'  => 2,
						'prev_text' => '← Anterior',
						'next_text' => 'Siguiente →',
					)
				);
				?>
			</nav>
		<?php else : ?>
			<p>Todavía no hay artículos publicados.</p>
		<?php endif; ?>
	</div>
</main>

<?php get_footer(); ?>
