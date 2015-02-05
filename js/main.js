/**
 * @author Wood
 */
jQuery.noConflict();
(function(bw){	
	bw(function() {
		console.log('in the main');
		var movingplayer=false;
		
		
		//setup stuff
		bw('div.setup').click(function(){
			console.log('create the board');
			if(bw('#player_count').val()!=''&&bw('#turn_count').val()!=''){
				//console.log(bw('#player_count').val());
				bw('div.setup > input').fadeOut(100);
				bw(this).slideUp();
				buildTheBoard(bw('#player_count').val(),bw('#turn_count').val());
				bw('div.board').show();
			}
			return false;
		});
		
		//boardstuff	
		//conversion of board stuff
		function playerClick(item){
			console.log(item);
			//console.log(e.offsetX+' '+e.offsetY);
			console.log('down on the player');
			//movingplayer=true;
			bw(this).toggleClass('movable'); //you can list several class names 
			//console.log(e);
			if(movingplayer==true){
				movingplayer = false;
				checkwhatsover(bw(this),item);
			}
			else{
				movingplayer = true;
			}
      		//movingplayer = (movingplayer==true) ? false : true;
      		console.log(movingplayer);
      		return false;
		}
		function playerMouseMove(item){
			if(movingplayer){
				bw('.movable').css({'left':(item.pageX-(bw(this).prop('offsetWidth')/2)),'top':(item.pageY-(bw(this).prop('offsetHeight')/2))});
				//console.log(e.pageY-(bw(this).prop('offsetHeight')/2));
			}
			return false;
		}
		function tileMouseOver(item){
			bw(this).addClass('imin');
			return false;
		}
		
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
		
		/*checkwhatsover: need renamed but allows the player tile to drop on top of lower tile
		 * 
		 */
		function checkwhatsover(player,mouse){
			var _playerAttr = {
				'Left':bw(player).prop('offsetLeft'),
				'Top':bw(player).prop('offsetTop'),
				'Width':bw(player).prop('offsetWidth'),
				'Height':bw(player).prop('offsetHeight')
			};
			
			var _mouse = {
				'x':mouse.pageX,
				'y':mouse.pageY
			};
			
				console.log(player.prop('offsetLeft'));
				//console.log(_playerAttr.Left);
				//console.log(_playerAttr.Top);
				//console.log(_playerAttr.Width);
				//console.log(_playerAttr.Height);
			
			bw('div.row > div').each(function(i,e){
				//console.log(e.offsetLeft+' '+e.offsetTop);

				if(mouse.pageX >= e.offsetLeft 
					&& mouse.pageY >= e.offsetTop 
					&& mouse.pageX <= (e.offsetLeft+e.offsetWidth) 
					&& mouse.pageY <= (e.offsetTop+e.offsetHeight)){
					console.log('yes');
					bw(player).css({'left':e.offsetLeft,'top':e.offsetTop});
					bw(e).prepend(bw(player));
				}
				else{
					console.log('no');
				}
			});
			
		}
		
		/*woodw
		buildTheBoard: use the player count and turns to build the grid of divs.
			players: how many rows to use
			turn: how many columns
			*** 
		*/
		function buildTheBoard(players, turn){
			var newRow, newCol;
			
			for(var i=0;i<players;i++){
				newRow = bw('<div>',{'class':'row'});
				newCol = bw('<div>',{'class':'landing tile','html':bw('<img>',{'class':'player','src':'img/player_icon.png','style':'background-color:'+pickColor(i)+';'}).on('mousemove',playerMouseMove(event)).on('click',playerClick(event))});
					bw(newRow).append(newCol);
				for(var j=0;j<turn;j++){
					newCol = bw('<div>',{'class':'tile'}).on('mouseover',tileMouseOver(event));
					bw(newRow).append(newCol);
				}
				bw('div.board').append(newRow);
			}
		}
		
		/*pickColor: this will allow the teams to have different colors
		 * number: the team number which returns a switch color
		 */
		function pickColor(number){
			switch(number){
				case 0:
					return 'red';
					break;
				case 1:
					return 'blue';
					break;
				case 2:
					return 'yellow';
					break;
				case 3:
					return 'green';
					break;
				case 4:
					return 'silver';
					break;
				case 5:
					return 'orange';
					break;
				case 6:
					return 'black';
					break;
			}
		}
		
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