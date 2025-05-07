import { extractMethodFromCode } from "./utils";

// These tests directly call the real implementation instead of mocking it
describe("extractMethodFromCode", () => {
  it("should extract method code from a class", () => {
    const code = `
      class Rectangle {
        width: number;
        height: number;
        
        constructor(width: number, height: number) {
          this.width = width;
          this.height = height;
        }
        
        area(): number {
          return this.width * this.height;
        }
        
        perimeter(): number {
          return 2 * (this.width + this.height);
        }
      }`;
    
    const result = extractMethodFromCode(code, "area");
    
    // The extracted method should contain the area method code, not the entire class
    expect(result).toContain("area(): number");
    expect(result).toContain("return this.width * this.height");
    expect(result).not.toContain("perimeter");
    expect(result).not.toContain("constructor");
  });

  it("should extract method with a complex signature", () => {
    const code = `
      class ApiClient {
        constructor(private baseUrl: string) {}
        
        async fetchData<T>(endpoint: string, options?: RequestOptions): Promise<T> {
          const url = this.baseUrl + endpoint;
          const response = await fetch(url, options);
          return await response.json();
        }
      }`;
    
    const result = extractMethodFromCode(code, "fetchData");
    
    expect(result).toContain("async fetchData<T>");
    expect(result).toContain("Promise<T>");
    expect(result).toContain("await fetch");
    expect(result).not.toContain("constructor");
  });

  it("should handle method with JSDoc comments", () => {
    const code = `
      class Calculator {
        /**
         * Adds two numbers together
         * @param a First number
         * @param b Second number
         * @returns Sum of the two numbers
         */
        add(a: number, b: number): number {
          return a + b;
        }
      }`;
    
    const result = extractMethodFromCode(code, "add");
    
    expect(result).toContain("add(a: number, b: number): number");
    expect(result).toContain("return a + b");
    // The JSDoc comments are not included in the extracted method
    // This is by design since the comments are handled separately
  });

  it("should return the original code if method is not found", () => {
    const code = `
      class User {
        name: string;
        age: number;
        
        constructor(name: string, age: number) {
          this.name = name;
          this.age = age;
        }
      }`;
    
    const result = extractMethodFromCode(code, "nonExistentMethod");
    
    // Should return the original code unchanged
    expect(result).toBe(code);
  });

  it("should handle nested methods and classes correctly", () => {
    const code = `
      class Outer {
        innerClass = class Inner {
          nestedMethod() {
            return "nested";
          }
        }
        
        outerMethod() {
          return new this.innerClass().nestedMethod();
        }
      }`;
    
    const result = extractMethodFromCode(code, "outerMethod");
    
    expect(result).toContain("outerMethod");
    expect(result).toContain("return new this.innerClass().nestedMethod()");
    expect(result).not.toContain("nestedMethod() {");
  });
});