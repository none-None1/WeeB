var HEADERS = {"locale.h":"#ifndef ELVM_LIBC_LOCALE_H_\n#define ELVM_LIBC_LOCALE_H_\n\n#define LC_ALL 6\n\nchar* setlocale(int category, const char* locale) {\n  return locale;\n}\n\n#endif  // ELVM_LIBC_LOCALE_H_\n","_raw_print.h":"#ifndef ELVM_LIBC_RAW_PRINT_H_\n#define ELVM_LIBC_RAW_PRINT_H_\n\n#include \"_builtin.h\"\n\nint putchar(int c);\n\nstatic void print_str(const char* p) {\n  for (; *p; p++)\n    putchar(*p);\n}\n\nstatic char* stringify_int(long v, char* p) {\n  *p = '\\0';\n  do {\n    --p;\n    *p = v % 10 + '0';\n    v /= 10;\n  } while (v);\n  return p;\n}\n\nstatic void print_int(long v) {\n  char buf[32];\n  print_str(stringify_int(v, buf + sizeof(buf) - 1));\n}\n\nstatic char* stringify_hex(long v, char* p) {\n  int is_negative = 0;\n  int c;\n  *p = '\\0';\n  if (v < 0) {\n    v = -v;\n    is_negative = 1;\n  }\n  do {\n    --p;\n    c = v % 16;\n    *p = c < 10 ? c + '0' : c - 10 + 'a';\n    v /= 16;\n  } while (v);\n  if (is_negative)\n    *--p = '-';\n  return p;\n}\n\n#endif  // ELVM_LIBC_RAW_PRINT_H_\n","stddef.h":"#ifndef ELVM_LIBC_STDDEF_H_\n#define ELVM_LIBC_STDDEF_H_\n\n#include \"_builtin.h\"\n\n#define NULL 0\n\ntypedef unsigned long size_t;\ntypedef unsigned long ptrdiff_t;\n\n#define offsetof(type, field) ((size_t) &((type *)0)->field)\n\n#endif  // ELVM_LIBC_STDDEF_H_\n","time.h":"#ifndef ELVM_LIBC_TIME_H_\n#define ELVM_LIBC_TIME_H_\n\ntypedef int time_t;\n\n#endif  // ELVM_LIBC_TIME_H_\n","stdlib.h":"#ifndef ELVM_LIBC_STDLIB_H_\n#define ELVM_LIBC_STDLIB_H_\n\n#include <stddef.h>\n#include \"_raw_print.h\"\n#include <ctype.h>\n\n#define EXIT_FAILURE 1\n\nstatic void print_str(const char* p);\n\ntypedef struct {\n  int quot, rem;\n} div_t;\n\nextern int* _edata;\n\nvoid exit(int s);\n\nvoid abort(void) {\n  exit(1);\n}\n\nvoid* malloc(int n) {\n  int* r = _edata;\n  _edata += n;\n  if (r > _edata) {\n    print_str(\"no memory!\\n\");\n    exit(1);\n  }\n  return r;\n}\n\nint* calloc(int n, int s) {\n  return malloc(n * s);\n}\n\nvoid free(void* p) {\n}\n\n// From Bionic:\nlong\nstrtol(const char *nptr, char **endptr, int base)\n{\n  const char *s;\n  long acc, cutoff;\n  int c;\n  int neg, any, cutlim;\n\n  /*\n   * Ensure that base is between 2 and 36 inclusive, or the special\n   * value of 0.\n   */\n  if (base < 0 || base == 1 || base > 36) {\n    if (endptr != 0)\n      *endptr = (char *)nptr;\n    return 0;\n  }\n\n  /*\n   * Skip white space and pick up leading +/- sign if any.\n   * If base is 0, allow 0x for hex and 0 for octal, else\n   * assume decimal; if base is already 16, allow 0x.\n   */\n  s = nptr;\n  do {\n    c = (unsigned char) *s++;\n  } while (isspace(c));\n  if (c == '-') {\n    neg = 1;\n    c = *s++;\n  } else {\n    neg = 0;\n    if (c == '+')\n      c = *s++;\n  }\n  if ((base == 0 || base == 16) &&\n      c == '0' && (*s == 'x' || *s == 'X')) {\n    c = s[1];\n    s += 2;\n    base = 16;\n  }\n  if (base == 0)\n    base = c == '0' ? 8 : 10;\n\n  if (neg) {\n    if (cutlim > 0) {\n      cutlim -= base;\n      cutoff += 1;\n    }\n    cutlim = -cutlim;\n  }\n  for (acc = 0, any = 0;; c = (unsigned char) *s++) {\n    if (isdigit(c))\n      c -= '0';\n    else if (isalpha(c))\n      c -= isupper(c) ? 'A' - 10 : 'a' - 10;\n    else\n      break;\n    if (c >= base)\n      break;\n    if (any < 0)\n      continue;\n    if (neg) {\n      any = 1;\n      acc *= base;\n      acc -= c;\n    } else {\n      any = 1;\n      acc *= base;\n      acc += c;\n    }\n  }\n  if (endptr != 0)\n    *endptr = (char *) (any ? s - 1 : nptr);\n  return (acc);\n}\n\nunsigned long strtoul(const char *nptr, char **endptr, int base) {\n  return strtol(nptr, endptr, base);\n}\n\nlong long strtoll(const char *nptr, char **endptr, int base) {\n  return strtol(nptr, endptr, base);\n}\n\nunsigned long long strtoull(const char *nptr, char **endptr, int base) {\n  return strtol(nptr, endptr, base);\n}\n\nint atoi(const char* s) {\n  int n = 0;\n  unsigned long i = 0;\n  while (s[i] >= '0' && s[i] <= '9') {\n    n = (n << 3) + (n << 1);\n    n += s[i++] - '0';\n  }\n  return n;\n}\n\nchar* getenv(const char* name) {\n  return NULL;\n}\n\nvoid qsort(void* vbase, size_t nmemb, size_t size,\n           int (*compar)(const void*, const void*)) {\n  if (nmemb <= 1)\n    return;\n  char* base = (char*)vbase;\n  char* pivot = base + (nmemb / 2) * size;\n  char* left = base;\n  char* right = base + (nmemb - 1) * size;\n#if 0\n  printf(\"nmemb=%d size=%d\\n\", nmemb, size);\n  for (int i = 0; i < nmemb; i++) {\n    printf(\"%d \", *((int*)base + i));\n  }\n  puts(\"\");\n#endif\n  for (;;) {\n    //printf(\"left=%d right=%d\", left-base, right-base);\n    while (compar(left, pivot) >= 32768)\n      left += size;\n    while ((compar(right, pivot) - 1) < 32768)\n      right -= size;\n    //printf(\" => left=%d right=%d\\n\", left-base, right-base);\n    if (left >= right)\n      break;\n    for (size_t i = 0; i < size; i++) {\n      char tmp = left[i];\n      left[i] = right[i];\n      right[i] = tmp;\n    }\n    if (pivot == left)\n      pivot = right;\n    else if (pivot == right)\n      pivot = left;\n    left += size;\n    right -= size;\n  }\n  //left -= size;\n  right += size;\n  qsort(base, (size_t)(left - base) / size, size, compar);\n  qsort(right, (size_t)(base + nmemb * size - right) / size,\n        size, compar);\n}\n\n#endif  // ELVM_LIBC_STDLIB_H_\n","inttypes.h":"#ifndef ELVM_LIBC_INTTYPES_H_\n#define ELVM_LIBC_INTTYPES_H_\n\n#include <stdint.h>\n\n#endif  // ELVM_LIBC_INTTYPES_H_\n","stdio.h":"#ifndef ELVM_LIBC_STDIO_H_\n#define ELVM_LIBC_STDIO_H_\n\n#include <stddef.h>\n#include <stdarg.h>\n#include \"_raw_print.h\"\n#include <string.h>\n\n#define EOF -1\n\nint getchar(void);\nint putchar(int c);\nint puts(const char* p);\nint printf(const char* fmt, ...);\nint sprintf(char* buf, const char* fmt, ...);\nint snprintf(char* buf, size_t size, const char* fmt, ...);\n\nint puts(const char* p) {\n  print_str(p);\n  putchar('\\n');\n}\n\nint vsnprintf(char* buf, size_t size, const char* fmt, va_list ap) {\n  const char* inp;\n  size_t off = 0;\n  int is_overlow = 0;\n  for (inp = fmt; *inp; inp++) {\n    if (*inp != '%') {\n      if (!is_overlow) {\n        if (off + 1 >= size) {\n          is_overlow = 1;\n          buf[off] = 0;\n        } else {\n          buf[off] = *inp;\n        }\n      }\n      off++;\n      continue;\n    }\n\n    char cur_buf[32];\n    char* cur_p;\n retry:\n    switch (*++inp) {\n      case 'l':\n        goto retry;\n      case 'd':\n      case 'u':\n        cur_p = stringify_int(va_arg(ap, long), cur_buf + sizeof(cur_buf) - 1);\n        break;\n      case 'x':\n        cur_p = stringify_hex(va_arg(ap, long), cur_buf + sizeof(cur_buf) - 1);\n        break;\n      case 's':\n        cur_p = va_arg(ap, char*);\n        break;\n      case 'c':\n        cur_buf[0] = va_arg(ap, char);\n        cur_buf[1] = 0;\n        cur_p = cur_buf;\n        break;\n      case '%':\n        cur_buf[0] = '%';\n        cur_buf[1] = 0;\n        cur_p = cur_buf;\n        break;\n      default:\n        print_int(*inp);\n        print_str(\" in \");\n        print_str(fmt);\n        print_str(\": unknown format!\\n\");\n        exit(1);\n    }\n\n    size_t len = strlen(cur_p);\n    if (!is_overlow) {\n      if (off + len >= size) {\n        is_overlow = 1;\n        buf[off] = 0;\n      } else {\n        strcpy(buf + off, cur_p);\n      }\n    }\n    off += len;\n  }\n  buf[off] = 0;\n  return off;\n}\n\nint vsprintf(char* buf, const char* fmt, va_list ap) {\n  return vsnprintf(buf, 256, fmt, ap);\n}\n\nint snprintf(char* buf, size_t size, const char* fmt, ...) {\n  va_list ap;\n  va_start(ap, fmt);\n  int r = vsnprintf(buf, size, fmt , ap);\n  va_end(ap);\n  return r;\n}\n\nint sprintf(char* buf, const char* fmt, ...) {\n  va_list ap;\n  va_start(ap, fmt);\n  int r = vsprintf(buf, fmt, ap);\n  va_end(ap);\n  return r;\n}\n\nint vprintf(const char* fmt, va_list ap) {\n  char buf[256];\n  int r = vsnprintf(buf, 256, fmt, ap);\n  buf[r] = 0;\n  print_str(buf);\n  return r;\n}\n\nint printf(const char* fmt, ...) {\n  va_list ap;\n  va_start(ap, fmt);\n  int r = vprintf(fmt, ap);\n  va_end(ap);\n  return r;\n}\n\ntypedef char FILE;\nFILE* stdin = (FILE*)1;\nFILE* stdout = (FILE*)1;\nFILE* stderr = (FILE*)1;\n\nint fprintf(FILE* fp, const char* fmt, ...) {\n  va_list ap;\n  va_start(ap, fmt);\n  vprintf(fmt, ap);\n  va_end(ap);\n}\n\nint vfprintf(FILE* fp, const char* fmt, va_list ap) {\n  return vprintf(fmt, ap);\n}\n\nint fileno(FILE* fp) {\n  return 0;\n}\n\nFILE* fopen(const char* filename, const char* mode) {\n  return stdin;\n}\n\nint fclose(FILE* fp) {\n  return 0;\n}\n\nsize_t fwrite(void* ptr, size_t s, size_t n, FILE* fp) {\n  char* str = ptr;\n  size_t l = (int)s * (int)n;\n  for (size_t i = 0; i < l; i++)\n    putchar(str[i]);\n  return l;\n}\n\nint fputs(const char* s, FILE* fp) {\n  print_str(s);\n}\n\nint fgets(char* s, int size, FILE* fp) {\n  for (int i = 0; i < size - 1; i++) {\n    int c = getchar();\n    s[i] = c;\n    if (c == '\\n' || c == EOF) {\n      s[i + 1] = 0;\n      return i;\n    }\n  }\n  s[size - 1] = 0;\n  return size;\n}\n\nstatic int g_ungot = EOF;\nstatic int eof_seen;\n\nint fgetc(FILE* fp) {\n  int r;\n  if (g_ungot == EOF) {\n    // A hack for whitespace, in which getchar after EOF is not\n    // defined well.\n    if (eof_seen)\n      return EOF;\n    r = getchar();\n    eof_seen = r == EOF;\n    return r;\n  }\n  r = g_ungot;\n  g_ungot = EOF;\n  return r;\n}\n\nint getc(FILE* fp) {\n  return fgetc(fp);\n}\n\nint ungetc(int c, FILE* fp) {\n  if (g_ungot == EOF)\n    return g_ungot = c;\n  return EOF;\n}\n\n#endif  // ELVM_LIBC_STDIO_H_\n","libgen.h":"#ifndef ELVM_LIBC_LIBGEN_H_\n#define ELVM_LIBC_LIBGEN_H_\n\n#endif  // ELVM_LIBC_LIBGEN_H_\n","stdint.h":"#ifndef ELVM_LIBC_STDINT_H_\n#define ELVM_LIBC_STDINT_H_\n\ntypedef unsigned char uint8_t;\ntypedef unsigned short uint16_t;\ntypedef unsigned int uint32_t;\ntypedef unsigned long uint64_t;\ntypedef unsigned long uintptr_t;\ntypedef char int8_t;\ntypedef short int16_t;\ntypedef int int32_t;\ntypedef long int64_t;\ntypedef long intptr_t;\ntypedef long time_t;\n\n#endif  // ELVM_LIBC_STDINT_H_\n","math.h":"#ifndef ELVM_LIBC_MATH_H_\n#define ELVM_LIBC_MATH_H_\n\n#endif  // ELVM_LIBC_MATH_H_\n","stdarg.h":"#ifndef ELVM_LIBC_STDARG_H_\n#define ELVM_LIBC_STDARG_H_\n\ntypedef char* va_list;\n#define va_start(ap, last) ap = &last\n#define va_arg(ap, type) *(type*)++ap\n#define va_copy(dest, src) dest = src\n#define va_end(ap)\n\n#endif  // ELVM_LIBC_STDARG_H_\n","unistd.h":"#ifndef ELVM_LIBC_UNISTD_H_\n#define ELVM_LIBC_UNISTD_H_\n\n#include <stddef.h>\n\ntypedef long off_t;\n\n#define PROT_READ 1\n#define PROT_WRITE 2\n#define PROT_EXEC 4\n#define MAP_PRIVATE 2\n#define MAP_ANON 0x20\n\nvoid* mmap(void* addr, size_t length, int prot, int flags,\n           int fd, long offset) {\n  return calloc(length, 2);\n}\n\nvoid munmap(void* addr, size_t length) {\n}\n\nint isatty(int fd) {\n  return 1;\n}\n\n#endif  // ELVM_LIBC_UNISTD_H_\n","ctype.h":"#ifndef ELVM_LIBC_CTYPE_H_\n#define ELVM_LIBC_CTYPE_H_\n\nint isspace(int c) {\n  return (c == '\\f' || c == '\\n' || c == '\\r' ||\n          c == '\\t' || c == '\\v' || c == ' ');\n}\n\nint isdigit(int c) {\n  return '0' <= c && c <= '9';\n}\n\nint isxdigit(int c) {\n  return isdigit(c) || ('a' <= c && c <= 'f') || ('A' <= c && c <= 'F');\n}\n\nint isupper(int c) {\n  return ('A' <= c && c <= 'Z');\n}\n\nint isalpha(int c) {\n  return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');\n}\n\nint isalnum(int c) {\n  return isalpha(c) || isdigit(c);\n}\n\nint isprint(int c) {\n  return isspace(c) || (c >= 32 && c < 127);\n}\n\n#endif  // ELVM_LIBC_CTYPE_H_\n","string.h":"#ifndef ELVM_LIBC_STRING_H_\n#define ELVM_LIBC_STRING_H_\n\n#include <ctype.h>\n#include <stddef.h>\n#include <stdlib.h>\n\nvoid* memset(void* d, int c, size_t n) {\n  size_t i;\n  for (i = 0; i < n; i++) {\n    ((char*)d)[i] = c;\n  }\n  return d;\n}\n\nvoid* memcpy(void* d, const void* s, size_t n) {\n  size_t i;\n  for (i = 0; i < n; i++) {\n    ((char*)d)[i] = ((char*)s)[i];\n  }\n  return d;\n}\n\nsize_t strlen(const char* s) {\n  size_t r;\n  for (r = 0; s[r]; r++) {}\n  return r;\n}\n\nchar* strcat(char* d, const char* s) {\n  char* r = d;\n  for (; *d; d++) {}\n  for (; *s; s++, d++)\n    *d = *s;\n  return r;\n}\n\nchar* strcpy(char* d, const char* s) {\n  char* r = d;\n  for (; *s; s++, d++)\n    *d = *s;\n  *d = 0;\n  return r;\n}\n\nint strcmp(const char* a, const char* b) {\n  for (;*a || *b; a++, b++) {\n    if (*a < *b)\n      return -1;\n    if (*a > *b)\n      return 1;\n  }\n  return 0;\n}\n\nchar* strchr(char* s, int c) {\n  for (; *s; s++) {\n    if (*s == c)\n      return s;\n  }\n  return NULL;\n}\n\nchar* strdup(const char* s) {\n  int l = strlen(s);\n  char* r = malloc(l + 1);\n  strcpy(r, s);\n  return r;\n}\n\n// From Bionic:\nchar *\nstrtok_r(char *s, const char *delim, char **last)\n{\n  const char *spanp;\n  int c, sc;\n  char *tok;\n\n  if (s == NULL && (s = *last) == NULL)\n    return (NULL);\n\n  /*\n   * Skip (span) leading delimiters (s += strspn(s, delim), sort of).\n   */\ncont:\n  c = *s++;\n  for (spanp = delim; (sc = *spanp++) != 0;) {\n    if (c == sc)\n      goto cont;\n  }\n\n  if (c == 0) {\t\t/* no non-delimiter characters */\n    *last = NULL;\n    return (NULL);\n  }\n  tok = s - 1;\n\n  /*\n   * Scan token (scan for delimiters: s += strcspn(s, delim), sort of).\n   * Note that delim must have one NUL; we stop if we see that, too.\n   */\n  for (;;) {\n    c = *s++;\n    spanp = delim;\n    do {\n      if ((sc = *spanp++) == c) {\n        if (c == 0)\n          s = NULL;\n        else\n          s[-1] = '\\0';\n        *last = s;\n        return (tok);\n      }\n    } while (sc != 0);\n  }\n  /* NOTREACHED */\n}\n\n// From Bionic:\n/*\n * This array is designed for mapping upper and lower case letter\n * together for a case independent comparison.  The mappings are\n * based upon ascii character sequences.\n */\nstatic const unsigned char charmap[] = {\n  '\\000', '\\001', '\\002', '\\003', '\\004', '\\005', '\\006', '\\007',\n  '\\010', '\\011', '\\012', '\\013', '\\014', '\\015', '\\016', '\\017',\n  '\\020', '\\021', '\\022', '\\023', '\\024', '\\025', '\\026', '\\027',\n  '\\030', '\\031', '\\032', '\\033', '\\034', '\\035', '\\036', '\\037',\n  '\\040', '\\041', '\\042', '\\043', '\\044', '\\045', '\\046', '\\047',\n  '\\050', '\\051', '\\052', '\\053', '\\054', '\\055', '\\056', '\\057',\n  '\\060', '\\061', '\\062', '\\063', '\\064', '\\065', '\\066', '\\067',\n  '\\070', '\\071', '\\072', '\\073', '\\074', '\\075', '\\076', '\\077',\n  '\\100', '\\141', '\\142', '\\143', '\\144', '\\145', '\\146', '\\147',\n  '\\150', '\\151', '\\152', '\\153', '\\154', '\\155', '\\156', '\\157',\n  '\\160', '\\161', '\\162', '\\163', '\\164', '\\165', '\\166', '\\167',\n  '\\170', '\\171', '\\172', '\\133', '\\134', '\\135', '\\136', '\\137',\n  '\\140', '\\141', '\\142', '\\143', '\\144', '\\145', '\\146', '\\147',\n  '\\150', '\\151', '\\152', '\\153', '\\154', '\\155', '\\156', '\\157',\n  '\\160', '\\161', '\\162', '\\163', '\\164', '\\165', '\\166', '\\167',\n  '\\170', '\\171', '\\172', '\\173', '\\174', '\\175', '\\176', '\\177',\n  '\\200', '\\201', '\\202', '\\203', '\\204', '\\205', '\\206', '\\207',\n  '\\210', '\\211', '\\212', '\\213', '\\214', '\\215', '\\216', '\\217',\n  '\\220', '\\221', '\\222', '\\223', '\\224', '\\225', '\\226', '\\227',\n  '\\230', '\\231', '\\232', '\\233', '\\234', '\\235', '\\236', '\\237',\n  '\\240', '\\241', '\\242', '\\243', '\\244', '\\245', '\\246', '\\247',\n  '\\250', '\\251', '\\252', '\\253', '\\254', '\\255', '\\256', '\\257',\n  '\\260', '\\261', '\\262', '\\263', '\\264', '\\265', '\\266', '\\267',\n  '\\270', '\\271', '\\272', '\\273', '\\274', '\\275', '\\276', '\\277',\n  '\\300', '\\301', '\\302', '\\303', '\\304', '\\305', '\\306', '\\307',\n  '\\310', '\\311', '\\312', '\\313', '\\314', '\\315', '\\316', '\\317',\n  '\\320', '\\321', '\\322', '\\323', '\\324', '\\325', '\\326', '\\327',\n  '\\330', '\\331', '\\332', '\\333', '\\334', '\\335', '\\336', '\\337',\n  '\\340', '\\341', '\\342', '\\343', '\\344', '\\345', '\\346', '\\347',\n  '\\350', '\\351', '\\352', '\\353', '\\354', '\\355', '\\356', '\\357',\n  '\\360', '\\361', '\\362', '\\363', '\\364', '\\365', '\\366', '\\367',\n  '\\370', '\\371', '\\372', '\\373', '\\374', '\\375', '\\376', '\\377',\n};\n\n// From Bionic:\nint\nstrcasecmp(const char *s1, const char *s2)\n{\n  const unsigned char *cm = charmap;\n  const unsigned char *us1 = (const unsigned char *)s1;\n  const unsigned char *us2 = (const unsigned char *)s2;\n\n  while (cm[*us1] == cm[*us2++])\n    if (*us1++ == '\\0')\n      return (0);\n  return (cm[*us1] - cm[*--us2]);\n}\n\n// From Bionic:\nint\nstrncasecmp(const char *s1, const char *s2, size_t n)\n{\n  if (n != 0) {\n    const unsigned char *cm = charmap;\n    const unsigned char *us1 = (const unsigned char *)s1;\n    const unsigned char *us2 = (const unsigned char *)s2;\n\n    do {\n      if (cm[*us1] != cm[*us2++])\n        return (cm[*us1] - cm[*--us2]);\n      if (*us1++ == '\\0')\n        break;\n    } while (--n != 0);\n  }\n  return (0);\n}\n\n// From Bionic:\nchar *\nstrpbrk(const char *s1, const char *s2)\n{\n\tconst char *scanp;\n\tint c, sc;\n\n\twhile ((c = *s1++) != 0) {\n\t\tfor (scanp = s2; (sc = *scanp++) != 0;)\n\t\t\tif (sc == c)\n\t\t\t\treturn ((char *)(s1 - 1));\n\t}\n\treturn (NULL);\n}\n\n#endif  // ELVM_LIBC_STRING_H_\n","setjmp.h":"#ifndef ELVM_LIBC_SETJMP_H_\n#define ELVM_LIBC_SETJMP_H_\n\n#endif  // ELVM_LIBC_SETJMP_H_\n","errno.h":"#ifndef ELVM_LIBC_ERRNO_H_\n#define ELVM_LIBC_ERRNO_H_\n\nint errno;\n\n#endif  // ELVM_LIBC_ERRNO_H_\n","assert.h":"#ifndef ELVM_LIBC_ASSERT_H_\n#define ELVM_LIBC_ASSERT_H_\n\n#include \"_raw_print.h\"\n\nvoid exit(int s);\n\n#define assert(x)                               \\\n  do {                                          \\\n    if (!(x)) {                                 \\\n      print_str(\"assertion failed: \" #x \"\\n\");  \\\n      exit(1);                                  \\\n    }                                           \\\n  } while (0)\n\n#endif  // ELVM_LIBC_ASSERT_H_\n","strings.h":"#ifndef ELVM_LIBC_STRINGS_H_\n#define ELVM_LIBC_STRINGS_H_\n\n#endif  // ELVM_LIBC_STRINGS_H_\n","limits.h":"#ifndef ELVM_LIBC_LIMITS_H_\n#define ELVM_LIBC_LIMITS_H_\n\n#define SIZE_MAX 16777215\n#define INT_MAX 16777215\n#define UINT_MAX 16777215\n#define LONG_MAX 16777215\n#define INT32_MAX 16777215\n#define INT32_MIN 0\n#define UINT16_MAX 16777215\n#define CHAR_BIT 24\n\n#endif  // ELVM_LIBC_LIMITS_H_\n","_builtin.h":"#ifndef ELVM_LIBC_BUILTIN_H_\n#define ELVM_LIBC_BUILTIN_H_\n\ntypedef struct {\n  int quot, rem;\n} _my_div_t;\n\n// Our 8cc doesn't support returning a structure value.\n// TODO: update 8cc.\nvoid my_div(unsigned int a, unsigned int b, _my_div_t* o) {\n  unsigned int d[24];\n  unsigned int r[24];\n  unsigned int i;\n  r[0] = 1;\n  for (i = 0;; i++) {\n    d[i] = b;\n    unsigned int nb = b + b;\n    if (nb > a || nb < b)\n      break;\n    r[i+1] = r[i] + r[i];\n    b = nb;\n  }\n\n  unsigned int q = 0;\n  for (;; i--) {\n    unsigned int v = d[i];\n    if (a >= v) {\n      q += r[i];\n      a -= v;\n    }\n    if (i == 0)\n      break;\n  }\n  o->quot = q;\n  o->rem = a;\n}\n\nstatic int __builtin_mul(int a, int b) {\n  int i, e, v;\n  if (a < b) {\n    v = a;\n    a = b;\n    b = v;\n  }\n  if (b == 1)\n    return a;\n  if (b == 0)\n    return 0;\n  int d[24];\n  int r[24];\n  for (i = 0, e = 1, v = a;; i++) {\n    d[i] = v;\n    r[i] = e;\n    v += v;\n    int ne = e + e;\n    if (ne < e || ne > b)\n      break;\n    e = ne;\n  }\n\n  int x = 0;\n  for (;; i--) {\n    if (b >= r[i]) {\n      x += d[i];\n      b -= r[i];\n    }\n    if (i == 0)\n      break;\n  }\n  return x;\n}\n\nstatic unsigned int __builtin_div(unsigned int a, unsigned int b) {\n  if (b == 1)\n    return a;\n  _my_div_t r;\n  my_div(a, b, &r);\n  return r.quot;\n}\n\nstatic unsigned int __builtin_mod(unsigned int a, unsigned int b) {\n  _my_div_t r;\n  my_div(a, b, &r);\n  return r.rem;\n}\n\nstatic const int __builtin_bits_table[] = {\n  0x800000, 0x400000, 0x200000, 0x100000,\n  0x80000, 0x40000, 0x20000, 0x10000,\n  0x8000, 0x4000, 0x2000, 0x1000,\n  0x800, 0x400, 0x200, 0x100,\n  0x80, 0x40, 0x20, 0x10,\n  0x8, 0x4, 0x2, 0x1,\n};\n\n#define __BUILTIN_TO_BIT(v, t) (v >= t ? (v -= t, 1) : 0)\n\nstatic unsigned int __builtin_and(unsigned int a, unsigned int b) {\n  int r = 0;\n  for (int i = 0; i < 24; i++) {\n    int t = __builtin_bits_table[i];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    int b1 = __BUILTIN_TO_BIT(b, t);\n    if (a1 && b1)\n      r += t;\n  }\n  return r;\n}\n\nstatic unsigned int __builtin_or(unsigned int a, unsigned int b) {\n  int r = 0;\n  for (int i = 0; i < 24; i++) {\n    int t = __builtin_bits_table[i];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    int b1 = __BUILTIN_TO_BIT(b, t);\n    if (a1 || b1)\n      r += t;\n  }\n  return r;\n}\n\nstatic unsigned int __builtin_xor(unsigned int a, unsigned int b) {\n  int r = 0;\n  for (int i = 0; i < 24; i++) {\n    int t = __builtin_bits_table[i];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    int b1 = __BUILTIN_TO_BIT(b, t);\n    if (a1 != b1)\n      r += t;\n  }\n  return r;\n}\n\nstatic unsigned int __builtin_not(unsigned int a) {\n  int r = 0;\n  for (int i = 0; i < 24; i++) {\n    int t = __builtin_bits_table[i];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    if (!a1)\n      r += t;\n  }\n  return r;\n}\n\nstatic unsigned int __builtin_shl(unsigned int a, unsigned int b) {\n  int r = 0;\n  for (int i = b; i < 24; i++) {\n    int t = __builtin_bits_table[i];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    if (a1)\n      r += __builtin_bits_table[i-b];\n  }\n  return r;\n}\n\nstatic unsigned int __builtin_shr(unsigned int a, unsigned int b) {\n  int r = 0;\n  for (int i = b; i < 24; i++) {\n    int t = __builtin_bits_table[i-b];\n    int a1 = __BUILTIN_TO_BIT(a, t);\n    if (a1)\n      r += __builtin_bits_table[i];\n  }\n  return r;\n}\n\n#endif  // ELVM_LIBC_BUILTIN_H_\n","stdbool.h":"#ifndef ELVM_LIBC_STDBOOL_H_\n#define ELVM_LIBC_STDBOOL_H_\n\n#define bool _Bool\n#define true 1\n#define false 0\n#define __bool_true_false_are_defined 1\n\n#endif  // ELVM_LIBC_STDBOOL_H_\n"};