// Test suite for AI endpoints
const fs = require('fs');
const path = require('path');

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

// Test resume parser
async function testResumeParser() {
  log('\n📄 Testing Resume Parser...', 'blue');
  
  // Create a test resume
  const testResume = `
John Doe
john.doe@example.com
(555) 123-4567
San Francisco, CA

SENIOR SOFTWARE ENGINEER

PROFESSIONAL SUMMARY
Experienced software engineer with 8 years of experience building scalable web applications.
Expertise in React, Node.js, Python, and cloud technologies.

EXPERIENCE

Senior Software Engineer - Tech Corp (2020-Present)
- Led development of microservices architecture
- Implemented CI/CD pipelines
- Mentored junior developers

Software Engineer - StartupXYZ (2016-2020)
- Built REST APIs using Node.js and Express
- Developed React components for customer dashboard
- Worked with PostgreSQL and MongoDB databases

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB

EDUCATION
BS Computer Science - UC Berkeley (2016)
`;

  // Save as text file
  const testFile = path.join(__dirname, 'test-resume.txt');
  fs.writeFileSync(testFile, testResume);
  
  try {
    const formData = new FormData();
    const file = new Blob([testResume], { type: 'text/plain' });
    formData.append('resume', file, 'test-resume.txt');
    
    const response = await fetch(`${BASE_URL}/api/parse-resume`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok && result.email) {
      log('✅ Resume Parser: SUCCESS', 'green');
      log(`   Found: ${result.firstName} ${result.lastName} - ${result.email}`, 'green');
      log(`   Skills: ${result.skills?.slice(0, 5).join(', ')}`, 'green');
    } else {
      log('❌ Resume Parser: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
    }
    
    return response.ok;
  } catch (error) {
    log('❌ Resume Parser: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  } finally {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
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
    } else {
      log('❌ Job Description Generator: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
    }
    
    return response.ok;
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
    } else {
      log('❌ Boolean Generator: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
    }
    
    return response.ok;
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
    } else {
      log('❌ Semantic Search: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
    }
    
    return response.ok;
  } catch (error) {
    log('❌ Semantic Search: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
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
    } else {
      log('❌ Database Connection: FAILED', 'red');
      log(`   Error: ${result.error || 'Unknown error'}`, 'red');
    }
    
    return response.ok;
  } catch (error) {
    log('❌ Database Connection: ERROR', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n🚀 Starting AI Endpoint Tests...', 'yellow');
  log('================================', 'yellow');
  
  const results = {
    database: await testDatabaseConnection(),
    resumeParser: await testResumeParser(),
    jobDescription: await testJobDescriptionGenerator(),
    booleanQuery: await testBooleanGenerator(),
    semanticSearch: await testSemanticSearch()
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
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('❌ Server is not running!', 'red');
    log('Please start the server with: npm run dev', 'yellow');
    process.exit(1);
  }
  
  await runTests();
})();