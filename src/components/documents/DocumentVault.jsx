import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { FolderLock, FileText, Download, Eye, Tag, Lock } from 'lucide-react';

const DocumentVault = () => {
  const { documents } = useCRM();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
            Encrypted Document Management & Vault
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>
            Document Vault ({documents.length} Files)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Store enterprise contracts, product brochures, spec manuals, POs, and compliance certificates with permission controls.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>File Size</th>
                <th>Uploaded By</th>
                <th>Access Level</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                      <span style={{ fontWeight: '700' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{doc.category}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.fileSize}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{doc.uploadedBy}</span>
                  </td>
                  <td>
                    <span className="badge badge-amber">{doc.accessLevel}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {doc.tags.map(t => (
                        <span key={t} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Downloading ${doc.title}...`)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DocumentVault;
