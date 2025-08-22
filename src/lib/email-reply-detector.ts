// Email reply detection and intent classification

interface ReplyDetectionResult {
  isReply: boolean;
  replyType: 'positive' | 'negative' | 'question' | 'neutral' | 'out-of-office' | 'unsubscribe' | null;
  confidence: number;
  extractedText?: string;
  intent?: string;
  shouldStopSequence: boolean;
  suggestedAction?: string;
}

// Common reply indicators
const REPLY_INDICATORS = [
  // Headers
  /^(Re:|RE:|Fwd:|FWD:|Fw:|FW:)/,
  /^On .+ wrote:$/m,
  /^From:.+$/m,
  /^Sent:.+$/m,
  /^To:.+$/m,
  /^Subject:.+$/m,
  
  // Quote markers
  /^>/m,
  /^>>/m,
  /^\|/m,
  /^---+ Original Message ---+/m,
  /^---+ Forwarded Message ---+/m,
  
  // Common reply phrases
  /thanks for (your email|reaching out|getting in touch)/i,
  /in response to your (email|message)/i,
  /regarding your (email|message|inquiry)/i,
  /following up on/i,
  /as discussed/i,
  /per our conversation/i
];

// Out of office patterns
const OOO_PATTERNS = [
  /out of (the )?office/i,
  /away from (my |the )?office/i,
  /on vacation/i,
  /on leave/i,
  /currently away/i,
  /auto(-)?reply/i,
  /automatic reply/i,
  /will be back/i,
  /return to the office/i,
  /limited access to email/i
];

// Unsubscribe patterns
const UNSUBSCRIBE_PATTERNS = [
  /unsubscribe/i,
  /stop (sending|email)/i,
  /remove me/i,
  /take me off/i,
  /opt out/i,
  /no longer interested/i,
  /don't contact/i,
  /cease communication/i
];

// Positive intent patterns
const POSITIVE_PATTERNS = [
  /interested/i,
  /let's (talk|chat|discuss|connect|meet)/i,
  /schedule a (call|meeting|discussion)/i,
  /available (for|to)/i,
  /sounds good/i,
  /looking forward/i,
  /yes,? (I|we) (would|can|are)/i,
  /definitely/i,
  /absolutely/i,
  /love to (learn|hear|discuss)/i,
  /tell me more/i,
  /send (me |us )?(more )?info/i,
  /what's the next step/i,
  /how do we proceed/i
];

// Negative intent patterns
const NEGATIVE_PATTERNS = [
  /not interested/i,
  /no thanks/i,
  /not a (good |right )?fit/i,
  /not the right time/i,
  /already have/i,
  /happy with (our |my )?current/i,
  /not looking/i,
  /don't need/i,
  /pass on this/i,
  /maybe (in the future|later|down the road)/i,
  /not in the budget/i
];

// Question patterns
const QUESTION_PATTERNS = [
  /\?$/m,
  /^(what|when|where|who|why|how|can you|could you|would you|do you|does|is there)/i,
  /tell me (more )?about/i,
  /can you (explain|clarify|provide|send)/i,
  /what (is|are|does|do)/i,
  /how (much|many|long|does)/i,
  /pricing|cost|budget|investment/i,
  /more (information|details|info)/i
];

/**
 * Detect if an email is a reply and classify its intent
 */
