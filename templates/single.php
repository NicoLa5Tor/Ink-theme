<?php
/**
 * Artículo del blog. Contenido real de WordPress, layout de /planes/.
 */
$ink_blog_single = ink_get_blog_single_data();

get_header();
?>

<main id="contenido-principal" class="ink-light-rest">
	<script type="application/json" id="ink-page-data"><?php echo wp_json_encode(
		array(
			'blogSingle' => $ink_blog_single,
			'contact'    => ink_get_contact_data(),
		)
	); ?></script>

	<div id="blog-single-root">
		<div class="ink-plans-page ink-blog-page">
			<header class="ink-plans-page__hero container-ink">
				<p class="ink-eyebrow"><?php echo esc_html( $ink_blog_single['pageEyebrow'] ); ?></p>
				<h1 class="ink-plans-page__title"><?php echo esc_html( $ink_blog_single['pageTitle'] ); ?></h1>
				<?php if ( ! empty( $ink_blog_single['pageSubtitle'] ) ) : ?>
					<p class="ink-plans-page__subtitle"><?php echo esc_html( $ink_blog_single['pageSubtitle'] ); ?></p>
				<?php endif; ?>
				<?php if ( ! empty( $ink_blog_single['date'] ) ) : ?>
					<p class="ink-blog-single__date"><?php echo esc_html( $ink_blog_single['date'] ); ?></p>
				<?php endif; ?>
			</header>

			<div class="ink-plans-page__body">
				<article class="ink-blog-article container-ink">
					<?php if ( ! empty( $ink_blog_single['image'] ) ) : ?>
						<img class="ink-blog-article__hero" src="<?php echo esc_url( $ink_blog_single['image'] ); ?>" alt="<?php echo esc_attr( $ink_blog_single['pageTitle'] ); ?>" width="1200" height="675">
					<?php endif; ?>
					<div class="ink-blog-article__content">
						<?php echo $ink_blog_single['content']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the_content already filtered. ?>
					</div>
					<div class="ink-blog-article__share">
						<p>Comparte este artículo</p>
						<div
							id="share-buttons-root"
							data-url="<?php echo esc_url( $ink_blog_single['shareUrl'] ); ?>"
							data-title="<?php echo esc_attr( $ink_blog_single['shareTitle'] ); ?>"
						></div>
					</div>
				</article>

				<?php if ( ! empty( $ink_blog_single['related'] ) ) : ?>
					<section class="ink-blog-related container-ink">
						<h2 class="ink-blog-related__title">Más del blog</h2>
						<div class="ink-blog-grid">
							<?php foreach ( $ink_blog_single['related'] as $post_card ) : ?>
								<a href="<?php echo esc_url( $post_card['href'] ); ?>" class="ink-blog-card ink-plans-page__why-item">
									<?php if ( ! empty( $post_card['image'] ) ) : ?>
										<img class="ink-blog-card__image" src="<?php echo esc_url( $post_card['image'] ); ?>" alt="<?php echo esc_attr( $post_card['title'] ); ?>" width="640" height="360" loading="lazy">
									<?php endif; ?>
									<div class="ink-blog-card__body">
										<h3><?php echo esc_html( $post_card['title'] ); ?></h3>
										<p><?php echo esc_html( $post_card['excerpt'] ); ?></p>
									</div>
								</a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<p class="ink-blog-back container-ink">
					<a href="<?php echo esc_url( $ink_blog_single['blogHref'] ); ?>">← Volver al blog</a>
				</p>
			</div>
		</div>
	</div>

	<div id="contact-root">
		<?php get_template_part( 'templates/parts/contact-form' ); ?>
	</div>
</main>

<?php get_footer(); ?>
