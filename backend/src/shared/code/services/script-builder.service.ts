import { Injectable } from '@nestjs/common';
import { TestCaseDto } from '../../../task/dto/create-task.dto';
import { Language } from '../../../task/types/language';

@Injectable()
export class ScriptBuilderService {
  buildScript(
    language: Language,
    userCode: string,
    testCases: TestCaseDto[],
    funcName: string,
  ): string {
    switch (language) {
      case Language.JS:
        return this.buildJsScript(userCode, testCases, funcName);
      case Language.Python:
        return this.buildPythonScript(userCode, testCases, funcName);
      case Language.CSharp:
        return this.buildCSharpScript(userCode, testCases, funcName);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private buildJsScript(
    userCode: string,
    testCases: TestCaseDto[],
    funcName: string,
  ): string {
    // 1. Sanitize Code for Injection
    // We use JSON.stringify to safely escape newlines, quotes, and backslashes
    // This turns: console.log("hi") -> "console.log(\"hi\")"
    const safeUserCode = JSON.stringify(userCode);

    return `
    (async () => {
      const testCases = ${JSON.stringify(testCases)};
      const results = [];
      const logs = [];
      let solutionError = null;

      // 2. Capture Console Output
      // We capture both log and error to help users debug
      const originalLog = console.log;
      const capture = (...args) => {
        logs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a) : String(a)
        ).join(' '));
      };
      console.log = capture;
      console.error = capture;

      try {
        // 3. Execute User Code
        // We use eval() on the sanitized string. 
        // This puts the function in the current scope so we can call it.
        eval(${safeUserCode});

        // 4. Validate Function
        if (typeof ${funcName} !== 'function') {
           throw new Error("Function '${funcName}' is not defined. Did you use the correct name?");
        }

        // 5. Run Tests
        for (const t of testCases) {
          const caseResult = { 
            input: t.input, 
            expectedOutput: t.expectedOutput, 
            passed: false, 
            actual: null, 
            error: null 
          };

          try {
            // EXECUTION:
            // Spread operator (...) handles arguments: solution(a, b) vs input [1, 2]
            const actual = await ${funcName}(...t.input);
            
            caseResult.actual = actual;

            // COMPARISON:
            // We handle 'undefined' explicitly because JSON.stringify(undefined) is undefined (not null)
            const actualStr = actual === undefined ? 'undefined' : JSON.stringify(actual);
            const expectedStr = t.expectedOutput === undefined ? 'undefined' : JSON.stringify(t.expectedOutput);
            
            caseResult.passed = actualStr === expectedStr;

          } catch (e) {
            caseResult.error = e.message;
            caseResult.passed = false;
          }
          
          results.push(caseResult);
        }

      } catch (e) {
        // Catch Syntax Errors or Top-Level Runtime Errors
        solutionError = e.toString(); 
        if (e.stack) {
            // Add the first line of the stack trace if available for context
            solutionError += ' ' + e.stack.split('\\n')[0];
        }
      }

      // 6. Output Final JSON
      // This matches exactly what your Python runner outputs
      console.log = originalLog;
      console.log(JSON.stringify({
        result: results,
        logs: logs,
        error: solutionError
      }));

    })();
    `;
  }

  private buildPythonScript(
    userCode: string,
    testCases: TestCaseDto[],
    funcName: string,
  ): string {
    // 1. Sanitize: Escape triple quotes in user code to prevent syntax crashes
    const safeUserCode = userCode.replace(/'''/g, "\\'\\'\\'");

    return `
import json, sys, io

# Data setup
test_cases = ${JSON.stringify(testCases)}
results = []
solution_error = None

# Capture stdout
old_stdout = sys.stdout
sys.stdout = io.StringIO()

try:
    # 2. EXECUTE: Use globals() safely
    # We strip the code to prevent indentation errors from template literals
    code_to_run = '''${safeUserCode}'''.strip()
    exec(code_to_run, globals())

    if '${funcName}' not in globals():
        solution_error = "Function '${funcName}' is not defined"
    else:
        func = globals()['${funcName}']
        for t in test_cases:
            case = {"input": t["input"], "expectedOutput": t["expectedOutput"], "passed": False, "actual": None, "error": None}
            try:
                # 3. PASS INPUT: Pass the input exactly as stored (List goes as List)
                actual = func(*t["input"])
                
                # Deep equality check for lists/dicts
                case["actual"] = actual
                case["passed"] = (actual == t["expectedOutput"])
            except Exception as e:
                case["error"] = str(e)
            results.append(case)

except Exception as e:
    solution_error = str(e)

# Restore stdout
logs = sys.stdout.getvalue().splitlines()
sys.stdout = old_stdout

# 4. PRINT: This is the ONLY line your Node app should parse
print(json.dumps({
    "result": results, 
    "logs": logs, 
    "error": solution_error
}))
`;
  }

  public buildCSharpScript(
    userCode: string,
    testCases: TestCaseDto[],
    funcName: string,
  ): string {
    const jsonString = JSON.stringify(testCases);
    const base64Data = Buffer.from(jsonString).toString('base64');

    return `
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Reflection;
using System.Linq;

// ========== USER CODE ==========
public class Solution {
    ${userCode}
}

// ========== RUNNER ==========
public class Program {
    public static void Main() {
        try {
            string base64 = "${base64Data}";
            string jsonString = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            
            // Fix 1: Use a safer TestCase class structure
            var testCases = JsonSerializer.Deserialize<List<TestCase>>(jsonString);
            var results = new List<TestCaseResult>();

            // Fix 2: Better Reflection to find the method (Public or Private, Static or Instance)
            MethodInfo method = typeof(Solution).GetMethod("${funcName}", 
                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static);

            if (method == null) {
                // Return a JSON error immediately
                Console.WriteLine(JsonSerializer.Serialize(new { error = "Method '${funcName}' not found." }));
                return;
            }

            object instance = method.IsStatic ? null : Activator.CreateInstance(typeof(Solution));
            ParameterInfo[] paramInfos = method.GetParameters();

            foreach (var t in testCases) {
                var resultObj = new TestCaseResult();
                resultObj.input = t.input;
                resultObj.expectedOutput = t.expectedOutput;

                try {
                    // Fix 3: Robust Input Parsing
                    // The input is a single JsonElement representing the ARRAY [1, 2]
                    // We must check if the argument count matches
                    if (t.input.ValueKind != JsonValueKind.Array) {
                         throw new Exception("Input must be an array of arguments.");
                    }

                    if (t.input.GetArrayLength() != paramInfos.Length) {
                         throw new Exception($"Expected {paramInfos.Length} arguments, but got {t.input.GetArrayLength()}.");
                    }

                    object[] args = new object[paramInfos.Length];
                    int index = 0;
                    
                    // Iterate manually through the JSON Array
                    foreach (JsonElement element in t.input.EnumerateArray()) {
                        // Deserialize strictly to the types the function expects (int, string, etc.)
                        args[index] = JsonSerializer.Deserialize(element.GetRawText(), paramInfos[index].ParameterType);
                        index++;
                    }

                    // EXECUTE
                    object actualValue = method.Invoke(instance, args);

                    // RESULT COMPARISON
                    object expectedTyped = null;
                    if (t.expectedOutput.ValueKind != JsonValueKind.Null) {
                         expectedTyped = JsonSerializer.Deserialize(
                            t.expectedOutput.GetRawText(), 
                            method.ReturnType
                         );
                    }

                    bool passed = false;
                    if (actualValue == null && expectedTyped == null) passed = true;
                    else if (actualValue != null) passed = actualValue.Equals(expectedTyped);

                    resultObj.actual = actualValue;
                    resultObj.passed = passed;

                } catch (Exception ex) {
                    var inner = ex.InnerException ?? ex;
                    resultObj.passed = false;
                    resultObj.error = inner.Message;
                    resultObj.actual = null;
                }
                results.Add(resultObj);
            }

            Console.WriteLine(JsonSerializer.Serialize(results));
        } 
        catch (Exception globalEx) {
            // This catches compilation/setup errors
            Console.WriteLine(JsonSerializer.Serialize(new { error = globalEx.ToString() }));
        }
    }

    // Input DTO (Raw JSON)
    public class TestCase {
        public JsonElement input { get; set; } // Represents the whole array [1, 2]
        public JsonElement expectedOutput { get; set; }
    }

    // Output DTO (What we send back to Node)
    public class TestCaseResult {
        public JsonElement input { get; set; }
        public JsonElement expectedOutput { get; set; }
        public object actual { get; set; }
        public bool passed { get; set; }
        public string error { get; set; }
    }
}

Program.Main();`;
  }
}
