'use client'
import { useEffect, useState, useRef } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getUserConversations, getConversation, sendMessage, markMessagesRead } from '@/lib/api/transactions'
import { formatRelativeTime, getInitials } from '@/lib/utils'

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    getUserConversations(user.id).then((c) => { setConversations(c); setLoading(false) })
  }, [user])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const loadConv = async (conv: any) => {
    setActiveConv(conv)
    if (!user) return
    const msgs = await getConversation(user.id, conv.other_user.id, conv.property?.id)
    setMessages(msgs || [])
    await markMessagesRead(user.id, conv.other_user.id)
  }

  const handleSend = async () => {
    if (!user || !activeConv || !newMessage.trim()) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')
    const opt = { id: Date.now().toString(), sender_id: user.id, content, created_at: new Date().toISOString() }
    setMessages((p) => [...p, opt])
    try { await sendMessage(user.id, activeConv.other_user.id, content, activeConv.property?.id) }
    catch { setMessages((p) => p.filter((m) => m.id !== opt.id)) }
    finally { setSending(false) }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold font-heading text-primary mb-6" style={{ letterSpacing:'-0.02em' }}>Messages</h1>
            <div className="rounded-2xl overflow-hidden shadow-card flex" style={{ height:'600px', backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
              {/* Sidebar */}
              <div className="w-72 flex flex-col" style={{ borderRight:'1px solid var(--color-border-light)' }}>
                <div className="p-4" style={{ borderBottom:'1px solid var(--color-border-light)' }}>
                  <h2 className="font-bold text-sm font-heading text-primary">Conversations</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
                  ) : conversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <i className="fa-regular fa-comments text-3xl mb-2 block text-muted" />
                      <p className="text-xs text-muted">No conversations yet</p>
                    </div>
                  ) : conversations.map((conv) => (<button key={conv.id} key={conv.id} onClick={() => loadConv(conv)}
                      className="w-full text-left p-4 transition-colors"
                      style={{ borderBottom:'1px solid var(--color-border-light)', backgroundColor: activeConv?.id === conv.id ? 'var(--brand-100)' : '' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>
                          {getInitials(conv.other_user?.name || '?')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate font-heading text-primary">{conv.other_user?.name}</p>
                          {conv.property && <p className="text-xs truncate" style={{ color:'var(--brand-500)' }}>{conv.property.title}</p>}
                          <p className="text-xs truncate mt-0.5 text-muted">{conv.last_message?.content}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted">{formatRelativeTime(conv.last_message?.created_at)}</p>
                          {conv.unread_count > 0 && (
                            <span className="w-5 h-5 text-white text-xs rounded-full flex items-center justify-center mt-1 ml-auto" style={{ backgroundColor:'var(--brand-500)' }}>{conv.unread_count}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Chat */}
              <div className="flex-1 flex flex-col">
                {activeConv ? (
                  <>
                    <div className="p-4 flex items-center gap-3" style={{ borderBottom:'1px solid var(--color-border-light)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>
                        {getInitials(activeConv.other_user?.name || '?')}
                      </div>
                      <div>
                        <p className="font-bold text-sm font-heading text-primary">{activeConv.other_user?.name}</p>
                        {activeConv.property && <p className="text-xs text-muted">{activeConv.property.title}</p>}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => { const isMe = msg.sender_id === user?.id
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm"
                              style={isMe
                                ? { backgroundColor:'var(--brand-500)', color:'#fff', borderBottomRightRadius:'4px' }
                                : { backgroundColor:'var(--color-surface-2)', color:'var(--color-text-primary)', borderBottomLeftRadius:'4px' }}>
                              <p className="leading-relaxed">{msg.content}</p>
                              <p className="text-xs mt-1" style={{ opacity:0.65 }}>{formatRelativeTime(msg.created_at)}</p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={endRef} />
                    </div>
                    <div className="p-4" style={{ borderTop:'1px solid var(--color-border-light)' }}>
                      <div className="flex gap-3 items-end">
                        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                          placeholder="Type a message... (Enter to send)" rows={2} className="flex-1 input-base resize-none" />
                        <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                          className="w-11 h-11 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-40"
                          style={{ backgroundColor:'var(--brand-500)' }}>
                          <i className="fa-solid fa-paper-plane text-sm" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted">
                    <i className="fa-regular fa-comments text-5xl mb-4" />
                    <p className="text-sm font-medium">Select a conversation</p>
                    <p className="text-xs mt-1">to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
