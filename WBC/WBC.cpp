#include "WBC.h"
#include<fstream>
#include<set>
#include<string>
using namespace std;
set<string> args;
int main(int argc, char* argv[])
{
	for (int i = 1; i < argc; i++) args.insert(string(argv[i]));
	if (args.count("-h")) {
		cout << "WBC - WeeB/WeeB++ compiler (transpiler to C)\nArguments:\n\t-h Help\n\t-p --plus Compile with WeeB++\n-c --comment Copy comments in program to output file\n\t-o Output file, default is standard output\nExamples:\n\tHelp: wbc -h\n\tTranspile WeeB program 1.wb to 1.c: wbc 1.wb -o 1.c\n\tTranspile WeeB++ program 1.wbp to 1.c: wbc 1.wbp -o 1.c";
		return 0;
	}
	if (argc < 2) {
		cerr << "Expected file name\nPass '-h' argument for help\n";
		return 1;
	}
	generate_flags gf;
	gf.comment = args.count("-c") || args.count("--comment");
	gf.plus = args.count("-p") || args.count("--plus");
	vector<generate_error> err;
	ifstream fi(argv[1]);
	if (!fi) {
		cerr << "Failed to open input file " << argv[1] << "\n";
		return 1;
	}
	string code;
	char c;
	while (fi.get(c)) code += c;
	string result = generate(code, gf, err);
	if (err.size()) {
		for (auto i : err) {
			cerr << "Line: " << i.line << "\tError: " << i.errmsg << "\n";
		}
		cerr << "Failed to compile\n";
		return 1;
	}
	else {
		cerr << "Compilation was successful\n";
		if (args.count("-o")) {
			for (int i = 2; i < argc; i++) {
				if (string(argv[i]) == "-o") {
					if (i == argc - 1) {
						cerr << "Did not specify output file\n";
						return 1;
					}
					ofstream fo(argv[i + 1]);
					if (!fo) {
						cerr << "Failed to open output file " << argv[i + 1] << "\n";
						return 1;
					}
					fo << result << "\n";
				}
			}
		}
		else {
			cout << result << "\n";
		}
	}
	return 0;
}
