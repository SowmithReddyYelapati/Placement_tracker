const KNOWLEDGE_BASE = {
  google: {
    insights: [
      "Emphasizes algorithmic creativity—find optimal solutions for unique, complex problems.",
      "Googleyness matters: show Intellectual Humility and Navigating Ambiguity.",
      "Expect questions with novel twists—practice reasoning through unfamiliar constraints.",
      "Strong focus on clear communication of your thought process during coding."
    ],
    mockQuestions: [
      "Given a graph, find the shortest path between nodes while accounting for varying edge costs.",
      "How would you design a distributed cache system for Google Search results?",
      "Tell me about a time you had to make a technical decision without all the information."
    ]
  },
  amazon: {
    insights: [
      "Deeply focus on the 16 Leadership Principles (LPs)—they are high-stakes here.",
      "Behavioral interviews use the STAR method—prepare stories that align with specific LPs.",
      "Technical focus on scalability, availability, and 'Frugality' in design.",
      "Expect 'Tell me about a time...' questions for every round."
    ],
    mockQuestions: [
      "Tell me about a time you had to dive deep into a problem that wasn't immediately obvious.",
      "Design a seat reservation system for Amazon's internal auditorium.",
      "How would you handle a situation where you disagree with your manager's technical direction?"
    ]
  },
  meta: {
    insights: [
      "Focus on high-speed execution—ability to write production-ready code quickly is key.",
      "Strong emphasis on Data Structures and Algorithms with optimal time complexity.",
      "System Design often focuses on massive-scale social media features.",
      "Culture of 'Move Fast'—demonstrate ability to learn and iterate rapidly."
    ],
    mockQuestions: [
      "Implement a highly efficient LRU cache from scratch.",
      "Design a news feed system that can handle 2 billion active users.",
      "Describe a complex project where you had to make a trade-off between speed and quality."
    ]
  },
  nvidia: {
    insights: [
      "Heavy domain knowledge: GPU architecture, parallel computing, and CUDA are critical.",
      "Strong focus on low-level system optimization and AI/ML hardware acceleration.",
      "Demonstrate passion for high-performance computing and the future of AI.",
      "Expect detailed questions on memory management and concurrency."
    ],
    mockQuestions: [
      "Explain the difference between shared memory and global memory in a GPU context.",
      "How would you optimize a GEMM (General Matrix Multiply) operation for Tensor Cores?",
      "Tell me about a technical challenge you faced while working with concurrent systems."
    ]
  },
  palantir: {
    insights: [
      "Famous for the 'Decomposition' interview—breaking down ambiguous, real-world problems.",
      "Values deep analytical thinking over rote memorization of algorithms.",
      "Expect questions about structuring projects to analyze complex, unstructured datasets.",
      "Show proficiency in handling large-scale data integration and security."
    ],
    mockQuestions: [
      "We have an ambiguous dataset of global logistics. How would you structure an analysis project?",
      "How would you ensure data privacy while building a multi-tenant analytics platform?",
      "Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder."
    ]
  },
  openai: {
    insights: [
      "Extremely selective—expects deep technical expertise in ML and systems.",
      "Interviews often include debugging neural network code or discussing research papers.",
      "Show understanding of LLM architectures, fine-tuning, and deployment challenges.",
      "Demonstrate alignment with the mission of building safe and beneficial AGI."
    ],
    mockQuestions: [
      "Discuss the trade-offs between different attention mechanisms in Transformer models.",
      "Debug this snippet of PyTorch code that is failing to converge during training.",
      "How would you approach evaluating the safety and bias of a newly trained model?"
    ]
  }
};

exports.generateInsights = async (req, res) => {
  try {
    const { companyName } = req.body;
    const lowerName = companyName.toLowerCase();
    
    let result = KNOWLEDGE_BASE[lowerName];
    
    if (!result) {
      // Fallback/Generic Logic
      result = {
        insights: [
          `Focus on the core products and mission statement of ${companyName}.`,
          `Prepare strong behavioral answers using the STAR method for ${companyName}.`,
          `Review ${companyName}'s engineering blog for recent technical developments.`,
          `Master fundamental Data Structures and Algorithms related to ${companyName}'s domain.`
        ],
        mockQuestions: [
          `Why do you want to work at ${companyName} specifically?`,
          `How would you improve ${companyName}'s flagship product?`,
          `Tell me about a time you failed and what you learned from it.`
        ]
      };
    }
    
    res.json({
      company: companyName,
      insights: result.insights,
      mockQuestions: result.mockQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'AI processing failed', error: error.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { query } = req.body;
    const lowerQuery = query.toLowerCase();
    
    // Detailed knowledge mapping
    const patterns = [
      {
        keys: ['recent', 'applications', 'track'],
        answer: "You can view your latest status in the 'Applications' tab. I've noticed you're currently in the 'Interview' stage for some roles. Make sure to review the specific company notes before your session!"
      },
      {
        keys: ['coding', 'rounds', 'technical', 'practice'],
        answer: "For coding rounds, focus on your top 5 Data Structures: Arrays, Strings, Hashing, Linked Lists, and Trees. Remember to always explain your time and space complexity (Big O)."
      },
      {
        keys: ['behavioral', 'star', 'soft skills'],
        answer: "Use the STAR method (Situation, Task, Action, Result) for behavioral questions. Focus on stories where you demonstrated leadership, dealt with conflict, or learned from a failure."
      },
      {
        keys: ['resume', 'tips', 'cv'],
        answer: "Keep your resume to 1 page if you have <5 years of experience. Use strong action verbs (e.g., 'Engineered', 'Optimized', 'Architected') and quantify your results with numbers."
      },
      {
        keys: ['hello', 'hi', 'hey'],
        answer: "Hello! I'm your Placement Intelligence Assistant. I can help you with interview prep, resume strategy, or tracking your application pipeline. What's on your mind?"
      }
    ];

    let answer = "";
    
    // Try to find a matched pattern
    const match = patterns.find(p => p.keys.some(k => lowerQuery.includes(k)));
    
    if (match) {
      answer = match.answer;
    } else {
      // Contextual matching for companies
      if (lowerQuery.includes('google')) answer = "Google prioritizes 'Googleyness' (intellectual humility & navigating ambiguity) and algorithmic creativity. Brush up on your Graph algorithms!";
      else if (lowerQuery.includes('amazon')) answer = "Amazon's 16 Leadership Principles are the backbone of their interview process. Prepare 2 STAR stories for every principle!";
      else if (lowerQuery.includes('meta')) answer = "Meta values speed and efficiency. Practice implementing production-ready solutions to common DSA problems in under 30 minutes.";
      else if (lowerQuery.includes('nvidia')) answer = "Nvidia is deep into CUDA and parallel computing. Be ready to discuss GPU architecture and low-level optimizations.";
      else if (lowerQuery.includes('openai')) answer = "OpenAI looks for deep ML intuition. Focus on Transformers, scaling laws, and model safety discussions.";
      else {
        const fallbacks = [
          "That's a great question. In the context of placements, I recommend focusing on consistent problem-solving and refining your elevator pitch.",
          "Interesting point. Have you checked the 'Intelligence' tab lately? It shows your current success patterns.",
          "I'm training my neural network on that specific topic. In the meantime, I suggest preparing a strong 'Tell me about yourself' answer.",
          "Success in placements often comes down to persistence. Keep tracking your applications and iterating on your resume!"
        ];
        answer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    }
    
    res.json({ answer: `[Neural Intelligence] ${answer}` });
  } catch (error) {
    res.status(500).json({ message: 'AI Chat failed', error: error.message });
  }
};
