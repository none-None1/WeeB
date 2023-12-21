#include "WeeB.h"
string strip(string x) {
	int i = 0, j = x.size() - 1;
	for (; i < x.size(); i++) {
		if (x[i] == '\t' || x[i] == ' ');
		else break;
	}
	for (; j >= 0; j--) {
		if (x[i] == '\t' || x[i] == ' ');
		else break;
	}
	if (i > j) return "";
	return x.substr(i, j - i + 1);
}
void adderr(vector<generate_error>& err, int errline, string errmsg) {
	generate_error e;
	e.line = errline;
	e.errmsg = errmsg;
}
void indent(string& s, string x,int indentation) {
	for (int i = 0; i < indentation; i++) s += "\t";
	s += x + "\n";
}
bool startwith(string s, string t) {
	return s.substr(0, t.size()) == t;
}
bool exdigit(string s) {
	for (auto i : s) if (i < '0' || i>'9') return false;
	return true;
}
bool excomp(string s) {
	if (s == "=" || s == "<>" || s == ">" || s == "<") return true;
	return false;
}
void splitstr(string s, vector<string>& vals) {
	vals.clear();
	stringstream st(s);
	string k;
	while (st >> k) {
		vals.push_back(k);
	}
}
string generate(string code, generate_flags flags, vector<generate_error> &err ) {
	stringstream s(code);
	string line,result;
	vector<string> lines,vals;
	int indentation = 1;
	if (flags.plus) {
		result += "#include<stdio.h>\n#define x tape[p]\nunsigned char tape[1000000];\nint temp;\nint p=0;\nint main(){\n";
	}
	else {
		result += "#include<stdio.h>\nunsigned char x;\nint temp;\nint main(){\n";
	}
	while (getline(s, line)) {
		lines.push_back(line);
	}
	int lineno = 1;
	for (auto x : lines) {
		string l = strip(x);
		string temp = l;
		transform(l.begin(), l.end(), l.begin(), ::tolower);
		if (l.empty()) {
			++lineno;
			continue;
		}
		if (l == "print") {
			indent(result, "printf(\"%d \",(int)(x));", indentation);
		}
		else if (l == "input") {
			indent(result, "scanf(\"%d\",&temp);", indentation);
			indent(result, "x=temp;", indentation);
		}
		else if (l == "infect person") {
			indent(result, "++x;", indentation);
		}
		else if (l == "deinfect person") {
			indent(result, "--x;", indentation);
		}
		else if (l == "bulk infect") {
			indent(result, "x=getchar();", indentation);
		}
		else if (l == "bulk deinfect") {
			indent(result, "x=(x?1:0);", indentation);
		}
		else if (l == "check number of infections") {
			indent(result, "putchar(x);", indentation);
		}
		else if (l == "do") {
			indent(result, "do{", indentation);
			++indentation;
		}
		else if (l == "else") {
			if(!indentation) adderr(err, lineno, "Else without previous if");
			else{
				--indentation;
				indent(result, "}else{", indentation);
				++indentation;
			}
		}
		else if (l == "loop") {
			if (!indentation) adderr(err, lineno, "Loop does not match do");
			else --indentation, indent(result, "}while(1);", indentation);
		}
		else if (startwith(l, "print ")) {
			string printstring;
			bool quoted = 0;
			for (auto i : temp) {
				if (i == '\"') {
					quoted = !quoted;
				}
				if (i != '\"' && quoted) {
					if (i == '\\') {
						printstring += "\\\\";
					}
					else if (i == '%') {
						printstring += "%%";
					}
					else {
						printstring += i;
					}
				}
			}
			indent(result, "printf(\""+printstring+"\");", indentation);
		}
		else if (l == "next house") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "++p;", indentation);
		}
		else if (l == "previous house") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "--p;", indentation);
		}
		else if (startwith(l,"start epidemic ")) {
			if(flags.comment) indent(result, "// "+l.substr(15), indentation);
		}
		else if (startwith(l, "delevop vaccine ")) {
			if (flags.plus) indent(result, "return 0;", indentation);
			else if (flags.comment) indent(result, "// " + l.substr(16), indentation);
		}
		else if (l == "exit do") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "break;", indentation);
		}
		else if (l == "exit while") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "break;", indentation);
		}
		else if (l == "end if") {
			if (!indentation) adderr(err, lineno, "Unmatched end if");
			else --indentation, indent(result, "}", indentation);
		}
		else if (l == "end while") {
			if (!indentation) adderr(err, lineno, "Unmatched end if");
			else --indentation, indent(result, "}", indentation);
		}
		else if (startwith(l, "reinfect ")) {
			splitstr(l, vals);
			if (vals.size() != 3 || vals[2] != "persons" || !exdigit(vals[1])) {
				adderr(err, lineno, "Syntax error");
			}
			else {
				indent(result, "x=" + vals[1] + ";", indentation);
			}
		}
		else if (startwith(l, "if ")) {
			splitstr(l, vals);
			if (vals.size() != 7 || vals[1] != "number" || vals[2] != "of" || vals[3] != "infections" || !excomp(vals[4]) || !exdigit(vals[5]) || vals[6] != "then") {
				adderr(err, lineno, "Syntax error");
			}
			else {
				string op = vals[4];
				if (op == "<>") op = "!=";
				if (op == "=") op = "==";
				indent(result, "if(x" + op + vals[5] + "){", indentation);
				++indentation;
			}
		}
		else if (startwith(l, "while ")) {
			splitstr(l, vals);
			if (vals.size() != 6 || vals[1] != "number" || vals[2] != "of" || vals[3] != "infections" || !excomp(vals[4]) || !exdigit(vals[5])) {
				adderr(err, lineno, "Syntax error");
			}
			else {
				string op = vals[4];
				if (op == "<>") op = "!=";
				if (op == "=") op = "==";
				indent(result, "if(x" + op + vals[5] + "){", indentation);
				++indentation;
			}
		}
		else if (startwith(l, "loop while ")) {
			splitstr(l, vals);
			if (vals.size() != 7 || vals[2] != "number" || vals[3] != "of" || vals[4] != "infections" || !excomp(vals[5]) || !exdigit(vals[6])) {
				adderr(err, lineno, "Syntax error");
			}
			else {
				string op = vals[4];
				if (op == "<>") op = "!=";
				if (op == "=") op = "==";
				if (!indentation) adderr(err, lineno, "Loop does not match do");
				indent(result, "while(x" + op + vals[5] + ");", indentation);
				--indentation;
			}
		}
		else {
			adderr(err, lineno, "Unrecognized command");
		}
		++lineno;
	}
	indent(result, "return 0;", indentation);
	result += "}";
	return result;
}