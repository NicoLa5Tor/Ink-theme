<?php
/**
 * Enlaces de WhatsApp centralizados.
 */
defined( 'ABSPATH' ) || exit;

/**
 * @return string
 */
function ink_whatsapp_phone() {
	return '573164637827';
}

/**
 * @param string|null $text Mensaje prellenado. Por defecto, el de conversión de planes.
 * @return string
 */
function ink_get_whatsapp_href( $text = null ) {
	if ( null === $text ) {
		$text = 'Estoy interesado(a) en mejorar la presencia digital de mi negocio.';
	}

	return 'https://api.whatsapp.com/send?' . http_build_query(
		array(
			'phone' => ink_whatsapp_phone(),
			'text'  => $text,
		)
	);
}

/**
 * Mensaje de WhatsApp por plan.
 *
 * @param string $plan_name Nombre visible del plan (Básico, Plus, Profesional).
 * @return string
 */
function ink_get_plan_whatsapp_href( $plan_name ) {
	return ink_get_whatsapp_href(
		sprintf(
			'Estoy interesado(a) en el plan %s. Estoy interesado(a) en mejorar la presencia digital de mi negocio.',
			$plan_name
		)
	);
}
