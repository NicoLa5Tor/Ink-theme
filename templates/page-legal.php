<?php
/**
 * Template Name: Legal
 *
 * Páginas legales indexables con el mismo layout y animaciones que /planes/.
 */
global $ink_home_data;

$slug = get_post_field( 'post_name', get_queried_object_id() );
$data = ink_get_legal_page_data( $slug );

if ( ! $data ) {
	get_header();
	?>
	<main id="contenido-principal" class="ink-light-rest">
		<div class="container-ink py-24 text-center">
			<h1 class="text-3xl font-semibold text-[#0a0a0a]"><?php the_title(); ?></h1>
			<div class="prose prose-lg mx-auto mt-8 max-w-3xl text-left"><?php the_content(); ?></div>
		</div>
	</main>
	<?php
	get_footer();
	return;
}

$ink_home_data = array(
	'legalPage' => $data,
);

get_header();
?>

<main id="contenido-principal" class="ink-light-rest">
	<script type="application/json" id="ink-page-data"><?php echo wp_json_encode( $ink_home_data ); ?></script>

	<div id="legal-page-root">
		<div class="ink-plans-page ink-legal-page">
			<header class="ink-plans-page__hero container-ink">
				<?php if ( ! empty( $data['pageEyebrow'] ) ) : ?>
					<p class="ink-eyebrow"><?php echo esc_html( $data['pageEyebrow'] ); ?></p>
				<?php endif; ?>
				<h1 class="ink-plans-page__title"><?php echo esc_html( $data['pageTitle'] ); ?></h1>
				<?php if ( ! empty( $data['pageSubtitle'] ) ) : ?>
					<p class="ink-plans-page__subtitle"><?php echo esc_html( $data['pageSubtitle'] ); ?></p>
				<?php endif; ?>
			</header>

			<div class="ink-plans-page__body">
				<?php if ( ! empty( $data['nav'] ) ) : ?>
					<nav class="ink-legal-nav container-ink" aria-label="Documentos legales">
						<?php foreach ( $data['nav'] as $item ) : ?>
							<a
								href="<?php echo esc_url( $item['href'] ); ?>"
								class="ink-plans-page__why-item ink-legal-nav__item<?php echo ! empty( $item['active'] ) ? ' is-active' : ''; ?>"
								<?php echo ! empty( $item['active'] ) ? ' aria-current="page"' : ''; ?>
							>
								<h2><?php echo esc_html( $item['title'] ); ?></h2>
								<p><?php echo esc_html( $item['text'] ); ?></p>
							</a>
						<?php endforeach; ?>
					</nav>
				<?php endif; ?>

				<article class="ink-legal-content container-ink">
					<?php if ( ! empty( $data['updated'] ) ) : ?>
						<p class="ink-legal-content__updated">
							Última actualización: <?php echo esc_html( $data['updated'] ); ?>
						</p>
					<?php endif; ?>
					<?php foreach ( $data['sections'] as $section ) : ?>
						<section class="ink-legal-section">
							<h2><?php echo esc_html( $section['title'] ); ?></h2>
							<?php foreach ( $section['paragraphs'] as $paragraph ) : ?>
								<p><?php echo esc_html( $paragraph ); ?></p>
							<?php endforeach; ?>
						</section>
					<?php endforeach; ?>
				</article>
			</div>
		</div>
	</div>
</main>

<?php get_footer(); ?>
