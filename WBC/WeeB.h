#ifndef WEEB_HEADER
#define WEEB_HEADER
#include<string>
#include<sstream>
#include<iostream>
#include<vector>
#include<algorithm>
#include<cctype>
using std::getline;
using std::string;
using std::stringstream;
using std::vector;
using std::transform;
struct generate_flags {
	bool comment;
	bool plus;
};
struct generate_error {
	int line;
	string errmsg;
};
string generate(string code, generate_flags flags, vector<generate_error>& err);
#endif