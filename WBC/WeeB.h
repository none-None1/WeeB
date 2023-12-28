#ifndef WEEB_HEADER
#define WEEB_HEADER
#include<string>
#include<sstream>
#include<iostream>
#include<vector>
#include<algorithm>
#include<cctype>
#include<stack>
using std::getline;
using std::string;
using std::stringstream;
using std::vector;
using std::transform;
using std::stack;
struct generate_flags {
	bool comment;
	bool plus;
	bool minimize;
	bool accept_elvm;
};
struct generate_error {
	int line;
	string errmsg;
};
string generate(string code, generate_flags flags, vector<generate_error>& err);
#endif