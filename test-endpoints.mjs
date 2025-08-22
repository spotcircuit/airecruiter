#!/usr/bin/env node

// Test suite for AI endpoints - Node.js version
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test database connection
async function testDatabaseConnection() {
  log('\n🗄️  Testing Database Connection...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/candidates`);
    const result = await response.json();
    
    if (response.ok) {
      log('✅ Database Connection: SUCCESS', 'green');
      log(`   Found ${result.candidates?.length || 0} candidates in database`, 'green');
      return true;
    } else {
      log('❌ Database Connection: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Database Connection: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Test job description generator
async function testJobDescriptionGenerator() {
  log('\n💼 Testing Job Description Generator...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate-job-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        experienceLevel: 'senior'
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.description) {
      log('✅ Job Description Generator: SUCCESS', 'green');
      log(`   Generated ${result.description.length} characters`, 'green');
      log(`   Preview: ${result.description.substring(0, 100)}...`, 'green');
      return true;
    } else {
      log('❌ Job Description Generator: FAILED', 'red');
      log(`   Status: ${response.status}`, 'red');
      log(`   Error: ${result.error || JSON.stringify(result)}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Job Description Generator: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Test boolean query generator
async function testBooleanGenerator() {
  log('\n🔍 Testing Boolean Query Generator...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate-boolean`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: ['React', 'Node.js', 'TypeScript'],
        jobTitle: 'Full Stack Developer',
        yearsExperience: 5,
        location: 'San Francisco'
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.query) {
      log('✅ Boolean Generator: SUCCESS', 'green');
      log(`   Query: ${result.query.substring(0, 150)}...`, 'green');
      return true;
    } else {
      log('❌ Boolean Generator: FAILED', 'red');
      log(`   Status: ${response.status}`, 'red');
      log(`   Error: ${result.error || JSON.stringify(result)}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Boolean Generator: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Test semantic search
async function testSemanticSearch() {
  log('\n🤖 Testing Semantic Candidate Search...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/candidates/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'React developer with AWS experience',
        useSemanticSearch: true,
        limit: 10
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      log('✅ Semantic Search: SUCCESS', 'green');
      log(`   Found ${result.candidates?.length || 0} candidates`, 'green');
      if (result.candidates?.length > 0) {
        const candidate = result.candidates[0];
        log(`   Top match: ${candidate.first_name} ${candidate.last_name} - Score: ${candidate.similarity_score?.toFixed(2) || 'N/A'}`, 'green');
      }
      return true;
    } else {
      log('❌ Semantic Search: FAILED', 'red');
      log(`   Status: ${response.status}`, 'red');
      log(`   Error: ${result.error || JSON.stringify(result)}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Semantic Search: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Test simple text search
async function testSimpleSearch() {
  log('\n🔎 Testing Simple Candidate Search...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/candidates/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'engineer',
        useSemanticSearch: false,
        limit: 10
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      log('✅ Simple Search: SUCCESS', 'green');
      log(`   Found ${result.candidates?.length || 0} candidates`, 'green');
      return true;
    } else {
      log('❌ Simple Search: FAILED', 'red');
      log(`   Error: ${result.error || JSON.stringify(result)}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Simple Search: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Check if OpenAI is configured
async function checkOpenAIConfig() {
  log('\n🔑 Checking OpenAI Configuration...', 'blue');
  
  // Try a simple API call
  try {
    const response = await fetch(`${BASE_URL}/api/generate-boolean`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: ['test'],
        jobTitle: 'test'
      })
    });
    
    const result = await response.json();
    
    if (response.status === 401 || result.error?.includes('API key')) {
      log('❌ OpenAI API Key not configured', 'red');
      log('   Please add OPENAI_API_KEY to your .env.local file', 'yellow');
      return false;
    }
    
    log('✅ OpenAI API Key configured', 'green');
    return true;
  } catch (error) {
    log('⚠️  Could not verify OpenAI configuration', 'yellow');
    return true; // Continue with tests
  }
}

// Main test runner
async function runTests() {
  log('\n🚀 Starting AI Endpoint Tests...', 'yellow');
  log('================================', 'yellow');
  
  // Check OpenAI first
  const openAIConfigured = await checkOpenAIConfig();
  
  const results = {
    database: await testDatabaseConnection(),
    simpleSearch: await testSimpleSearch(),
    jobDescription: openAIConfigured ? await testJobDescriptionGenerator() : false,
    booleanQuery: openAIConfigured ? await testBooleanGenerator() : false,
    semanticSearch: openAIConfigured ? await testSemanticSearch() : false
  };
  
  log('\n================================', 'yellow');
  log('📊 Test Results Summary:', 'yellow');
  
  const passed = Object.values(results).filter(r => r).length;
  const failed = Object.values(results).filter(r => !r).length;
  
  Object.entries(results).forEach(([name, passed]) => {
    log(`   ${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASSED' : 'FAILED'}`, passed ? 'green' : 'red');
  });
  
  log('\n================================', 'yellow');
  log(`Total: ${passed} passed, ${failed} failed`, failed > 0 ? 'red' : 'green');
  
  if (failed > 0) {
    log('\n⚠️  Some tests failed. Please check:', 'yellow');
    log('1. Is the Next.js server running? (npm run dev)', 'yellow');
    log('2. Is the database connected and tables created?', 'yellow');
    log('3. Are the OpenAI API keys configured in .env.local?', 'yellow');
    log('4. Check the server console for detailed error messages', 'yellow');
  } else {
    log('\n🎉 All tests passed!', 'green');
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Run the tests
const serverRunning = await checkServer();

if (!serverRunning) {
  log('❌ Server is not running!', 'red');
  log('Please start the server with: npm run dev', 'yellow');
  process.exit(1);
}

await runTests();