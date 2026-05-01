/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Code2, 
  TerminalSquare, 
  Settings, 
  BookOpen, 
  Workflow,
  Search,
  PenTool,
  ShieldCheck,
  AlignLeft,
  ChevronRight,
  GitBranch
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';

const agentFiles = import.meta.glob('./agent/*', { query: '?raw', import: 'default', eager: true });

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFile, setSelectedFile] = useState('./agent/index.ts');

  const filesList = Object.keys(agentFiles);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 border-b border-slate-200 pb-4">
                DevDoc Agent Project
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                An automated documentation maintenance system powered by a multi-agent LangChain workflow. 
                Triggered via git post-commit hooks, DevDoc ensures your READMEs, API docs, and CHANGELOGs 
                are always in sync with your codebase.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Multi-Agent Architecture</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Utilizes 5 dedicated agents (Orchestrator, Locator, Generator, Verifier, Summarizer) 
                  with a long-chain reasoning and self-correction loop to prevent hallucinations.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <TerminalSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Git Hook Integration</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Seamlessly integrates into your existing workflow via <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs border border-slate-200">.git/hooks/post-commit</code>. 
                  Zero manual intervention required.
                </p>
              </div>
            </div>

            <section className="space-y-4 mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Setup Instructions</h2>
              <div className="font-mono text-sm mb-4 p-5 bg-slate-900 text-slate-300 rounded-md leading-relaxed shadow-inner space-y-3">
                <p className="text-emerald-400"># 1. Install dependencies in your project</p>
                <p className="text-white">npm install @langchain/openai @langchain/core ts-node</p>
                
                <p className="text-emerald-400 mt-4"># 2. Copy the agent files to your repository</p>
                <p className="text-white">mkdir -p src/agent && cp -r &lt;downloaded_folder&gt;/agent/* src/agent/</p>
                
                <p className="text-emerald-400 mt-4"># 3. Run the installation script</p>
                <p className="text-white">node src/agent/install-hook.js</p>

                <p className="text-emerald-400 mt-4"># 4. Set your API key in .devdoc/config.json</p>
              </div>
            </section>
          </div>
        );
      case 'architecture':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="space-y-2 mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">Agent Logic Flow</h1>
              <p className="text-slate-600 font-mono text-sm">The long-chain reasoning process handling up to 100k daily tokens efficiently.</p>
            </header>
            
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm relative">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-8 tracking-widest">Orchestration Pipeline</h3>
              
              <div className="grid grid-cols-1 gap-8 relative">
                <div className="absolute left-[24px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
                
                {[
                  { icon: GitBranch, name: "Commit Hook", desc: "Extracts Diff & Message", color: "bg-slate-800 text-white" },
                  { icon: Bot, name: "Orchestrator", desc: "Analyzes intent, decides what to update", color: "bg-indigo-600 text-white shadow-lg" },
                  { icon: Search, name: "Locator", desc: "Finds the exact lines/sections in files", color: "bg-blue-500 text-white shadow-lg" },
                  { icon: PenTool, name: "Generator", desc: "Writes the update (gpt-4o-mini)", color: "bg-white border text-indigo-600 border-indigo-200" },
                  { icon: ShieldCheck, name: "Verifier", desc: "Checks against src code. Feedback loop (Max 3 retries)", color: "bg-emerald-500 text-white shadow-md ring-4 ring-emerald-50" },
                  { icon: AlignLeft, name: "Summarizer", desc: "Batches commits into CHANGELOG", color: "bg-slate-300 text-slate-600 opacity-50" }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-6 relative z-10">
                    <div className={"w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center " + step.color}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{`Step ${idx}: ${step.name}`}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="flex h-[calc(100vh-12rem)] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm animate-in fade-in duration-500">
            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
              <div className="p-4 border-b border-slate-200 bg-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agent Explorer</span>
              </div>
              <div className="p-3 space-y-1">
                {filesList.map(file => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={"w-full text-left px-3 py-2 rounded-md text-sm transition-colors text-slate-600 " + (
                      selectedFile === file 
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100' 
                      : 'hover:bg-slate-100 hover:text-slate-900 font-medium border border-transparent'
                    )}
                  >
                    {file.replace('./agent/', '')}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-slate-900 p-2">
              <Editor
                height="100%"
                language={selectedFile.endsWith('.ts') ? 'typescript' : selectedFile.endsWith('.js') ? 'javascript' : 'json'}
                theme="vs-dark"
                value={agentFiles[selectedFile] as string}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col relative overflow-hidden">
      <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase text-slate-800">DevDoc <span className="text-indigo-600">Agent</span></span>
          <div className="ml-4 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono rounded border border-emerald-100 hidden sm:block">Hook Active</div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'overview', icon: BookOpen, label: 'Overview' },
            { id: 'architecture', icon: Workflow, label: 'Architecture' },
            { id: 'code', icon: Code2, label: 'Source Code' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-bold transition-all " + (
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto w-full p-8 flex-grow">
        {renderContent()}
      </main>
      
      <footer className="w-full h-8 bg-slate-100 border-t border-slate-200 flex items-center px-8 justify-between mt-auto">
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span>SYSTEM: OK</span>
          <span>●</span>
          <span>NODE: v20.5.1</span>
          <span>●</span>
          <span>GIT-HOOK: post-commit active</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
          MODEL: GPT-4o-mini | EMBED: text-embedding-3-small
        </div>
      </footer>
    </div>
  );
}

