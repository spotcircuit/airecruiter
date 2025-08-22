import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { detectReply, extractSentiment, getRecommendedAction } from '@/lib/email-reply-detector';

export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json();
    
    if (!Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Invalid emails data' },
        { status: 400 }
      );
    }

    const results = [];
    
    for (const email of emails) {
      const { 
        sequenceRunId, 
        contactId, 
        subject, 
        content,
        fromEmail,
        receivedAt
      } = email;
      
      // Detect if it's a reply and analyze intent
      const replyAnalysis = detectReply(content);
      const sentiment = extractSentiment(content);
      const recommendedAction = getRecommendedAction(replyAnalysis);
      
      // If it's a reply, update the sequence run
      if (replyAnalysis.isReply && sequenceRunId) {
        // Stop the sequence if needed
        if (replyAnalysis.shouldStopSequence) {
          await query(
            `UPDATE sequence_runs 
             SET status = $1, 
                 stopped_at = CURRENT_TIMESTAMP,
                 stop_reason = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3`,
            [
              replyAnalysis.replyType === 'unsubscribe' ? 'unsubscribed' : 'stopped',
              `Reply detected: ${replyAnalysis.intent}`,
              sequenceRunId
            ]
          );
        }
        
        // Log the reply as an activity
        await query(
          `INSERT INTO activities (
            subject_type, subject_id, type, title, description, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            'contact',
            contactId,
            'email_reply',
            `Reply: ${replyAnalysis.replyType}`,
            replyAnalysis.extractedText?.substring(0, 500),
            JSON.stringify({
              replyType: replyAnalysis.replyType,
              sentiment: sentiment.sentiment,
              confidence: replyAnalysis.confidence,
              suggestedAction: recommendedAction.action
            })
          ]
        );
        
        // Update contact status based on reply type
        if (replyAnalysis.replyType === 'positive') {
          await query(
            `UPDATE contacts 
             SET status = 'interested', 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1`,
            [contactId]
          );
        } else if (replyAnalysis.replyType === 'negative') {
          await query(
            `UPDATE contacts 
             SET status = 'not_interested', 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1`,
            [contactId]
          );
        } else if (replyAnalysis.replyType === 'unsubscribe') {
          await query(
            `UPDATE contacts 
             SET status = 'unsubscribed', 
                 email_opted_out = true,
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1`,
            [contactId]
          );
        }
      }
      
      results.push({
        emailId: email.id,
        fromEmail,
        subject,
        receivedAt,
        analysis: {
          ...replyAnalysis,
          sentiment: sentiment.sentiment,
          sentimentScore: sentiment.score
        },
        recommendedAction,
        sequenceRunStopped: replyAnalysis.shouldStopSequence
      });
    }
    
    return NextResponse.json({
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('Error checking email replies:', error);
    return NextResponse.json(
      { error: 'Failed to check replies' },
      { status: 500 }
    );
  }
}

// GET endpoint to check replies for a specific sequence
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sequenceId = searchParams.get('sequence_id');
    
    if (!sequenceId) {
      return NextResponse.json(
        { error: 'Sequence ID is required' },
        { status: 400 }
      );
    }
    
    // Get all active sequence runs for this sequence
    const activeRuns = await query(
      `SELECT 
        sr.*,
        c.email as contact_email,
        c.first_name,
        c.last_name
       FROM sequence_runs sr
       JOIN contacts c ON sr.contact_id = c.id
       WHERE sr.sequence_id = $1
         AND sr.status = 'active'`,
      [sequenceId]
    );
    
    // Check recent activities for replies
    const recentReplies = await query(
      `SELECT 
        a.*,
        c.email as contact_email,
        c.first_name,
        c.last_name
       FROM activities a
       JOIN contacts c ON a.subject_id = c.id
       WHERE a.subject_type = 'contact'
         AND a.type = 'email_reply'
         AND a.created_at > NOW() - INTERVAL '7 days'
         AND c.id IN (
           SELECT contact_id 
           FROM sequence_runs 
           WHERE sequence_id = $1
         )
       ORDER BY a.created_at DESC`,
      [sequenceId]
    );
    
    return NextResponse.json({
      activeRuns: activeRuns.rows,
      recentReplies: recentReplies.rows,
      stats: {
        totalActive: activeRuns.rowCount,
        totalReplies: recentReplies.rowCount,
        replyRate: activeRuns.rowCount > 0 
          ? (recentReplies.rowCount / activeRuns.rowCount * 100).toFixed(1) + '%'
          : '0%'
      }
    });
  } catch (error) {
    console.error('Error fetching sequence replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}