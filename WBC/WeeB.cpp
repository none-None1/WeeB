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
	err.push_back(e);
}
void indent(string& s, string x,int indentation,bool minimize) {
	if (minimize) {
		s += x;
		return;
	}
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
		if (!flags.minimize) {
			if(flags.accept_elvm) result += "#include<stdio.h>\n#define x tape[p]\nunsigned char tape[10000];\nint temp;\nint p=0;\n#include<ctype.h>\nint readint(){\n\tchar c;\n\tint r=0;\n\twhile(isspace(c=getchar()));\n\tr=c-48;\n\twhile(isdigit(c=getchar()))r=r*10+c-48;\n\treturn r;\n}\nint main(){\n";
			else result += "#include<stdio.h>\n#define x tape[p]\nunsigned char tape[1000000];\nint temp;\nint p=0;\nint main(){\n";
		}
		else {
			if(flags.accept_elvm) result += "#include<stdio.h>\n#include<ctype.h>\n#define x tape[p]\nunsigned char tape[10000];int temp;int p=0;int readint(){char c;int r=0;while(isspace(c=getchar()));r=c-48;while(isdigit(c=getchar()))r=r*10+c-48;return r;}int main(){";
			else result += "#include<stdio.h>\n#define x tape[p]\nunsigned char tape[1000000];int temp;int p=0;int main(){";
		}
	}
	else {
		if (!flags.minimize) result += "#include<stdio.h>\nunsigned char x;\nint temp;\nint main(){\n";
		else result += "#include<stdio.h>\nunsigned char x;int temp;int main(){";
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
			indent(result, "printf(\"%d \",(int)(x));", indentation, flags.minimize);
		}
		else if (l == "input") {
			indent(result, (flags.accept_elvm ? "temp=readint();" : "scanf(\"%d\",&temp);"), indentation, flags.minimize);
			indent(result, "x=temp;", indentation, flags.minimize);
		}
		else if (l == "infect person") {
			indent(result, (flags.accept_elvm? "x=x+1;": "++x;"), indentation, flags.minimize);
		}
		else if (l == "deinfect person") {
			indent(result, (flags.accept_elvm ? "x=x-1;" : "--x;"), indentation, flags.minimize);
		}
		else if (l == "bulk infect") {
			indent(result, "x=getchar();", indentation, flags.minimize);
		}
		else if (l == "bulk deinfect") {
			indent(result, "x=(x?1:0);", indentation, flags.minimize);
		}
		else if (l == "check number of infections") {
			indent(result, "putchar(x);", indentation, flags.minimize);
		}
		else if (l == "do") {
			indent(result, "do{", indentation, flags.minimize);
			++indentation;
		}
		else if (l == "else") {
			if(!indentation) adderr(err, lineno, "Else without previous if");
			else{
				--indentation;
				indent(result, "}else{", indentation, flags.minimize);
				++indentation;
			}
		}
		else if (l == "loop") {
			if (!indentation) adderr(err, lineno, "Loop does not match do");
			else --indentation, indent(result, "}while(1);", indentation, flags.minimize);
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
			indent(result, "printf(\""+printstring+"\");", indentation, flags.minimize);
		}
		else if (l == "next house") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "++p;", indentation, flags.minimize);
		}
		else if (l == "previous house") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "--p;", indentation, flags.minimize);
		}
		else if (startwith(l,"start epidemic ")) {
			if(flags.comment) indent(result, "// "+l.substr(15), indentation, flags.minimize);
		}
		else if (startwith(l, "delevop vaccine ")) {
			if (flags.plus) indent(result, "return 0;", indentation, flags.minimize);
			else if (flags.comment) indent(result, "// " + l.substr(16), indentation, flags.minimize);
		}
		else if (l == "exit do") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "break;", indentation, flags.minimize);
		}
		else if (l == "exit while") {
			if (!flags.plus) adderr(err, lineno, "This feature is only usable in WeeB++");
			else indent(result, "break;", indentation, flags.minimize);
		}
		else if (l == "end if") {
			if (!indentation) adderr(err, lineno, "Unmatched end if");
			else --indentation, indent(result, "}", indentation, flags.minimize);
		}
		else if (l == "end while") {
			if (!indentation) adderr(err, lineno, "Unmatched end if");
			else --indentation, indent(result, "}", indentation, flags.minimize);
		}
		else if (startwith(l, "reinfect ")) {
			splitstr(l, vals);
			if (vals.size() != 3 || vals[2] != "persons" || !exdigit(vals[1])) {
				adderr(err, lineno, "Syntax error");
			}
			else {
				indent(result, "x=" + vals[1] + ";", indentation, flags.minimize);
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
				indent(result, "if(x" + op + vals[5] + "){", indentation, flags.minimize);
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
				indent(result, "if(x" + op + vals[5] + "){", indentation, flags.minimize);
				++indentation;
			}
		}
		else if (startwith(l, "loop while ")) {
			splitstr(l, vals);
			if (vals.size() != 7 || vals[2] != "number" || vals[3] != "of" || vals[4] != "infections" || !excomp(vals[5]) || !exdigit(vals[6])) {
				adderr(err, lineno, "Syntax error");
			}
			else {
				string op = vals[5];
				if (op == "<>") op = "!=";
				if (op == "=") op = "==";
				if (!indentation) adderr(err, lineno, "Loop does not match do");
				else --indentation,indent(result, "}while(x" + op + vals[6] + ");", indentation, flags.minimize);
			}
		}
		else {
			adderr(err, lineno, "Unrecognized command");
		}
		++lineno;
	}
	indent(result, "return 0;", indentation, flags.minimize);
	result += "}";
	return result;
}