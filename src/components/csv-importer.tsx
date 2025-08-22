'use client';

import { useState, useRef } from 'react';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface CSVImporterProps {
  type: 'companies' | 'contacts' | 'candidates';
  onImport: (data: any[]) => Promise<void>;
  onClose: () => void;
}

interface FieldMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

export function CSVImporter({ type, onImport, onClose }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRequiredFields = () => {
    switch(type) {
      case 'companies':
        return {
          required: ['name'],
          optional: ['domain', 'description', 'industry', 'company_size', 'headquarters', 'website', 'linkedin_url']
        };
      case 'contacts':
        return {
          required: ['first_name', 'last_name', 'email'],
          optional: ['phone', 'title', 'linkedin_url', 'company_name']
        };
      case 'candidates':
        return {
          required: ['first_name', 'last_name', 'email'],
          optional: ['phone', 'current_title', 'current_company', 'location', 'years_experience', 'skills', 'linkedin_url', 'github_url']
        };
      default:
        return { required: [], optional: [] };
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    const text = await selectedFile.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      alert('The CSV file appears to be empty');
      return;
    }

    // Parse CSV
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    setCsvHeaders(headers);

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
    setCsvData(data);

    // Auto-map fields
    const { required, optional } = getRequiredFields();
    const allFields = [...required, ...optional];
    const mappings: FieldMapping[] = [];

    allFields.forEach(field => {
      // Try to find matching CSV column
      const matchingHeader = headers.find(h => 
        h.toLowerCase().replace(/[_\s-]/g, '') === field.toLowerCase().replace(/[_\s-]/g, '')
      );
      
      mappings.push({
        csvColumn: matchingHeader || '',
        dbField: field,
        required: required.includes(field)
      });
    });

    setFieldMappings(mappings);
  };

  const handleMappingChange = (index: number, csvColumn: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index].csvColumn = csvColumn;
    setFieldMappings(newMappings);
  };

  const handleImport = async () => {
    // Validate required mappings
    const missingRequired = fieldMappings.filter(m => m.required && !m.csvColumn);
    if (missingRequired.length > 0) {
      alert(`Please map all required fields: ${missingRequired.map(m => m.dbField).join(', ')}`);
      return;
    }

    setImporting(true);
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      // Transform CSV data based on mappings
      const transformedData = csvData.map((row, index) => {
        const transformed: any = {};
        fieldMappings.forEach(mapping => {
          if (mapping.csvColumn) {
            transformed[mapping.dbField] = row[mapping.csvColumn];
          }
        });
        
        // Add defaults based on type
        if (type === 'companies') {
          transformed.partner_status = 'lead';
        }
        
        return transformed;
      });

      // Import data
      await onImport(transformedData);
      results.success = transformedData.length;
      
    } catch (error: any) {
      results.failed = csvData.length;
      results.errors.push(error.message || 'Import failed');
    }

    setImportResults(results);
    setImporting(false);
  };

  const downloadTemplate = () => {
    const { required, optional } = getRequiredFields();
    const headers = [...required, ...optional].join(',');
    
    let sampleData = '';
    switch(type) {
      case 'companies':
        sampleData = '\nAcme Corp,acme.com,Leading software company,SaaS,500,San Francisco,https://acme.com,https://linkedin.com/company/acme';
        break;
      case 'contacts':
        sampleData = '\nJohn,Doe,john@acme.com,555-0100,VP Engineering,https://linkedin.com/in/johndoe,Acme Corp';
        break;
      case 'candidates':
        sampleData = '\nJane,Smith,jane@email.com,555-0200,Senior Engineer,TechCo,New York,8,"React,Node.js,Python",https://linkedin.com/in/janesmith,https://github.com/janesmith';
        break;
    }

    const csvContent = headers + sampleData;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (importResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="text-center">
            {importResults.success > 0 && importResults.failed === 0 ? (
              <>
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Successful!</h3>
                <p className="text-gray-600">
                  Successfully imported {importResults.success} {type}
                </p>
              </>
            ) : (
              <>
                <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Failed</h3>
                <p className="text-gray-600 mb-2">
                  {importResults.failed} records failed to import
                </p>
                {importResults.errors.length > 0 && (
                  <div className="text-left bg-red-50 p-3 rounded mt-3">
                    <p className="text-sm font-medium text-red-800 mb-1">Errors:</p>
                    {importResults.errors.map((error, i) => (
                      <p key={i} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentArrowUpIcon className="h-7 w-7 mr-2 text-blue-600" />
            Import {type.charAt(0).toUpperCase() + type.slice(1)} from CSV
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!file ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">CSV Format Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>First row must contain column headers</li>
                      <li>Required fields: {getRequiredFields().required.join(', ')}</li>
                      <li>Use commas to separate values</li>
                      <li>Wrap values containing commas in quotes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Select CSV File
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center mx-auto"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download CSV Template
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  <span className="font-medium">File loaded:</span> {file.name}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Found {csvData.length} rows and {csvHeaders.length} columns
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Map CSV Columns to Database Fields</h3>
                <div className="space-y-2">
                  {fieldMappings.map((mapping, index) => (
                    <div key={mapping.dbField} className="flex items-center gap-3">
                      <div className="w-1/3">
                        <span className="text-sm font-medium text-gray-700">
                          {mapping.dbField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          {mapping.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                      <div className="w-8 text-center text-gray-400">→</div>
                      <div className="flex-1">
                        <select
                          value={mapping.csvColumn}
                          onChange={(e) => handleMappingChange(index, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            mapping.required && !mapping.csvColumn ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">-- Select CSV Column --</option>
                          {csvHeaders.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Preview (First 5 Rows)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {csvHeaders.slice(0, 5).map(header => (
                          <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {csvHeaders.slice(0, 5).map(header => (
                            <td key={header} className="px-3 py-2 text-sm text-gray-900">
                              {row[header] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {file && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Import {csvData.length} Records
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}