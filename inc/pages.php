<?php
/**
 * Páginas requeridas por el tema (planes, gracias, etc.).
 * Se crean automáticamente si no existen en WordPress.
 */
defined( 'ABSPATH' ) || exit;

/**
 * @return array<string, array{title:string, template:string}>
 */
function ink_required_pages() {
	return array(
		'planes'  => array(
			'title'    => 'Planes',
			'template' => 'templates/page-planes.php',
		),
		'gracias' => array(
			'title'    => 'Gracias',
			'template' => 'templates/page-gracias.php',
		),
	);
}

/**
 * Crea o corrige las páginas del tema y sus plantillas asignadas.
 */
function ink_ensure_theme_pages() {
	if ( wp_installing() ) {
		return;
	}

	$created = false;

	foreach ( ink_required_pages() as $slug => $config ) {
		$page = get_page_by_path( $slug, OBJECT, 'page' );

		if ( ! $page ) {
			$page_id = wp_insert_post(
				array(
					'post_title'   => $config['title'],
					'post_name'    => $slug,
					'post_status'  => 'publish',
					'post_type'    => 'page',
					'post_content' => '',
				),
				true
			);

			if ( is_wp_error( $page_id ) ) {
				continue;
			}

			$page    = get_post( $page_id );
			$created = true;
		}

		if ( ! empty( $config['template'] ) ) {
			$current = get_post_meta( $page->ID, '_wp_page_template', true );
			if ( $current !== $config['template'] ) {
				update_post_meta( $page->ID, '_wp_page_template', $config['template'] );
			}
		}
	}

	if ( $created ) {
		flush_rewrite_rules( false );
	}
}

add_action( 'init', 'ink_ensure_theme_pages', 20 );
