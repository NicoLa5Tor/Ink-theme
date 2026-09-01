<?php
/**
 * inc/menus.php — handler del formulario de contacto (submit clásico ->
 * redirect a /gracias/). Los links de nav (Inicio/Blog) están hardcodeados
 * en header.php ya que el sitio no usa menús editables desde el admin.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handler del formulario de contacto (ver templates/parts/contact-form.php).
 * Submit clásico -> valida -> guarda/envía -> redirige a /gracias/.
 * Registrado para usuarios logueados y anónimos (visitantes del sitio público).
 */
add_action( 'admin_post_nopriv_ink_contact_form', 'ink_handle_contact_form' );
add_action( 'admin_post_ink_contact_form', 'ink_handle_contact_form' );

function ink_handle_contact_form() {
	if ( ! isset( $_POST['ink_contact_nonce'] ) || ! wp_verify_nonce( $_POST['ink_contact_nonce'], 'ink_contact_form' ) ) {
		wp_die( esc_html__( 'Solicitud inválida.', 'ink-theme' ), '', array( 'response' => 403 ) );
	}

	$nombre   = isset( $_POST['nombre'] ) ? sanitize_text_field( wp_unslash( $_POST['nombre'] ) ) : '';
	$email    = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$telefono = isset( $_POST['telefono'] ) ? sanitize_text_field( wp_unslash( $_POST['telefono'] ) ) : '';
	$mensaje  = isset( $_POST['mensaje'] ) ? sanitize_textarea_field( wp_unslash( $_POST['mensaje'] ) ) : '';

	if ( empty( $nombre ) || ! is_email( $email ) || empty( $telefono ) ) {
		wp_safe_redirect( add_query_arg( 'error', '1', wp_get_referer() ?: home_url( '/#contacto' ) ) );
		exit;
	}

	$admin_email = get_option( 'admin_email' );
	$subject     = sprintf( '[%s] Nuevo contacto: %s', get_bloginfo( 'name' ), $nombre );
	$body        = "Nombre: {$nombre}\nCorreo: {$email}\nTeléfono: {$telefono}\nMensaje:\n{$mensaje}";

	wp_mail( $admin_email, $subject, $body );

	wp_safe_redirect( home_url( '/gracias/' ) );
	exit;
}