export function detectReply(emailContent: string): ReplyDetectionResult {
  if (!emailContent || emailContent.trim().length === 0) {
    return {
      isReply: false,
      replyType: null,
      confidence: 0,
      shouldStopSequence: false
    };
  }

  const content = emailContent.toLowerCase();
  const lines = emailContent.split('\n');
  
  // Check if it's a reply
  let replyScore = 0;
  for (const pattern of REPLY_INDICATORS) {
    if (pattern.test(emailContent)) {
      replyScore += 0.3;
    }
  }
  
  const isReply = replyScore > 0.5;
  
  // Extract the actual reply text (before quoted content)
  let extractedText = emailContent;
  const quoteIndex = lines.findIndex(line => 
    /^>|^On .+ wrote:|^---+ Original Message/i.test(line)
  );
  if (quoteIndex > 0) {
    extractedText = lines.slice(0, quoteIndex).join('\n').trim();
  }
  
  // Check for out of office
  const isOOO = OOO_PATTERNS.some(pattern => pattern.test(content));
  if (isOOO) {
    return {
      isReply: true,
      replyType: 'out-of-office',
      confidence: 0.95,
      extractedText,
      intent: 'Out of office auto-reply',
      shouldStopSequence: true,
      suggestedAction: 'Pause sequence and set reminder to follow up when they return'
    };
  }
  
  // Check for unsubscribe
  const isUnsubscribe = UNSUBSCRIBE_PATTERNS.some(pattern => pattern.test(content));
  if (isUnsubscribe) {
    return {
      isReply: true,
      replyType: 'unsubscribe',
      confidence: 0.98,
      extractedText,
      intent: 'Unsubscribe request',
      shouldStopSequence: true,
      suggestedAction: 'Stop all sequences and mark as unsubscribed'
    };
  }
  
  // Classify intent
  let positiveScore = 0;
  let negativeScore = 0;
  let questionScore = 0;
  
  for (const pattern of POSITIVE_PATTERNS) {
    if (pattern.test(content)) {
      positiveScore += 1;
    }
  }
  
  for (const pattern of NEGATIVE_PATTERNS) {
    if (pattern.test(content)) {
      negativeScore += 1;
    }
  }
  
  for (const pattern of QUESTION_PATTERNS) {
    if (pattern.test(content)) {
      questionScore += 1;
    }
  }
  
  // Determine reply type based on scores
  let replyType: ReplyDetectionResult['replyType'] = 'neutral';
  let intent = 'General response';
  let shouldStopSequence = false;
  let suggestedAction = 'Review and respond manually';
  let confidence = 0.5;
  
  if (positiveScore > negativeScore && positiveScore > questionScore) {
    replyType = 'positive';
    intent = 'Interested in learning more';
    shouldStopSequence = true;
    suggestedAction = 'Stop sequence and engage personally - they are interested!';
    confidence = Math.min(0.9, 0.5 + positiveScore * 0.15);
  } else if (negativeScore > positiveScore && negativeScore > questionScore) {
    replyType = 'negative';
    intent = 'Not interested at this time';
    shouldStopSequence = true;
    suggestedAction = 'Stop sequence and mark as not interested';
    confidence = Math.min(0.9, 0.5 + negativeScore * 0.15);
  } else if (questionScore > 0) {
    replyType = 'question';
    intent = 'Has questions or needs more information';
    shouldStopSequence = true;
    suggestedAction = 'Stop sequence and answer their questions';
    confidence = Math.min(0.85, 0.5 + questionScore * 0.2);
  }
  
  // If we detected it's a reply but couldn't classify well, still stop the sequence
  if (isReply && replyType === 'neutral') {
    shouldStopSequence = true;
    suggestedAction = 'Stop sequence - manual review needed';
  }
  
  return {
    isReply: isReply || replyScore > 0.3,
    replyType,
    confidence,
    extractedText,
    intent,
    shouldStopSequence,
    suggestedAction
  };
}

/**
 * Extract the sender's sentiment from the reply
 */
export function extractSentiment(emailContent: string): {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
} {
  const content = emailContent.toLowerCase();
  
  const positiveWords = [
    'great', 'excellent', 'wonderful', 'fantastic', 'amazing',
    'interested', 'excited', 'love', 'perfect', 'yes',
    'absolutely', 'definitely', 'thanks', 'appreciate'
  ];
  
  const negativeWords = [
    'not', 'no', 'never', 'unfortunately', 'unable',
    'cannot', 'won\'t', 'wouldn\'t', 'don\'t', 'doesn\'t',
    'disappointed', 'frustrated', 'unhappy', 'bad'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of positiveWords) {
    if (content.includes(word)) {
      positiveCount++;
    }
  }
  
  for (const word of negativeWords) {
    if (content.includes(word)) {
      negativeCount++;
    }
  }
  
  const totalWords = content.split(/\s+/).length;
  const positiveRatio = positiveCount / Math.max(totalWords, 1);
  const negativeRatio = negativeCount / Math.max(totalWords, 1);
  
  if (positiveRatio > negativeRatio * 1.5) {
    return {
      sentiment: 'positive',
      score: Math.min(1, positiveRatio * 10)
    };
  } else if (negativeRatio > positiveRatio * 1.5) {
    return {
      sentiment: 'negative',
      score: Math.min(1, negativeRatio * 10)
    };
  }
  
  return {
    sentiment: 'neutral',
    score: 0.5
  };
}

/**
 * Check if sequence should continue based on reply
 */
export function shouldContinueSequence(reply: ReplyDetectionResult): boolean {
  return !reply.shouldStopSequence && !reply.isReply;
}

/**
 * Get recommended next action based on reply
 */
export function getRecommendedAction(reply: ReplyDetectionResult): {
  action: string;
  priority: 'high' | 'medium' | 'low';
  template?: string;
} {
  if (!reply.isReply) {
    return {
      action: 'Continue sequence as planned',
      priority: 'low'
    };
  }
  
  switch (reply.replyType) {
    case 'positive':
      return {
        action: 'Schedule a call or meeting',
        priority: 'high',
        template: 'Thanks for your interest! I\'d love to discuss this further. Are you available for a brief call this week?'
      };
      
    case 'negative':
      return {
        action: 'Mark as not interested and stop outreach',
        priority: 'medium',
        template: 'Thank you for your response. I\'ll make sure we don\'t reach out again. Best of luck!'
      };
      
    case 'question':
      return {
        action: 'Answer their questions promptly',
        priority: 'high',
        template: 'Thanks for your questions! Let me provide you with more details...'
      };
      
    case 'out-of-office':
      return {
        action: 'Pause and retry when they return',
        priority: 'low'
      };
      
    case 'unsubscribe':
      return {
        action: 'Remove from all sequences immediately',
        priority: 'high'
      };
      
    default:
      return {
        action: reply.suggestedAction || 'Review manually',
        priority: 'medium'
      };
  }
}