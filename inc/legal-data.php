<?php
/**
 * Contenido y metadatos de páginas legales (indexables).
 */
defined( 'ABSPATH' ) || exit;

/**
 * @return array<int, array{slug:string, title:string, summary:string, href:string}>
 */
function ink_get_legal_pages_index() {
	$pages = array(
		array(
			'slug'    => 'politica-de-privacidad',
			'title'   => 'Política de privacidad',
			'summary' => 'Cómo recopilamos, usamos y protegemos tus datos personales.',
		),
		array(
			'slug'    => 'politica-de-cookies',
			'title'   => 'Política de cookies',
			'summary' => 'Qué cookies usamos, para qué sirven y cómo gestionarlas.',
		),
		array(
			'slug'    => 'terminos-y-condiciones',
			'title'   => 'Términos y condiciones',
			'summary' => 'Condiciones de uso del sitio y de nuestros servicios digitales.',
		),
	);

	return array_map(
		function ( $page ) {
			$page['href'] = home_url( '/' . $page['slug'] . '/' );
			return $page;
		},
		$pages
	);
}

/**
 * @param string $current_slug
 * @return array<int, array{title:string, text:string, href:string, active:bool}>
 */
function ink_get_legal_nav( $current_slug ) {
	$nav = array();
	foreach ( ink_get_legal_pages_index() as $page ) {
		$nav[] = array(
			'title'  => $page['title'],
			'text'   => $page['summary'],
			'href'   => $page['href'],
			'active' => $page['slug'] === $current_slug,
		);
	}
	return $nav;
}

/**
 * @param string $slug
 * @return array<string, mixed>|null
 */
