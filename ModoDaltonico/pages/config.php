<?php

require_api( 'authentication_api.php' );
require_api( 'form_api.php' );
require_api( 'helper_api.php' );

auth_reauthenticate();
access_ensure_global_level( config_get( 'manage_plugin_threshold' ) );

$t_action = gpc_get_string( 'action', '' );

if( $t_action === 'save' ) {
	form_security_validate( 'plugin_ModoDaltonico_config' );

	$t_enabled = gpc_get_string( 'md_enabled', 'on' );
	$t_contrast = gpc_get_string( 'md_contrast_type', 'protanopia' );

	$t_valid_types = array( 'protanopia', 'deuteranopia', 'tritanopia' );
	if( !in_array( $t_contrast, $t_valid_types ) ) {
		$t_contrast = 'protanopia';
	}

	plugin_config_set( 'md_enabled', ( $t_enabled === 'on' ) ? ON : OFF );
	plugin_config_set( 'md_contrast_type', $t_contrast );

	form_security_purge( 'plugin_ModoDaltonico_config' );
	print_header_redirect( plugin_page( 'config', true ) );
}

layout_page_header( plugin_lang_get( 'name' ) );
layout_page_begin();

$t_enabled       = plugin_config_get( 'md_enabled' );
$t_contrast_type = plugin_config_get( 'md_contrast_type' );
?>

<div class="col-md-8 col-md-offset-2 col-xs-12">
	<div class="widget-box widget-color-blue2">
		<div class="widget-header widget-header-small">
			<h4 class="widget-title">
				<?php print_icon( 'fa-eye', 'ace-icon' ); ?>
				<?php echo plugin_lang_get( 'configuracion' ); ?>
			</h4>
		</div>
		<div class="widget-body">
			<div class="widget-main no-padding">
				<form id="md-config-form"
					action="<?php echo string_attribute( plugin_page( 'config' ) ); ?>"
					method="post">

					<?php echo form_security_field( 'plugin_ModoDaltonico_config' ); ?>
					<input type="hidden" name="action" value="save" />

					<table class="table table-bordered table-condensed table-striped">
						<tr>
							<td class="category" style="width:30%;">
								<?php echo plugin_lang_get( 'activar' ); ?> / <?php echo plugin_lang_get( 'desactivar' ); ?>
							</td>
							<td>
								<label>
									<input type="radio" name="md_enabled" value="on"
										<?php echo ( $t_enabled == ON ) ? 'checked="checked"' : ''; ?> />
									<?php echo plugin_lang_get( 'activado' ); ?>
								</label>
								&nbsp;&nbsp;
								<label>
									<input type="radio" name="md_enabled" value="off"
										<?php echo ( $t_enabled == OFF ) ? 'checked="checked"' : ''; ?> />
									<?php echo plugin_lang_get( 'desactivado' ); ?>
								</label>
							</td>
						</tr>
						<tr>
							<td class="category">
								<?php echo plugin_lang_get( 'tipo_contraste' ); ?>
							</td>
							<td>
								<select name="md_contrast_type" class="input-sm">
									<option value="protanopia"
										<?php echo ( $t_contrast_type === 'protanopia' ) ? 'selected="selected"' : ''; ?>>
										<?php echo plugin_lang_get( 'protanopia' ); ?>
									</option>
									<option value="deuteranopia"
										<?php echo ( $t_contrast_type === 'deuteranopia' ) ? 'selected="selected"' : ''; ?>>
										<?php echo plugin_lang_get( 'deuteranopia' ); ?>
									</option>
									<option value="tritanopia"
										<?php echo ( $t_contrast_type === 'tritanopia' ) ? 'selected="selected"' : ''; ?>>
										<?php echo plugin_lang_get( 'tritanopia' ); ?>
									</option>
								</select>
							</td>
						</tr>
					</table>

					<div class="widget-toolbox padding-8 clearfix">
						<button type="submit" class="btn btn-primary btn-sm btn-white btn-round">
							<?php print_icon( 'fa-save', 'ace-icon' ); ?>
							<?php echo plugin_lang_get( 'guardar' ); ?>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<?php
layout_page_end();
