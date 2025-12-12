'use client'

import { useState, useEffect } from 'react'

interface Code {
  id: string
  code: string
  status: 'available' | 'claimed'
  claimedBy?: string
  claimedAt?: string
  description?: string
}

export default function Home() {
  const [codes, setCodes] = useState<Code[]>([])
  const [newCode, setNewCode] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [filter, setFilter] = useState<'all' | 'available' | 'claimed'>('all')

  useEffect(() => {
    const stored = localStorage.getItem('redemption-codes')
    if (stored) {
      setCodes(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('redemption-codes', JSON.stringify(codes))
  }, [codes])

  const addCode = () => {
    if (!newCode.trim()) return

    const code: Code = {
      id: Date.now().toString(),
      code: newCode.trim(),
      status: 'available',
      description: newDescription.trim() || undefined
    }

    setCodes([...codes, code])
    setNewCode('')
    setNewDescription('')
  }

  const claimCode = (id: string) => {
    const name = prompt('请输入领取人姓名:')
    if (!name) return

    setCodes(codes.map(c =>
      c.id === id
        ? { ...c, status: 'claimed' as const, claimedBy: name, claimedAt: new Date().toLocaleString('zh-CN') }
        : c
    ))
  }

  const unclaimCode = (id: string) => {
    setCodes(codes.map(c =>
      c.id === id
        ? { ...c, status: 'available' as const, claimedBy: undefined, claimedAt: undefined }
        : c
    ))
  }

  const deleteCode = (id: string) => {
    if (confirm('确定要删除这个兑换码吗？')) {
      setCodes(codes.filter(c => c.id !== id))
    }
  }

  const filteredCodes = codes.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  const availableCount = codes.filter(c => c.status === 'available').length
  const claimedCount = codes.filter(c => c.status === 'claimed').length

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#667eea',
          marginBottom: '10px',
          fontSize: '2.5em'
        }}>
          🎟️ 兑换码管理系统
        </h1>

        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: '#10b981',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '1.2em',
            fontWeight: 'bold'
          }}>
            ✓ 可用: {availableCount}
          </div>
          <div style={{
            background: '#ef4444',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '1.2em',
            fontWeight: 'bold'
          }}>
            ✗ 已领: {claimedCount}
          </div>
          <div style={{
            background: '#667eea',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '1.2em',
            fontWeight: 'bold'
          }}>
            总计: {codes.length}
          </div>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginTop: 0, color: '#334155' }}>添加新兑换码</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="兑换码"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCode()}
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <input
              type="text"
              placeholder="描述（可选）"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCode()}
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <button
              onClick={addCode}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              添加
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 20px',
              background: filter === 'all' ? '#667eea' : '#e2e8f0',
              color: filter === 'all' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('available')}
            style={{
              padding: '10px 20px',
              background: filter === 'available' ? '#10b981' : '#e2e8f0',
              color: filter === 'available' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            可用
          </button>
          <button
            onClick={() => setFilter('claimed')}
            style={{
              padding: '10px 20px',
              background: filter === 'claimed' ? '#ef4444' : '#e2e8f0',
              color: filter === 'claimed' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            已领
          </button>
        </div>

        {filteredCodes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#94a3b8',
            fontSize: '1.2em'
          }}>
            {codes.length === 0 ? '还没有兑换码，请添加一个' : '没有符合筛选条件的兑换码'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            {filteredCodes.map(code => (
              <div
                key={code.id}
                style={{
                  background: code.status === 'available' ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${code.status === 'available' ? '#10b981' : '#ef4444'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}
              >
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '5px',
                    fontFamily: 'monospace'
                  }}>
                    {code.code}
                  </div>
                  {code.description && (
                    <div style={{ color: '#64748b', marginBottom: '5px' }}>
                      {code.description}
                    </div>
                  )}
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    background: code.status === 'available' ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}>
                    {code.status === 'available' ? '✓ 可用' : '✗ 已领取'}
                  </div>
                  {code.claimedBy && (
                    <div style={{ marginTop: '8px', color: '#64748b', fontSize: '0.9em' }}>
                      领取人: {code.claimedBy} | 时间: {code.claimedAt}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {code.status === 'available' ? (
                    <button
                      onClick={() => claimCode(code.id)}
                      style={{
                        padding: '10px 20px',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      领取
                    </button>
                  ) : (
                    <button
                      onClick={() => unclaimCode(code.id)}
                      style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      恢复
                    </button>
                  )}
                  <button
                    onClick={() => deleteCode(code.id)}
                    style={{
                      padding: '10px 20px',
                      background: '#64748b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
