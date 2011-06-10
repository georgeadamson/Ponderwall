(function($){
	
	$(function(){

		var feed = {

			data    : { results: [] },
			keyword : window.location.hash || 'twitter',
			url     : "http://search.twitter.com/search.json?callback=?",


      // TODO: Make this smarter, eg reorganise the grid when window is resized.
      initTweetSlots : function(){

        for(var i=0; i<9; i++){
          $("#template-for-tweet-slot").tmpl().appendTo("#tweets-container");
        }
        
      },


			displayLatestTweet : function(){

				if( feed.data.results && feed.data.results.length ){

          // Pull off the first tweet from the data:
					var tweet = feed.data.results.shift();                                console.log('next tweet:',tweet);

					var $slot = feed.nextAvailableSlot();

          $.when( hideTweet($slot) ).then(function(){ 

            $slot.empty();

				  	if( $slot.available() ){
  						$("#template-for-tweet").tmpl(tweet).appendTo( $slot );
  						showTweet($slot);
  					}

          });

				}

        function hideTweet( $slot ){
          return $.Deferred(function( deferred ){
              $slot.fadeOut( 1000, deferred.resolve );
          }).promise();
        }

        function showTweet( $slot ){
          return $.Deferred(function( deferred ){
              $slot.fadeIn( 1000, deferred.resolve );
          }).promise();
        }

			},


      // Helper to return the most appropriate slot where we should display the latest tweet:
      nextAvailableSlot : function(){

				var $slots = $("#tweets-container .tweet-slot");
				var $slot  = $slots.filter(":childless:first");

        // When there are no empty slots, lets find the oldest tweet that we could replace:
				if( $slot.notFound() ){

					$slot = $slots.sort(function(a,b){
					  return $(a).children().data('ui-timestamp') > $(b).children().data('ui-timestamp');
					}).first();

				}

        return $slot;

      },


			getLatestTweets : function(){

				var data = { q: feed.keyword, since_id: feed.data.max_id };

				$.getJSON( feed.url, data, feed.gotLatestTweets );                      // console.log( 'getLatestTweets:', feed.url, data );

			},


			gotLatestTweets : function(data){

        // Store the latest data in our feed object:
				//feed.data = data;                                                       console.log( 'gotLatestTweets:', data.results && data.results.length, data );

        var queueBefore = feed.data.results.length;

        feed.data.results = feed.data.results.concat( data.results );

        console.log( 'Queue was:', queueBefore, ', added:', data.results.length, ', now:', feed.data.results.length )

			},


			stopPolling : function(reason){
				window.clearInterval(feed.twitterPoller);
				window.clearInterval(feed.uiRefresher);
				console.log('Polling stopped deliberately.', reason || '' );
			}

		}


		// Poll for new tweets every n milliseconds:
		feed.twitterPoller = window.setInterval( feed.getLatestTweets,    20000 );      // Frequency of twitter queries.
		feed.uiRefresher   = window.setInterval( feed.displayLatestTweet, 2000  );      // Frequency of ui updates.
		feed.sleepTimeout  = window.setTimeout(  feed.stopPolling,        5*60*1000 );  // Shutdown eventually

    // Get things started:
    feed.initTweetSlots();
		feed.getLatestTweets();


		// Stop polling when user presses ESCAPE!
		$(window).bind( 'keydown', function(e){
			if(e.keyCode==27){ 
				feed.stopPolling('User pressed Escape');
			}
		});

	});
	
})(jQuery);