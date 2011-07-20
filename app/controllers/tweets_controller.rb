class TweetsController < ApplicationController
  #active_scaffold :tweet do |conf|
  #end
  
  
  def twitter_search
    @jsonp_callback = params[:callback]
  end
  
end 