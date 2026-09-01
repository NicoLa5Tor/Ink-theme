<?php
/**
 * Template Name: Blog
 *
 * Fallback si /blog/ aún no está asignada como “Página de entradas”.
 * Consulta los posts reales y reutiliza el índice.
 */
$paged = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );

$ink_blog_query = new WP_Query(
	array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'paged'               => $paged,
		'ignore_sticky_posts' => false,
	)
);

$ink_blog_data = ink_get_blog_index_data( $ink_blog_query );
wp_reset_postdata();

require __DIR__ . '/archive.php';
