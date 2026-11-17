<?php

class ModoDaltonicoPlugin extends MantisPlugin {

	public function register() {
		$this->name        = plugin_lang_get( 'name' );
		$this->description = plugin_lang_get( 'description' );
		$this->version     = '1.0.0';
		$this->requires    = array( 'MantisCore' => '2.0.0' );
		$this->author      = 'Equipo Accesibilidad';
		$this->contact     = 'accesibilidad@ejemplo.com';
		$this->url         = '';
		$this->page        = 'config';
	}

	public function config() {
		return array(
			'md_enabled'       => ON,
			'md_contrast_type' => 'protanopia',
		);
	}

	public function events() {
		return array();
	}

	public function hooks() {
		return array(
			'EVENT_MENU_MAIN'       => 'menu_main',
			'EVENT_LAYOUT_RESOURCES' => 'layout_resources',
		);
	}

	public function menu_main() {
		if( plugin_config_get( 'md_enabled' ) == OFF ) {
			return array();
		}
		return array(
			'<a href="' . plugin_page( 'config' ) . '">'
			. plugin_lang_get( 'configuracion' )
			. '</a>',
		);
	}

	public function layout_resources() {
		if( plugin_config_get( 'md_enabled' ) == OFF ) {
			return '';
		}

		$t_contrast_type = plugin_config_get( 'md_contrast_type' );
		$t_active_label  = plugin_lang_get( 'modo_activo' );
		$t_inactive_label = plugin_lang_get( 'modo_inactivo' );

		$t_config = array(
			'initialActive'  => true,
			'contrastType'   => $t_contrast_type,
			'toggleUrl'      => plugin_page( 'toggle' ),
			'activeLabel'    => $t_active_label,
			'inactiveLabel'  => $t_inactive_label,
			'strings'        => array(
				'protanopia'       => plugin_lang_get( 'protanopia' ),
				'deuteranopia'     => plugin_lang_get( 'deuteranopia' ),
				'tritanopia'       => plugin_lang_get( 'tritanopia' ),
				'indicador_activo' => plugin_lang_get( 'indicador_activo' ),
				'activar'          => plugin_lang_get( 'activar' ),
				'desactivar'       => plugin_lang_get( 'desactivar' ),
				'tipo_contraste'   => plugin_lang_get( 'tipo_contraste' ),
			),
		);

		$t_output = '<link rel="stylesheet" href="' . plugin_file( 'modoDaltonico.css' ) . '" />' . "\n";
		$t_output .= '<script>window.ModoDaltonicoConfig = ' . json_encode( $t_config ) . ';</script>' . "\n";
		$t_output .= '<script src="' . plugin_file( 'modoDaltonico.js' ) . '"></script>' . "\n";

		return $t_output;
	}

	public function install() {
		return true;
	}

	public function uninstall() {
		return;
	}
}
