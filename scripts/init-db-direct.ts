import { query } from '../src/lib/db';

async function initDatabase() {
  console.log('🚀 Initializing database with direct queries...');
  
  try {
    // Drop existing tables if they exist (in reverse order of dependencies)
    console.log('Dropping existing tables...');
    const dropTables = [
      'DROP TABLE IF EXISTS screening_responses CASCADE',
      'DROP TABLE IF EXISTS screening_questions CASCADE',
      'DROP TABLE IF EXISTS email_templates CASCADE',
      'DROP TABLE IF EXISTS sequence_runs CASCADE',
      'DROP TABLE IF EXISTS sequences CASCADE',
      'DROP TABLE IF EXISTS activities CASCADE',
      'DROP TABLE IF EXISTS submissions CASCADE',
      'DROP TABLE IF EXISTS candidates CASCADE',
      'DROP TABLE IF EXISTS jobs CASCADE',
      'DROP TABLE IF EXISTS deals CASCADE',
      'DROP TABLE IF EXISTS contacts CASCADE',
      'DROP TABLE IF EXISTS companies CASCADE',
      'DROP TABLE IF EXISTS icps CASCADE',
    ];
    
    for (const sql of dropTables) {
      await query(sql);
    }
    
    // Drop existing types
    console.log('Dropping existing types...');
    await query('DROP TYPE IF EXISTS deal_stage CASCADE');
    await query('DROP TYPE IF EXISTS job_status CASCADE');
    await query('DROP TYPE IF EXISTS submission_status CASCADE');
    await query('DROP TYPE IF EXISTS activity_type CASCADE');
    await query('DROP TYPE IF EXISTS sequence_channel CASCADE');
    await query('DROP TYPE IF EXISTS sequence_run_state CASCADE');
    await query('DROP TYPE IF EXISTS partner_status CASCADE');
    
    // Create extensions
    console.log('Creating extensions...');
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await query('CREATE EXTENSION IF NOT EXISTS "vector"');
    
    // Create enums
    console.log('Creating enum types...');
    await query("CREATE TYPE deal_stage AS ENUM ('prospect', 'discovery', 'proposal', 'won', 'lost')");
    await query("CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed')");
    await query("CREATE TYPE submission_status AS ENUM ('draft', 'sent', 'interview', 'offer', 'rejected')");
    await query("CREATE TYPE activity_type AS ENUM ('email', 'note', 'call', 'status', 'meeting', 'task')");
    await query("CREATE TYPE sequence_channel AS ENUM ('email', 'sms', 'linkedin')");
    await query("CREATE TYPE sequence_run_state AS ENUM ('pending', 'sent', 'replied', 'stopped', 'completed')");
    await query("CREATE TYPE partner_status AS ENUM ('lead', 'prospect', 'active', 'inactive', 'churned')");
    
    // Create companies table
    console.log('Creating companies table...');
    await query(`
      CREATE TABLE companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE,
        industry VARCHAR(100),
        size VARCHAR(50),
        location VARCHAR(255),
        headquarters VARCHAR(255),
        description TEXT,
        signals JSONB DEFAULT '{}',
        partner_status partner_status DEFAULT 'lead',
        hiring_urgency VARCHAR(50),
        hiring_volume INTEGER,
        growth_stage VARCHAR(50),
        funding_amount DECIMAL(15, 2),
        website_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create contacts table
    console.log('Creating contacts table...');
    await query(`
      CREATE TABLE contacts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
        title VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        linkedin_url VARCHAR(500),
        is_primary BOOLEAN DEFAULT false,
        do_not_contact BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create deals table
    console.log('Creating deals table...');
    await query(`
      CREATE TABLE deals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        stage deal_stage DEFAULT 'prospect',
        value DECIMAL(12, 2),
        probability INTEGER CHECK (probability >= 0 AND probability <= 100),
        owner_id UUID,
        next_step TEXT,
        close_date DATE,
        notes TEXT,
        lost_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP WITH TIME ZONE
      )
    `);
    
    // Create jobs table
    console.log('Creating jobs table...');
    await query(`
      CREATE TABLE jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        location VARCHAR(255),
        location_type VARCHAR(50),
        employment_type VARCHAR(50),
        experience_level VARCHAR(50),
        salary_min DECIMAL(10, 2),
        salary_max DECIMAL(10, 2),
        salary_currency VARCHAR(3) DEFAULT 'USD',
        jd_text TEXT,
        requirements TEXT[],
        nice_to_haves TEXT[],
        benefits TEXT[],
        status job_status DEFAULT 'draft',
        urgency VARCHAR(50),
        openings INTEGER DEFAULT 1,
        embedding vector(1536),
        published_at TIMESTAMP WITH TIME ZONE,
        closed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create candidates table
    console.log('Creating candidates table...');
    await query(`
      CREATE TABLE candidates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        full_name VARCHAR(255) GENERATED ALWAYS AS (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) STORED,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        current_title VARCHAR(255),
        current_company VARCHAR(255),
        years_experience INTEGER,
        resume_url VARCHAR(500),
        resume_text TEXT,
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        portfolio_url VARCHAR(500),
        skills TEXT[],
        education JSONB DEFAULT '[]',
        experience JSONB DEFAULT '[]',
        source VARCHAR(100),
        source_details JSONB,
        notes TEXT,
        tags TEXT[],
        embedding vector(1536),
        willing_to_relocate BOOLEAN,
        expected_salary_min DECIMAL(10, 2),
        expected_salary_max DECIMAL(10, 2),
        notice_period VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create submissions table
    console.log('Creating submissions table...');
    await query(`
      CREATE TABLE submissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
        match_score DECIMAL(5, 2),
        match_reasons JSONB DEFAULT '[]',
        brief_md TEXT,
        status submission_status DEFAULT 'draft',
        stage VARCHAR(50) DEFAULT 'new',
        rejection_reason TEXT,
        notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE,
        interviewed_at TIMESTAMP WITH TIME ZONE,
        offered_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id, candidate_id)
      )
    `);
    
    // Create activities table
    console.log('Creating activities table...');
    await query(`
      CREATE TABLE activities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        actor_id UUID,
        subject_type VARCHAR(50) NOT NULL,
        subject_id UUID NOT NULL,
        related_type VARCHAR(50),
        related_id UUID,
        type activity_type NOT NULL,
        title VARCHAR(255),
        description TEXT,
        payload JSONB DEFAULT '{}',
        is_automated BOOLEAN DEFAULT false,
        occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sequences table
    console.log('Creating sequences table...');
    await query(`
      CREATE TABLE sequences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        channel sequence_channel DEFAULT 'email',
        is_active BOOLEAN DEFAULT true,
        steps JSONB NOT NULL,
        settings JSONB DEFAULT '{}',
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sequence_runs table
    console.log('Creating sequence_runs table...');
    await query(`
      CREATE TABLE sequence_runs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
        contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
        deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
        state sequence_run_state DEFAULT 'pending',
        current_step INTEGER DEFAULT 0,
        last_event JSONB,
        personalization_data JSONB DEFAULT '{}',
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        stopped_at TIMESTAMP WITH TIME ZONE,
        stop_reason VARCHAR(255),
        metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sequence_id, contact_id)
      )
    `);
    
    // Create ICPs table
    console.log('Creating ICPs table...');
    await query(`
      CREATE TABLE icps (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        geography VARCHAR(255),
        company_size_min INTEGER,
        company_size_max INTEGER,
        tech_keywords TEXT[],
        hiring_signals TEXT[],
        other_criteria JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create screening_questions table
    console.log('Creating screening_questions table...');
    await query(`
      CREATE TABLE screening_questions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        question_type VARCHAR(50) DEFAULT 'text',
        options TEXT[],
        is_required BOOLEAN DEFAULT true,
        is_knockout BOOLEAN DEFAULT false,
        expected_answer TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create screening_responses table
    console.log('Creating screening_responses table...');
    await query(`
      CREATE TABLE screening_responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
        question_id UUID REFERENCES screening_questions(id) ON DELETE CASCADE,
        answer TEXT,
        is_correct BOOLEAN,
        answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(submission_id, question_id)
      )
    `);
    
    // Create email_templates table
    console.log('Creating email_templates table...');
    await query(`
      CREATE TABLE email_templates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        body TEXT NOT NULL,
        variables TEXT[],
        category VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    console.log('Creating indexes...');
    await query('CREATE INDEX idx_companies_domain ON companies(domain)');
    await query('CREATE INDEX idx_companies_partner_status ON companies(partner_status)');
    await query('CREATE INDEX idx_companies_industry ON companies(industry)');
    await query('CREATE INDEX idx_contacts_company_id ON contacts(company_id)');
    await query('CREATE INDEX idx_contacts_email ON contacts(email)');
    await query('CREATE INDEX idx_deals_company_id ON deals(company_id)');
    await query('CREATE INDEX idx_deals_stage ON deals(stage)');
    await query('CREATE INDEX idx_jobs_company_id ON jobs(company_id)');
    await query('CREATE INDEX idx_jobs_status ON jobs(status)');
    await query('CREATE INDEX idx_candidates_email ON candidates(email)');
    await query('CREATE INDEX idx_candidates_source ON candidates(source)');
    await query('CREATE INDEX idx_submissions_job_id ON submissions(job_id)');
    await query('CREATE INDEX idx_submissions_candidate_id ON submissions(candidate_id)');
    await query('CREATE INDEX idx_submissions_status ON submissions(status)');
    await query('CREATE INDEX idx_activities_subject ON activities(subject_type, subject_id)');
    await query('CREATE INDEX idx_activities_occurred_at ON activities(occurred_at DESC)');
    await query('CREATE INDEX idx_sequence_runs_contact_id ON sequence_runs(contact_id)');
    await query('CREATE INDEX idx_sequence_runs_state ON sequence_runs(state)');
    
    // Create update trigger function
    console.log('Creating update trigger function...');
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    
    // Create triggers
    console.log('Creating update triggers...');
    const tablesToTrigger = [
      'companies', 'contacts', 'deals', 'jobs', 'candidates', 
      'submissions', 'sequences', 'sequence_runs', 'icps', 'email_templates'
    ];
    
    for (const table of tablesToTrigger) {
      await query(`
        CREATE TRIGGER update_${table}_updated_at 
        BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `);
    }
    
    console.log('✅ Database schema initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase().then(() => {
    console.log('🎉 Database initialization complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}

export default initDatabase;