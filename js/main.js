/**
 * @author Wood
 */
jQuery.noConflict();
(function(bw) {
	bw(function() {
		console.log('in the main');
		var movingplayer = false;
		var triviaQuestions = getTriviaQuestions();
		console.log(getOneTriviaQuestion('sports'));
		
		//setup stuff
		bw('div.setup').click(function() {

			if (bw('#player_count').val() != '' && bw('#turn_count').val() != '') {
				console.log('create the board');
				//console.log(bw('#player_count').val());
				bw('div.setup > input').fadeOut(100);
				bw(this).slideUp();
				buildTheBoard(bw('#player_count').val(), bw('#turn_count').val());
				bw('div.board').show();

			}
			return false;
		});

		//Player & Tile Movement event handlers
		bw('div.board').on('click', 'img.player', function(event) {
			//console.log(event);
			//console.log(e.offsetX+' '+e.offsetY);
			console.log('down on the player');
			//movingplayer=true;
			bw(this).toggleClass('movable');
			//you can list several class names
			//console.log(e);
			if (movingplayer == true) {
				movingplayer = false;
				checkwhatsover(bw(this), event);
			} else {

				movingplayer = true;
			}
			//movingplayer = (movingplayer==true) ? false : true;
			console.log(movingplayer);
			return false;
		});
		bw('div.board').on('mousemove', 'img.player', function(event) {
			//console.log(event);
			if (movingplayer) {
				bw('.movable').css({
					'left' : (event.pageX - (bw(this).prop('offsetWidth') / 2)),
					'top' : (event.pageY - (bw(this).prop('offsetHeight') / 2))
				});
				//console.log(e.pageY-(bw(this).prop('offsetHeight')/2));
			}
			return false;
		});
		//boardstuff
		//DEBUG: detect keypress to force premature game state actions
		bw(document).keydown(function(e) {
			switch(e.which) {
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
				highlightColumn(e.which - 48);
				break;
			default:
				console.log('key press event: ' + e.which);
				break;
			}
		});

		/*checkwhatsover: need renamed but allows the player tile to drop on top of lower tile
		 *
		 */
		function checkwhatsover(player, mouse) {
			console.log(player.prop('offsetLeft'));

			bw('div.row > div').each(function(i, e) {
				//console.log(e.offsetLeft+' '+e.offsetTop);

				if (mouse.pageX >= e.offsetLeft && mouse.pageY >= e.offsetTop && mouse.pageX <= (e.offsetLeft + e.offsetWidth) && mouse.pageY <= (e.offsetTop + e.offsetHeight)) {
					console.log('yes');

					//bw(player).css({'left':e.offsetLeft,'top':e.offsetTop});
					bw(e).prepend(bw(player));
					moveToParent(player, e);
					return false;
				} else {
					console.log('no');
				}
			});

		}

		/*woodw
		 * moveToParent: this should align any absolute moving element to its parent
		 *
		 */
		function moveToParent(player, parent) {
			console.log(parent);
			console.log(bw(player).css('left') + '   -----  ' + parent.offsetLeft);
			bw(player).css({
				'left' : parent.offsetLeft,
				'top' : parent.offsetTop
			});
			console.log(bw(player).css('left') + '   +++++  ' + parent.offsetLeft);
		}

		/*woodw
		 buildTheBoard: use the player count and turns to build the grid of divs.
		 players: how many rows to use
		 turn: how many columns
		 ***
		 */
		function buildTheBoard(players, turn) {
			var newRow, newCol;

			for (var i = 0; i < players; i++) {
				newRow = bw('<div>', {
					'class' : 'row'
				});
				newCol = bw('<div>', {
					'class' : 'landing tile',
					'html' : bw('<img>', {
						'class' : 'player',
						'src' : 'img/player_icon.png',
						'style' : 'background-color:' + pickColor(i) + ';'
					})
				});
				bw(newRow).append(newCol);
				for (var j = 0; j < turn; j++) {
					newCol = bw('<div>', {
						'class' : 'tile'
					});
					bw(newRow).append(newCol);
				}
				bw('div.board').append(newRow);
			}
		}

		/*woodw
		 *pickColor: this will allow the teams to have different colors
		 * number: the team number which returns a switch color
		 */
		function pickColor(number) {
			switch(number) {
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
		function highlightColumn(column) {
			//console.log('para: '+column);
			bw('div.row div:nth-child(' + (column + 1) + ')').toggleClass('highlightedTile');
			bw('div.row div:not(:nth-child(' + (column + 1) + '))').removeClass('highlightedTile');
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
		function shiftColumn(direction) {
			var _holdingTile = bw('<div>');
			var _stack = bw('div.row div.highlightedTile');

			switch(direction) {
			case(-1):
				_holdingTile = bw(_stack[0]).clone();
				for (var i = 0; i < _stack.size(); i++) {
					if (i + 1 < _stack.size()) {
						bw(_stack[i]).html(bw(_stack[i + 1]).html());
					} else {
						bw(_stack[i]).html(bw(_holdingTile).html());
					}
				}
				break;
			case(1):
				_holdingTile = bw(_stack[_stack.size() - 1]).clone();
				for (var i = _stack.size() - 1; i >= 0; i--) {
					if (i > 0) {
						bw(_stack[i]).html(bw(_stack[i - 1]).html());
					} else {
						bw(_stack[i]).html(bw(_holdingTile).html());
					}
				}
				break;
			}

			bw('div.tile.highlightedTile > img.player').each(function(i, e) {
				console.log(bw(e).parent());
				moveToParent(e, bw(e).parent()[0]);
			});
		}

		function getTriviaQuestions(){
		return {"technology": [
			{"question": "The purpose of choke in tube light is ?","multiple-choice": "To decrease the current@_@To increase the current@_@To decrease the voltage momentarily@_@To increase the voltage momentarily","answer": "To increase the voltage momentarily","explanation": "","used": false
			}, {"question": "Which is a type of Electrically-Erasable Programmable Read-Only Memory?","multiple-choice": "Flash@_@Flange@_@Fury@_@FRAM","answer": "Flash","explanation": "It's commonly used for MP3 players, computer BIOS code and \"thumb\" drives. Originally developed in Japan by Toshiba, it has become quite popular for products requiring non-volatile erasable memory. Flash devices have a limited number of erase cycles (typically 10,000 to 1,000,000 cycles) so they're not as good a choice for applications in which the data changes constantly. However, since it has no moving parts (unlike a hard disk) it is an excellent choice for storing the operating code for small personal electronics like PDAs, cell phones, digital cameras, and the data in items like MP3 players.","used": false
			}, {"question": "A computer virus that actively attacks an anti-virus program or programs in an effort to prevent detection is...","multiple-choice": "Worm@_@Retrovirus@_@Trojan@_@Ghost virus","answer": "Retrovirus","explanation": "","used": false
			}, {"question": "Who is largely responsible for breaking the German Enigma codes, created a test that provided a foundation for artificial intelligence?","multiple-choice": "Alan Turing@_@Jeff Bezos@_@George Boole@_@Charles Babbage","answer": "Alan Turing","explanation": "","used": false
			}, {"question": "A JPG is...","multiple-choice": "A Jumper Programmed Graphic@_@A format for an image file@_@A type of hard disk@_@A unit of measure for memory","answer": "A format for an image file","explanation": "","used": false
			}, {"question": "What does VVVF stand for?","multiple-choice": "Variant Voltage Vile Frequency@_@Variable Velocity Variable Fun@_@Very Very Vicious Frequency@_@Variable Voltage Variable Frequency","answer": "Variable Voltage Variable Frequency","explanation": "It is a method of controlling the speed of an AC induction motor, whereby speed, current and torque can all be accurately controlled.","used": false
			}, {"question": "The first step to getting output from a laser is to excite an active medium. What is this process called?","multiple-choice": "Pumping@_@Exciting@_@Priming@_@Raising","answer": "Pumping","explanation": "A collection of atoms or molecules that can be excited to a higher energy state is called an active medium. Before lasing can occur, the active media is \"pumped\". The process of raising the atoms in the active media from a lower energy state to a higher state is like pumping water up from a well.","used": false
			}, {"question": "What does the term PLC stand for?","multiple-choice": "Programmable Lift Computer@_@Program List Control@_@Programmable Logic Controller@_@Piezo Lamp Connector","answer": "Programmable Logic Controller","explanation": "Used in manufacturing, engineering, and process operations.","used": false
			}, {"question": "Who created Pretty Good Privacy (PGP)?","multiple-choice": "Phil Zimmermann@_@Tim Berners-Lee@_@Marc Andreessen@_@Ken Thompson","answer": "Phil Zimmermann","explanation": "Phil Zimmermann created the first version of PGP encryption in 1991. Pretty Good Privacy (PGP) is a data encryption and decryption computer program that provides cryptographic privacy and authentication for data communication. PGP is often used for signing, encrypting and decrypting texts, E-mails, files, directories and whole disk partitions to increase the security of e-mail communications.","used": false
			}, {"question": "Modem stands for...","multiple-choice": "Modulator Demodulater@_@Monetary Devaluation Exchange Mechanism@_@Memory Demagnetization@_@Monetary Demarkation","answer": "Modulator Demodulater","explanation": "","used": false
			}, {"question": "Which was an early mainframe computer?","multiple-choice": "ENIAC@_@UNIC@_@BRAINIA@_@FUNTRIA","answer": "ENIAC","explanation": "","used": false
			}, {"question": "What was the first full-length computer generated feature film?","multiple-choice": "*hint* Created by Pixar & Disney","answer": "Toy Story","explanation": "","used": false
			}, {"question": "Which company invented the floppy disk?","multiple-choice": "Intel@_@IBM@_@Sony@_@Memorex","answer": "IBM","explanation": "","used": false
			}, {"question": "What is the name of Linux’s Mascot?","multiple-choice": "Rico@_@Wheezy@_@Tux@_@Mumble","answer": "Tux (a penguin)","explanation": "","used": false
			}, {"question": "What game system was the first to offer online gaming?","multiple-choice": "Wonderswan@_@Playstation@_@XBOX@_@Dreamcast","answer": "Dreamcast","explanation": "","used": false
			}, {"question": "What does the computer acronym PnP stand for?","multiple-choice": "Plug and Play@_@Prime network Principle@_@Program and Pray@_@Process neutral Path","answer": "Plug and play","explanation": "","used": false
			}, {"question": "Up until the 1990s, IBM has a very strict public uniform for IBM employees. Describe the uniform.","multiple-choice": "","answer": "A dark (or gray) suit, white shirt, and a “sincere” tie","explanation": "","used": false
			}, {"question": "Solar power can make life easier in remote locations that don't have access to electricity grids, and in some cases, it serves a vital purpose. For which of the following is solar power most commonly used in rural locations?","multiple-choice": "Grain elevators@_@Steam trains@_@Water pumps@_@Cable TV access","answer": "Water pumps","explanation": "Obtaining water can take up a good part of the day for people living in remote locations without access to plumbing. Additionally, surface water can be contaminated, thus causing illnesses in those who use on it. Solar water pumps are used to access underground fresh water supplies, allowing wells to often be built right where the villagers live. A project in the Kalahari Desert of southern Africa, for example, tapped into a freshwater lake located 100 feet below the surface to provide water not only for people but also for their livestock and their crops.","used": false
			}, {"question": "Who uses a stithy?","multiple-choice": "blacksmith@_@store clerk@_@tailor@_@chef","answer": "blacksmith","explanation": "This is another term for the anvil usually used by blacksmiths.","used": false
			}, {"question": "How does a fisherman use a snell?","multiple-choice": "to cook his catch@_@to preserve his catch@_@to hold his catch@_@to join the hook to the main line","answer": "to join the hook to the main line","explanation": "A snell is also called a leader. It is a short piece of light cable used to join the hook to the main fishing line.","used": false
			}, {"question": "What does a seamstress use a ham for?","multiple-choice": "lunch@_@a dinner party@_@telling sick jokes@_@pressing curved seams","answer": "pressing curved seams","explanation": "A ham is a stuffed form shaped somewhat like a ham which the seams to be pressed are laid onto so that they will keep their shape when pressed.","used": false
			}
		],
		"geography": [
			{"question": "The great Victoria Desert is located in","multiple-choice": "Canada@_@West Africa@_@Australia@_@North America","answer": "Australia","explanation": "","used": false
			}, {"question": "The largest gold producing country in the world is","multiple-choice": "China@_@Canada@_@South Africa@_@USA","answer": "China","explanation": "","used": false
			}, {"question": "The largest country of the world by geographical area is","multiple-choice": "Russia@_@Vatican City@_@Australia@_@USA","answer": "Russia","explanation": "","used": false
			}, {"question": "The highest sand dunes are found is","multiple-choice": "the Sahara desert@_@the Atacama desert@_@the Kalahari desert@_@the Gobi desert","answer": "the Sahara desert","explanation": "","used": false
			}, {"question": "The largest part of our hydrosphere is","multiple-choice": "Atlantic Ocean@_@Indian Ocean@_@Pacific ocean@_@Antarctica ocean","answer": "Pacific ocean","explanation": "","used": false
			}, {"question": "Which of the following is an igneous rock?","multiple-choice": "Granite@_@Limestone@_@Slate@_@Quartzite","answer": "Granite","explanation": "","used": false
			}, {"question": "The main factor determining a region's climate is","multiple-choice": "longitude@_@latitude@_@temperature@_@All of the above","answer": "latitude","explanation": "","used": false
			}, {"question": "Both Japan and Indonesia are made up of a chain of islands called","multiple-choice": "an archipelago@_@a peninsula@_@a delta@_@an atoll","answer": "an archipelago","explanation": "An archipelago is defined as a chain of islands, which describes Japan and Indonesia perfectly.","used": false
			}, {"question": "Which of these nations is located closet to the Philippines, Malaysia, and Indonesia?","multiple-choice": "Korea@_@Vietnam@_@Somalia@_@Pakistan","answer": "Vietnam","explanation": "While Korea and Vietnam are both located in Southeast Asia, Vietnam is much closer to the Philippines, Malaysia, and Indonesia. Somalia is located on the Horn of Africa, and Pakistan is located near India in South Asia.","used": false
			}, {"question": "On a map of the world, Asia is to Japan as Europe is to","multiple-choice": "Great Britain@_@the Netherlands@_@Austria@_@Italy","answer": "Great Britain","explanation": "Asia is a continental landmass, and Japan is an island that is found just off the coast of Asia. In this same way Europe is a continental landmass and Great Britain is an island just off the coast of Europe.","used": false
			}, {"question": "The river situated along the border between the USA and Mexico is","multiple-choice": "the Rio Grande@_@the Amazon@_@the Mississippi@_@the Colorado","answer": "the Rio Grande","explanation": "","used": false
			}, {"question": "The progressive wave theory regarding of tides was put forth by","multiple-choice": "R.A. Harris@_@Issac Newton@_@William Whewell@_@G.B. Airy","answer": "William Whewell","explanation": "","used": false
			}, {"question": "The river Jordan drains into the","multiple-choice": "Dead Sea@_@Adriatic Garden@_@Gulf of Suez@_@Resaca Garden","answer": "Dead Sea","explanation": "","used": false
			}, {"question": "How many lakes comprise the Great Lakes?","multiple-choice": "4@_@5@_@6@_@7","answer": "5","explanation": "","used": false
			}, {"question": "Which is the smallest state in the Midwest?","multiple-choice": " Illinois@_@Missouri@_@Iowa@_@Indiana","answer": "Indiana","explanation": "Indiana has an area of 93719 sq. km.","used": false
			}, {"question": "In which state does the Snake River originate?","multiple-choice": "Iowa@_@Idaho@_@Wyoming@_@Colorado","answer": "Wyoming","explanation": "The Snake River rises in Wyoming and flows into Idaho. It is 1504 km long.","used": false
			}, {"question": "The pass located at the southern end of the Nilgiri Hills in south India is called","multiple-choice": "the Palghat gap@_@the Bhorghat pass@_@the Thalgat pass@_@the Bolan pass","answer": "the Palghat gap","explanation": "","used": false
			}, {"question": "Which country has the largest coast line?","multiple-choice": "USA@_@Australia@_@Canada@_@India","answer": "Canada","explanation": "","used": false
			}, {"question": "Which is known as 'Garden City of India'?","multiple-choice": "Trivandram@_@Imphal@_@Simla@_@Bangalore","answer": "Bangalore","explanation": "","used": false
			}, {"question": "According to a famous Chinese saying, which two cities in Jiangsu and Zhejiang provinces respectively are \"parallels of heaven\"?","multiple-choice": "Shanghai and Hangzhou@_@Fuzhou and Wuhan@_@Suzhou and Nanjing@_@Suzhou and Hangzhou","answer": "Suzhou and Hangzhou","explanation": "The saying goes (in Chinese): \"Shang you tian tang, xia you Su-Hang\", meaning, literally: \"Above there is heaven, below there is Suzhou and Hangzhou\", a tribute to the beauty of these cities. Hangzhou is the capital of Zhejiang province, while Suzhou is an elegant city in Jiangsu of fine gardens and extensive waterways. Hence the fact it is sometimes called \"Venice of the Orient\".","used": false
			}
		],
		"sports": [
			{"question": "In Cricket, if a batsman is out on the very first ball he faced, what is it called?","multiple-choice": "Golden Duck@_@Golden Elephant@_@Golden Fleece@_@Mallard Duck","answer": "Golden Duck","explanation": "When a cricketer is out without scoring, it is said that he's \"out for a duck\", and if he's out on the very first ball he's faced, it then becomes a \"Golden Duck\". There are many theories abounding as to where the term \"duck\" originated, many of them highly amusing, but the accepted answer is the far more prosaic one that the figure \"0\" resembles a duck's egg. Why not an Ostrich, or an Albatross or even a Platypus' egg, I know not, but scoring a \"duck\" is something every cricketer hates. It is a character building experience.","used": false
			}, {"question": "What is the name given to the two people who officiate in a cricket match?","multiple-choice": "Umpires@_@Referees@_@Judges@_@Trevor and Kevin","answer": "Umpires","explanation": "The oft maligned umpires have a very busy job of things. They must judge the legality of bowling activities, uphold the laws and spirit of the game, respond to appeals for the dismissal of the batsman, count the number of deliveries bowled, signal runs and wickets to the scorers, and countless other minute activities to ensure that the game runs smoothly. The introduction of a \"third umpire\" in recent years in most \"high profile\" games, essentially to rule on television replays, has in reality probably put even more pressure on the poor umpires to be flawless in their decision making.","used": false
			}, {"question": "Which of these is not a fielding position in cricket?","multiple-choice": "Silly Mid On@_@Second Slip@_@Fine Leg@_@Winded Willow","answer": "Winded Willow","explanation": "It is not a pre-requisite to have a lovely pair of pins to field at Fine Leg, but you'll probably have to do a fair amount of running if you're fielding down on the legside boundary at this position. Second Slip and Silly Mid On are both close catching positions, near to the batsman. The latter a few feet away, so you need to be a little bit silly to volunteer to go and field there. Winded Willow has nothing to do with Kenneth Grahame, cricket, or anything else.","used": false
			}, {"question": "If a Pittsburgh Steeler kicked a field goal with the ball hiked from the 50-yard line and made it, how long was the actual field goal?","multiple-choice": "50 yards@_@55 yards@_@60 yards@_@67 yards","answer": "67 yards","explanation": "With the ball hiked from the 50-yard line, add 10 yards for the end zone depth, then seven more for the ball placement. In 1970, New Orleans Saints kicker Tom Dempsey kicked a 63-yard field goal against the Lions. In 1998, Denver Bronco kicker Jason Elam tied Dempsey's record against the Jaguars.","used": false
			}, {"question": "In which American Football season was the 'instant replay' first used?","multiple-choice": "1963@_@1995@_@1986@_@1970","answer": "1986","explanation": "It first began in 1986. Due to the watering-eyes of many owners, and many fans wanting to keep the game 'pure', it was discontinued after the 1991 season. It was brought back under stringent guidelines, then was remodified, and modified again, and again, etc.","used": false
			}, {"question": "What position did Jerry Rice play throughout most of his career?","multiple-choice": "wide receiver@_@running back@_@quarterback@_@tight end","answer": "wide receiver","explanation": "Jerry Rice was drafted in 1985 by the San Francisco 49ers. He was born October 13, 1962. Entering the 2003 season, he has played for the 49ers and the Oakland Raiders.","used": false
			}, {"question": "Which of these is not a position in American football?","multiple-choice": "Punter@_@Quarterback@_@Full Forward@_@Half Back","answer": "Full Forward","explanation": "Full Forward is a position in Australian Rules Football.","used": false
			}, {"question": "Which of the following is not an NFL team?","multiple-choice": "Miami Dolphins@_@Buffalo Bills@_@Washington Redskins@_@Pittsburgh Patriots","answer": "Pittsburgh Patriots","explanation": "Pittsburgh are the Steelers and the Patriots are New England.","used": false
			}, {"question": "In American Football, what was the name of the team from Dallas, Texas that became the Kansas City Chiefs?","multiple-choice": "Dallas Mavericks@_@Dallas Texans@_@Dallas Stars@_@Texas Rangers","answer": "Dallas Texans","explanation": "Mavericks is a basketball team, Stars hockey, and Rangers baseball.","used": false
			}, {"question": "Which of the following American Football teams/franchises, was the last in the 20th century to go defunct?","multiple-choice": "Minneapolis Waves@_@Detroit Mudhens@_@Dallas Texans@_@Houston Derricks","answer": "Dallas Texans","explanation": "The other teams never existed. The Texans' only season was in 1952. They started and finished off their franchise with a 1-11 season record. They allowed the most points in the NFL with 427. They were coached by Jim Phelan, which was his only season of coaching also.","used": false
			}, {"question": "The last NFL team from Brooklyn was called what?","multiple-choice": "Brooks@_@Tigers@_@Homeboys@_@Brawlers","answer": "Tigers","explanation": "The Brooklyn Tigers' last season in pro football was in 1944. They finished their franchise with a 0-10 season record. They never scored more than 14 points in a game the entire season, and were shutout 3 times. In 1943, the team was called the Brooklyn Dodgers, and had been called that since the franchise's inception in 1930.","used": false
			}, {"question": "Who was this former Green Bay Packer offensive tackle, who later took the Bengals as a head coach to a Super Bowl?","multiple-choice": "Warren Wells@_@Bart Starr@_@Forrest Gregg@_@Ben Davidson","answer": "Forrest Gregg","explanation": "Gregg was an eight-time Pro Bowler with the Packers in the 1960s, and played on five championship teams also. After coaching the Browns for three seasons, the Bengals took Gregg at the helm in 1980. He took the 1981 Cincinnati team with their 12-4 record to the Super Bowl. The Bengals lost to the 49ers, 26-21.","used": false
			}, {"question": "In Golf, if one player tees off with the following four clubs and hits them all well, which club would make the ball go further?","multiple-choice": "7-iron@_@Putter@_@Pitching wedge@_@Driver","answer": "Driver","explanation": "A driver is the biggest club in a golf kit. It hits the ball far, but it can sometimes make the ball stray off course while it is in the air. A putter would be nearly impossible to tee off with.","used": false
			}, {"question": "Which legendary golfer was known as the \"Golden Bear\"?","multiple-choice": "Jack Nicklaus@_@Ben Hogan@_@Arnold Palmer@_@Gary Player","answer": "Jack Nicklaus","explanation": "Jack Nicklaus nickname came about because of his stocky build and his golden blonde hair. Jack Nicklaus was often seen wearing yellow or \"gold\".","used": false
			}, {"question": "In GOlf, when a ball is hit out of bounds what is the penalty?","multiple-choice": "2 stroke@_@3 strokes@_@0 strokes@_@1 stroke","answer": "1 stroke","explanation": "When the ball is found out of bounds you must return to the area where ball was struck and add 1 stroke onto score for that for hole. If the penalty is breached the player can take a stroke play:2 stroke penalty or match play:loss of hole penalty","used": false
			}, {"question": "What is the least number of points in tennis needed to win a game?","multiple-choice": "4@_@5@_@3@_@6","answer": "4","explanation": "Although a game can be won with 5 and 6 or possibly more points, 4 is all it takes.","used": false
			}, {"question": "What is the name given to a shot that is hit to your opponent who then fails to touch the ball with his or her racket?","multiple-choice": "shooter@_@winner@_@breaker@_@turner","answer": "winner","explanation": "At the end of the match, statisticians compare the number of winners a player has to the number of errors he or she committed. Obviously, the more winners than errors, the greater the chance that you won the match.","used": false
			}, {"question": "Who was the first player in baseball to hit 30 home runs in a season?","multiple-choice": "Frank Robinson@_@Babe Ruth@_@Mark McGwire@_@Derek Jeter","answer": "Babe Ruth","explanation": "After playing in the Minor League with Baltimore, the Babe became a Boston Red Sox pitcher in 1914. He continued to be a full-time pitcher until 1918. He set a season record for home runs with the Red Sox in 1919 when he smacked 29. He was sold to the Yankees for the 1920 season, and set an unbelievable record of smashing 54 home runs for New York. Ruth would hit 50+ home runs four times in his career, and retire with 714. The Babe played with the Yankees until 1934, then he spent his final season with the Boston Braves of the National League. When Ruth retired in 1935, Lou Gehrig was number two for career home runs with 378. The Babe batted a career .342 and had a pitching record of 94-46. The Hall of Fame took George Herman Ruth in 1936 during the first induction ceremony. He died in 1948 at the age of 53.","used": false
			}, {"question": "What does a 'double header' in baseball mean?","multiple-choice": "Two hits in the same game@_@Two doubles in consecutive games@_@Two doubles in the same game@_@Two games played on the same day","answer": "Two games played on the same day","explanation": "Double headers are generally played because a previous game was cancelled, and had to be rescheduled.","used": false
			}, {"question": "How many players on one soccer team are allowed on the field at the start of the match?","multiple-choice": "10@_@20@_@22@_@11","answer": "11","explanation": "10 players on the field plus 1 goalie equals 11 total players allowed on the field by one side. So, with both teams on the field there should be 22 players not including referees.","used": false
			}, {"question": "Which of the following terms refers to a player who is not likely to score a goal?","multiple-choice": "Striker@_@Stopper@_@Forward@_@Attacking Midfielder","answer": "Stopper","explanation": "A stopper is part of the defense and is normally its last line. This position is normally given to a defender to either guard the most capable scorer on the opposing team or meant to be the last line of defense.","used": false
			}, {"question": "Which country do the club teams Penarol and Nacional play in?","multiple-choice": " Italy@_@Uruguay@_@Brazil@_@England","answer": "Uruguay","explanation": "Penarol and Nacional have a had many great derbies over the years.","used": false
			}
		],
		"pop-culture": [
			{"question": "How do you properly pronounce “5SOS”?","multiple-choice": "five sauce@_@five S-O-S@_@five help@_@five Australian dudes","answer": "five sauce","explanation": "","used": false
			}, {"question": "Which of these artists did NOT have a No. 1 hit?","multiple-choice": "Taylor Swift@_@Meghan Trainor@_@Ariana Grande@_@MAGIC!","answer": "Ariana Grande","explanation": "","used": false
			}, {"question": "Which one of these is NOT the name of robot in Interstellar?","multiple-choice": "CASE@_@TARS@_@REDD@_@KIPP","answer": "REDD","explanation": "","used": false
			}, {"question": "Name the song from these lyrics: “The truck's jacked up, flat bills flipped back / Yeah, you can find us where the party's at.”","multiple-choice": "Luke Bryan/Crash My Party@_@Pitbull & Ke$ha/Timber@_@Florida Georgia Line/This Is How We Roll@_@Cole Swindell/Chillin’ It","answer": "Florida Georgia Line/This Is How We Roll","explanation": "","used": false
			}, {"question": "Winston’s cat, Ferguson, on New Girl is what kind of cat?","multiple-choice": "Bengal@_@Scottish Fold@_@Maine Coon@_@Siamese","answer": "Scottish Fold","explanation": "","used": false
			}, {"question": "Of what nationality is the rock band Volbeat?","multiple-choice": "Canadian@_@Scottish@_@Danish@_@English","answer": "Danish","explanation": "","used": false
			}, {"question": "Which group sang the rock hit \"The High Road\" in 2013?","multiple-choice": "Pop Evil@_@Papa Roach@_@Three Days Grace@_@Otherwise","answer": "Three Days Grace","explanation": "","used": false
			}, {"question": "What kind of love did The Lumineers sing about in their 2013 hit?","multiple-choice": "Crazy@_@Stubborn@_@Sick@_@Foolhardy","answer": "Stubborn","explanation": "","used": false
			}, {"question": "Pitbull and Christina Aguilera partnered on which hit single in 2013?","multiple-choice": "Back In Time@_@Feel This Moment@_@International Love@_@Don't Stop The Party","answer": "Feel This Moment","explanation": "","used": false
			}, {"question": "Which of these bands' music would most fit the categorization of \"rap rock\"?","multiple-choice": "Flyleaf@_@Big Wreck@_@Hollywood Undead@_@Muse","answer": "Hollywood Undead","explanation": "","used": false
			}, {"question": "What is the name of Adam Sandler's production company?","multiple-choice": "Happy Madison@_@Waterboy Productions@_@Just Go With It@_@Grown Up Production","answer": "Happy Madison","explanation": "","used": false
			}, {"question": "The 2013 film \"American Hustle\" takes place in which decade?","multiple-choice": "1970@_@1960@_@1980@_@1990","answer": "1970","explanation": "","used": false
			}, {"question": "What was the name of Thor's mother, who died in \"Thor: The Dark World\"?","multiple-choice": "Fandral@_@Sif@_@Heimdall@_@Frigga","answer": "Frigga","explanation": "","used": false
			}, {"question": "What is the last name of \"Ender\" from \"Ender's Game\"?","multiple-choice": "Arkanian@_@Wiggin@_@Rackham@_@Graff","answer": "Wiggin","explanation": "","used": false
			}, {"question": "Who played Jackie Robinson in the 2013 film \"42\"?","multiple-choice": "Wesley Snipes@_@Chadwick Boseman@_@Dennis Haysbert@_@Lucas Black","answer": "Chadwick Boseman","explanation": "","used": false
			}, {"question": "What company commercial poked fun at people standing in line waiting for an iPhone?","multiple-choice": "Nokia@_@Motorola@_@HTC@_@Samsung","answer": "Samsung","explanation": "","used": false
			}, {"question": "Michael Jackson's hair caught fire during the filming of whose commercial?","multiple-choice": "Mountain Dew@_@Dr. Pepper@_@Pepsi@_@Coke","answer": "Pepsi","explanation": "","used": false
			}, {"question": "What cereal is the \"Breakfast of Champions\"?","multiple-choice": "Cheerios@_@Apple Jacks@_@Wheaties@_@Kix","answer": "Wheaties","explanation": "","used": false
			}, {"question": "Who says \"Sometimes you feel like a nut, sometimes you don't\"?","multiple-choice": "Cadbury@_@Mars@_@Mounds@_@Hersgey","answer": "Mounds","explanation": "","used": false
			}, {"question": "Who performed at halftime of the 2013 Super Bowl?","multiple-choice": "Beyonce@_@Tom Petty@_@Usher@_@Aerosmith","answer": "Beyonce","explanation": "","used": false
			}, {"question": "What company made \"Whassup\" a popular phrase in the early 2000s?","multiple-choice": "Budweiser@_@Burger King@_@Miller Light@_@McDonalds","answer": "Budweiser","explanation": "","used": false
			}, {"question": "Who won the 2014 People's Choice Award for Favorite Female Artist?","multiple-choice": "Katy Perry@_@Demi Lovato@_@Taylor Swift@_@Britney Spears","answer": "Demi Lovato","explanation": "","used": false
			}
		],
		"art": [
			{"question": "Which flowers are closely associated with the painter, Claude Monet?","multiple-choice": "Buttercups@_@Lilacs@_@Water lilies@_@Roses","answer": "Water lilies","explanation": "The magic of water lilies is well known to us from Monet's paintings. They come in shades of white, pink, red, apricot and yellow and add beauty and colour to any body of water from a lake to a small water feature. They range from petite, miniature varieties, through to those with large flowers. Most do well in water about 30 to 60 centimetres deep. Miniature varieties can thrive even in more shallow conditions.","used": false
			}, {"question": "Sunflowers are synonymous with Van Gogh, but where do these flowers originally come from?","multiple-choice": "Southern France@_@The Himalayas@_@Iberian Peninsula@_@Central America","answer": "Central America","explanation": "Sunflowers are first recorded in Mexico around 2600BC. They then appear in Tennessee some 300 years later and were probably introduced to the Mississippi Valley area around the same time, along with maize. When the flowers are in bud the heads follow the sun from East to West, but when they are in full bloom they lose this ability and become fixed, usually facing East. They will grow in any fertile soil that receives full sun and have been known to attain heights of up to twelve feet. Their seeds are a favourite bird food.","used": false
			}, {"question": "Which member of the Beatles, whose own paintings are heavily influenced by nature, has the honour of having had a rose named after him?","multiple-choice": "George Harrison@_@John Lennon@_@Paul McCartney@_@Ringo Starr","answer": "Paul McCartney","explanation": "The 'Paul McCartney Rose' or 'Sweet Lady' was introduced around 1995. It is a large flowered Hybrid Tea rose with medium pink petals. Although an ordinary looking rose, its distinguishing feature is its exceptionally strong fragrance. Since its original cultivation it has won several awards.","used": false
			}, {"question": "If you saw an artist hatching, they are not coming out of an egg, but rather adding what feature to their picture?","multiple-choice": "Texture@_@Contrast@_@Shading@_@Colour","answer": "Shading","explanation": "Hatching is using lines of different size and spacing to create shading or relief in a drawing. There are three kinds of hatching: linear, which uses parallel lines, cross-hatching, which uses perpendicular lines, and contoured, which uses wavy lines. Hatching is uncommon in paintings, but is commonly found in drawing and printmaking.","used": false
			}, {"question": "During which art movement is somebody likely to find a painting that may teach a moral?","multiple-choice": "Impressionism@_@Surrealism@_@Neoclassicism@_@Renaissance","answer": "Neoclassicism","explanation": "In neoclassicism, paintings would often teach a moral or lesson.","used": false
			}, {"question": "Who sculpted 'The Thinker'?","multiple-choice": "Bernini@_@Remington@_@Rodin@_@Michelangelo","answer": "Rodin","explanation": "","used": false
			}, {"question": "Who painted 'Starry Night'?","multiple-choice": "Gauguin@_@Van Gogh@_@Matisse@_@Goya","answer": "Van Gogh","explanation": "","used": false
			}, {"question": "Who painted the Mona Lisa?","multiple-choice": "Michelangelo@_@Rembrandt@_@Leonardo da Vinci@_@Raphael","answer": "Leonardo da Vinci","explanation": "","used": false
			}, {"question": "What artist painted 'The Night Watch'?","multiple-choice": "Rubens@_@Van Eyck@_@Gainsborough@_@Rembrandt","answer": "Rembrandt","explanation": "","used": false
			}, {"question": "What could be one definition of a \"Still Life\" work of art?","multiple-choice": "A painting of inanimate objects@_@A painting of battle scenes@_@A painting of famous people@_@A painting of birds flying in air","answer": "A painting of inanimate objects","explanation": "","used": false
			}, {"question": "What is a pictogram?","multiple-choice": "Symbol used to express an idea@_@The first graphic images used to represent words@_@Represents syllables or basic sounds","answer": "The first graphic images used to represent words","explanation": "","used": false
			}, {"question": "What is kerning?","multiple-choice": "the space between letters@_@the space between lines of text@_@justifying type to the left","answer": "the space between letters","explanation": "","used": false
			}, {"question": "The \"rule\" that is used for good photography composition.","multiple-choice": "centering@_@overlap@_@thirds@_@halves","answer": "thirds","explanation": "","used": false
			}, {"question": "Which color refers to the \"scale\" used to print monochromatic images, a 2012 Liam Neeson movie about a man fighting wolves in the wilderness, and the Havens that JRR Tolkein's characters go off to from Middle Earth?","multiple-choice": "Red@_@Green@_@Gray@_@Blue","answer": "Gray","explanation": "Grayscale means that all colors are printed in black and white,\"The Gray\" was a Liam Neeson movie about a lonely man fighting wolves to survive, and Tolkein sends his Ring-bearer characters and elves off to a place called \"The Grey Havens\".","used": false
			}, {"question": "What color refers to the berets worn by the US Army Special Forces, and superheroes Arrow, Lantern, and Hornet?","multiple-choice": "Green@_@Black@_@Yellow@_@White","answer": "Green","explanation": "The US Army Special Forces are named after their headgear, and Green Hornet, Green Arrow and Green Lantern are superheroes. The Green Hornet is a masked vigilante, the Green Arrow is an archer in the DC comics universe, and Green Lantern is a set of superheroes with rings that generate physical objects - also from the DC universe.","used": false
			}, {"question": "INDIGO. Indigo in the common English language is taken from the Greek \"indikon\", meaning what?","multiple-choice": "Purple@_@Dye@_@Electric@_@Blue","answer": "Dye","explanation": "The Greek \"indikon\" came to mean dye due to the deep blue dye commonly used in Greece which came from India.","used": false
			}, {"question": "What color is represented by #FFFF00","multiple-choice": "Blue@_@Green@_@Purple@_@Yellow","answer": "Yellow","explanation": "","used": false
			}, {"question": "Despite its name, this instrument is the tenor version of the oboe. At one time used mostly in French military music, what is this misnamed instrument?","multiple-choice": "Harp@_@Flute@_@Recorder@_@Tin Whistle","answer": "Flute","explanation": "A 5000-year old Egyptian painting depicts a fox playing a flute. Egyptian flutes were made of cane or metal. The transverse flute, or side-blown flute, has been found depicted on Etruscan tombs and urns. The flute is pitched in the key of C and is considered a woodwind instrument. The piccolo is pitched an octave higher than the flute and is half its size. The fife, smaller than the flute, has a narrower bore and shriller sound. It has been used primarily in marching bands and was used in the British army until the 1890s.","used": false
			}, {"question": "This instrument is one of the oldest and dates back to ancient Egypt. The Pied Piper of folklore used this instrument to lure away children from villages. This instrument is called what?","multiple-choice": "French Horn@_@Chalumeau@_@Cornett@_@English Horn","answer": "English Horn","explanation": "Although the fingering of the English horn, or cor anglais, is the same as the oboe, it is pitched in F. The oboe is pitched in C. It is also 1½ times bigger than the oboe. The cor anglais of the mid 18th century was curved to a crescent or bent at an angle and covered in black leather. The curved end made the instrument easier to hold and to play. The modern cor anglais is straight with a globular bell. Its tone is closer to the oboe d'amore, a larger version of the oboe.","used": false
			}, {"question": "Which double-reed instrument, dating back to the medieval and Renaissance periods, is the predecessor of the oboe?","multiple-choice": "Shawm@_@Lute@_@Flute@_@Pipe Reed","answer": "Shawm","explanation": "The medieval shawm was simply made. It was constructed of wood, made in one piece, with seven finger holes and a thumb hole. The reed was attached to a metal disc and the player placed his lips against it to produce a rather shrill sound. The base of the shawm flared out like a bell. As the instrument developed through the late Middle Ages and Renaissance periods, the reed was designed so that the player could manipulate it with the lips. Due to the shrill sound they produced, shawms were played outdoors at open-air performances.","used": false
			}
			]};
		}
		
		function getOneTriviaQuestion(type){
			var randomNum = Math.floor(Math.random()*triviaQuestions.sports.length);
			triviaQuestions.sports.length;
			
			while(true){
				if(!triviaQuestions.sports[randomNum].used){
					triviaQuestions.sports[randomNum].used = true;
					break;
				}
				randomNum = Math.floor(Math.random()*triviaQuestions.sports.length);
			}
			return triviaQuestions.sports[randomNum];
		}
		
	});
})(jQuery); 