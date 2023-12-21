cmake_minimum_required (VERSION 3.8)

if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

project ("WBC")
add_library(weebasic STATIC "WeeB.cpp" "WeeB.h")
add_executable (wbc "WBC.cpp" "WBC.h" "WeeB.cpp")
target_link_libraries(wbc weebasic)
if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET wbc PROPERTY CXX_STANDARD 11)
endif()