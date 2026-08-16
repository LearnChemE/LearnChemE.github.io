# Compilers
CXX_NATIVE = g++       # Or clang++
CXX_WASM = emcc

# Source and Output Targets
SRC = main.cpp
TARGET_NATIVE = app_native
TARGET_WASM = main.js

# Flags
CXXFLAGS_NATIVE = -g -std=c++17
CXXFLAGS_WASM = -O3 -std=c++17 \
                --bind \
                -s WASM=1 \
                -s NO_EXIT_RUNTIME=1

# Default rule builds both
all: native wasm

# Rule for native executable
native: $(SRC)
	$(CXX_NATIVE) $(SRC) $(CXXFLAGS_NATIVE) -o $(TARGET_NATIVE)

# Rule for WebAssembly module
wasm: $(SRC)
	$(CXX_WASM) $(SRC) $(CXXFLAGS_WASM) -o $(TARGET_WASM)

# Clean up generated files
clean:
	rm -f $(TARGET_NATIVE) $(TARGET_WASM) main.wasm