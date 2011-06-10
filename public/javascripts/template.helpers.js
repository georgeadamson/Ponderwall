
(function($){

  // Extend jQuery's selector syntax:
  $.extend($.expr[':'], {

    // Custom selector much like jQuery's native :empty selector but this ignores textnodes:
  	childless: function( elem, i, match, array ) {
  		return !$(elem).children().length;
  	}

  });

	$.extend( $.fn, {
	  
	  // Define our own custom jQuery method to return the outer html of an element:
	  outerHtml : function(){ return $('<p>').append( $(this).clone() ).html() },
	  
	  // Daft custom helper methods to make code more readable:
	  notFound  : function(){ return !this.length },
	  available : function(){ return  this.length },
	  
	  
    /**
     * jQuery.fn.sortElements - http://james.padolsey.com/javascript/sorting-elements-with-jquery
     * --------------
     * @param Function comparator:
     *   Exactly the same behaviour as [1,2,3].sort(comparator)
     *   
     * @param Function getSortable
     *   A function that should return the element that is
     *   to be sorted. The comparator will run on the
     *   current collection, but you may want the actual
     *   resulting sort to occur on a parent or another
     *   associated element.
     *   
     *   E.g. $('td').sortElements(comparator, function(){
     *      return this.parentNode; 
     *   })
     *   
     *   The <td>'s parent (<tr>) will be sorted instead
     *   of the <td> itself.
     */
    sortElements : (function(){

        var sort = [].sort;

        return function(comparator, getSortable) {

            getSortable = getSortable || function(){return this;};

            var placements = this.map(function(){

                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,

                    // Since the element itself will change position, we have
                    // to have some way of storing its original position in
                    // the DOM. The easiest way is to have a 'flag' node:
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );

                return function() {

                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }

                    // Insert before flag:
                    parentNode.insertBefore(this, nextSibling);
                    // Remove flag:
                    parentNode.removeChild(nextSibling);

                };

            });

            return sort.call(this, comparator).each(function(i){
                placements[i].call(getSortable.call(this));
            });

        };

    })()

	});
	
})(jQuery);


var helpers = {
	
	formatUsername : function(string){
		var attributes = { 
			href   : 'http://www.twitter.com/' + string,
			target : '_blank'
		};
		return $( "<a>", attributes ).text( "@" + string ).outerHtml();
	},
	
	formatDate : function(string){
		
		
	},

	// Prepare a hash of helpers to convert urls and hashtags etc into links: (These are referenced from within the jQuery html template)
	// Based on Dustin Diaz's ify, but with fixes from Remy Sharp's twitter.js and by George Adamson:
	// TODO: Move this out of global namespace and update Template options to use namespaced function.
	tweetify : (function(){

	  var entities = { '"':'&quot;', '&':'&amp;', '<':'&lt;', '>':'&gt;' };

	  return {
	    "link": function(t) {
	      return t.replace(/[a-z]+:\/\/[a-z0-9-_]+\.[a-z0-9-_:~%&\?\/.=]+[^:\.,\)\s*$]/ig, function(m) {
	        return '<a target="_blank" href="' + m + '">' + ((m.length > 25) ? m.substr(0, 24) + '...' : m) + '</a>';
	      });
	    },
	    "at": function(t) {
	      return t.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15})/g, function(m, m1, m2) {
	        return m1 + '<a target="_blank" href="http://twitter.com/' + m2 + '">@' + m2 + '</a>';
	      });
	    },
	    "hash": function(t) {
	      return t.replace(/(^|[^\w'"]+)\#([a-zA-Z0-9_]{2,})/g, function(m, m1, m2) {
	        return m1 + '<a target="_blank" href="http://search.twitter.com/search?q=%23' + m2 + '">#' + m2 + '</a>';
	      });
	    },
	    "clean": function(tweetText) {
	      return this.hash(this.at(this.link(tweetText)));
	    }
	  };

	})()

}





