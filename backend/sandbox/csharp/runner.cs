using System;
using System.Text.Json;

class Program {
    static void Main() {
        try {
            string code = Console.In.ReadToEnd();

            // For simplicity, just echo the code.
            // In a real setup, you could compile & run dynamically.
            string output = "Executed C#: " + code.Trim();

            Console.WriteLine(JsonSerializer.Serialize(new {
                result = output,
                logs = Array.Empty<string>(),
                error = (string)null
            }));
        } catch (Exception ex) {
            Console.WriteLine(JsonSerializer.Serialize(new {
                result = (string)null,
                logs = Array.Empty<string>(),
                error = ex.Message
            }));
        }
    }
}
