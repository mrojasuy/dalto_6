(function() {
	'use strict';

	var config = window.ModoDaltonicoConfig || {};
	var LS_ACTIVE_KEY = 'md_active';
	var LS_MODE_KEY = 'md_contrast_type';
	var MODES = ['protanopia', 'deuteranopia', 'tritanopia'];

	function getStoredActive() {
		try {
			var val = localStorage.getItem(LS_ACTIVE_KEY);
			if (val === 'true') return true;
			if (val === 'false') return false;
			return null;
		} catch (e) {
			return null;
		}
	}

	function setStoredActive(active) {
		try {
			localStorage.setItem(LS_ACTIVE_KEY, active ? 'true' : 'false');
		} catch (e) {}
	}

	function getStoredMode() {
		try {
			var val = localStorage.getItem(LS_MODE_KEY);
			if (val && MODES.indexOf(val) !== -1) return val;
			return null;
		} catch (e) {
			return null;
		}
	}

	function setStoredMode(mode) {
		try {
			localStorage.setItem(LS_MODE_KEY, mode);
		} catch (e) {}
	}

	function injectSvgFilters() {
		var svgNS = 'http://www.w3.org/2000/svg';
		var container = document.createElement('div');
		container.className = 'md-svg-filters';
		container.setAttribute('aria-hidden', 'true');
		container.style.position = 'absolute';
		container.style.width = '0';
		container.style.height = '0';
		container.style.overflow = 'hidden';

		container.innerHTML =
			'<svg xmlns="' + svgNS + '">' +
			'<defs>' +
			'<filter id="md-filter-protanopia">' +
			'<feColorMatrix type="matrix" values="' +
			'0.567, 0.433, 0,     0, 0 ' +
			'0.558, 0.442, 0,     0, 0 ' +
			'0,     0.242, 0.758, 0, 0 ' +
			'0,     0,     0,     1, 0" />' +
			'</filter>' +
			'<filter id="md-filter-deuteranopia">' +
			'<feColorMatrix type="matrix" values="' +
			'0.625, 0.375, 0,   0, 0 ' +
			'0.7,   0.3,   0,   0, 0 ' +
			'0,     0.3,   0.7, 0, 0 ' +
			'0,     0,     0,   1, 0" />' +
			'</filter>' +
			'<filter id="md-filter-tritanopia">' +
			'<feColorMatrix type="matrix" values="' +
			'0.95, 0.05,  0,     0, 0 ' +
			'0,    0.433, 0.567, 0, 0 ' +
			'0,    0.475, 0.525, 0, 0 ' +
			'0,    0,     0,     1, 0" />' +
			'</filter>' +
			'</defs>' +
			'</svg>';

		document.body.appendChild(container);
	}

	function applyMode(active, mode) {
		var html = document.documentElement;
		MODES.forEach(function(m) {
			html.classList.remove('md-' + m);
		});
		if (active && mode && MODES.indexOf(mode) !== -1) {
			html.classList.add('md-' + mode);
		}
	}

	function updateToggleButton(btn, active) {
		btn.setAttribute('aria-pressed', active ? 'true' : 'false');
		var label = active ? (config.activeLabel || 'ON') : (config.inactiveLabel || 'OFF');
		var labelEl = btn.querySelector('.md-toggle-label');
		if (labelEl) {
			labelEl.textContent = label;
		}
	}

	function updateBadge(badge, active, mode) {
		if (active) {
			badge.classList.add('md-badge--visible');
			var textEl = badge.querySelector('.md-badge-text');
			if (textEl) {
				var indicator = config.strings && config.strings.indicador_activo
					? config.strings.indicador_activo
					: 'Active';
				var modeLabel = config.strings && config.strings[mode]
					? config.strings[mode]
					: mode;
				textEl.textContent = indicator + ' - ' + modeLabel;
			}
		} else {
			badge.classList.remove('md-badge--visible');
		}
	}

	function changeMode(newMode, state) {
		if (newMode && MODES.indexOf(newMode) !== -1) {
			state.currentMode = newMode;
			setStoredMode(newMode);
			state.widgetSelect.value = newMode;
			applyMode(state.isActive, newMode);
			updateBadge(state.badge, state.isActive, newMode);
			syncConfigPageSelect(newMode);
		}
	}

	function toggleActive(state) {
		state.isActive = !state.isActive;
		setStoredActive(state.isActive);
		updateToggleButton(state.toggleBtn, state.isActive);
		applyMode(state.isActive, state.currentMode);
		updateBadge(state.badge, state.isActive, state.currentMode);
	}

	function syncConfigPageSelect(mode) {
		var configSelect = document.querySelector('select[name="md_contrast_type"]');
		if (configSelect && configSelect !== document.activeElement) {
			configSelect.value = mode;
		}
	}

	function init() {
		injectSvgFilters();

		var storedActive = getStoredActive();
		var isActive = storedActive !== null ? storedActive : !!config.initialActive;
		var currentMode = getStoredMode() || config.contrastType || 'protanopia';

		if (storedActive === null) {
			setStoredActive(isActive);
		}
		if (!getStoredMode()) {
			setStoredMode(currentMode);
		}

		// --- Build floating widget ---
		var widget = document.createElement('div');
		widget.className = 'md-widget';

		// Icon
		var icon = document.createElement('span');
		icon.className = 'md-widget-icon';
		icon.setAttribute('aria-hidden', 'true');
		icon.innerHTML = '&#128065;';
		widget.appendChild(icon);

		// Select combo (always visible)
		var widgetSelect = document.createElement('select');
		widgetSelect.className = 'md-widget-select';
		widgetSelect.setAttribute('aria-label', config.strings && config.strings.tipo_contraste
			? config.strings.tipo_contraste
			: 'Contrast type');

		MODES.forEach(function(mode) {
			var opt = document.createElement('option');
			opt.value = mode;
			opt.textContent = config.strings && config.strings[mode]
				? config.strings[mode]
				: mode;
			if (mode === currentMode) {
				opt.selected = true;
			}
			widgetSelect.appendChild(opt);
		});
		widget.appendChild(widgetSelect);

		// Toggle button
		var toggleBtn = document.createElement('button');
		toggleBtn.className = 'md-toggle';
		toggleBtn.setAttribute('type', 'button');
		toggleBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		toggleBtn.setAttribute('aria-label', config.strings && config.strings.activar
			? config.strings.activar
			: 'Toggle colorblind mode');
		toggleBtn.innerHTML =
			'<span class="md-toggle-label">' +
			(isActive ? (config.activeLabel || 'ON') : (config.inactiveLabel || 'OFF')) +
			'</span>';
		widget.appendChild(toggleBtn);

		// Badge indicator
		var badge = document.createElement('div');
		badge.className = 'md-badge';
		badge.setAttribute('aria-live', 'polite');
		badge.innerHTML =
			'<span class="md-badge-dot"></span>' +
			'<span class="md-badge-text"></span>';

		document.body.appendChild(widget);
		document.body.appendChild(badge);

		// Shared state object
		var state = {
			isActive: isActive,
			currentMode: currentMode,
			toggleBtn: toggleBtn,
			widgetSelect: widgetSelect,
			badge: badge
		};

		// Apply initial state
		applyMode(isActive, currentMode);
		updateBadge(badge, isActive, currentMode);

		// --- Event listeners ---

		// Toggle button click
		toggleBtn.addEventListener('click', function() {
			toggleActive(state);
		});

		// Floating combo change: apply immediately
		widgetSelect.addEventListener('change', function() {
			var newMode = widgetSelect.value;
			changeMode(newMode, state);
			if (!state.isActive) {
				state.isActive = true;
				setStoredActive(true);
				updateToggleButton(toggleBtn, true);
				applyMode(true, state.currentMode);
				updateBadge(badge, true, state.currentMode);
			}
		});

		// Config page select: apply immediately when changed
		var configSelect = document.querySelector('select[name="md_contrast_type"]');
		if (configSelect) {
			configSelect.addEventListener('change', function() {
				var newMode = configSelect.value;
				changeMode(newMode, state);
				if (!state.isActive) {
					state.isActive = true;
					setStoredActive(true);
					updateToggleButton(toggleBtn, true);
					applyMode(true, state.currentMode);
					updateBadge(badge, true, state.currentMode);
				}
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
