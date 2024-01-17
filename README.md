# WeeB
 WeeB esoteric language

WeeB, also known as [WeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeBasic](https://esolangs.org/wiki/WeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeBasic), is an esoteric language that is like BASIC and is derived from [Weeeeeeeeeeeeeeeeeeeeeeeeeeeeee](https://esolangs.org/wiki/Weeeeeeeeeeeeeeeeeeeeeeeeeeeeee).

The repository includes WBC, a compiler (transpiler to C) for WeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeBasic and its derivative, WeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeBasic++, and some examples.

## WBC
WBC is the compiler from WeeB/WeeB++ to C, you can use it to compile code, then use a C compiler to compile the generated code.

You can also call WBC from C++ by linking `weebasic.lib (libweebasic.a)` and include `WeeB.h` and call the `generate` function:
```cpp
string generate(string code, generate_flags flags, vector<generate_error>& err);
```
generate_flags can have:
```text
plus: compile with WeeB++ instead of WeeB
comment: Put comments in the original program to the transpiled program
minimize: Minimize the code (Removes indentations and trim off the excess line feeds, thus resulting in shorter code)
```

## Online IDE
An online IDE for WeeB using asm.js

ToDo:
* Add permalinks
You can report bugs or suggestions by posting an issue.