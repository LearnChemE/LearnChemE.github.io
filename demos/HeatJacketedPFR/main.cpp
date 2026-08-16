#include "rk45.h"
#include <iostream>

// 1. Define your class
class Calculator {
public:
    Calculator(int baseValue) : base(baseValue) {}
    
    int add(int val) { 
        return base + val; 
    }
    
private:
    int base;
    RK45Solver* solver_;
};

// 2. WebAssembly Bindings (Only compiles when using emcc)
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_class_example) {
    class_<Calculator>("Calculator")
        .constructor<int>()
        .function("add", &Calculator::add);
}
#endif

// 3. Native Entry Point (Ignored by WebAssembly)
#ifndef __EMSCRIPTEN__
int main() {
    std::cout << "[Native C++] Starting native execution..." << std::endl;
    
    Calculator calc(10);
    int result = calc.add(32);
    
    std::cout << "[Native C++] Calculator result: " << result << std::endl;
    return 0;
}
#endif