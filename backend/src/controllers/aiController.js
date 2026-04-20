exports.generateInsights = async (req, res) => {
  try {
    const { companyName } = req.body;
    
    // In a real production scenario with valid keys, you would use the OpenAI SDK here:
    // const completion = await openai.chat.completions.create({...})
    
    // Fallback/Demo Mocking to keep it "OpenAI API Compatible" contextually
    const tips = {
        company: companyName,
        insights: [
          `Focus heavily on System Design for ${companyName}.`,
          `Prepare strong behavioral answers around Leadership Principles.`,
          `Review recent ${companyName} product launches and engineering blogs.`,
          `Practice graph and dynamic programming questions on LeetCode.`
        ],
        mockQuestions: [
          `How would you design a scaled version of ${companyName}'s main product?`,
          `Tell me about a time you had a conflict with a teammate at work.`,
          `Given an array of integers, how would you find the maximum subarray sum?`
        ]
    };
    
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: 'AI processing failed', error: error.message });
  }
};
