import fs from 'fs';
import path from 'path';
import { query, testConnection } from '../src/lib/db';

async function initDatabase() {
  console.log('🚀 Initializing database...');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  
  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split schema into individual statements (simple split by semicolon)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip pure comment lines
      if (statement.trim().startsWith('--')) continue;
      
      try {
        await query(statement);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error: any) {
        // Check if it's just a "already exists" error which we can ignore
        if (error.message?.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1}/${statements.length} - already exists (skipped)`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('✅ Database schema initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase().then(() => {
    console.log('🎉 Database initialization complete!');
    process.exit(0);
  });
}

export default initDatabase;