<?php
/**
 * Serializa entradas reales del blog para PHP + React.
 */
defined( 'ABSPATH' ) || exit;

/**
 * @param WP_Post|int $post
 * @return array<string, mixed>
 */
function ink_format_blog_card( $post ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return array();
	}

	$cats = get_the_category( $post->ID );
	$cat  = $cats ? $cats[0]->name : '';

	return array(
		'id'       => $post->ID,
		'title'    => get_the_title( $post ),
		'excerpt'  => wp_trim_words( get_the_excerpt( $post ), 22 ),
		'date'     => get_the_date( '', $post ),
		'href'     => get_permalink( $post ),
		'image'    => get_the_post_thumbnail_url( $post, 'medium_large' ) ?: '',
		'category' => $cat,
	);
}

/**
 * Datos del índice /blog/ (o archivo de categoría/etiqueta).
 *
 * @return array<string, mixed>
 */
/**
 * @param WP_Query|null $query
 * @return array<string, mixed>
 */
function ink_get_blog_index_data( $query = null ) {
	global $wp_query;

	$q = $query instanceof WP_Query ? $query : $wp_query;

	$posts = array();
	if ( $q instanceof WP_Query && $q->have_posts() ) {
		while ( $q->have_posts() ) {
			$q->the_post();
			$card = ink_format_blog_card( get_post() );
			if ( $card && 'post' === get_post_type() ) {
				$posts[] = $card;
			}
		}
		$q->rewind_posts();
		wp_reset_postdata();
	}

	$categories = array();
	foreach ( get_categories( array( 'hide_empty' => true ) ) as $cat ) {
		$count = (int) $cat->count;
		$categories[] = array(
			'title'  => $cat->name,
			'text'   => 1 === $count ? '1 artículo' : $count . ' artículos',
			'href'   => get_category_link( $cat ),
			'active' => is_category( $cat->term_id ),
		);
	}

	$total   = max( 1, $q instanceof WP_Query ? (int) $q->max_num_pages : 1 );
	$current = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );
	$pages   = array();
	if ( $total > 1 ) {
		for ( $i = 1; $i <= $total; $i++ ) {
			$pages[] = array(
				'n'       => $i,
				'href'    => get_pagenum_link( $i ),
				'current' => $i === $current,
			);
		}
	}

	if ( is_category() ) {
		$title    = single_cat_title( '', false );
		$subtitle = category_description() ? wp_strip_all_tags( category_description() ) : 'Artículos de esta categoría.';
		$eyebrow  = 'Blog';
	} elseif ( is_tag() ) {
		$title    = single_tag_title( '', false );
		$subtitle = 'Artículos con esta etiqueta.';
		$eyebrow  = 'Blog';
	} else {
		$title    = 'Ideas que convierten';
		$subtitle = 'Estrategia, pauta y contenido: lo que vamos aprendiendo con negocios reales.';
		$eyebrow  = 'Blog Ink Digital';
	}

	return array(
		'pageEyebrow'  => $eyebrow,
		'pageTitle'    => $title,
		'pageSubtitle' => $subtitle,
		'posts'        => $posts,
		'categories'   => $categories,
		'pagination'   => $pages,
		'emptyText'    => 'Todavía no hay artículos publicados. En cuanto subamos el primero, aparece aquí.',
	);
}

/**
 * Datos de un artículo individual.
 *
 * @return array<string, mixed>
 */
function ink_get_blog_single_data() {
	$post = get_post();
	if ( ! $post ) {
		return array();
	}

	$related = array();
	$cats    = wp_get_post_categories( $post->ID );
	if ( $cats ) {
		$query = new WP_Query(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => 3,
				'post__not_in'   => array( $post->ID ),
				'category__in'   => $cats,
				'ignore_sticky_posts' => true,
			)
		);
		foreach ( $query->posts as $related_post ) {
			$related[] = ink_format_blog_card( $related_post );
		}
		wp_reset_postdata();
	}

	$cat_name = '';
	$first    = get_the_category( $post->ID );
	if ( $first ) {
		$cat_name = $first[0]->name;
	}

	return array(
		'pageEyebrow'  => $cat_name ? $cat_name : 'Blog',
		'pageTitle'    => get_the_title( $post ),
		'pageSubtitle' => wp_trim_words( get_the_excerpt( $post ), 28 ),
		'date'         => get_the_date( '', $post ),
		'image'        => get_the_post_thumbnail_url( $post, 'large' ) ?: '',
		'content'      => apply_filters( 'the_content', $post->post_content ),
		'shareUrl'     => get_permalink( $post ),
		'shareTitle'   => get_the_title( $post ),
		'related'      => $related,
		'blogHref'     => get_permalink( (int) get_option( 'page_for_posts' ) ) ?: home_url( '/blog/' ),
	);
}
