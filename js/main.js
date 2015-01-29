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
					//shiftColumn(1,-1);
					break;
				case(40):
					//down
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
		function highlightColumn(_column){
			console.log('para: '+_column);
			bw('div.row div:nth-child('+(_column+1)+')').toggleClass('highlightedTile');
			bw('div.row div:not(:nth-child('+(_column+1)+'))').removeClass('highlightedTile');
		}
		
		/*woodw
		ShiftColumn: move a stack of ties up or down the list
			_column: which column to move up or down
			_direction: whether it is moving up or down 
		*/
		function shiftColumn(_column,_direction){
			//var holdingTile = bw(div.board).children
		}
				
	});
})(jQuery);