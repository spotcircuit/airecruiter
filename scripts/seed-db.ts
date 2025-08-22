import { query } from '../src/lib/db';
import { faker } from '@faker-js/faker';

// Install faker if needed: npm install -D @faker-js/faker

async function seedDatabase() {
  console.log('🌱 Seeding database with demo data...');
  
  try {
    // Clear existing data (in reverse order of dependencies)
    await query('DELETE FROM screening_responses');
    await query('DELETE FROM screening_questions');
    await query('DELETE FROM sequence_runs');
    await query('DELETE FROM sequences');
    await query('DELETE FROM activities');
    await query('DELETE FROM submissions');
    await query('DELETE FROM candidates');
    await query('DELETE FROM jobs');
    await query('DELETE FROM deals');
    await query('DELETE FROM contacts');
    await query('DELETE FROM companies');
    await query('DELETE FROM icps');
    await query('DELETE FROM email_templates');
    
    console.log('✅ Cleared existing data');
    
    // Seed Companies (20)
    const companies = [];
    const companyData = [
      { name: 'TechCorp Solutions', industry: 'Technology', size: '51-200', growth_stage: 'series-b', hiring_urgency: 'high' },
      { name: 'FinanceHub Inc', industry: 'Finance', size: '201-500', growth_stage: 'growth', hiring_urgency: 'medium' },
      { name: 'HealthTech Innovations', industry: 'Healthcare', size: '11-50', growth_stage: 'series-a', hiring_urgency: 'high' },
      { name: 'EduLearn Platform', industry: 'Education', size: '51-200', growth_stage: 'seed', hiring_urgency: 'low' },
      { name: 'GreenEnergy Systems', industry: 'Energy', size: '501-1000', growth_stage: 'enterprise', hiring_urgency: 'medium' },
      { name: 'RetailFlow Commerce', industry: 'Retail', size: '201-500', growth_stage: 'growth', hiring_urgency: 'high' },
      { name: 'CloudScale Infrastructure', industry: 'Technology', size: '1001+', growth_stage: 'enterprise', hiring_urgency: 'high' },
      { name: 'DataMind Analytics', industry: 'Technology', size: '11-50', growth_stage: 'series-a', hiring_urgency: 'medium' },
      { name: 'SecureNet Systems', industry: 'Cybersecurity', size: '51-200', growth_stage: 'series-b', hiring_urgency: 'high' },
      { name: 'BioPharm Innovations', industry: 'Healthcare', size: '201-500', growth_stage: 'growth', hiring_urgency: 'low' },
      { name: 'LogiChain Solutions', industry: 'Logistics', size: '101-200', growth_stage: 'series-b', hiring_urgency: 'medium' },
      { name: 'SmartHome Tech', industry: 'Technology', size: '11-50', growth_stage: 'seed', hiring_urgency: 'high' },
      { name: 'AdTech Dynamics', industry: 'Marketing', size: '51-200', growth_stage: 'series-a', hiring_urgency: 'medium' },
      { name: 'FoodTech Express', industry: 'Food & Beverage', size: '201-500', growth_stage: 'growth', hiring_urgency: 'high' },
      { name: 'AI Ventures', industry: 'Technology', size: '1-10', growth_stage: 'seed', hiring_urgency: 'low' },
      { name: 'PropTech Solutions', industry: 'Real Estate', size: '51-200', growth_stage: 'series-b', hiring_urgency: 'medium' },
      { name: 'GameStudio Pro', industry: 'Entertainment', size: '101-200', growth_stage: 'series-a', hiring_urgency: 'high' },
      { name: 'InsureTech Plus', industry: 'Insurance', size: '201-500', growth_stage: 'growth', hiring_urgency: 'medium' },
      { name: 'TravelTech Hub', industry: 'Travel', size: '11-50', growth_stage: 'seed', hiring_urgency: 'low' },
      { name: 'MediaStream Networks', industry: 'Media', size: '501-1000', growth_stage: 'enterprise', hiring_urgency: 'high' }
    ];
    
    for (const data of companyData) {
      const result = await query(
        `INSERT INTO companies (name, domain, industry, size, location, growth_stage, hiring_urgency, partner_status, signals) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          data.name,
          data.name.toLowerCase().replace(/\s+/g, '') + '.com',
          data.industry,
          data.size,
          faker.location.city() + ', ' + faker.location.state(),
          data.growth_stage,
          data.hiring_urgency,
          ['lead', 'prospect', 'active'][Math.floor(Math.random() * 3)],
          JSON.stringify({
            tech_stack: ['React', 'Node.js', 'AWS', 'PostgreSQL'].slice(0, Math.floor(Math.random() * 4) + 1),
            hiring_signals: Math.random() > 0.5,
            recent_funding: Math.random() > 0.7
          })
        ]
      );
      companies.push({ id: result.rows[0].id, ...data });
    }
    console.log(`✅ Created ${companies.length} companies`);
    
    // Seed Contacts (50)
    const contacts = [];
    for (let i = 0; i < 50; i++) {
      const companyIndex = Math.floor(Math.random() * companies.length);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const companyDomain = companies[companyIndex].name.toLowerCase().replace(/\s+/g, '') + '.com';
      
      const result = await query(
        `INSERT INTO contacts (company_id, first_name, last_name, email, title, phone, linkedin_url, is_primary) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          companies[companyIndex].id,
          firstName,
          lastName,
          firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@' + companyDomain,
          faker.person.jobTitle(),
          faker.phone.number(),
          'https://linkedin.com/in/' + firstName.toLowerCase() + lastName.toLowerCase(),
          i % 5 === 0 // Every 5th contact is primary
        ]
      );
      contacts.push({ id: result.rows[0].id, company_id: companies[companyIndex].id });
    }
    console.log(`✅ Created ${contacts.length} contacts`);
    
    // Seed Deals (15)
    const deals = [];
    const dealStages = ['prospect', 'discovery', 'proposal', 'won', 'lost'];
    for (let i = 0; i < 15; i++) {
      const company = companies[i];
      const stage = dealStages[Math.floor(Math.random() * dealStages.length)];
      
      const result = await query(
        `INSERT INTO deals (company_id, name, stage, value, probability, next_step) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          company.id,
          `Recruitment Partnership - ${company.name}`,
          stage,
          Math.floor(Math.random() * 100000) + 10000,
          stage === 'won' ? 100 : stage === 'lost' ? 0 : Math.floor(Math.random() * 80) + 20,
          faker.lorem.sentence()
        ]
      );
      deals.push({ id: result.rows[0].id, company_id: company.id });
    }
    console.log(`✅ Created ${deals.length} deals`);
    
    // Seed Jobs (6)
    const jobs = [];
    const jobTitles = [
      'Senior Software Engineer',
      'Product Manager',
      'Data Scientist',
      'DevOps Engineer',
      'UX Designer',
      'Marketing Manager'
    ];
    
    for (let i = 0; i < 6; i++) {
      const company = companies[i];
      const result = await query(
        `INSERT INTO jobs (company_id, title, department, location, location_type, employment_type, experience_level, salary_min, salary_max, status, urgency, openings, jd_text) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
        [
          company.id,
          jobTitles[i],
          ['Engineering', 'Product', 'Data', 'Operations', 'Design', 'Marketing'][i],
          faker.location.city() + ', ' + faker.location.state(),
          ['remote', 'hybrid', 'onsite'][Math.floor(Math.random() * 3)],
          'full-time',
          ['senior', 'mid', 'senior', 'senior', 'mid', 'mid'][i],
          [120000, 110000, 130000, 115000, 95000, 85000][i],
          [180000, 160000, 190000, 165000, 130000, 120000][i],
          'published',
          ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          Math.floor(Math.random() * 3) + 1,
          faker.lorem.paragraphs(3)
        ]
      );
      jobs.push({ id: result.rows[0].id, company_id: company.id, title: jobTitles[i] });
    }
    console.log(`✅ Created ${jobs.length} jobs`);
    
    // Seed Candidates (120)
    const candidates = [];
    const skills = {
      'Senior Software Engineer': ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      'Product Manager': ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Roadmap Planning'],
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics', 'R'],
      'DevOps Engineer': ['Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Docker', 'Jenkins'],
      'UX Designer': ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe XD'],
      'Marketing Manager': ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media']
    };
    
    for (let i = 0; i < 120; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const jobType = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const candidateSkills = skills[jobType];
      
      const result = await query(
        `INSERT INTO candidates (first_name, last_name, email, phone, location, current_title, current_company, years_experience, skills, source, expected_salary_min, expected_salary_max) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
          firstName,
          lastName,
          firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@example.com',
          faker.phone.number(),
          faker.location.city() + ', ' + faker.location.state(),
          faker.person.jobTitle(),
          faker.company.name(),
          Math.floor(Math.random() * 15) + 1,
          candidateSkills,
          ['linkedin', 'indeed', 'referral', 'website'][Math.floor(Math.random() * 4)],
          Math.floor(Math.random() * 50000) + 80000,
          Math.floor(Math.random() * 50000) + 130000
        ]
      );
      candidates.push({ 
        id: result.rows[0].id, 
        name: firstName + ' ' + lastName,
        skills: candidateSkills 
      });
    }
    console.log(`✅ Created ${candidates.length} candidates`);
    
    // Seed Submissions (50)
    for (let i = 0; i < 50; i++) {
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const candidate = candidates[Math.floor(Math.random() * candidates.length)];
      const matchScore = Math.floor(Math.random() * 40) + 60; // 60-100 score
      
      try {
        await query(
          `INSERT INTO submissions (job_id, candidate_id, match_score, status, stage, match_reasons) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            job.id,
            candidate.id,
            matchScore,
            ['draft', 'sent', 'interview', 'offer', 'rejected'][Math.floor(Math.random() * 5)],
            ['new', 'screening', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'][Math.floor(Math.random() * 7)],
            JSON.stringify([
              { reason: 'Skills match', weight: 0.4 },
              { reason: 'Experience level', weight: 0.3 },
              { reason: 'Location match', weight: 0.2 },
              { reason: 'Salary expectations', weight: 0.1 }
            ])
          ]
        );
      } catch (err) {
        // Skip duplicates
      }
    }
    console.log(`✅ Created ~50 submissions`);
    
    // Seed Email Templates
    const templates = [
      {
        name: 'Initial Outreach',
        subject: 'Partnership Opportunity with {{company_name}}',
        body: 'Hi {{first_name}},\n\nI noticed {{company_name}} is growing rapidly...',
        category: 'outreach'
      },
      {
        name: 'Follow Up',
        subject: 'Following up on recruitment partnership',
        body: 'Hi {{first_name}},\n\nI wanted to follow up on my previous email...',
        category: 'outreach'
      },
      {
        name: 'Candidate Screening',
        subject: 'Exciting opportunity at {{company_name}}',
        body: 'Hi {{candidate_name}},\n\nWe have an exciting {{job_title}} role...',
        category: 'screening'
      }
    ];
    
    for (const template of templates) {
      await query(
        `INSERT INTO email_templates (name, subject, body, category, is_active) 
         VALUES ($1, $2, $3, $4, $5)`,
        [template.name, template.subject, template.body, template.category, true]
      );
    }
    console.log(`✅ Created ${templates.length} email templates`);
    
    // Seed Sequences
    const sequenceResult = await query(
      `INSERT INTO sequences (name, description, channel, is_active, steps) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        'BD Outreach Campaign',
        'Standard 3-step outreach sequence for new prospects',
        'email',
        true,
        JSON.stringify([
          { order: 1, delay_days: 0, template: { subject: 'Partnership Opportunity', body: 'Initial outreach...' } },
          { order: 2, delay_days: 3, template: { subject: 'Following up', body: 'Follow up message...' } },
          { order: 3, delay_days: 7, template: { subject: 'Final check-in', body: 'Final message...' } }
        ])
      ]
    );
    console.log('✅ Created email sequence');
    
    // Seed ICPs
    await query(
      `INSERT INTO icps (name, industry, geography, company_size_min, company_size_max, tech_keywords, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'Tech Startups',
        'Technology',
        'United States',
        50,
        500,
        ['React', 'Node.js', 'AWS', 'Python'],
        true
      ]
    );
    console.log('✅ Created ICP profile');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${companies.length} companies`);
    console.log(`   - ${contacts.length} contacts`);
    console.log(`   - ${deals.length} deals`);
    console.log(`   - ${jobs.length} jobs`);
    console.log(`   - ${candidates.length} candidates`);
    console.log(`   - ~50 submissions`);
    console.log(`   - ${templates.length} email templates`);
    console.log(`   - 1 sequence`);
    console.log(`   - 1 ICP profile`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✅ Seed script completed!');
    process.exit(0);
  });
}

export default seedDatabase;