function ink_get_legal_page_data( $slug ) {
	$pages = array(
		'politica-de-privacidad'  => array(
			'pageEyebrow'  => 'Legal',
			'pageTitle'    => 'Política de privacidad',
			'pageSubtitle' => 'En Ink Digital tratamos tu información con transparencia y bajo la normativa colombiana de protección de datos.',
			'updated'      => '1 de septiembre de 2026',
			'sections'     => array(
				array(
					'title'      => '1. Responsable del tratamiento',
					'paragraphs' => array(
						'Ink Digital, con domicilio en Bogotá, Colombia, es responsable del tratamiento de los datos personales que nos proporciones a través de este sitio web, formularios de contacto, WhatsApp o correo electrónico.',
						'Para ejercer tus derechos o resolver dudas sobre privacidad puedes escribirnos a través del formulario de contacto del sitio o por WhatsApp al +57 316 4637827.',
					),
				),
				array(
					'title'      => '2. Datos que recopilamos',
					'paragraphs' => array(
						'Podemos recopilar nombre, correo electrónico, teléfono, empresa, mensaje enviado y datos técnicos de navegación (dirección IP, tipo de dispositivo, páginas visitadas) cuando interactúas con nuestro sitio o nos contactas.',
						'Solo solicitamos la información necesaria para responder consultas, elaborar propuestas comerciales o prestar nuestros servicios de marketing digital.',
					),
				),
				array(
					'title'      => '3. Finalidad del tratamiento',
					'paragraphs' => array(
						'Usamos tus datos para: responder solicitudes de información, gestionar la relación comercial, enviar comunicaciones relacionadas con nuestros servicios, mejorar la experiencia del sitio y cumplir obligaciones legales.',
						'No vendemos ni cedemos tus datos personales a terceros con fines comerciales ajenos a la prestación del servicio.',
					),
				),
				array(
					'title'      => '4. Conservación y seguridad',
					'paragraphs' => array(
						'Conservamos los datos el tiempo necesario para cumplir las finalidades descritas o las obligaciones legales aplicables. Aplicamos medidas técnicas y organizativas razonables para proteger la información contra acceso no autorizado, pérdida o alteración.',
					),
				),
				array(
					'title'      => '5. Tus derechos',
					'paragraphs' => array(
						'Puedes solicitar acceso, actualización, rectificación o supresión de tus datos, así como revocar el consentimiento otorgado, cuando la normativa lo permita. Atenderemos tu solicitud en los plazos establecidos por la ley.',
					),
				),
			),
		),
		'politica-de-cookies'     => array(
			'pageEyebrow'  => 'Legal',
			'pageTitle'    => 'Política de cookies',
			'pageSubtitle' => 'Información sobre las cookies y tecnologías similares que utilizamos en inkdigital.co.',
			'updated'      => '1 de septiembre de 2026',
			'sections'     => array(
				array(
					'title'      => '1. ¿Qué son las cookies?',
					'paragraphs' => array(
						'Las cookies son pequeños archivos de texto que el navegador almacena en tu dispositivo cuando visitas un sitio web. Nos ayudan a que el sitio funcione correctamente, recordar preferencias y medir el rendimiento de nuestras campañas.',
					),
				),
				array(
					'title'      => '2. Tipos de cookies que usamos',
					'paragraphs' => array(
						'Cookies técnicas: necesarias para el funcionamiento del sitio y la seguridad básica.',
						'Cookies analíticas: nos permiten entender cómo los visitantes usan el sitio (por ejemplo, Google Analytics / Google Tag Manager), de forma agregada.',
						'Cookies de marketing: pueden usarse para medir conversiones de campañas publicitarias cuando aceptas su uso.',
					),
				),
				array(
					'title'      => '3. Consentimiento',
					'paragraphs' => array(
						'Al aceptar cookies no esenciales desde el banner de consentimiento, autorizas su instalación conforme a esta política. Puedes retirar tu consentimiento en cualquier momento ajustando la configuración de tu navegador o del propio banner, si está disponible.',
					),
				),
				array(
					'title'      => '4. Cómo gestionar o desactivar cookies',
					'paragraphs' => array(
						'Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que desactivar cookies técnicas puede afectar el funcionamiento de algunas partes del sitio.',
						'Consulta la documentación de tu navegador (Chrome, Safari, Firefox, Edge) para más detalles sobre cómo administrar cookies.',
					),
				),
			),
		),
		'terminos-y-condiciones'  => array(
			'pageEyebrow'  => 'Legal',
			'pageTitle'    => 'Términos y condiciones',
			'pageSubtitle' => 'Condiciones generales de uso de este sitio web y de los servicios ofrecidos por Ink Digital.',
			'updated'      => '1 de septiembre de 2026',
			'sections'     => array(
				array(
					'title'      => '1. Aceptación',
					'paragraphs' => array(
						'Al acceder y utilizar este sitio web aceptas estos términos y condiciones. Si no estás de acuerdo, te recomendamos no utilizar el sitio.',
					),
				),
				array(
					'title'      => '2. Servicios',
					'paragraphs' => array(
						'Ink Digital ofrece servicios de marketing digital, publicidad en línea, gestión de redes sociales, diseño web y consultoría estratégica. El alcance, plazos y honorarios de cada proyecto se definen en propuesta o contrato comercial aparte.',
					),
				),
				array(
					'title'      => '3. Uso del sitio',
					'paragraphs' => array(
						'Te comprometes a utilizar el sitio de forma lícita, sin intentar dañar, sobrecargar o interferir con su funcionamiento. El contenido del sitio (textos, imágenes, marcas) es propiedad de Ink Digital o de sus licenciantes y no puede reproducirse sin autorización.',
					),
				),
				array(
					'title'      => '4. Limitación de responsabilidad',
					'paragraphs' => array(
						'La información del sitio tiene fines informativos. Aunque procuramos mantenerla actualizada, no garantizamos que esté libre de errores. Ink Digital no será responsable por daños indirectos derivados del uso del sitio, salvo disposición legal en contrario.',
					),
				),
				array(
					'title'      => '5. Modificaciones',
					'paragraphs' => array(
						'Podemos actualizar estos términos en cualquier momento. Los cambios entrarán en vigor al publicarse en esta página con la fecha de actualización correspondiente.',
					),
				),
			),
		),
	);

	if ( ! isset( $pages[ $slug ] ) ) {
		return null;
	}

	$data          = $pages[ $slug ];
	$data['slug']  = $slug;
	$data['nav']   = ink_get_legal_nav( $slug );

	return $data;
}
