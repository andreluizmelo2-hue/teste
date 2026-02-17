import { useState } from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useSync } from '../context/SyncContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Executions() {
  const { data, loading, isOnline, addItem, updateItem } = useOfflineSync('executions');
  const { isSyncing } = useSync();
  const [newExecution, setNewExecution] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddExecution = async () => {
    if (!newExecution.trim()) return;
    try {
      await addItem({ name: newExecution, status: 'pending', syncStatus: isOnline ? 'synced' : 'pending' });
      setNewExecution('');
    } catch (error) {
      alert('Erro ao adicionar: ' + error.message);
    }
  };

  const handleEditExecution = async (id) => {
    if (!editingValue.trim()) return;
    try {
      await updateItem(id, { name: editingValue, syncStatus: isOnline ? 'synced' : 'pending' });
      setEditingId(null);
      setEditingValue('');
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
    }
  };

  const handleDeleteExecution = async (id) => {
    const item = data.find(e => e.id === id);
    if (!item) return;
    try {
      await updateItem(id, { deleted: true });
    } catch (error) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Execuções</h1>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input type="text" placeholder="Nome da execução..." value={newExecution} onChange={(e) => setNewExecution(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <button onClick={handleAddExecution} disabled={isSyncing} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Adicionar
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>
          {!isOnline && '📱 Offline - dados serão sincronizados ao conectar'}
          {isOnline && isSyncing && '⏳ Sincronizando...'}
          {isOnline && !isSyncing && '✅ Online'}
        </p>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : data.length === 0 ? (
        <p style={{ color: '#999' }}>Nenhuma execução registrada</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {data.filter(e => !e.deleted).map((execution) => (
            <div key={execution.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: '4px', background: execution.syncStatus === 'pending' ? '#fff3cd' : '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingId === execution.id ? (
                <input type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} onBlur={() => handleEditExecution(execution.id)} autoFocus style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              ) : (
                <div>
                  <strong>{execution.name}</strong>
                  <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
                    {execution.syncStatus === 'pending' ? '⏳ Pendente' : '✓ Sincronizado'}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditingId(execution.id); setEditingValue(execution.name); }} style={{ padding: '4px 8px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDeleteExecution(execution.id)} style={{ padding: '4px 8px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}