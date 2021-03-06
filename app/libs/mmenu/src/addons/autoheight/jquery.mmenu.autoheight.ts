/*	
 * jQuery mmenu autoHeight add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */

(function( $ ) {

	var _PLUGIN_ = 'mmenu',
		_ADDON_  = 'autoHeight';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Extend shorthand options
			if ( typeof opts == 'boolean' && opts )
			{
				opts = {
					height: 'auto'
				};
			}
			if ( typeof opts == 'string' )
			{
				opts = {
					height: opts
				};
			}
			if ( typeof opts != 'object' )
			{
				opts = {};
			}
			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			if ( opts.height != 'auto' && opts.height != 'highest' )
			{
				return;
			}


			this.bind( 'initMenu:after',
				function()
				{
					this.$menu.addClass( _c.autoheight );
				}
			);


			//	Set the height
			var setHeight = function( $panel )
			{
				if ( this.opts.offCanvas && !this.vars.opened )
				{
					return;
				}

				var _top = Math.max( parseInt( this.$pnls.css( 'top' )		, 10 ), 0 ) || 0,
					_bot = Math.max( parseInt( this.$pnls.css( 'bottom' )	, 10 ), 0 ) || 0,
					_hgh = 0;

				this.$menu.addClass( _c.measureheight );

				if ( opts.height == 'auto' )
				{
					$panel = $panel || this.$pnls.children( '.' + _c.opened );
					if ( $panel.is( '.' + _c.vertical ) )
					{
						$panel = $panel
							.parents( '.' + _c.panel )
							.not( '.' + _c.vertical );
					}
					if ( !$panel.length )
					{
						$panel = this.$pnls.children( '.' + _c.panel );
					}

					_hgh = $panel.first().outerHeight();
				}
				else if ( opts.height == 'highest' )
				{
					this.$pnls.children()
						.each(
							function()
							{
								var $panel = $(this);
								if ( $panel.is( '.' + _c.vertical ) )
								{
									$panel = $panel
										.parents( '.' + _c.panel )
										.not( '.' + _c.vertical )
										.first();
								}
								_hgh = Math.max( _hgh, $panel.outerHeight() );
							}
						);
				}

				this.$menu
					.height( _hgh + _top + _bot )
					.removeClass( _c.measureheight );
			};

			if ( this.opts.offCanvas )
			{
				this.bind( 'open:start'			, setHeight );
			}

			if ( opts.height == 'highest' )
			{
				this.bind( 'initPanels:after' 	, setHeight );
			}
			if ( opts.height == 'auto' )
			{
				this.bind( 'updateListview'		, setHeight );
				this.bind( 'openPanel:start'	, setHeight );
				this.bind( 'closePanel'			, setHeight );
			}
		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

 			_c.add( 'autoheight measureheight' );
			_e.add( 'resize' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu ) {}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		height: 'default' // 'default/highest/auto'
	};


	var _c, _d, _e, glbl;

})( jQuery );