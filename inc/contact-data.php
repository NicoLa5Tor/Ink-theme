<?php
/**
 * Datos del banner de contacto.
 */
defined( 'ABSPATH' ) || exit;

/**
 * @return array<string, mixed>
 */
function ink_get_contact_data() {
	$theme_uri = get_template_directory_uri();
	$phone     = '+57 316 463 7827';
	$tel       = 'tel:+573164637827';

	$people = array(
		array(
			'name'  => 'Felipe',
			'image' => $theme_uri . '/assets/equipo/felipe.png',
		),
		array(
			'name'  => 'Alisson',
			'image' => $theme_uri . '/assets/equipo/alisson.png',
		),
		array(
			'name'  => 'Ayure',
			'image' => $theme_uri . '/assets/equipo/ayure.png',
		),
		array(
			'name'  => 'Guecela',
			'image' => $theme_uri . '/assets/equipo/guecela.png',
		),
	);

	return array(
		'eyebrow'      => 'Marketing digital con resultados medibles',
		'title'        => 'Habla con un experto hoy.',
		'subtitle'     => 'Escríbenos y te mostramos cómo sumar valor a tu equipo, con los siguientes pasos claros. Sin rodeos, sin perder tiempo.',
		'ctaLabel'     => 'Agenda una llamada',
		'mailLabel'    => 'Enviar correo',
		'formTitle'    => 'Cuéntanos sobre tu proyecto',
		'formAction'   => admin_url( 'admin-post.php' ),
		'nonce'        => wp_create_nonce( 'ink_contact_form' ),
		'whatsappHref' => ink_get_whatsapp_href( 'Hola, quiero agendar una llamada con un especialista de Ink Digital.' ),
		'phone'        => $phone,
		'telHref'      => $tel,
		'people'       => $people,
	);
}
