# Main target: build both native and wasm
all: native wasm

# Compilers
CC = emcc
CXX = em++
NATIVE_CC = g++

SOURCE_DIR = src/wasm
TARGET_NAME = sediment
OUTPUT_FILE = $(SOURCE_DIR)/$(TARGET_NAME).js
TEST_EXE = test.out

# Source lists
C_SOURCES = $(wildcard $(SOURCE_DIR)/*.c)
CXX_SOURCES = $(wildcard $(SOURCE_DIR)/*.cpp)

# Produce separate object filenames for native and wasm builds to avoid collisions
NATIVE_OBJS = $(C_SOURCES:.c=.native.o) $(CXX_SOURCES:.cpp=.native.o)
WASM_OBJS   = $(C_SOURCES:.c=.wasm.o)   $(CXX_SOURCES:.cpp=.wasm.o)
WASM_OBJS  := $(filter-out $(SOURCE_DIR)/test.wasm.o, $(WASM_OBJS))

# Libraries and flags
LIBS = -lm #-pthread -fopenmp

# Emscripten flags
CFLG = -O3 -Wall --emit-tsd sediment.d.ts
SFLG = --bind \
	-s EXPORT_ES6=1 \
	-s EXPORT_NAME=createSedimentModule \
	-s MODULARIZE=1 \
	-s ERROR_ON_UNDEFINED_SYMBOLS=1 \
	-s ASSERTIONS=1

# Native flags
NATIVE_CFLAGS = -O3 -Wall -std=c++17
NATIVE_LDFLAGS = -O3

.PHONY: all native wasm clean

# Top-level targets
native: $(TEST_EXE)
wasm: $(OUTPUT_FILE)

# Link rules
$(TEST_EXE): $(NATIVE_OBJS)
	$(NATIVE_CC) $(NATIVE_LDFLAGS) -o $@ $^ $(LIBS)

$(OUTPUT_FILE): $(WASM_OBJS)
	$(CXX) -o $@ $^ $(LIBS) $(CFLG) $(SFLG)

# Compile rules for native (.native.o)
%.native.o: %.c
	$(NATIVE_CC) $(NATIVE_CFLAGS) -c $< -o $@ $(LIBS)

%.native.o: %.cpp
	$(NATIVE_CC) $(NATIVE_CFLAGS) -c $< -o $@ $(LIBS)

# Compile rules for wasm (.wasm.o)
%.wasm.o: %.c %.h
	$(CC) -c $< -o $@ $(CFLG)

%.wasm.o: %.cpp %.h
	$(CXX) -c $< -o $@ $(CFLG)

clean:
	rm -f $(OUTPUT_FILE) $(SOURCE_DIR)/$(TARGET_NAME).d.ts $(SOURCE_DIR)/$(TARGET_NAME).wasm
	rm -f $(NATIVE_OBJS) $(WASM_OBJS) $(TEST_EXE)