<?php
/**
 * Formulario de contacto — submit clásico (sin AJAX), redirige a /gracias/
 * en éxito vía admin-post.php. Ver inc/menus.php para el handler
 * `admin_post_ink_contact_form` / `admin_post_nopriv_ink_contact_form`.
 */
global $ink_home_data;
$contact = $ink_home_data['contact'] ?? array(
	'title'        => '¿Listo para crecer?',
	'subtitle'     => 'Cuéntanos sobre tu negocio y te contactamos en menos de 24 horas.',
	'whatsappHref' => '#',
);
?>
<section class="ink-section ink-contact scroll-mt-24 py-20" id="contacto">
	<div class="container-ink grid gap-12 lg:grid-cols-2">
		<div>
			<h2 class="ink-gradient-heading text-3xl font-semibold tracking-tight sm:text-4xl">
				<?php echo esc_html( $contact['title'] ); ?>
			</h2>
			<p class="ink-contact__lead mt-4 max-w-lg text-base md:text-lg">
				<?php echo esc_html( $contact['subtitle'] ); ?>
			</p>
			<a href="<?php echo esc_url( $contact['whatsappHref'] ); ?>" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center justify-center rounded-md bg-[var(--color-whatsapp)] px-8 py-4 text-base font-medium text-white">
				Escríbenos por WhatsApp
			</a>
		</div>

		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="ink-contact-glass">
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
			<div class="ink-contact-mail" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
					<rect x="3" y="5" width="18" height="14" rx="2" />
					<path d="M4 7l8 6 8-6" />
				</svg>
			</div>
			<p class="ink-contact-sent">Mensaje enviado</p>
		</form>
	</div>
</section>
