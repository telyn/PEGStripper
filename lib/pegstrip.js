module.exports = function(input,options) {
	var output = "";

	if(options == undefined) {
		options = {};
	}

	var depth = 0;
	var inQuotes = false;
	var inDoubleQuotes = false;
	var inSingleQuotes = false;
	var inRegex = false;
	var inComment = false;
	var escaping = false;
	var escapePos = -1;

	var debug_entries = [];

	var print = function(c) {
		if(inComment && options.strip_comments) {
			return;
		}
		if(depth == 0) {
			output += c;
		}
	}

	for(var i = 0; i < input.length ; i++) {
		var c = input[i];
		inQuotes = inDoubleQuotes || inSingleQuotes;
		
		if(options.debug) {
			debug_entries.push({char: c, at_beginning: {depth: depth, inQ: inQuotes, inDQ: inDoubleQuotes, inSQ: inSingleQuotes, inR: inRegex, inC: inComment, escaping: escaping, escapePos: escapePos}});
		}

		switch(c) {
			case '{':
				if(inQuotes || inRegex) {
					print(c);
				} else {
					if(input[i-1] == "!" || input[i-1] == "&") {
						print("{}"); 
					}
					depth++;
				}
				break;
			case '}':
				if(inQuotes || inRegex) {
					print(c);
				} else {
					depth--;
					if(depth < 0) depth=0;
				}
				break;
			case '"':
				if(!(escaping || inSingleQuotes || inRegex)) {
					inDoubleQuotes = !inDoubleQuotes;
				}
				print(c);
				break;
			case "\'":
				if(!(escaping || inDoubleQuotes || inRegex)) {
					inSingleQuotes = !inSingleQuotes;
				}
				print(c);
				break;
			case '\\':
				if(inQuotes || inRegex) {
					escaping = !escaping;
					escapePos = i;
				}
				print(c);
				break;
			case '[':
				if(!inQuotes) {
					inRegex = true;
				}
				print(c);
				break;
			case ']':
				if(inRegex && !escaping) {
					inRegex = false;
				}
				print(c);
				break;
			case '/':
				if(!inComment && input[i+1] == '*') {
					inComment = true;
					print(c);
				} else if(inComment && input[i-1] == '*') {
					inComment = false;
					print(c);
				} else {
					print(c);
				}

			 	break;

			default:
				print(c);
				break;
		}
		if(escapePos == i-1) {
			escaping = false;
		}	
	}
	if(options.debug) {
		return debug_entries.map(JSON.stringify).join("\r\n");
	}
	return output;
}