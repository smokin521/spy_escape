/**
 * @author Wood
 */
jQuery.noConflict();
(function(bw){	
	bw(function() {
		console.log('in the main');
		
		//DEBUG: detect keypress to force premature game state actions	
		bw(document).keydown(function(e){
			switch(e.which){
				case(38):
					//up
					shiftColumn(-1);
					break;
				case(40):
					//down
					shiftColumn(1);
					break;
				case(49):
				case(50):
				case(51):
				case(52):
				case(53):
				case(54):
				case(55):
				case(56):
				case(57):
					//highlight a column
					highlightColumn(e.which-48);
					break;
				default:
					console.log('key press event: '+e.which);
					break;
			}
		});
		
		/*woodw
		highlightColumn: highlight a particular column and remove highlight from everything else.
			_column: which column to highlight
			***
			* (_column+1): this is needed to skip the landing class. 
			* div.tile:nth-child contains an ongoing bug that still 
			* goes by element child size and not sub child size. 
		*/
		function highlightColumn(column){
			console.log('para: '+column);
			bw('div.row div:nth-child('+(column+1)+')').toggleClass('highlightedTile');
			bw('div.row div:not(:nth-child('+(column+1)+'))').removeClass('highlightedTile');
		}
		
		/*woodw
		ShiftColumn: move a stack of ties up or down the list
			***
			* direction: whether it is moving up(-1) or down(1) 
			* *We take a stack and perform standard array push/pop.
			* 1. place the first replaced item in a held reference item
			* and make sure its a seperate object and not just a reference
			* 2. copy the values to other objects.
			* 3. inject the held item at the end.
		*/
		function shiftColumn(direction){
			var _holdingTile=bw('<div>');
			var _stack = bw('div.row div.highlightedTile');

			switch(direction){
				case(-1):
					_holdingTile = bw(_stack[0]).clone();
					for(var i=0;i<_stack.size();i++){
						if(i+1<_stack.size()){
							bw(_stack[i]).html(bw(_stack[i+1]).html());
						}
						else{
							bw(_stack[i]).html(bw(_holdingTile).html());
						}	
					}
					break;
				case(1):
					_holdingTile = bw(_stack[_stack.size()-1]).clone();
					for(var i=_stack.size()-1;i>=0;i--){
						if(i>0){
							bw(_stack[i]).html(bw(_stack[i-1]).html());
						}
						else{
							bw(_stack[i]).html(bw(_holdingTile).html());
						}	
					}
					break;
			}
		}
				
	});
})(jQuery);