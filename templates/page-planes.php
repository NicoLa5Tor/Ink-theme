<?php
/**
 * Template Name: Planes
 *
 * Vista completa de precios. Crear en WP una página con slug `planes`
 * y asignar esta plantilla. Los datos vienen de inc/plans-data.php.
 */
global $ink_home_data;

$ink_plans_data = ink_get_plans_data();

$ink_home_data = array(
	'plansPage' => $ink_plans_data,
	'contact'   => ink_get_contact_data(),
);

get_header();
?>

<main id="contenido-principal" class="ink-light-rest">
	<script type="application/json" id="ink-page-data"><?php echo wp_json_encode( $ink_home_data ); ?></script>

	<div id="plans-page-root">
		<div class="ink-plans-page">
			<header class="ink-plans-page__hero container-ink">
				<?php if ( ! empty( $ink_plans_data['pageEyebrow'] ) ) : ?>
					<p class="ink-eyebrow"><?php echo esc_html( $ink_plans_data['pageEyebrow'] ); ?></p>
				<?php endif; ?>
				<h1 class="ink-plans-page__title"><?php echo esc_html( $ink_plans_data['pageTitle'] ); ?></h1>
				<?php if ( ! empty( $ink_plans_data['pageSubtitle'] ) ) : ?>
					<p class="ink-plans-page__subtitle"><?php echo esc_html( $ink_plans_data['pageSubtitle'] ); ?></p>
				<?php endif; ?>
			</header>

			<?php if ( ! empty( $ink_plans_data['whyUs'] ) ) : ?>
				<div class="ink-plans-page__why container-ink">
					<?php foreach ( $ink_plans_data['whyUs'] as $item ) : ?>
						<article class="ink-plans-page__why-item">
							<h2><?php echo esc_html( $item['title'] ); ?></h2>
							<p><?php echo esc_html( $item['text'] ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<div class="ink-price-cards ink-price-cards--full container-ink">
				<?php foreach ( $ink_plans_data['plans'] as $plan ) : ?>
					<article
						id="<?php echo esc_attr( $plan['slug'] ); ?>"
						class="ink-price-card ink-price-card--full scroll-mt-28<?php echo ! empty( $plan['featured'] ) ? ' is-featured' : ''; ?>"
					>
						<div class="ink-price-card__head">
							<p class="ink-price-card__pack"><?php echo esc_html( $plan['name'] ); ?></p>
							<p class="ink-price-card__price">
								<?php echo esc_html( $plan['price'] ); ?>
								<?php if ( ! empty( $plan['period'] ) ) : ?>
									<span>/<?php echo esc_html( $plan['period'] ); ?></span>
								<?php endif; ?>
							</p>
							<?php if ( ! empty( $plan['idealFor'] ) ) : ?>
								<p class="ink-price-card__ideal">
									<span>Ideal para:</span>
									<?php echo esc_html( $plan['idealFor'] ); ?>
								</p>
							<?php endif; ?>
						</div>

						<ul class="ink-price-card__features">
							<?php foreach ( $plan['features'] as $feature ) : ?>
								<li><?php echo esc_html( $feature ); ?></li>
							<?php endforeach; ?>
						</ul>

						<?php if ( ! empty( $plan['results'] ) ) : ?>
							<p class="ink-price-card__results">
								<span>Resultados esperados:</span>
								<?php echo esc_html( $plan['results'] ); ?>
							</p>
						<?php endif; ?>

						<a
							class="ink-price-card__btn"
							href="<?php echo esc_url( $plan['href'] ); ?>"
							target="_blank"
							rel="noopener noreferrer"
						>
							Empezar
						</a>
					</article>
				<?php endforeach; ?>
			</div>

			<?php if ( ! empty( $ink_plans_data['guarantee'] ) ) : ?>
				<aside class="ink-plans-page__guarantee container-ink">
					<p><?php echo esc_html( $ink_plans_data['guarantee'] ); ?></p>
				</aside>
			<?php endif; ?>
		</div>
	</div>

	<div id="contact-root">
		<?php get_template_part( 'templates/parts/contact-form' ); ?>
	</div>
</main>

<?php get_footer(); ?>
