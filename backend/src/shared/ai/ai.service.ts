import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_KEY'),
    });
  }

  async generateHint(
    taskTitle: string,
    taskDescription: string,
    userCode: string,
    failureContext: {
      input?: any;
      expected?: any;
      actual?: any;
      error?: string; // Runtime error message
    },
  ): Promise<string> {
    try {
      // 1. Construct the "Tutor" Persona
      const systemPrompt = `
        You are a friendly and encouraging coding tutor.
        A student is stuck on a programming task.
        
        GOAL: Help them fix their error without giving the full solution.
        
        GUIDELINES:
        - If there is a Syntax/Runtime Error: Explain what the error message means in simple terms.
        - If there is a Logic Error (Wrong Output): Ask a guiding question to help them find the bug.
        - Keep it short (max 3 sentences).
        - DO NOT write the corrected code block.
      `;

      // 2. Build the specific context based on failure type
      let errorDetails = '';

      if (failureContext.error) {
        errorDetails = `
        The code crashed with this error:
        "${failureContext.error}"
        `;
      } else {
        errorDetails = `
        The code ran but failed a test case.
        Input: ${JSON.stringify(failureContext.input)}
        Expected Output: ${JSON.stringify(failureContext.expected)}
        Actual User Output: ${JSON.stringify(failureContext.actual)}
        `;
      }

      const userPrompt = `
        Task: "${taskTitle}"
        Instructions: ${taskDescription}

        Student's Code:
        \`\`\`javascript
        ${userCode}
        \`\`\`

        ${errorDetails}

        Provide a helpful hint.
      `;

      // 3. Call OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // or 'gpt-3.5-turbo' to save money
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      });

      return (
        response.choices[0].message.content || 'Keep trying, you are close!'
      );
    } catch (error) {
      console.error('AI Error:', error);
      throw new InternalServerErrorException(
        'AI tutor is currently unavailable.',
      );
    }
  }

  async generateCodeReview(
    taskTitle: string,
    taskDescription: string,
    userCode: string,
    language: string,
  ): Promise<string> {
    try {
      // 1. Construct the "Senior Engineer" Persona
      const systemPrompt = `
        You are a strict but helpful Senior Software Engineer conducting a code review.
        The student's code has ALREADY PASSED all unit tests. It is functionally correct.

        GOAL: Teach the student how to make their code "Production Ready".

        GUIDELINES:
        - Do not check for bugs (it works). Check for CLEAN CODE.
        - Focus on: Variable Naming, Indentation, Time Complexity (Big O), and Language-Specific Best Practices.
        - Be concise.
        - Use the following Markdown structure for your response:

        ### 🔍 Code Quality
        * [Point 1]
        * [Point 2]

        ### ⏱️ Complexity
        * [Time/Space complexity analysis]

        ### 💡 Pro Tip
        [One specific, actionable tip to improve this specific solution]
      `;

      // 2. Build the context
      const userPrompt = `
        Task: "${taskTitle}"
        Instructions: ${taskDescription}
        Language: ${language}

        Student's Solution:
        \`\`\`${language}
        ${userCode}
        \`\`\`

        Review this code for style and efficiency.
      `;

      // 3. Call OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // GPT-4 is much better at "Code Review" than 3.5
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5, // Lower temperature for more analytical/consistent results
      });

      return (
        response.choices[0].message.content ||
        'Great job! The code looks clean.'
      );
    } catch (error) {
      console.error('AI Code Review Error:', error);
      // Fallback message so the user still sees their success screen without the review
      return 'Code review is currently unavailable, but great job on passing the tests!';
    }
  }
}
