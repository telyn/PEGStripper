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

	var print = function() {
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
		switch(c) {
			case '{':
				if(inQuotes || inRegex) {
					print(c);
				} else {
					if(input[i-1] == "!" || input[i-1] == "&") {
						output += "{}";
					}
					depth++;
				}
				break;
			case '}':
				if(inQuotes || inRegex) {
					print(c);
				} else {
					depth--;
				}
				break;
			case '"':
				if(!(escaping || inSingleQuotes)) {
					inDoubleQuotes = !inDoubleQuotes;
				}
				print(c);
				break;
			case "\'":
				if(!(escaping || inDoubleQuotes)) {
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
					if(!options.strip_comments) {
						output += c;
					}
				} else if(inComment && input[i-1] == '*') {
					inComment = false;
					if(!options.strip_comments) {
						output += c;
					}
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
	return output;
}