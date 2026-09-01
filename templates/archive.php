<?php
/**
 * Índice del blog y archivos. Entradas reales de WordPress.
 * Mismo layout/animación que /planes/.
 */
if ( ! isset( $ink_blog_data ) ) {
	$ink_blog_data = ink_get_blog_index_data();
}

get_header();
?>

<main id="contenido-principal" class="ink-light-rest">
	<script type="application/json" id="ink-page-data"><?php echo wp_json_encode(
		array(
			'blogIndex' => $ink_blog_data,
			'contact'   => ink_get_contact_data(),
		)
	); ?></script>

	<div id="blog-index-root">
		<div class="ink-plans-page ink-blog-page">
			<header class="ink-plans-page__hero container-ink">
				<p class="ink-eyebrow"><?php echo esc_html( $ink_blog_data['pageEyebrow'] ); ?></p>
				<h1 class="ink-plans-page__title"><?php echo esc_html( $ink_blog_data['pageTitle'] ); ?></h1>
				<p class="ink-plans-page__subtitle"><?php echo esc_html( $ink_blog_data['pageSubtitle'] ); ?></p>
			</header>

			<div class="ink-plans-page__body">
				<?php if ( ! empty( $ink_blog_data['categories'] ) ) : ?>
					<nav class="ink-legal-nav container-ink" aria-label="Categorías">
						<?php foreach ( $ink_blog_data['categories'] as $item ) : ?>
							<a
								href="<?php echo esc_url( $item['href'] ); ?>"
								class="ink-plans-page__why-item ink-legal-nav__item<?php echo ! empty( $item['active'] ) ? ' is-active' : ''; ?>"
							>
								<h2><?php echo esc_html( $item['title'] ); ?></h2>
								<p><?php echo esc_html( $item['text'] ); ?></p>
							</a>
						<?php endforeach; ?>
					</nav>
				<?php endif; ?>

				<div class="ink-blog-grid container-ink">
					<?php if ( ! empty( $ink_blog_data['posts'] ) ) : ?>
						<?php foreach ( $ink_blog_data['posts'] as $post_card ) : ?>
							<a href="<?php echo esc_url( $post_card['href'] ); ?>" class="ink-blog-card ink-plans-page__why-item">
								<?php if ( ! empty( $post_card['image'] ) ) : ?>
									<img class="ink-blog-card__image" src="<?php echo esc_url( $post_card['image'] ); ?>" alt="" width="640" height="360" loading="lazy">
								<?php else : ?>
									<div class="ink-blog-card__image ink-blog-card__image--empty" aria-hidden="true"></div>
								<?php endif; ?>
								<div class="ink-blog-card__body">
									<p class="ink-blog-card__meta">
										<?php if ( ! empty( $post_card['category'] ) ) : ?>
											<span><?php echo esc_html( $post_card['category'] ); ?></span>
										<?php endif; ?>
										<?php if ( ! empty( $post_card['date'] ) ) : ?>
											<time><?php echo esc_html( $post_card['date'] ); ?></time>
										<?php endif; ?>
									</p>
									<h2><?php echo esc_html( $post_card['title'] ); ?></h2>
									<?php if ( ! empty( $post_card['excerpt'] ) ) : ?>
										<p><?php echo esc_html( $post_card['excerpt'] ); ?></p>
									<?php endif; ?>
								</div>
							</a>
						<?php endforeach; ?>
					<?php else : ?>
						<p class="ink-blog-empty"><?php echo esc_html( $ink_blog_data['emptyText'] ); ?></p>
					<?php endif; ?>
				</div>

				<?php if ( count( $ink_blog_data['pagination'] ) > 1 ) : ?>
					<nav class="ink-blog-pagination container-ink" aria-label="Paginación">
						<?php foreach ( $ink_blog_data['pagination'] as $page ) : ?>
							<a href="<?php echo esc_url( $page['href'] ); ?>"<?php echo ! empty( $page['current'] ) ? ' class="is-current" aria-current="page"' : ''; ?>>
								<?php echo (int) $page['n']; ?>
							</a>
						<?php endforeach; ?>
					</nav>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<div id="contact-root">
		<?php get_template_part( 'templates/parts/contact-form' ); ?>
	</div>
</main>

<?php get_footer(); ?>
