<?php
/**
 * Banner de contacto (SSR). React lo hidrata en #contact-root.
 */
global $ink_home_data;
$contact   = $ink_home_data['contact'] ?? ink_get_contact_data();
$people    = $contact['people'] ?? array();
$portraits = $people;
$avatars   = array_slice( $people, 0, 2 );
?>
<section class="ink-section ink-contact scroll-mt-24 py-20" id="contacto">
	<div class="container-ink">
		<div class="ink-contact-banner">
			<div class="ink-contact-banner__copy">
				<?php if ( ! empty( $contact['eyebrow'] ) ) : ?>
					<p class="ink-contact-banner__eyebrow"><?php echo esc_html( $contact['eyebrow'] ); ?></p>
				<?php endif; ?>
				<h2 class="ink-gradient-heading ink-contact-banner__title"><?php echo esc_html( $contact['title'] ); ?></h2>
				<?php if ( ! empty( $contact['subtitle'] ) ) : ?>
					<p class="ink-contact-banner__lead"><?php echo esc_html( $contact['subtitle'] ); ?></p>
				<?php endif; ?>

				<div class="ink-contact-banner__actions">
					<a
						class="ink-contact-banner__cta"
						href="<?php echo esc_url( $contact['whatsappHref'] ); ?>"
						target="_blank"
						rel="noopener noreferrer"
					>
						<?php if ( $avatars ) : ?>
							<span class="ink-contact-banner__avatars" aria-hidden="true">
								<?php foreach ( $avatars as $person ) : ?>
									<img src="<?php echo esc_url( $person['image'] ); ?>" alt="">
								<?php endforeach; ?>
							</span>
						<?php endif; ?>
						<span><?php echo esc_html( $contact['ctaLabel'] ); ?></span>
					</a>

					<a class="ink-contact-banner__mail" href="#contacto-formulario">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
							<rect x="3" y="5" width="18" height="14" rx="2" />
							<path d="M4 7l8 6 8-6" />
						</svg>
						<?php echo esc_html( $contact['mailLabel'] ?? 'Enviar correo' ); ?>
					</a>

					<?php if ( ! empty( $contact['phone'] ) && ! empty( $contact['telHref'] ) ) : ?>
						<a class="ink-contact-banner__phone" href="<?php echo esc_url( $contact['telHref'] ); ?>">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="M6.5 3.8h2.4l1.1 3.1-1.7 1.3a12.4 12.4 0 0 0 6.5 6.5l1.3-1.7 3.1 1.1v2.4c0 .7-.5 1.3-1.2 1.4A16.6 16.6 0 0 1 5.1 5c.1-.7.7-1.2 1.4-1.2Z" />
							</svg>
							<?php echo esc_html( $contact['phone'] ); ?>
						</a>
					<?php endif; ?>
				</div>
			</div>

			<?php if ( $portraits ) : ?>
				<div class="ink-contact-banner__people" aria-hidden="true">
					<?php foreach ( $portraits as $index => $person ) : ?>
						<img
							src="<?php echo esc_url( $person['image'] ); ?>"
							alt=""
							class="ink-contact-banner__person ink-contact-banner__person--<?php echo (int) $index + 1; ?>"
						>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div id="contacto-formulario" class="ink-contact-modal ink-contact-modal--static">
		<div class="ink-contact-modal__panel">
			<a class="ink-contact-modal__close" href="#contacto" aria-label="Cerrar formulario">
				<span></span>
				<span></span>
			</a>
			<h3 class="ink-contact-modal__title"><?php echo esc_html( $contact['formTitle'] ?? 'Cuéntanos sobre tu proyecto' ); ?></h3>
			<form action="<?php echo esc_url( $contact['formAction'] ?? admin_url( 'admin-post.php' ) ); ?>" method="post" class="ink-contact-glass">
				<div class="ink-contact-glass__fields">
					<input type="hidden" name="action" value="ink_contact_form">
					<?php wp_nonce_field( 'ink_contact_form', 'ink_contact_nonce' ); ?>

					<label class="ink-contact-glass__label" for="ink-nombre">Nombre</label>
					<input required name="nombre" id="ink-nombre" type="text" class="ink-contact-field" placeholder="Tu nombre">

					<label class="ink-contact-glass__label" for="ink-email">Correo</label>
					<input required name="email" id="ink-email" type="email" class="ink-contact-field" placeholder="Tu correo">

					<label class="ink-contact-glass__label" for="ink-telefono">Teléfono</label>
					<input required name="telefono" id="ink-telefono" type="tel" class="ink-contact-field" placeholder="Tu teléfono">

					<label class="ink-contact-glass__label" for="ink-mensaje">Mensaje</label>
					<textarea name="mensaje" id="ink-mensaje" rows="5" class="ink-contact-field ink-contact-field--area" placeholder="Cuéntanos sobre tu proyecto"></textarea>

					<button type="submit" class="ink-contact-submit">Enviar mensaje</button>
				</div>
			</form>
		</div>
	</div>
</section>
