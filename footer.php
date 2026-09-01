<?php
/**
 * Footer del tema. Todos los links (legales, redes, contacto) son texto
 * real en PHP. El único fragmento hidratado por React es el botón
 * flotante de WhatsApp (#site-footer-float-root).
 */
$whatsapp_href = 'https://api.whatsapp.com/send?' . http_build_query(
	array(
		'phone'        => '573164637827',
		'text'         => 'Hola, quiero más información sobre sus servicios',
		'utm_source'   => 'web',
		'utm_medium'   => 'footer',
		'utm_campaign' => 'contacto',
	)
);
?>
	<footer id="site-footer" class="border-t border-neutral-800 bg-[var(--color-charcoal)] py-16 text-[var(--color-gray-text)]">
		<div class="container-ink grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<p class="font-heading text-xl font-extrabold text-white"><?php bloginfo( 'name' ); ?></p>
				<p class="mt-3 text-sm">Marketing digital en Bogotá: estrategia, pauta y contenido que convierten.</p>
				<a href="<?php echo esc_url( $whatsapp_href ); ?>" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block text-sm font-semibold text-[var(--color-blue)]">
					+57 316 4637827
				</a>
			</div>

			<div>
				<p class="font-heading font-semibold text-white">Sitio</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Inicio</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#servicios' ) ); ?>">Servicios</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#portafolio' ) ); ?>">Portafolio</a></li>
					<li><a href="<?php echo esc_url( home_url( '/planes/' ) ); ?>">Planes</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#contacto' ) ); ?>">Contacto</a></li>
				</ul>
			</div>

			<div>
				<p class="font-heading font-semibold text-white">Blog</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Todos los artículos</a></li>
				</ul>
			</div>

			<div>
				<p class="font-heading font-semibold text-white">Legal</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li><a href="/politica-de-privacidad/">Política de privacidad</a></li>
					<li><a href="/politica-de-cookies/">Política de cookies</a></li>
					<li><a href="/terminos-y-condiciones/">Términos y condiciones</a></li>
				</ul>
			</div>
		</div>

		<div class="container-ink mt-10 border-t border-neutral-800 pt-6 text-xs text-[var(--color-muted)]">
			&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. Todos los derechos reservados.
		</div>
	</footer>

	<div id="site-footer-float-root"></div>

	<?php wp_footer(); ?>
</body>
</html>
