<?php

require_api( 'authentication_api.php' );
require_api( 'form_api.php' );

auth_ensure_user_authenticated();

$t_active = gpc_get_string( 'active', '' );

if( !in_array( $t_active, array( 'on', 'off' ) ) ) {
	header( 'Content-Type: application/json; charset=utf-8' );
	echo json_encode( array( 'ok' => false, 'error' => 'Invalid parameter' ) );
	exit;
}

header( 'Content-Type: application/json; charset=utf-8' );
echo json_encode( array( 'ok' => true, 'active' => $t_active ) );
exit;
