// Override the default ajax request definer to handle PUT and DELETE automatically:
// We achieve this by simply wrapping the original function:
amplify.request.types.ajax = (function($){

	var _ajax = amplify.request.types.ajax;

	return function( defnSettings ){

		if( defnSettings.type.match( /^(PUT|DELETE)$/i ) ){
			$.extend( true, defnSettings, {
				type: 'POST',
				data: { 
					_method : defnSettings.type, 
					utf8    : "✓"
					// authenticity_token
				}
			});
		}

		return _ajax(defnSettings);

	}

})(jQuery);